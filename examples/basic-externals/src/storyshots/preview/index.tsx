import './run';

if (module.hot) {
  module.hot.accept();
}

declare global {
  interface NodeModule {
    hot?: {
      accept(): void;
    };
  }
}
