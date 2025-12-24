import * as path from 'node:path';

export function getScriptPath(name: string): string {
  return path.join(
    path.dirname(require.resolve('@storyshots/next')),
    'scripts',
    name,
  );
}
