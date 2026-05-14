# Contributing Guide

Thank you for your interest in contributing to Dev Studio! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional. We're building a welcoming community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `develop`
4. **Make your changes**
5. **Push to your fork**
6. **Open a Pull Request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/Dev-Studio.git
cd Dev-Studio

# Add upstream remote
git remote add upstream https://github.com/firstall31-dot/Dev-Studio.git

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name
```

## Making Changes

### Code Style

- Follow existing code style
- Use TypeScript for type safety
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: reorganize code
test: add tests
chore: update dependencies
```

Example:
```
feat: add prompt versioning

- Add version history to prompts
- Allow reverting to previous versions
- Display version metadata in UI
```

### Testing

- Write tests for new features
- Ensure existing tests pass
- Run linter before committing

```bash
npm run lint
npm run test -- --run
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

2. **Run tests and linting**:
   ```bash
   npm run lint
   npm run test -- --run
   npm run build
   ```

3. **Update documentation** if needed

### Submitting PR

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request** on GitHub
   - Use the PR template
   - Link related issues
   - Describe changes clearly
   - Add screenshots for UI changes

3. **Respond to feedback**
   - Address review comments
   - Push additional commits
   - Don't force push (unless requested)

### PR Requirements

- ✅ All tests pass
- ✅ Code is linted
- ✅ No TypeScript errors
- ✅ Documentation is updated
- ✅ Commit messages are clear
- ✅ At least one approval

## Types of Contributions

### Bug Fixes

1. Create issue describing the bug
2. Create branch: `fix/bug-description`
3. Fix the bug
4. Add test to prevent regression
5. Submit PR

### Features

1. Discuss feature in issue first
2. Create branch: `feature/feature-name`
3. Implement feature
4. Add tests
5. Update documentation
6. Submit PR

### Documentation

1. Create branch: `docs/documentation-name`
2. Update or create documentation
3. Submit PR

### Tests

1. Create branch: `test/test-description`
2. Add tests
3. Submit PR

## Project Structure

```
src/
├── routes/          # Pages
├── components/      # React components
├── hooks/           # Custom hooks
├── lib/             # Utilities and store
└── integrations/    # External services

docs/               # Documentation
.github/            # GitHub workflows
docker/             # Docker configuration
```

## Common Tasks

### Add a New Page

1. Create file in `src/routes/`
2. Add route to router
3. Create components as needed
4. Update navigation if needed
5. Add documentation

### Add a New Component

1. Create file in `src/components/`
2. Export from `src/components/index.ts`
3. Add TypeScript types
4. Add JSDoc comments
5. Create stories if using Storybook

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Test after updating
npm run build
npm run test -- --run
```

### Run Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Troubleshooting

### Tests Failing

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Run tests
npm run test -- --run
```

### Build Errors

```bash
# Check TypeScript
npx tsc --noEmit

# Check ESLint
npm run lint

# Clear build cache
rm -rf dist .output .vinxi
npm run build
```

### Git Issues

```bash
# Sync with upstream
git fetch upstream
git rebase upstream/develop

# Undo last commit
git reset --soft HEAD~1

# Stash changes
git stash
```

## Getting Help

- 📖 Read [documentation](./README.md)
- 🐛 Check [existing issues](https://github.com/firstall31-dot/Dev-Studio/issues)
- 💬 Start a [discussion](https://github.com/firstall31-dot/Dev-Studio/discussions)
- 📧 Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Dev Studio! 🎉
