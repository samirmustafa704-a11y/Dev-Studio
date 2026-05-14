# Scripts

Helper scripts for Dev Studio development and contribution.

## Available Scripts

### Setup Scripts

#### `setup.bat` (Windows)
Configure Git for contribution.

```bash
scripts/setup.bat
```

**What it does:**
- Checks if Git is installed
- Prompts for your email and name
- Configures Git globally
- Shows next steps

#### `setup.sh` (macOS/Linux)
Configure Git for contribution.

```bash
./scripts/setup.sh
```

**What it does:**
- Checks if Git is installed
- Prompts for your email and name
- Configures Git globally
- Shows next steps

### Push Scripts

#### `push.bat` (Windows)
Push your changes to GitHub.

```bash
scripts/push.bat
```

**What it does:**
- Verifies Git is configured
- Shows pending commits
- Asks for confirmation
- Pushes to GitHub
- Shows next steps

#### `push.sh` (macOS/Linux)
Push your changes to GitHub.

```bash
./scripts/push.sh
```

**What it does:**
- Verifies Git is configured
- Shows pending commits
- Asks for confirmation
- Pushes to GitHub
- Shows next steps

## Quick Start

### Windows

1. **Setup Git:**
   ```bash
   scripts/setup.bat
   ```

2. **Push Changes:**
   ```bash
   scripts/push.bat
   ```

### macOS/Linux

1. **Setup Git:**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Push Changes:**
   ```bash
   chmod +x scripts/push.sh
   ./scripts/push.sh
   ```

## Manual Commands

If you prefer to run commands manually:

### Configure Git
```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### Check Pending Commits
```bash
git log --oneline -3
```

### Push to GitHub
```bash
git push -u origin main
```

## Troubleshooting

### "Permission denied" (macOS/Linux)
Make scripts executable:
```bash
chmod +x scripts/setup.sh
chmod +x scripts/push.sh
```

### "Git not found"
Install Git from: https://git-scm.com/download

### "Authentication failed"
See `CONTRIBUTE_SETUP.md` for authentication options:
- Personal Access Token
- SSH Key
- Git Credential Manager

## Related Documentation

- `PUSH_GUIDE.md` - Detailed push instructions
- `CONTRIBUTE_SETUP.md` - Complete setup guide
- `NEXT_STEPS.md` - Project next steps

---

**Ready to contribute?** Run `setup.bat` or `setup.sh` to get started!
