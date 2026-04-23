# Changelog

All notable changes to the "Smart VSCode Copy" extension will be documented in this file.

## [1.0.0] - 2026-04-04

### Added
- **Initial Release** of Smart VSCode Copy.
- **Context Awareness**: Automatically resolves the code hierarchy (Class > Method > Property) using the VS Code Symbol Provider.
- **Three Reference Styles**:
    - `Standard`: Detailed labels for Path, Repo, and Context.
    - `GitHubLink`: Generates a direct web link to the specific lines on GitHub.
    - `Minimalist`: A high-density, single-line reference using custom separators.
- **Smart Dedent**: Automatically removes leading indentation from copied code blocks so they align perfectly in Markdown.
- **Git Integration**: Optional inclusion of remote repository URLs and short commit hashes.
- **Right-Click Integration**: Commands added to the editor context menu for quick access.
- **Keyboard Shortcuts**:
    - `Ctrl+Alt+C` (Cmd+Opt+C) for Simple Reference.
    - `Ctrl+Alt+Shift+C` (Cmd+Opt+Shift+C) for Code Block Reference.

### Fixed
- Fixed an issue where single-line selections would show a range (e.g., L10-L10).
- Resolved inconsistent indentation when copying nested functions.

## [1.1.0] - 2026-04-04

- Updated display name and metadata

## [1.1.1] - 2026-04-04

- Updated CHANGELOG.md

## [1.1.2] - 2026-04-07

- Changed VSCode version to 1.60.0 as APIs are stable.

## [1.1.5] - 2026-04-07

- Ensure that ssh repos are converted to http links for github
