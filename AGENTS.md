# Repository Guidelines

## Project Organization

This repository is organized into two separate projects:

- `server/` contains the Express API and PostgreSQL integration. See [server/AGENTS.md](server/AGENTS.md) for its structure, commands, and conventions.
- `client/` is reserved for the future web application. See [client/AGENTS.md](client/AGENTS.md) for its scope and conventions.

Read the applicable directory guide before changing either project. Run commands from the directory specified by that guide.

## API Documentation

When adding, changing, or removing Express API routes or changing their contracts, use the [express-openapi skill](.agents/skills/express-openapi/SKILL.md) to update the [OpenAPI specification](server/openapi.json). Follow the verification steps in [server/AGENTS.md](server/AGENTS.md#development-and-testing).

## PostgreSQL Study Notes

- Keep the SQL and `psql` study notes at the repository root. Exclude LibreOffice lock files (`.~lock.*#`) from changes.
- Use uppercase SQL keywords, lowercase `snake_case` identifiers such as `user_id`, and four spaces for indented table definitions. Write explanatory comments in the SQL notes in Russian and keep database credentials out of examples.
- Run the relevant setup and query individually in a disposable PostgreSQL database. Check the result rows or schema change and include any required extensions or seed data in the reproduction steps.

## Code Comments

- Explain why, rather than what the code does when that is already clear.
- Do not comment on obvious code; prefer clear, accurate names.
- Add a doc comment to every public function describing its contract.
- Explain complex arithmetic next to the calculation.
- Keep comments up to date whenever the related code changes.

## When starting a new task use GitHub Flow

Apply these rules only when starting a new task. Continue the current task in its existing branch and PR without restarting the workflow.

See [docs/rules/github-flow.md](docs/rules/github-flow.md) for details.

## When committing

Use the [commit skill](.agents/skills/commit/SKILL.md).

## When creating Pull Request Workflow

Follow the rules in [docs/rules/pr.md](docs/rules/pr.md).
