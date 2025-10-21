import { createURL } from '@/externals/createURL';

export type Post = {
  id: number;
  title: string;
};

interface IBlogRepository {
  getPost(id: Post['id']): Promise<Post | null>;

  getPosts(): Promise<Post[]>;

  createPost(post: Pick<Post, 'title'>): Promise<void>;
}

type Externals = { blog: IBlogRepository };

export const externals: Externals = {
  blog: {
    getPost: (id) =>
      fetch(createURL(`/api/posts/${id}`)).then((response) => response.json()),
    createPost: async (post) => {
      await fetch(createURL('/api/posts'), {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    getPosts: () =>
      fetch(createURL('/api/posts')).then((response) => response.json()),
  },
};
