# Contributing

- Use hash-based section IDs (e.g., `#journal`) when adding new features.
- Prefer lazy-loaded modules with `React.lazy` and `<Suspense>` wrappers.
- Fetch data lazily by combining `useInView` with `AbortController` cleanup.
