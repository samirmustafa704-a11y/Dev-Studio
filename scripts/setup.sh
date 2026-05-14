#!/bin/bash

# Dev Studio - Setup Script
# Configures Git and prepares for contribution

echo "🚀 Dev Studio - Setup"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed!"
  echo "Please install Git from: https://git-scm.com/download"
  exit 1
fi

echo "✓ Git is installed"
echo ""

# Get user input
read -p "Enter your email: " EMAIL
read -p "Enter your name: " NAME

if [ -z "$EMAIL" ] || [ -z "$NAME" ]; then
  echo "❌ Email and name are required!"
  exit 1
fi

# Configure Git
echo ""
echo "Configuring Git..."
git config --global user.email "$EMAIL"
git config --global user.name "$NAME"

# Verify configuration
echo ""
echo "✓ Git configured successfully!"
echo ""
echo "Configuration:"
echo "  Email: $EMAIL"
echo "  Name: $NAME"
echo ""

# Show next steps
echo "Next steps:"
echo "1. Set up authentication:"
echo "   - Personal Access Token: https://github.com/settings/tokens"
echo "   - SSH Key: https://github.com/settings/ssh/new"
echo ""
echo "2. Push your changes:"
echo "   - Run: ./push.sh"
echo "   - Or: git push -u origin main"
echo ""
echo "3. Create a Pull Request:"
echo "   - Go to: https://github.com/firstall31-dot/Dev-Studio"
echo "   - Click 'Compare & pull request'"
echo ""
