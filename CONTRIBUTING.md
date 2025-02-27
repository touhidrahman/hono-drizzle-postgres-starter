# Contributing to Hono RestAPI Starter Kit

Thank you for your interest in contributing to the Hono RestAPI Starter Kit! This document provides guidelines and
instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
    - [Setting Up Your Development Environment](#setting-up-your-development-environment)
    - [Making Changes](#making-changes)
    - [Testing Your Changes](#testing-your-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Bug Reports and Feature Requests](#bug-reports-and-feature-requests)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to
uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

To get started with contributing:

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/SyahrulBhudiF/Hono-Starter-Code
   cd Hono-Starter-Code
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/SyahrulBhudiF/Hono-Starter-Code
   ```
4. Install dependencies:
   ```bash
   bun install
   ```

## Development Process

### Setting Up Your Development Environment

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your development configuration
   ```

3. Start the development environment:
   ```bash
   docker compose up
   ```

### Making Changes

When working on the codebase:

- Keep your changes focused on a single issue or feature
- Follow the existing code style and architecture
- Document any new features or changes to existing functionality
- Add/update comments for complex code sections
- Update the README if necessary

### Testing Your Changes

Although the project doesn't have formal tests yet, please make sure to:

1. Manually test your changes thoroughly
2. Verify API endpoints work as expected using the Swagger UI
3. Check that your changes don't break existing functionality

## Pull Request Process

1. Update your fork to the latest upstream changes:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Submit a pull request through the GitHub interface:
    - Use a clear and descriptive title
    - Include a comprehensive description of the changes
    - Reference any related issues using the GitHub issue number (#123)
    - Request reviews from maintainers if applicable

4. Address any feedback or requested changes from the code review

5. Once approved, your changes will be merged by a maintainer

## Coding Standards

Follow these guidelines when writing code:

- Use TypeScript for all new code
- Follow the existing code style and architecture
- Keep functions small and focused on a single task
- Use clear variable and function names
- Add JSDoc comments for public APIs and complex logic

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

- `type`: feat, fix, docs, style, refactor, test, chore
- `scope`: optional, the part of the codebase affected (e.g., auth, db, api)
- `subject`: short description of the change
- `body`: detailed explanation (optional)
- `footer`: reference issues, breaking changes (optional)

Examples:

```
feat(auth): add OAuth2 authentication with Google

fix(db): resolve connection pooling issue
```

## Bug Reports and Feature Requests

For bug reports and feature requests, please create an issue on GitHub:

- Be as detailed as possible in your description
- Include steps to reproduce for bugs
- For feature requests, explain the use case and benefits

---

Thank you for contributing to the Hono RestAPI Starter Kit! Your efforts help make this project better for everyone.