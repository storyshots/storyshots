import { Request } from 'express';


import { RunnableStoryMeta } from '../../../core/story/runnable-story-meta';

export function parseStory(request: Request) {
  return request.body as RunnableStoryMeta;
}
