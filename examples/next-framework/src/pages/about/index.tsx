import {
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from 'next/dist/types';
import { useRouter } from 'next/router';
import React from 'react';

export default function About(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const router = useRouter();

  return (
    <div>
      <h1>{props.name}</h1>
      <button onClick={() => void router.push('/contacts')}>To Contacts</button>
    </div>
  );
}

export async function getServerSideProps() {
  const about = await new Promise<string>((resolve) =>
    setTimeout(() => resolve('This page is about many things...'), 1_000),
  );

  return {
    props: {
      name: about,
    },
  } satisfies GetServerSidePropsResult<unknown>;
}
