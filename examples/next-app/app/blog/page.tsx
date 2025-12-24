'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post, externals } from '@/externals';

export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    void externals.blog.getPosts().then(setPosts);
  }, []);

  return (
    <ul>
      <Link href="/">Back</Link>{' '}
      <button
        onClick={() =>
          externals.blog
            .createPost({ title: `My ${posts.length + 1} post` })
            .then(() => externals.blog.getPosts().then(setPosts))
        }
      >
        Create
      </button>
      {posts.map((post, index) => (
        <li key={index}>
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
