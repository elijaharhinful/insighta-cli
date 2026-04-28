# Insighta CLI

The terminal interface for **Insighta Labs+**. This tool allows users to manage and query profiles directly from their command line, with full support for GitHub OAuth (PKCE) and Natural Language search.

---

## Features

-   **Secure Auth**: GitHub OAuth 2.0 with PKCE flow.
-   **Profile Management**: List, Get, and Create (Admin only) profiles.
-   **NLP Search**: Search profiles using natural language queries.
-   **Data Export**: Export filtered profile data to CSV.
-   **Smart Refresh**: Automatic token refresh handling.
-   **Rich UI**: Beautiful terminal tables, loaders, and colored output.

---

## Installation

To install the CLI globally:

```bash
cd insighta-cli
npm install -g .
```

*Note: In production, this would be distributed via npm as `npm install -g @insighta/cli`.*

---

## Authentication

Insighta CLI uses a secure PKCE-based OAuth flow.

1.  Run `insighta login`.
2.  The CLI starts a temporary local server and opens your browser to GitHub.
3.  After you authorize, GitHub redirects to your local server.
4.  The CLI exchanges the code for access/refresh tokens and stores them securely.

---

## Commands Reference

### Authentication Commands

| Command | Description |
|---|---|
| `insighta login` | Starts the GitHub OAuth login flow. |
| `insighta logout` | Clears local credentials and invalidates the session. |
| `insighta whoami` | Displays information about the currently logged-in user. |

### Profile Commands

| Command | Description |
|---|---|
| `insighta profiles list` | Lists profiles with optional filters (`--gender`, `--country`, `--age-group`, `--min-age`, `--max-age`, `--sort-by`, `--order`, `--page`, `--limit`). |
| `insighta profiles get <id>` | Retrieves detailed information for a specific profile. |
| `insighta profiles search "<query>"` | Performs a natural language search (e.g., `insighta profiles search "young males from nigeria"`). |
| `insighta profiles create --name <name>` | (Admin Only) Creates and enriches a new profile. |
| `insighta profiles export --format csv` | Exports profiles to a CSV file in the current directory. Supports all list filters. |

---

## Configuration

Credentials and configuration are stored locally in:
`~/.insighta/credentials.json`

This file contains:
-   `access_token`
-   `refresh_token`
-   `user_info`

---

## Development

### Setup
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Configure `.env` with `API_URL` (pointing to your `profile-api`).
4.  Run in development mode: `npm run dev -- <command>`.

### Build
To build the project:
```bash
npm run build
```
The executable will be available at `dist/index.js`.
