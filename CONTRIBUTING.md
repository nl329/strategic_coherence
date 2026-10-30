# Contributing

`index.html` is the self-contained application. No build step is required. Preserve page wording and user customizations when changing functionality.

Run `node --test tests/portable.test.cjs` with Node.js 22 or newer before proposing changes. Tests must use simulated responses and must not require real credentials or paid API calls.

Changes to prompts, model settings, aggregation, or parsing affect the measure. Update the user guide, exported prompt-version identifiers where appropriate, tests, and changelog. Distinguish display-only edits from measurement changes.

Use synthetic examples in issues and pull requests. Do not include private interview data, API keys, or result exports. A project license must be selected before contribution/reuse terms can be represented as open source.
