#!/usr/bin/env bash
set -euo pipefail

API_VER="v25.0"

pretty() {
  if command -v jq >/dev/null 2>&1; then jq .
  else node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.stringify(JSON.parse(d),null,2))}catch(e){console.log(d)}})"
  fi
}

echo "=== SmartFlow Facebook / Meta API Test ==="
echo "Paste the token you put in the app. It will NOT show on screen."
read -rsp "FACEBOOK_ACCESS_TOKEN: " FB_TOKEN
echo
echo

echo "1) Testing token with /me..."
curl -sS -G "https://graph.facebook.com/${API_VER}/me" \
  --data-urlencode "fields=id,name" \
  --data-urlencode "access_token=${FB_TOKEN}" | pretty

echo
echo "2) Checking token permissions..."
curl -sS -G "https://graph.facebook.com/${API_VER}/me/permissions" \
  --data-urlencode "access_token=${FB_TOKEN}" | pretty

echo
echo "3) Checking Facebook Pages available to this token..."
curl -sS -G "https://graph.facebook.com/${API_VER}/me/accounts" \
  --data-urlencode "fields=id,name,tasks,access_token" \
  --data-urlencode "access_token=${FB_TOKEN}" | pretty

echo
echo "4) Optional deeper token debug."
read -rp "FACEBOOK_APP_ID, or press Enter to skip: " FB_APP_ID
if [ -n "${FB_APP_ID}" ]; then
  read -rsp "FACEBOOK_APP_SECRET: " FB_APP_SECRET
  echo
  curl -sS -G "https://graph.facebook.com/${API_VER}/debug_token" \
    --data-urlencode "input_token=${FB_TOKEN}" \
    --data-urlencode "access_token=${FB_APP_ID}|${FB_APP_SECRET}" | pretty
fi

echo
echo "=== DONE ==="
echo "PASS = you see your Facebook name/id and pages."
echo "FAIL = OAuthException / invalid token / missing permissions."
