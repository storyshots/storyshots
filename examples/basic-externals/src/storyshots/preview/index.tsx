import './run';

if (module.hot) {
  module.hot.accept('./run', () => {});
}

declare global {
  interface NodeModule {
    hot?: {
      accept: any;
    };
  }
}
