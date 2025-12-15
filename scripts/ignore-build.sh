if [ -n "$VERCEL_GIT_COMMIT_SHA" ]; then
  echo "Skipping Git-triggered build"
  exit 1
fi

echo "Allowing deploy hook build"
exit 0
