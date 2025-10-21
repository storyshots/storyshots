import { it } from '@/storyshots/factories';
import { finder } from '@storyshots/core';
import { body, Endpoint, params } from '@storyshots/msw-externals';
import { Post } from '@/externals';
import { arrange, endpoint, handle, record } from '@/storyshots/arrangers';
import { createSharedState } from '@storyshots/next';
import { createURL } from '@/externals/createURL';

export const stories = [
  it('renders main', {
    arrange: withEmptyPosts(),
  }),
  it('renders empty blogs', {
    arrange: arrange(withEmptyPosts(), record('blogGetPosts')),
    act: (actor) => actor.click(finder.getByText('To blogs')),
  }),
  it('allows to create a post', {
    arrange: arrange(
      withPostsEmulated(),
      record('blogGetPosts'),
      record('blogCreatePost'),
    ),
    act: (actor) =>
      actor
        .click(finder.getByText('To blogs'))
        .click(finder.getByRole('button', { name: 'Create' })),
  }),
  it('allows to view created post', {
    arrange: withPostsEmulated(),
    act: (actor) =>
      actor
        .click(finder.getByText('To blogs'))
        .click(finder.getByRole('button', { name: 'Create' }))
        .click(finder.getByRole('link', { name: 'My 1 post' })),
  }),
  it('handles empty post view', {
    arrange: withEmptyPosts(),
    at: '/blog/0',
  }),
];

function withEmptyPosts() {
  return arrange(
    withEndpointsDefined(),
    handle('blogCreatePost', async () => {}),
    handle('blogGetPosts', async () => []),
    handle('blogGetPost', async () => null),
  );
}

function withPostsEmulated() {
  const posts = createSharedState<Post[]>('posts', []);

  return arrange(
    withEndpointsDefined(),
    handle('blogCreatePost', async (request) => {
      const form: Post = await body(request);

      return posts.update((all) => [...all, { ...form, id: all.length }]);
    }),
    handle('blogGetPosts', posts.get),
    handle('blogGetPost', async (request) => {
      const { id } = params(request);

      return (await posts.get()).find((it) => it.id === parseInt(id)) ?? null;
    }),
  );
}

function withEndpointsDefined() {
  return arrange(
    endpoint('blogGetPosts', { method: 'GET', url: createURL('/api/posts') }),
    endpoint('blogGetPost', {
      method: 'GET',
      url: createURL('/api/posts/:id'),
    }),
    endpoint('blogCreatePost', {
      method: 'POST',
      url: createURL('/api/posts'),
    }),
  );
}

declare module '@storyshots/msw-externals' {
  interface Endpoints {
    blogGetPosts: Endpoint<Post[]>;
    blogCreatePost: Endpoint<void>;
    blogGetPost: Endpoint<Post | null>;
  }
}
