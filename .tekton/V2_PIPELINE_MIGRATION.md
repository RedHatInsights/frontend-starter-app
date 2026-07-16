# V2 Pipeline Migration Guide

This repository has been updated to use the v2 platform-ui pipeline with flexible secret management.

## Changes Made

### Pipeline Reference Updated
- **From**: `RedHatInsights/konflux-pipelines` (main) - v1 pipeline
- **To**: `catastrophe-brandon/konflux-pipelines` (btweed/platform-ui-v2-flexible-secrets) - v2 pipeline

### Pipeline File
- **From**: `pipelines/platform-ui/docker-build-run-all-tests.yaml`
- **To**: `pipelines/platform-ui/docker-build-run-all-tests-v2.yaml`

## Secret Management

The v2 pipeline uses `envFrom` to automatically expose all secret keys as environment variables, while maintaining backwards compatibility for legacy key names.

### Current Secret: `frontend-starter-app-credentials-secret`

**Required keys** (must exist):
- `e2e-user` → Available as `E2E_USER`
- `e2e-password` → Available as `E2E_PASSWORD`
- `e2e-hcc-env-url` → Available as both `E2E_HCC_ENV_URL` AND `HCC_ENV_URL` (backwards compat)
- `e2e-stage-actual-hostname` → Available as both `E2E_STAGE_ACTUAL_HOSTNAME` AND `STAGE_ACTUAL_HOSTNAME` (backwards compat)

### Adding Custom Secrets (e.g., Chromatic, Currents)

You can now add any additional secret keys without modifying the pipeline!

**Example: Adding Chromatic support**
```yaml
# In your ExternalSecret definition
data:
  # Existing keys
  - secretKey: e2e-user
    remoteRef:
      key: ...
  
  # NEW: Add Chromatic keys
  - secretKey: chromatic-token
    remoteRef:
      key: frontend-starter-app/chromatic/token
  - secretKey: chromatic-project-id
    remoteRef:
      key: frontend-starter-app/chromatic/project-id
```

**Usage in e2e-tests-script:**
```bash
#!/bin/bash

# Run tests
npx playwright test

# Chromatic integration (if keys exist in secret)
if [ -n "$CHROMATIC_TOKEN" ]; then
  echo "Publishing to Chromatic..."
  npx chromatic --project-token="$CHROMATIC_TOKEN"
fi
```

### Environment Variables in Scripts

All scripts have access to:
1. **Automatic variables** (via envFrom): All secret keys converted to uppercase with hyphens→underscores
2. **Backwards-compatible variables**: `HCC_ENV_URL`, `STAGE_ACTUAL_HOSTNAME`
3. **Custom variables**: Any additional keys you add to the secret

## Testing the Migration

1. Verify secret exists:
   ```bash
   kubectl get secret frontend-starter-app-credentials-secret -n rh-platform-experien-tenant
   ```

2. Check secret keys:
   ```bash
   kubectl get secret frontend-starter-app-credentials-secret -n rh-platform-experien-tenant -o jsonpath='{.data}' | jq 'keys'
   ```

3. Create a PR to trigger the pipeline and verify e2e tests pass

## Rollback Plan

If issues occur, revert to v1 pipeline by changing `.tekton/frontend-starter-app-pull-request.yaml`:

```yaml
pipelineRef:
  resolver: git
  params:
  - name: url
    value: https://github.com/RedHatInsights/konflux-pipelines
  - name: revision
    value: main
  - name: pathInRepo
    value: pipelines/platform-ui/docker-build-run-all-tests.yaml
```

## Benefits

- **No pipeline changes needed** for future secret additions
- **Backwards compatible** with existing secrets
- **Easy integration** with third-party services (Chromatic, Currents, etc.)
- **Per-repo flexibility** - each repo can define its own custom secrets
