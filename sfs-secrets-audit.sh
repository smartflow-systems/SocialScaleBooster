#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="${1:-$(pwd)}"
TS="$(date +%Y%m%d_%H%M%S)"
OUT="$ROOT/sfs-secret-audit-$TS"

mkdir -p "$OUT"

REPORT="$OUT/SFS_SECRETS_AUDIT.md"
MATRIX="$OUT/sfs-secret-matrix.tsv"
LEAKS="$OUT/possible-leaks.tsv"
ENVKEYS="$OUT/current-replit-env-keys.txt"

printf "repo\tkey\tcode_refs\tenv_file_refs\tcurrent_replit_env\trecommended_scope\trisk\tdescription\tnotes\n" > "$MATRIX"
printf "repo\tfile\tline\tissue\taction\n" > "$LEAKS"

env | sed -E 's/=.*$//' | sort -u > "$ENVKEYS"

safe_files() {
  find "$1" \
    \( -path '*/.git' \
    -o -path '*/node_modules' \
    -o -path '*/dist' \
    -o -path '*/build' \
    -o -path '*/.next' \
    -o -path '*/coverage' \
    -o -path '*/attached_assets' \
    -o -path '*/.cache' \) -prune \
    -o -type f -print
}

describe_key() {
  case "$1" in
    SFS_PAT)
      printf "SHARED_CONTROL_SECRET\tHIGH\tGitHub token for SFS automation/repo sync\tUse in GitHub org/repo secrets or selected control Replits only. Rotate if leaked.\n"
      ;;
    REPLIT_TOKEN)
      printf "SHARED_CONTROL_SECRET\tHIGH\tReplit automation token\tControl repl only. Do not place in every repo.\n"
      ;;
    SFS_SYNC_URL)
      printf "SHARED_CONFIG_OPTIONAL\tMEDIUM\tCentral SFS sync endpoint\tOnly repos that call the sync service need this.\n"
      ;;
    DATABASE_URL|PGHOST|PGUSER|PGPASSWORD|PGDATABASE|PGPORT)
      printf "PER_REPO_PER_ENV\tHIGH\tDatabase connection config\tUsually separate per repo and per environment.\n"
      ;;
    JWT_SECRET|SFS_JWT_SECRET|SESSION_SECRET|CSRF_SECRET)
      printf "PER_REPO_PER_ENV\tHIGH\tAuth/session signing secret\tUse strong separate values per app/env. If code expects JWT_SECRET but Replit has SFS_JWT_SECRET, app can break.\n"
      ;;
    STRIPE_SECRET_KEY)
      printf "PER_STRIPE_ENV\tHIGH\tStripe private API key\tServer only. Never expose in frontend.\n"
      ;;
    STRIPE_WEBHOOK_SECRET)
      printf "PER_WEBHOOK_ENDPOINT\tHIGH\tStripe webhook signing secret\tSeparate per webhook endpoint/domain.\n"
      ;;
    STRIPE_PUBLISHABLE_KEY|VITE_STRIPE_PUBLISHABLE_KEY|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      printf "PUBLIC_CONFIG\tLOW\tStripe publishable frontend key\tAllowed in frontend, but separate test/live.\n"
      ;;
    STRIPE_PRICE_*|STRIPE_PRICE_STARTER|STRIPE_PRICE_PRO|STRIPE_PRICE_ENTERPRISE)
      printf "SHARED_CONFIG_IF_SAME_PRODUCTS\tLOW\tStripe price IDs\tCan be shared if all repos use same Stripe products.\n"
      ;;
    OPENAI_API_KEY|ANTHROPIC_API_KEY)
      printf "SERVER_SECRET\tHIGH\tAI provider API key\tServer only. Separate keys if you want billing split by app.\n"
      ;;
    X_CLIENT_ID|X_CLIENT_SECRET|X_CALLBACK_URL|TWITTER_CLIENT_ID|TWITTER_CLIENT_SECRET|TWITTER_CALLBACK_URL)
      printf "PER_OAUTH_APP\tHIGH\tX/Twitter OAuth config\tPer OAuth app/callback. Client secret is server only.\n"
      ;;
    TOKEN_ENCRYPTION_KEY|ENCRYPTION_KEY)
      printf "PER_REPO_PER_ENV\tHIGH\tToken/data encryption key\tSeparate per app/env. Rotating can break old encrypted tokens.\n"
      ;;
    CLIENT_URL|CORS_ORIGIN|CORS_ORIGINS|PUBLIC_BASE_URL|BOOK_URL|AI_URL)
      printf "PER_DEPLOYMENT_CONFIG\tMEDIUM\tPublic URL / CORS config\tNot always secret, but wrong value breaks auth/API calls.\n"
      ;;
    GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|GOOGLE_REDIRECT_URI)
      printf "PER_GOOGLE_APP\tHIGH\tGoogle OAuth config\tSecret server side. Redirect URI must match deployment.\n"
      ;;
    FACEBOOK_APP_ID|FACEBOOK_APP_SECRET|META_APP_ID|META_APP_SECRET|PAGE_ACCESS_TOKEN)
      printf "PER_META_APP_OR_PAGE\tHIGH\tMeta/Facebook token config\tRotate if found in files/logs.\n"
      ;;
    VITE_*|NEXT_PUBLIC_*|PUBLIC_*)
      printf "PUBLIC_FRONTEND_ENV\tMEDIUM\tFrontend-exposed variable\tNever put real secrets here.\n"
      ;;
    *)
      printf "UNKNOWN_REVIEW\tMEDIUM\tUnknown env var\tReview manually and decide shared vs per-repo.\n"
      ;;
  esac
}

mapfile -t REPOS < <(
  find "$ROOT" \
    \( -path '*/node_modules' -o -path '*/.cache' -o -path '*/dist' -o -path '*/build' \) -prune \
    -o -type d -name .git -print 2>/dev/null \
  | sed 's#/.git$##' \
  | sort -u
)

if [ "${#REPOS[@]}" -eq 0 ]; then
  REPOS=("$ROOT")
fi

LEAK_RE='sk_live_[A-Za-z0-9_]+|sk_test_[A-Za-z0-9_]+|rk_live_[A-Za-z0-9_]+|whsec_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+|gh[pousr]_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|postgres(ql)?://[^[:space:]"'"'"'`]+:[^[:space:]"'"'"'`]+@'

for repo in "${REPOS[@]}"; do
  repo_name="$(basename "$repo")"
  tmp_code="$OUT/$repo_name.code.keys"
  tmp_env="$OUT/$repo_name.envfile.keys"
  : > "$tmp_code"
  : > "$tmp_env"

  while IFS= read -r f; do
    case "$f" in
      *package-lock.json|*pnpm-lock.yaml|*yarn.lock|*.map|*.png|*.jpg|*.jpeg|*.gif|*.webp|*.pdf)
        continue
        ;;
    esac

    if grep -Iq . "$f" 2>/dev/null; then
      perl -ne '
        while(/process\.env(?:\.|\[\s*["\x27])([A-Za-z_][A-Za-z0-9_]*)/g){print "$1\n"}
        while(/import\.meta\.env(?:\.|\[\s*["\x27])([A-Za-z_][A-Za-z0-9_]*)/g){print "$1\n"}
        while(/os\.(?:getenv|environ\.get)\(\s*["\x27]([A-Za-z_][A-Za-z0-9_]*)/g){print "$1\n"}
        while(/os\.environ\[\s*["\x27]([A-Za-z_][A-Za-z0-9_]*)/g){print "$1\n"}
        while(/\b([A-Z][A-Z0-9_]{2,})\b/g){
          $k=$1;
          print "$k\n" if $k =~ /(SECRET|TOKEN|KEY|DATABASE_URL|PGHOST|PGUSER|PGPASSWORD|PGDATABASE|PGPORT|STRIPE|OPENAI|ANTHROPIC|JWT|SESSION|CORS|CLIENT_URL|SFS_|X_|TWITTER|FACEBOOK|META|GOOGLE|VITE_|NEXT_PUBLIC_|PUBLIC_)/;
        }
      ' "$f" 2>/dev/null >> "$tmp_code" || true

      if grep -InE "$LEAK_RE" "$f" >/tmp/sfs_leak_hits 2>/dev/null; then
        while IFS=: read -r hit_file hit_line _; do
          printf "%s\t%s\t%s\t%s\t%s\n" "$repo_name" "${hit_file#$repo/}" "$hit_line" "POSSIBLE_SECRET_VALUE_IN_FILE" "ROTATE_IF_REAL_AND_REMOVE_FROM_GIT" >> "$LEAKS"
        done < /tmp/sfs_leak_hits
      fi
    fi

    base="$(basename "$f")"
    if [[ "$base" =~ ^\.env($|\.|-) || "$base" == ".env.example" || "$base" == "env.example" ]]; then
      grep -IhE '^[[:space:]]*(export[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=' "$f" 2>/dev/null \
        | sed -E 's/^[[:space:]]*export[[:space:]]+//; s/[[:space:]]*=.*$//; s/[[:space:]]//g' \
        >> "$tmp_env" || true
    fi
  done < <(safe_files "$repo")

  sort -u "$tmp_code" -o "$tmp_code"
  sort -u "$tmp_env" -o "$tmp_env"

  if git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git -C "$repo" ls-files 2>/dev/null \
      | grep -Ei '(^|/)\.env($|\.|-)|secret|credential|service-account|private-key' \
      | grep -Eiv 'example|sample|template|README|docs/' \
      | while IFS= read -r tracked; do
          printf "%s\t%s\t%s\t%s\t%s\n" "$repo_name" "$tracked" "-" "SENSITIVE_NAMED_FILE_TRACKED_BY_GIT" "CHECK_AND_REMOVE_IF_REAL_SECRET_FILE" >> "$LEAKS"
        done || true
  fi

  all_keys="$(cat "$tmp_code" "$tmp_env" 2>/dev/null | sort -u || true)"

  while IFS= read -r key; do
    [ -z "$key" ] && continue

    code_refs="no"
    env_file_refs="no"
    current_env="missing"

    grep -qx "$key" "$tmp_code" && code_refs="yes"
    grep -qx "$key" "$tmp_env" && env_file_refs="yes"
    grep -qx "$key" "$ENVKEYS" && current_env="present"

    IFS=$'\t' read -r scope risk desc notes < <(describe_key "$key")

    printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
      "$repo_name" "$key" "$code_refs" "$env_file_refs" "$current_env" "$scope" "$risk" "$desc" "$notes" >> "$MATRIX"
  done <<< "$all_keys"
done

{
  echo "# SFS Secrets Audit"
  echo
  echo "**Generated:** $(date)"
  echo "**Root scanned:** \`$ROOT\`"
  echo
  echo "## Safe rule"
  echo
  echo "This hides secret values. It reports names, repo usage, missing env vars, and possible leak locations only."
  echo
  echo "## Repos scanned"
  echo
  for repo in "${REPOS[@]}"; do
    echo "- \`$(basename "$repo")\` — \`$repo\`"
  done
  echo
  echo "## Current Replit env keys found"
  echo
  sed 's/^/- `/' "$ENVKEYS" | sed 's/$/`/'
  echo
  echo "## Possible leaks / rotation flags"
  echo
  if [ "$(wc -l < "$LEAKS")" -le 1 ]; then
    echo
    echo "No obvious secret-value patterns found."
  else
    echo
    echo "| Repo | File | Line | Issue | Action |"
    echo "|---|---|---:|---|---|"
    tail -n +2 "$LEAKS" | head -n 200 | awk -F'\t' '{printf "| `%s` | `%s` | %s | %s | %s |\n",$1,$2,$3,$4,$5}'
  fi
  echo
  echo "## Secret matrix"
  echo
  echo "| Repo | Key | Code refs | Env file refs | Current Replit env | Scope | Risk | Description | Notes |"
  echo "|---|---|---|---|---|---|---|---|---|"
  tail -n +2 "$MATRIX" | sort | awk -F'\t' '{printf "| `%s` | `%s` | %s | %s | **%s** | %s | %s | %s | %s |\n",$1,$2,$3,$4,$5,$6,$7,$8,$9}'
  echo
  echo "## Output files"
  echo
  echo "- \`$REPORT\`"
  echo "- \`$MATRIX\`"
  echo "- \`$LEAKS\`"
  echo "- \`$ENVKEYS\`"
} > "$REPORT"

echo
echo "✅ SFS secrets audit complete."
echo "Report:"
echo "$REPORT"
echo
echo "Run this to view it:"
echo "sed -n '1,260p' '$REPORT'"
