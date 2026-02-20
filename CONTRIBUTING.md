# Contributing to DevLog

Thank you for your interest in contributing to DevLog! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Your environment (OS, Node.js version, browser, etc.)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Use cases and examples
- Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/devlog.git
   cd devlog
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Make your changes**
   - Write clean, readable TypeScript/React code
   - Follow ESLint rules and TypeScript best practices
   - Use functional components with hooks
   - Add tests for new features
   - Update documentation as needed

5. **Run tests**
   ```bash
   npm test
   # or
   npm run test:coverage
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

7. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Follow TypeScript and React best practices
- Use functional components with hooks
- Use TypeScript types and interfaces
- Keep components focused and small
- Use meaningful variable and component names
- Follow the existing code structure and patterns

### Testing

- Write tests for new features
- Aim for good test coverage
- Tests should be independent and repeatable
- Use descriptive test names

### Documentation

- Update README.md if adding new features
- Add docstrings to new functions/classes
- Update this file if changing contribution process

## Commit Messages

Use clear, descriptive commit messages:
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Be concise but descriptive
- Reference issue numbers if applicable

Examples:
- `Add: support for date range filtering`
- `Fix: handle empty tag list correctly`
- `Update: improve error messages`

## Questions?

Feel free to open an issue for any questions about contributing!
