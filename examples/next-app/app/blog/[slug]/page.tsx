'use server';

import React from 'react';
import Link from 'next/link';
import { externals } from '@/externals';

export default async function Blog(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const post = await externals.blog.getPost(parseInt(slug));

  return (
    <h1>
      {post?.title ?? 'Post was not found'} <Link href="/blog">Back</Link>
    </h1>
  );
}
