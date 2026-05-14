#!/bin/bash

# Dev Studio - Push Changes Script
# This script helps you push changes to GitHub

echo "🚀 Dev Studio - Push Changes"
echo ""

# Check if git is configured
EMAIL=$(git config --global user.email)
NAME=$(git config --global user.name)

if [ -z "$EMAIL" ] || [ -z "$NAME" ]; then
  echo "❌ Git not configured!"
  echo ""
  echo "Please configure Git first:"
  echo "  git config --global user.email 'your-email@example.com'"
  echo "  git config --global user.name 'Your Name'"
  exit 1
fi

echo "✓ Git configured as: $NAME <$EMAIL>"
echo ""

# Check for pending commits
COMMITS=$(git log --oneline origin/main..main | wc -l)

if [ "$COMMITS" -eq 0 ]; then
  echo "✓ No pending commits to push"
  exit 0
fi

echo "📊 Pending commits: $COMMITS"
echo ""
echo "Recent commits:"
git log --oneline -5
echo ""

# Ask for confirmation
read -p "Push these commits to GitHub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

# Push changes
echo ""
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to GitHub!"
  echo ""
  echo "Next steps:"
  echo "1. Go to: https://github.com/firstall31-dot/Dev-Studio"
  echo "2. Create a Pull Request"
  echo "3. Add description of changes"
  echo "4. Submit for review"
else
  echo ""
  echo "❌ Push failed!"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check your internet connection"
  echo "2. Verify GitHub credentials"
  echo "3. See CONTRIBUTE_SETUP.md for authentication help"
fi
