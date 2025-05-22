import { useRouter } from 'next/router';
import React from 'react';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>Home page</h1>
      <button onClick={() => void router.push('/about')}>To About</button>
    </div>
  );
}
