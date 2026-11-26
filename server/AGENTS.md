# Server Guidelines

## Structure

- `index.js` is the CommonJS entry point. It configures Express, checks the PostgreSQL connection, and defines the post routes.
- `package.json` declares server dependencies and scripts. Keep `package-lock.json` in sync when dependencies change.
- `.env.example` documents the PostgreSQL connection settings. Keep actual credentials in the local `.env` file.

## Development and Testing

Run these commands from `server/`.

- `npm ci` installs the dependencies pinned in the lockfile.
- `node --check index.js` checks JavaScript syntax.
- `npm start` runs the API on port 3000. `npm run dev` restarts it when files change.
- For route changes, use a disposable PostgreSQL database with the `posts` table described in the root README. Check the HTTP response and stored rows for the affected operations.

## Coding Conventions

- Use CommonJS `require`, single quotes, and statement terminators.
- Write explanatory code comments in Russian.
- Pass request values to `pg` as SQL parameters. Use a fixed list of allowed columns when constructing an update.
