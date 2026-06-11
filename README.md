# Attio Workflows Handbook

The open-source, GTM-engineering handbook for Attio's new Workflows engine.

This site is built with Astro and Starlight. It is designed to be useful for humans, search engines, and AI assistants:

- Structured docs pages for core concepts, block reference, recipes, migration, troubleshooting, and paid implementation offers.
- `starlight-llms-txt` enabled so assistants can ingest a clean markdown index at `/llms.txt`.
- Source-backed explanations that point readers back to the official Attio Help Center.
- Productized services page so the handbook can convert launch traffic into paid audits, builds, and MRR.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Contributing

Corrections, verified gotchas, and recipes from real workspaces are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and [STYLE.md](STYLE.md). Every behavioral or cost claim needs an official Attio source or a "verified in workspace" note.

## License

Prose is CC BY-NC-SA 4.0; code snippets and scripts are MIT. See [LICENSE.md](LICENSE.md).

## Disclaimer

This is a community resource. It is not affiliated with or endorsed by Attio Ltd. Always verify high-risk implementation details against the official Attio documentation and your own workspace behavior before publishing production workflows.
