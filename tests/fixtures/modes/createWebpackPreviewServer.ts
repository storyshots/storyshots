import { TF } from '../tf';
import { DefinePlugin, webpack } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Server from 'webpack-dev-server';
import { IPreviewServer } from '@storyshots/core/manager';

export async function createWebpackPreviewServer(
  tf: TF,
): Promise<IPreviewServer> {
  const compiler = webpack({
    mode: 'development',
    entry: tf.path,
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|js)x?$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new DefinePlugin({
        'process.env': { NODE_ENV: '"development"' },
      }),
    ],
  });

  const server = new Server({ port: 3000 }, compiler);

  await server.start();

  return {
    at: 'http://localhost:3000',
    cleanup: async () => {
      console.log('Webpack cleanup start');
      await server.stop();
      console.log('Webpack cleanup stop');
    },
  };
}
