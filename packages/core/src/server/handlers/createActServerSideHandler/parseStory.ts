import { Request } from 'express';
import { StoryRunMeta } from '../../reusables/types';

export function parseStory(request: Request) {
  return request.body as StoryRunMeta;
}
