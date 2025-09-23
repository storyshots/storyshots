import { RequestHandler } from 'express';
import send from 'send';
import path from 'path';

// TODO: Find a way to remove createWatchManager from production builds
// import fs from 'fs';
// import { context } from 'esbuild';
//
// function createWatchManager(): RequestHandler {
//   async function watch() {
//     const lib = path.dirname(require.resolve('@storyshots/core/package.json'));
//
//     const ctx = await context({
//       entryPoints: [path.join(lib, 'src', 'client', 'index.tsx')],
//       outdir: path.join(lib, 'lib', 'client'),
//       bundle: true,
//       platform: 'browser',
//       sourcemap: 'inline',
//       minify: false,
//     });
//
//     fs.watch(path.join(lib, 'src', 'client'), { recursive: true }, () =>
//       ctx.rebuild(),
//     );
//   }
//
//   void watch();
//
//   return createPrebuiltManager();
// }

function createPrebuiltManager(): RequestHandler {
  const ui = path.join(
    path.dirname(require.resolve('@storyshots/core/package.json')),
    'lib',
    'client',
  );

  return (request, response) => {
    const file = request.path.lastIndexOf('.') > request.path.lastIndexOf('/');

    return send(request, file ? request.path : '/index.html', {
      root: ui,
    }).pipe(response);
  };
}

export const createUIHandler = createPrebuiltManager;
