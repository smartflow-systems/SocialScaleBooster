#!/usr/bin/env bash
# git-branch-cleanup.sh - Clean up local branches whose upstream is gone
#
# Usage: git-branch-cleanup.sh [options]
#
# Options:
#   --remote <name>   Remote to check against (default: origin)
#   --base <ref>      Base ref for merge checking (auto-detected if omitted)
#   --apply           Actually delete branches (dry-run by default)
#   --force           Also delete unmerged branches (requires --apply)
#   --yes             Skip confirmation prompt (requires --apply)
#   -h, --help        Show this help message
#
# By default, runs in dry-run mode showing what would be deleted.

set -euo pipefail

# Colors for output (disabled if not a terminal)
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    BOLD='\033[1m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    BOLD=''
    NC=''
fi

# Default options
REMOTE="origin"
BASE_REF=""
APPLY=false
FORCE=false
YES=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --remote)
            REMOTE="$2"
            shift 2
            ;;
        --base)
            BASE_REF="$2"
            shift 2
            ;;
        --apply)
            APPLY=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --yes)
            YES=true
            shift
            ;;
        -h|--help)
            sed -n '2,/^$/p' "$0" | sed 's/^# \?//'
            exit 0
            ;;
        *)
            echo -e "${RED}Error: Unknown option: $1${NC}" >&2
            exit 1
            ;;
    esac
done

# Validate options
if [[ "$FORCE" == true && "$APPLY" != true ]]; then
    echo -e "${RED}Error: --force requires --apply${NC}" >&2
    exit 1
fi

if [[ "$YES" == true && "$APPLY" != true ]]; then
    echo -e "${RED}Error: --yes requires --apply${NC}" >&2
    exit 1
fi

# Step 1: Navigate to git repo root, fail fast if not a repo
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    echo -e "${RED}Error: Not inside a git repository${NC}" >&2
    exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"
echo -e "${BLUE}Repository:${NC} $REPO_ROOT"

# Step 2: Fetch and prune remote-tracking refs
echo -e "${BLUE}Fetching from ${REMOTE} with prune...${NC}"
if ! git fetch --prune "$REMOTE" 2>/dev/null; then
    echo -e "${YELLOW}Warning: Could not fetch from ${REMOTE}. Continuing with local data.${NC}"
fi

# Step 3: Detect base ref
detect_base_ref() {
    local remote="$1"

    # Try remote/HEAD first
    if git rev-parse --verify "${remote}/HEAD" &>/dev/null; then
        # Get the symbolic ref target
        local head_ref
        head_ref=$(git symbolic-ref "refs/remotes/${remote}/HEAD" 2>/dev/null || true)
        if [[ -n "$head_ref" ]]; then
            echo "${head_ref#refs/remotes/}"
            return 0
        fi
    fi

    # Try main
    if git rev-parse --verify "${remote}/main" &>/dev/null; then
        echo "${remote}/main"
        return 0
    fi

    # Try master
    if git rev-parse --verify "${remote}/master" &>/dev/null; then
        echo "${remote}/master"
        return 0
    fi

    # Fallback to HEAD
    echo "HEAD"
    return 0
}

if [[ -z "$BASE_REF" ]]; then
    BASE_REF=$(detect_base_ref "$REMOTE")
fi

echo -e "${BLUE}Base ref:${NC} $BASE_REF"

# Step 4: Get current branch (to skip it)
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD)
echo -e "${BLUE}Current branch:${NC} $CURRENT_BRANCH"
echo ""

# Step 5: Enumerate local branches and find "gone" candidates
# Format: %(refname:short) %(upstream:short) %(upstream:track)
declare -a GONE_BRANCHES=()
declare -A BRANCH_UPSTREAM=()
declare -A BRANCH_MERGED=()

while IFS= read -r line; do
    # Parse the line: branch_name|upstream|track_status
    branch=$(echo "$line" | cut -d'|' -f1)
    upstream=$(echo "$line" | cut -d'|' -f2)
    track=$(echo "$line" | cut -d'|' -f3)

    # Skip empty branch names
    [[ -z "$branch" ]] && continue

    # Skip current branch
    [[ "$branch" == "$CURRENT_BRANCH" ]] && continue

    # Check if upstream is "gone"
    is_gone=false

    if [[ "$track" == *"gone"* ]]; then
        is_gone=true
    elif [[ -n "$upstream" ]]; then
        # Check if the upstream ref actually exists
        if ! git rev-parse --verify "refs/remotes/${upstream}" &>/dev/null; then
            is_gone=true
        fi
    fi

    if [[ "$is_gone" == true ]]; then
        GONE_BRANCHES+=("$branch")
        BRANCH_UPSTREAM["$branch"]="$upstream"

        # Step 6: Check if merged into base ref
        if git merge-base --is-ancestor "$branch" "$BASE_REF" 2>/dev/null; then
            BRANCH_MERGED["$branch"]="merged"
        else
            BRANCH_MERGED["$branch"]="unmerged"
        fi
    fi
done < <(git for-each-ref --format='%(refname:short)|%(upstream:short)|%(upstream:track)' refs/heads/)

# Report results
if [[ ${#GONE_BRANCHES[@]} -eq 0 ]]; then
    echo -e "${GREEN}No branches with gone upstreams found.${NC}"
    exit 0
fi

echo -e "${BOLD}Branches with gone upstreams:${NC}"
echo ""

merged_count=0
unmerged_count=0

for branch in "${GONE_BRANCHES[@]}"; do
    upstream="${BRANCH_UPSTREAM[$branch]:-<none>}"
    status="${BRANCH_MERGED[$branch]}"

    if [[ "$status" == "merged" ]]; then
        echo -e "  ${GREEN}[merged]${NC}   $branch → $upstream"
        ((merged_count++))
    else
        echo -e "  ${RED}[unmerged]${NC} $branch → $upstream"
        ((unmerged_count++))
    fi
done

echo ""
echo -e "${BOLD}Summary:${NC} ${merged_count} merged, ${unmerged_count} unmerged"
echo ""

# Step 7: Apply changes if requested
if [[ "$APPLY" != true ]]; then
    echo -e "${YELLOW}Dry-run mode. Use --apply to delete branches.${NC}"
    exit 0
fi

# Confirm unless --yes
if [[ "$YES" != true ]]; then
    if [[ "$FORCE" == true ]]; then
        echo -e "${RED}WARNING: --force will delete ${unmerged_count} unmerged branch(es)!${NC}"
    fi

    read -p "Proceed with deletion? [y/N] " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

echo ""
echo -e "${BOLD}Deleting branches...${NC}"

deleted_count=0
skipped_count=0

for branch in "${GONE_BRANCHES[@]}"; do
    status="${BRANCH_MERGED[$branch]}"

    if [[ "$status" == "merged" ]]; then
        # Delete merged branch with -d
        if git branch -d "$branch" 2>/dev/null; then
            echo -e "  ${GREEN}Deleted:${NC} $branch"
            ((deleted_count++))
        else
            echo -e "  ${RED}Failed to delete:${NC} $branch"
        fi
    elif [[ "$FORCE" == true ]]; then
        # Delete unmerged branch with -D (only with --force)
        if git branch -D "$branch" 2>/dev/null; then
            echo -e "  ${YELLOW}Force deleted:${NC} $branch"
            ((deleted_count++))
        else
            echo -e "  ${RED}Failed to delete:${NC} $branch"
        fi
    else
        echo -e "  ${YELLOW}Skipped (unmerged):${NC} $branch"
        ((skipped_count++))
    fi
done

echo ""
echo -e "${BOLD}Result:${NC} ${deleted_count} deleted, ${skipped_count} skipped"

# Step 8: Run remote prune for extra cleanup
echo ""
echo -e "${BLUE}Running remote prune...${NC}"
git remote prune "$REMOTE" 2>/dev/null || true

echo -e "${GREEN}Done.${NC}"
