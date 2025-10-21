import React from 'react';
import { Root } from '@/storyshots/Root';
import { ModeInjector } from '@storyshots/next/client';

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        <ModeInjector />
      </head>
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
