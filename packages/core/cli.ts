#!/usr/bin/env node

import {
  runCI,
  runUI,
  UserDefinedManagerConfig,
} from '@storyshots/core/manager';
import path from 'path';
import { register } from 'ts-node';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

void main();

async function main() {
  register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });

  const argv = await yargs(hideBin(process.argv))
    .usage('storyshots [path to manager config]')
    .option('ui', {
      type: 'boolean',
      description: 'Enable UI mode',
      default: false,
    })
    .demandCommand(
      1,
      'Error: Please provide a storyshots config file path as the last argument (e.g., storyshots --ui path/to/config.ts)',
    ).argv;

  const config: UserDefinedManagerConfig = await require(
    path.join(process.cwd(), argv._[0] as string),
  ).default;

  return argv.ui ? runUI(config) : runCI(config);
}
