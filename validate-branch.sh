#!/bin/bash

# Get the current branch name
branch_name=$(git rev-parse --abbrev-ref HEAD)

# Define regular expressions for the expected patterns
feature_regex="^feature\/[A-Z0-9]{1,}-[a-z0-9-]+$"
bugfix_regex="^bugfix\/[A-Z0-9]{1,}-[a-z0-9-]+$"

# Check if the branch name matches either of the expected patterns
if [[ $branch_name =~ $feature_regex || $branch_name =~ $bugfix_regex ]]; then
  echo "Branch name is valid: $branch_name"
  exit 0
else
  echo "Error: Branch name '$branch_name' does not match the required pattern."
  exit 1  # Exit with non-zero status to prevent the commit/push action
fi
