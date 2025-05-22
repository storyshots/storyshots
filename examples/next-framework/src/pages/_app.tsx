import { stories } from '../../storyshots/stories';
import NextApp, { AppContext, AppProps } from 'next/app';
import React, { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    mutateENV(process.env.story as string, false);
  }, []);

  return <Component {...pageProps} />;
}

App.getInitialProps = async (context: AppContext) => {
  mutateENV(process.env.story as string, typeof window === 'undefined');

  return NextApp.getInitialProps(context);
};

function mutateENV(story: string, server: boolean) {
  if (server) {
    console.log('SERVER UPDATE');
  } else {
    console.log('CLIENT UPDATE');
  }

  console.log(stories.find((it) => it.name === story));
}
