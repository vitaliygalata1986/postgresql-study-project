# Client Guidelines

This directory contains the React and Vite web application. Run commands from `client/`.

- `npm ci` installs the dependencies pinned in the lockfile.
- `npm run dev` starts Vite and proxies `/api/` to the local Express server.
- `npm run lint` checks the client source.
- `npm run build` produces the static build in `dist/`.

Use the server's HTTP API for post operations. Keep database credentials and PostgreSQL access in `server/`.
