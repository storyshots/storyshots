import { GetStaticPropsResult, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

export default function Contacts(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const router = useRouter();

  return (
    <div>
      <h1>Contacts:</h1>
      <ul>
        {props.contacts.map((it, index) => (
          <li key={index}>{it}</li>
        ))}
      </ul>
      <button onClick={() => void router.push('/')}>To Home</button>
    </div>
  );
}

export async function getStaticProps() {
  const contacts = await new Promise<string[]>((resolve) =>
    setTimeout(() => resolve(['Maria', 'John', 'Susan']), 1_000),
  );

  return {
    props: {
      contacts,
    },
  } satisfies GetStaticPropsResult<unknown>;
}
