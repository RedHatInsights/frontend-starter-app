# Why TanStack Query

## What it is
TanStack Query is NOT a client state management library. It does NOT replace
Redux, zustand, or useState. It manages server state: caching, request
deduplication, background refetching, stale-while-revalidate.

See: https://tanstack.com/query/v5/docs/framework/react/guides/does-this-replace-client-state

## The problem
Every developer writes the same useEffect + useState boilerplate for data
fetching. Most get it wrong:
- Missing cleanup → memory leaks
- Missing dependency arrays → infinite render loops
- No request deduplication → 16 identical API calls (see: July 8 outage)
- No cache invalidation → stale data

These mistakes have caused production incidents in HCC.

## The proof
This pattern eliminated ~40% of boilerplate in the rbac-ui migration
(RHCLOUD-44200, closed).

## Before
```tsx
function useCVEs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCVEs()
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
// 15 lines. Every developer writes this differently.
// Most forget the cleanup. None handle cache invalidation.
```

## After
```tsx
function useCVEs() {
  const { fetchCVEs } = useAppServices();
  return useQuery({
    queryKey: ['cves'],
    queryFn: fetchCVEs,
  });
}
// 5 lines. Caching, dedup, cleanup, error handling built in.
```

The diff in this PR shows this pattern applied to a real CVEList.
