## Development

Astro tracks at most one dev server per project (in `.astro/dev.json`), regardless of port — a second `astro dev` just reports the existing one, and `astro dev stop` always targets that single tracked instance. Check before starting anything:

```
astro dev status
```

- **Already running** — it may be the user's own server. Leave it alone: never run `astro dev stop` or `--force` against it. Just use its reported URL.
- **Nothing running** — start your own on a non-default port, so it's never mistaken for the user's:

  ```
  astro dev --background --port 4322
  ```

  Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`. Once the task is done, stop it yourself with `astro dev stop` — but only when you're the one who started it.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
