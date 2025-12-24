const { execSync } = require('node:child_process');
const path = require('node:path');

main();

function main() {
  try {
    const script = path.resolve(
      path.dirname(require.resolve('@playwright/test')),
      'cli.js',
    );

    /**
     * Script may fail for example in case computer is running behind corporate proxy
     * so developers must perform installation manually by themselves
     */
    execSync(`node ${script} install chromium`, {
      stdio: 'inherit',
      cwd: process.env.INIT_CWD,
    });
  } catch (error) {
    console.error(`Failed to install chromium automatically.\n\n${error}`);
  }
}
