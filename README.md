# VibeCodeDetector

## Branching Workflow

This project uses a branching workflow for collaboration:

### Branches
- **main** - Stable, production-ready code
- **develop** - Integration branch for features
- **feature/*** - Individual feature branches

### Workflow
1. Create a feature branch: `git checkout -b feature/your-feature-name develop`
2. Make your changes and commit
3. Push your branch: `git push origin feature/your-feature-name`
4. Create a Pull Request to merge into `develop`
5. After review, merge into `develop`
6. Periodically merge `develop` into `main` for releases

### Quick Commands
```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Save your work
git add .
git commit -m "Description of changes"
git push origin feature/my-feature

# Update your branch with latest changes
git checkout develop
git pull origin develop
git checkout feature/my-feature
git merge develop
```
