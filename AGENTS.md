## Development

When starting the dev server, use background mode:

```
astro dev --background --port 4321 --host 0.0.0.0
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### Cursor Cloud Agents Window preview

The right-side preview needs port **4321** forwarded:

1. Keep the site bound to `0.0.0.0:4321` (not `127.0.0.1`).
2. In the Agents Window, open **Forwarded Ports** (plug icon).
3. Turn on **Auto-Forward Ports**, or manually forward **4321**.
4. Choose **Open in internal browser** for that port.
5. If the panel still says it cannot connect, run **Developer: Reload Window** and reopen the agent tab.

`npm run preview` builds then serves on `0.0.0.0:4321`. Declared in `.cursor/environment.json` as port `web`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
