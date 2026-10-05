#!/usr/bin/env bash
# Fail if any prototype story file is missing tags: ['!manifest'], which keeps
# prototypes out of the Storybook components manifest.
set -euo pipefail

[ -d src/prototypes ] || exit 0

missing=$(grep -rLE --include='*.stories.*' "[\"']!manifest[\"']" src/prototypes || true)

if [ -n "$missing" ]; then
  echo "These prototype stories are missing tags: ['!manifest'] in their meta:"
  echo "$missing" | sed 's/^/  /'
  echo "Add it so prototypes stay out of the Storybook components manifest."
  exit 1
fi
