#!/usr/bin/env bash

# Check if the deployment source is a 'deploy-hook'
if [ "$VERCEL_DEPLOYMENT_SOURCE" = "deploy-hook" ]; then
  # Check if the specific deploy hook name is 'github'
  if [ "$VERCEL_DEPLOY_HOOK_NAME" = "github" ]; then
    echo "✅ Allowing build: Triggered by the specific 'github' deploy hook."
    exit 1   # Vercel interprets exit code 1 as: 'PROCEED' with the build
  else
    echo "⚠️ Ignoring build: Triggered by a deploy hook, but not the 'github' hook ($VERCEL_DEPLOY_HOOK_NAME)."
    exit 0   # Vercel interprets exit code 0 as: 'SKIP/IGNORE' the build
  fi
else
  # Deployment source is not a deploy hook (e.g., Git push, CLI, etc.)
  echo "❌ Ignoring build: Deployment source is not a deploy hook ($VERCEL_DEPLOYMENT_SOURCE)."
  exit 0     # Vercel interprets exit code 0 as: 'SKIP/IGNORE' the build
fi