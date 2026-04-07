#!/usr/bin/env bash
# tools/git-prune-tracking.sh
#
# Safely prunes remote-tracking branches (refs/remotes/*) without touching local branches.
# Optional:
#   --main-only <remote>         Only fetch default branch from that remote (reduces future clutter)
#   --purge-nondefault <remote>  Deletes existing refs/remotes/<remote>/* except <default> and HEAD
#
# Usage:
#   bash tools/git-prune-tracking.sh                       # dry-run report
#   bash tools/git-prune-tracking.sh --apply               # fetch --prune + remote prune
#   bash tools/git-prune-tracking.sh --apply --all
#   bash tools/git-prune-tracking.sh --apply --main-only origin --purge-nondefault origin
#
set -euo pipefail

APPLY=0
ALL=0
REMOTES=()
MAIN_ONLY_REMOTE=""
PURGE_REMOTE=""

die() { echo "Error: $*" >&2; exit 1; }
info() { echo -e "\n== $* =="; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) APPLY=1; shift;;
    --all) ALL=1; shift;;
    --remote) REMOTES+=("${2:-}"); shift 2;;
    --main-only) MAIN_ONLY_REMOTE="${2:-}"; shift 2;;
    --purge-nondefault) PURGE_REMOTE="${2:-}"; shift 2;;
    -h|--help)
      sed -n '1,140p' "$0"
      exit 0
      ;;
    *) die "Unknown arg: $1";;
  esac
done

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not inside a git repo."
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

has_remote() { git remote | grep -qx "$1"; }
list_remotes() { git remote; }

count_remote_refs() {
  local r="$1"
  git for-each-ref "refs/remotes/${r}" --format='%(refname)' 2>/dev/null | wc -l | tr -d ' '
}

detect_default_branch() {
  local r="$1"
  local sym=""
  sym="$(git symbolic-ref -q --short "refs/remotes/${r}/HEAD" 2>/dev/null || true)"
  if [[ -n "$sym" ]] && git show-ref --verify --quiet "refs/remotes/${sym}"; then
    echo "${sym#${r}/}"
    return 0
  fi
  if git show-ref --verify --quiet "refs/remotes/${r}/main"; then echo "main"; return 0; fi
  if git show-ref --verify --quiet "refs/remotes/${r}/master"; then echo "master"; return 0; fi
  echo "main"
}

purge_nondefault_refs() {
  local r="$1"
  has_remote "$r" || die "Remote '$r' not found."
  local def
  def="$(detect_default_branch "$r")"

  info "Purging non-default remote-tracking refs"
  echo "remote: $r"
  echo "keep:   $r/$def (and $r/HEAD if present)"

  mapfile -t refs < <(
    git for-each-ref "refs/remotes/${r}" --format='%(refname)' 2>/dev/null \
      | grep -vE "^refs/remotes/${r}/${def}$" \
      | grep -vE "^refs/remotes/${r}/HEAD$" \
      || true
  )

  if [[ "${#refs[@]}" -eq 0 ]]; then
    echo "Nothing to purge."
    return 0
  fi

  echo "Will delete ${#refs[@]} refs:"
  for ref in "${refs[@]}"; do echo "  - ${ref#refs/remotes/}"; done

  if [[ "$APPLY" -ne 1 ]]; then
    echo "DRY-RUN: not deleting (use --apply)."
    return 0
  fi

  for ref in "${refs[@]}"; do
    git update-ref -d "$ref" || true
  done
  echo "Purged."
}

# Determine targets
if [[ "$ALL" -eq 1 ]]; then
  mapfile -t REMOTES < <(list_remotes)
elif [[ "${#REMOTES[@]}" -eq 0 ]]; then
  has_remote origin && REMOTES+=("origin")
  has_remote upstream && REMOTES+=("upstream")
fi

[[ "${#REMOTES[@]}" -gt 0 ]] || die "No remotes found."

info "Repo"
echo "root: $ROOT"
echo "mode: $([[ "$APPLY" -eq 1 ]] && echo APPLY || echo DRY-RUN)"
echo "remotes: ${REMOTES[*]}"

if [[ -n "$MAIN_ONLY_REMOTE" ]]; then
  has_remote "$MAIN_ONLY_REMOTE" || die "Remote '$MAIN_ONLY_REMOTE' not found."
  def="$(detect_default_branch "$MAIN_ONLY_REMOTE")"
  info "Main-only refspec change (optional)"
  echo "remote: $MAIN_ONLY_REMOTE"
  echo "default branch detected: $def"
  echo "This will reduce clutter by fetching ONLY '$def' from $MAIN_ONLY_REMOTE."
  echo "Current fetch refspec(s):"
  git config --get-all "remote.${MAIN_ONLY_REMOTE}.fetch" || true
  if [[ "$APPLY" -eq 1 ]]; then
    git config "remote.${MAIN_ONLY_REMOTE}.fetch" "+refs/heads/${def}:refs/remotes/${MAIN_ONLY_REMOTE}/${def}"
    echo "Updated fetch refspec to only track ${def}."
  else
    echo "DRY-RUN: would set remote.${MAIN_ONLY_REMOTE}.fetch to:"
    echo "  +refs/heads/${def}:refs/remotes/${MAIN_ONLY_REMOTE}/${def}"
  fi
fi

info "Before"
for r in "${REMOTES[@]}"; do
  has_remote "$r" || continue
  printf "  %-10s refs=%s url=%s\n" "$r" "$(count_remote_refs "$r")" "$(git remote get-url "$r")"
done

if [[ "$APPLY" -ne 1 ]]; then
  info "Dry-run actions that would run"
  for r in "${REMOTES[@]}"; do
    has_remote "$r" || continue
    echo "  git fetch --prune --tags $r"
    echo "  git remote prune $r"
  done
  if [[ -n "$PURGE_REMOTE" ]]; then
    echo "  (and purge non-default refs for $PURGE_REMOTE)"
    purge_nondefault_refs "$PURGE_REMOTE"
  fi
  echo
  echo "Run with: bash tools/git-prune-tracking.sh --apply"
  exit 0
fi

info "Pruning"
for r in "${REMOTES[@]}"; do
  has_remote "$r" || continue
  git fetch --prune --tags "$r" >/dev/null 2>&1 || true
  git remote prune "$r" >/dev/null 2>&1 || true
done

if [[ -n "$PURGE_REMOTE" ]]; then
  purge_nondefault_refs "$PURGE_REMOTE"
fi

info "After"
for r in "${REMOTES[@]}"; do
  has_remote "$r" || continue
  printf "  %-10s refs=%s\n" "$r" "$(count_remote_refs "$r")"
done

info "Done"
echo "Note: This never deletes local branches (refs/heads/*). It only prunes refs/remotes/*."
