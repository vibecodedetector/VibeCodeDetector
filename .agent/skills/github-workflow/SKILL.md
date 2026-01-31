---
name: GitHub Repository Management
description: Manage GitHub repository, branches, PRs, and issues for VibeCheck development
---

# GitHub Repository Management

This skill provides guidance for managing the VibeCheck project on GitHub.

## Repository Operations

### Get Repository Info

```tool
mcp_github-mcp-server_get_file_contents
owner: <owner>
repo: VibeCode
path: /
```

### List Branches

```tool
mcp_github-mcp-server_list_branches
owner: <owner>
repo: VibeCode
```

### Create Feature Branch

```tool
mcp_github-mcp-server_create_branch
owner: <owner>
repo: VibeCode
branch: feature/<feature-name>
from_branch: main
```

## Pull Requests

### Create Pull Request

```tool
mcp_github-mcp-server_create_pull_request
owner: <owner>
repo: VibeCode
title: <PR title>
head: feature/<feature-name>
base: main
body: |
  ## Summary
  <description>
  
  ## Changes
  - Change 1
  - Change 2
  
  ## Testing
  - [ ] Unit tests pass
  - [ ] Manual testing completed
```

### List Open PRs

```tool
mcp_github-mcp-server_list_pull_requests
owner: <owner>
repo: VibeCode
state: open
```

### Get PR Details

```tool
mcp_github-mcp-server_pull_request_read
method: get
owner: <owner>
repo: VibeCode
pullNumber: <pr_number>
```

### Get PR Diff

```tool
mcp_github-mcp-server_pull_request_read
method: get_diff
owner: <owner>
repo: VibeCode
pullNumber: <pr_number>
```

### Merge Pull Request

```tool
mcp_github-mcp-server_merge_pull_request
owner: <owner>
repo: VibeCode
pullNumber: <pr_number>
merge_method: squash
commit_title: <commit_title>
```

## Issues

### Create Issue

```tool
mcp_github-mcp-server_issue_write
method: create
owner: <owner>
repo: VibeCode
title: <issue_title>
body: |
  ## Description
  <description>
  
  ## Acceptance Criteria
  - [ ] Criteria 1
  - [ ] Criteria 2
labels: ["enhancement", "scanner"]
```

### List Open Issues

```tool
mcp_github-mcp-server_list_issues
owner: <owner>
repo: VibeCode
state: OPEN
```

### Get Issue Details

```tool
mcp_github-mcp-server_issue_read
method: get
owner: <owner>
repo: VibeCode
issue_number: <issue_number>
```

### Add Comment to Issue

```tool
mcp_github-mcp-server_add_issue_comment
owner: <owner>
repo: VibeCode
issue_number: <issue_number>
body: <comment_text>
```

## File Operations

### Get File Contents

```tool
mcp_github-mcp-server_get_file_contents
owner: <owner>
repo: VibeCode
path: <file_path>
ref: <branch_name>
```

### Create or Update File

```tool
mcp_github-mcp-server_create_or_update_file
owner: <owner>
repo: VibeCode
path: <file_path>
content: <file_content>
message: <commit_message>
branch: <branch_name>
sha: <existing_file_sha>
```

### Push Multiple Files

```tool
mcp_github-mcp-server_push_files
owner: <owner>
repo: VibeCode
branch: <branch_name>
files: [
  {"path": "file1.ts", "content": "<content>"},
  {"path": "file2.ts", "content": "<content>"}
]
message: <commit_message>
```

## Commits

### List Recent Commits

```tool
mcp_github-mcp-server_list_commits
owner: <owner>
repo: VibeCode
perPage: 10
```

### Get Commit Details

```tool
mcp_github-mcp-server_get_commit
owner: <owner>
repo: VibeCode
sha: <commit_sha>
```

## Labels for VibeCheck

Recommended labels for the project:

| Label | Description | Color |
|-------|-------------|-------|
| `scanner` | Related to scanner development | blue |
| `dashboard` | UI/Dashboard changes | purple |
| `security` | Security-related issues | red |
| `billing` | Stripe/billing features | green |
| `bug` | Something isn't working | red |
| `enhancement` | New feature or request | blue |
| `documentation` | Docs improvements | yellow |
| `good first issue` | Good for newcomers | green |

## Branch Naming Convention

- `feature/<name>` - New features
- `fix/<name>` - Bug fixes
- `refactor/<name>` - Code refactoring
- `docs/<name>` - Documentation updates
- `scanner/<type>` - Scanner-specific work (e.g., `scanner/security`, `scanner/seo`)

## PR Review Workflow

1. Create feature branch from `main`
2. Make changes and commit
3. Push branch and create PR
4. Request Copilot review (optional):
   ```tool
   mcp_github-mcp-server_request_copilot_review
   owner: <owner>
   repo: VibeCode
   pullNumber: <pr_number>
   ```
5. Address feedback
6. Squash and merge when approved

## Getting Current User

```tool
mcp_github-mcp-server_get_me
```

This returns the authenticated user's information including username.
