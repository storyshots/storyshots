import { Request } from 'express';


import { RunnableStoryMeta } from '@core';

export function parseStory(request: Request) {
  return request.body as RunnableStoryMeta;
}
