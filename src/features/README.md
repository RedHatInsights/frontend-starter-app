# Feature Islands

Each feature lives in its own folder under `src/features/`. A feature island
is self-contained: components, hooks, data queries, mocks, stories, and docs
all co-located.

```
src/features/
├── sample/              # The starter app's example feature
│   ├── SamplePage.tsx
│   ├── components/
│   ├── data/            # queries, mocks (added in later PRs)
│   └── README.md
└── README.md            # This file
```

When creating a new app from this template, keep this structure:
- One folder per feature
- Co-locate everything the feature needs
- Features should not import from each other
