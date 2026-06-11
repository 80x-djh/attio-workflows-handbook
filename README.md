# Attio Workflows Handbook

The open-source, GTM-engineering handbook for Attio's new Workflows engine — every trigger and block documented, every credit cost explained, and follow-along go-to-market builds you can ship into your own workspace.

The site is built with [Mintlify](https://mintlify.com). The documentation lives in [`mintlify/`](./mintlify): a `docs.json` plus the MDX pages, organized by the four Diátaxis modes — **Learn**, **Guides**, **Reference**, **Explanation** — alongside Troubleshooting and Pro.

It is designed to be useful for humans, search engines, and AI assistants: Mintlify serves a clean markdown index at `/llms.txt`, and every behavioral or cost claim points back to the official Attio Help Center.

## Local development

```sh
npm i -g mint        # one-time: install the Mintlify CLI
cd mintlify
mint dev             # local preview at http://localhost:3000
```

## Checks

```sh
cd mintlify
mint validate        # strict build — exits non-zero on any error
mint broken-links    # verify every internal link resolves
mint a11y            # accessibility (color contrast, image alt text)
```

## Deploying

See [MINTLIFY-DEPLOY.md](./MINTLIFY-DEPLOY.md). In short: the Mintlify GitHub App deploys this repo automatically, reading `docs.json` from the `mintlify/` subdirectory.

## Contributing

Corrections, verified gotchas, and recipes from real workspaces are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md) and the writing standard in [STYLE.md](./STYLE.md). Every behavioral or cost claim needs an official Attio source or a documented workspace observation.

## License

Prose is CC BY-NC-SA 4.0; code snippets and scripts are MIT. See [LICENSE.md](./LICENSE.md).

## Disclaimer

This is a community resource. It is not affiliated with or endorsed by Attio Ltd. Always verify high-risk implementation details against the official Attio documentation and your own workspace behavior before publishing production workflows.
