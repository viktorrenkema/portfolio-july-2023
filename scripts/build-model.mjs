import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../apps/plywood-nightstand/', import.meta.url));
const output = fileURLToPath(new URL('../public/3d-modeling/self/', import.meta.url));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

for (const args of [
  ['ci', '--include=dev', '--no-audit', '--no-fund'],
  ['run', 'build', '--', '--base=/3d-modeling/self/', `--outDir=${output}`, '--emptyOutDir'],
]) {
  const result = spawnSync(npm, args, { cwd: project, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
