#!/usr/bin/env bash
# tools/git-status.sh
#
# Complex but readable Git status dashboard for multi-remote setups (origin + upstream).
#
# Usage:
#   bash tools/git-status.sh
#   bash tools/git-status.sh --no-fetch
#   bash tools/git-status.sh --json
#   bash tools/git-status.sh --remote origin --remote upstream
#
set -euo pipefail

NO_FETCH=0
AS_JSON=0
REMOTES=()

die() { echo "Error: $*" >&2; exit 1; }

supports_color() { [[ -t 1 ]] && command -v tput >/dev/null 2>&1; }
if supports_color; then
  BOLD="$(tput bold)"; DIM="$(tput dim)"; RESET="$(tput sgr0)"
  RED="$(tput setaf 1)"; GREEN="$(tput setaf 2)"; YELLOW="$(tput setaf 3)"; BLUE="$(tput setaf 4)"; MAG="$(tput setaf 5)"; CYAN="$(tput setaf 6)"
else
  BOLD=""; DIM=""; RESET=""
  RED=""; GREEN=""; YELLOW=""; BLUE=""; MAG=""; CYAN=""
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-fetch) NO_FETCH=1; shift;;
    --json) AS_JSON=1; shift;;
    --remote) REMOTES+=("${2:-}"); shift 2;;
    -h|--help)
      sed -n '1,80p' "$0"
      exit 0
      ;;
    *) die "Unknown arg: $1";;
  esac
done

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not inside a git repo."
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

has_remote() { git remote | grep -qx "$1"; }

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

json_escape() {
  python3 - <<'PY' "$1"
import json,sys
print(json.dumps(sys.argv[1]))
PY
}

current_branch="$(git rev-parse --abbrev-ref HEAD)"
upstream_ref="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"
head_sha="$(git rev-parse --short HEAD)"
head_msg="$(git log -1 --pretty=%s 2>/dev/null || true)"

dirty_count="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
untracked_count="$(git status --porcelain 2>/dev/null | grep -cE '^\?\?' || true)"

# Default remotes if not provided
if [[ "${#REMOTES[@]}" -eq 0 ]]; then
  has_remote origin && REMOTES+=("origin")
  has_remote upstream && REMOTES+=("upstream")
fi

# Fetch/prune
if [[ "$NO_FETCH" -eq 0 ]]; then
  for r in "${REMOTES[@]}"; do
    if has_remote "$r"; then
      git fetch --prune --tags "$r" >/dev/null 2>&1 || true
    fi
  done
fi

ahead_behind() {
  local left="$1" right="$2"
  git rev-list --left-right --count "${left}...${right}" 2>/dev/null || echo "n/a"
}

make_block() {
  local r="$1"
  local def
  def="$(detect_default_branch "$r")"
  local base="refs/remotes/${r}/${def}"
  local base_short="${r}/${def}"
  local ab
  ab="$(ahead_behind "$base_short" "HEAD")"
  echo "$def|$ab"
}

if [[ "$AS_JSON" -eq 1 ]]; then
  origin_url="$(git remote get-url origin 2>/dev/null || true)"
  upstream_url="$(git remote get-url upstream 2>/dev/null || true)"
  origin_def=""; origin_ab=""
  upstream_def=""; upstream_ab=""
  if has_remote origin; then
    IFS='|' read -r origin_def origin_ab <<<"$(make_block origin)"
  fi
  if has_remote upstream; then
    IFS='|' read -r upstream_def upstream_ab <<<"$(make_block upstream)"
  fi

  printf "{\n"
  printf "  \"root\": %s,\n" "$(json_escape "$ROOT")"
  printf "  \"branch\": %s,\n" "$(json_escape "$current_branch")"
  printf "  \"upstream\": %s,\n" "$(json_escape "${upstream_ref:-}")"
  printf "  \"head\": {\"sha\": %s, \"subject\": %s},\n" "$(json_escape "$head_sha")" "$(json_escape "$head_msg")"
  printf "  \"working_tree\": {\"dirty\": %s, \"untracked\": %s},\n" "$dirty_count" "$untracked_count"
  printf "  \"remotes\": {\n"
  printf "    \"origin\": {\"url\": %s, \"default_branch\": %s, \"behind_ahead\": %s},\n" \
    "$(json_escape "$origin_url")" "$(json_escape "$origin_def")" "$(json_escape "$origin_ab")"
  printf "    \"upstream\": {\"url\": %s, \"default_branch\": %s, \"behind_ahead\": %s}\n" \
    "$(json_escape "$upstream_url")" "$(json_escape "$upstream_def")" "$(json_escape "$upstream_ab")"
  printf "  }\n"
  printf "}\n"
  exit 0
fi

echo "${BOLD}${CYAN}Git Status Dashboard${RESET} ${DIM}(${ROOT})${RESET}"
echo

# Remotes
echo "${BOLD}Remotes${RESET}"
for r in "${REMOTES[@]}"; do
  if has_remote "$r"; then
    url="$(git remote get-url "$r")"
    printf "  %s%-8s%s %s\n" "${MAG}" "$r" "${RESET}" "$url"
  fi
done
echo

# Branch & upstream
echo "${BOLD}Branch${RESET}"
printf "  %s%s%s @ %s%s%s\n" "${GREEN}" "$current_branch" "${RESET}" "${DIM}" "${upstream_ref:-<no-upstream>}" "${RESET}"
printf "  HEAD: %s%s%s %s%s%s\n" "${YELLOW}" "$head_sha" "${RESET}" "${DIM}" "$head_msg" "${RESET}"
echo

# Working tree
echo "${BOLD}Working Tree${RESET}"
if [[ "$dirty_count" -eq 0 ]]; then
  printf "  %sclean%s\n" "${GREEN}" "${RESET}"
else
  printf "  %sdirty%s (%s changes)\n" "${RED}" "${RESET}" "$dirty_count"
fi
if [[ "$untracked_count" -gt 0 ]]; then
  printf "  %suntracked%s (%s)\n" "${YELLOW}" "${RESET}" "$untracked_count"
fi
echo

# Ahead/behind per remote default branch
echo "${BOLD}Ahead/Behind vs remotes (default branch)${RESET}"
for r in "${REMOTES[@]}"; do
  if has_remote "$r"; then
    IFS='|' read -r def ab <<<"$(make_block "$r")"
    # ab = "behind ahead"
    behind="$(awk '{print $1}' <<<"$ab" 2>/dev/null || echo "n/a")"
    ahead="$(awk '{print $2}' <<<"$ab" 2>/dev/null || echo "n/a")"
    printf "  %s%-8s%s %s%-6s%s behind=%s ahead=%s\n" \
      "${MAG}" "$r" "${RESET}" "${DIM}" "${def}" "${RESET}" \
      "${behind}" "${ahead}"
  fi
done
echo

echo "${DIM}Tip:${RESET} use ${BOLD}--no-fetch${RESET} for offline, ${BOLD}--json${RESET} for scripting."
