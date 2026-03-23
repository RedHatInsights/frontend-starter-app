---
displayName: "Update Dependencies"
description: "Update minor and patch npm dependencies with Jira cross-reference, PR creation, and CI monitoring"
icon: "package"
order: 1
---

# Update Dependencies Workflow

Follow these steps in order. Do not skip steps.

## Step 1: Identify the repository

Determine the repository name from the git remote:

```bash
git remote get-url origin
```

Extract the `<org>/<repo-name>` from the URL (e.g., `RedHatInsights/frontend-starter-app`).

## Step 2: Check Jira for relevant issues

Search the RHCLOUD Jira project for issues related to this repository:

1. Search for issues with label `hcc-ai-framework` and label `repo:<org>/<repo-name>` (using the repo name from Step 1)
2. Only consider issues that are **unassigned** (assignee is empty) — skip any issue that already has an assignee
4. Summarize any open issues found — note blockers, known incompatibilities, or dependency-specific guidance
5. Save the list of relevant issue keys (e.g., RHCLOUD-12345) — you will update them later

If Jira is not configured, log a warning and proceed without it.

## Step 3: Create a feature branch

Create a dedicated branch for the dependency updates. If a relevant Jira issue was found in Step 2, use its key in the branch name:

```bash
# With Jira ticket (preferred):
git checkout -b RHCLOUD-12345/update-deps

# Without Jira ticket (fallback):
git checkout -b chore/update-deps-$(date +%Y%m%d)
```

If multiple Jira issues were found, use the most relevant one (e.g., the one specifically about dependency updates). This ensures updates are isolated from the main branch and the PR is linked to the Jira issue via branch name.

## Step 4: Audit current dependencies

Run `npm outdated` to identify available updates. Create a list of candidates, separating them into:

- **Minor updates** (e.g., 6.3.x → 6.4.x)
- **Patch updates** (e.g., 6.4.0 → 6.4.1)
- **Major updates** (skip these — log them for the report but do not update)

## Step 5: Group and update dependencies

Update dependencies in logical groups. For each group:

1. Update the version ranges in `package.json` directly
2. Run `npm install` to update `package-lock.json`
3. Run the verification suite (Step 5)
4. If tests pass, commit the group
5. If tests fail, revert the group and note the failure

### Grouping order

1. **PatternFly packages** — `@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-data-view`, `@patternfly/react-component-groups` (update together)
2. **Red Hat Cloud Services packages** — `@redhat-cloud-services/*` (update together)
3. **React ecosystem** — `react`, `react-dom`, `react-router-dom`, `@types/react`, `@types/react-dom` (update together)
4. **Testing tools** — `jest`, `@testing-library/*`, `cypress`, `@playwright/test` (update together)
5. **Build tools** — `typescript`, `eslint`, `webpack-bundle-analyzer` (update together)
6. **Remaining packages** — update individually

## Step 6: Verify after each group

Run the full verification suite:

```bash
npm run lint
npm test
npm run build
```

All three must pass. If any fails:
- Identify which specific package caused the failure
- Revert the entire group
- Try updating packages in the group individually to isolate the problem
- Skip the problematic package and note it in the report

## Step 7: Create Pull Request

After all updates are committed and pushed:

```bash
git push -u origin <branch>
gh pr create --title "chore(deps): update minor and patch dependencies" \
  --body "Automated dependency update — minor and patch versions only.\n\nSee commit history for individual updates."
```

Save the PR URL for later steps.

## Step 8: Update Jira

For each relevant Jira issue found in Step 2, add a comment:

> Automated dependency update PR created: <PR URL>
> Updates include: <summary of packages updated>

## Step 9: Monitor CI status checks

Poll the PR for CI status checks using `gh pr checks`. Repeat every 60 seconds until all required checks have completed.

### Check classification

- **MUST pass** — Konflux checks, any test/build/lint checks
- **CAN be ignored** — Jenkins checks, GitHub Actions security/scanning checks (e.g., `CodeQL`, `Snyk`, `security-scan`)
- **Everything else** — must pass unless clearly a security-only scanner

### If a required check fails

1. Fetch the check's log output: `gh run view <run-id> --log-failed` or inspect the Konflux pipeline logs
2. Read the error and understand what broke
3. Fix the issue in the codebase
4. Commit the fix: `fix(deps): resolve <check-name> failure — <brief description>`
5. Push and wait for checks to re-run
6. Repeat until all required checks pass or you've exhausted reasonable fixes (max 3 fix attempts per check)

If you cannot resolve a check after 3 attempts, note it in the report and move on.

## Step 10: Address PR review comments

After CI checks are green, check for new review comments on the PR:

```bash
gh pr view --comments
```

If there are new comments or review requests:

1. Read each comment carefully
2. Make the requested changes
3. Commit with: `fix(deps): address review — <brief description>`
4. Push the changes
5. Reply to each comment explaining what you did
6. Re-check CI status after pushing

Repeat this step until there are no unaddressed comments. If you are waiting for human review and no new comments appear after checking, proceed to the next step.

## Step 11: Wait for PR merge and close Jira

Monitor the PR for merge status:

```bash
gh pr view --json state,mergedAt
```

Check every 2 minutes. Once the PR is merged:

1. For each relevant Jira issue found in Step 2, transition the issue to **Done** / **Closed**
2. Add a final comment to each issue:

> PR merged: <PR URL>
> Dependency updates applied successfully.

If the PR is closed without merging, note it in the report and do not close the Jira issues.

## Step 12: Generate report

Create `artifacts/dependency-update-report.md` with:

- **Jira Issues Found** — summary of relevant RHCLOUD issues and comments added
- **Pull Request** — PR URL and current status
- **Updated** — table of package, old version, new version, group
- **Skipped (major)** — packages with major updates available (not applied)
- **Failed** — packages that caused test failures (reverted), with error details
- **CI Checks** — status of each check (passed / failed / ignored), with notes on any fixes applied
- **Review Comments** — summary of feedback received and actions taken
- **Test Results** — final pass/fail status of lint, test, build
