#!/usr/bin/env bash

echo "Deployment source: $VERCEL_DEPLOYMENT_SOURCE"

if [ "$VERCEL_DEPLOYMENT_SOURCE" = "github" ]; then
  echo "Allowing build (github deploy hook)"
  exit 1   # ❗ continue build
fi

echo "Ignoring build (not github deploy hook)"
exit 0     # ❗ skip build
