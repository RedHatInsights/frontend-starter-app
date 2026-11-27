const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const param = (name, value) => new RegExp(`  - name: ${name}\n    value: ${value}(?:\n|$)`);
const pkg = JSON.parse(read('package.json'));
const appName = pkg.insights.appname;

test('PR and push select the shared hermetic deploy target', () => {
  for (const kind of ['pull-request', 'push']) {
    const pipeline = read(`.tekton/frontend-starter-app-${kind}.yaml`);
    assert.match(pipeline, param('dockerfile', 'build-tools/Dockerfile\\.hermetic'));
    assert.match(pipeline, param('target-stage', 'deploy'));
    assert.match(pipeline, param('hermetic', '"true"'));
    assert.match(pipeline, /"type": "npm", "path": "\."/);
    assert.ok(pipeline.includes(`"LABEL_COMPONENT=${appName}-hermetic"`));
    assert.ok(pipeline.includes(`"LABEL_URL=https://github.com/RedHatInsights/${appName}"`));
    assert.match(pipeline, /npm run lint/);
    assert.match(pipeline, /npm test --/);
    assert.match(pipeline, /npm run test:hermetic/);
  }
  const pr = read('.tekton/frontend-starter-app-pull-request.yaml');
  assert.match(pr, /docker-build-run-all-tests-v3\.yaml/);
  assert.match(pr, param('run-app-command', 'caddy'));
  assert.match(pr, param('e2e-readiness-path', '/default/fed-mods\\.json'));
  assert.match(pr, /npx playwright test/);
});

for (const name of [appName, 'renamed-app']) test(`shared generators preserve route and metadata for ${name}`, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'starter-hermetic-'));
  try {
    fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ ...pkg, insights: { ...pkg.insights, appname: name } }));
    fs.mkdirSync(path.join(tmp, 'dist'));
    for (const script of ['caddyfile_gen_hermetic.js', 'build_app_info_hermetic.js']) {
      execFileSync(process.execPath, [path.join(root, 'build-tools', script)], { cwd: tmp });
    }
    const caddy = fs.readFileSync(path.join(tmp, 'Caddyfile'), 'utf8');
    assert.ok(caddy.includes(`path /apps/${name}*`));
    assert.ok(caddy.includes(`uri strip_prefix /apps/${name}\n`));
    assert.match(caddy, /root \/srv\/dist/);
    assert.match(caddy, /path \{\$ENV_PUBLIC_PATH\}\*/);
    assert.match(read('build-tools/Dockerfile.hermetic'), /ENV ENV_PUBLIC_PATH "\/default"/);
    for (const file of ['app.info.json', 'app.info.deps.json']) {
      const metadata = JSON.parse(fs.readFileSync(path.join(tmp, 'dist', file), 'utf8'));
      assert.equal(metadata.app_name, name);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
