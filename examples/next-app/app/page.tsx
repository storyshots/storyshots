import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <h1>
      Hello Next.js! <Link href="/blog">To blogs</Link>
    </h1>
  );
}
