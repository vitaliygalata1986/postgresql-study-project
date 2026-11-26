---
name: express-openapi
description: Maintain and verify the OpenAPI contract for this project's Node.js and Express API. Use when routes, request fields, validation, or responses change, or when asked to synchronize API documentation.
---

# Maintain the Express OpenAPI contract

Read [server/AGENTS.md](../../../server/AGENTS.md) and inspect [server/index.js](../../../server/index.js). Use the root [README.md](../../../README.md) for the PostgreSQL setup and confirm schema details against the SQL used by the handlers.

## Match the running API

- Inventory Express registrations and any mounted router prefixes. Compare every method and path with the OpenAPI `paths` map, translating Express parameters such as `:id` to `{id}` and marking each path parameter as required. Remove operations whose registrations were deleted. Include `HEAD` and `OPTIONS` when the application registers them explicitly.
- Trace each operation through the middleware, handler, and PostgreSQL query. Describe accepted body encodings, actual field constraints and defaults, status codes, response content types, and bodies. Express parses both JSON and URL-encoded forms in this project, and handlers currently return both JSON and string responses.
- Derive requiredness from code and database constraints. A partial update can accept omitted fields, and a query can succeed without affecting any rows. Verify those cases before documenting validation or a `404`. Record discrepancies between intended and actual behavior as findings when the task only changes documentation.

## Update and verify the contract

- Keep the existing contract format and source if present. When first creating the contract, use OpenAPI 3.1 in `server/openapi.json`. Reuse repository validation or generation commands if available. A standalone specification is sufficient for synchronization.
- Compare the final path and method inventory against the Express registrations. Check path parameters, request and response media types, status codes, and local schema references. For JSON, verify it parses from `server/` with `node -e "JSON.parse(require('node:fs').readFileSync('openapi.json', 'utf8'))"`. Run the repository's OpenAPI validator if one is available.
- Follow `server/AGENTS.md` for JavaScript syntax checks and HTTP verification against a disposable PostgreSQL database. When routes change, verify their responses and relevant stored rows. Report which operations and artifacts changed and which static or HTTP checks ran.
