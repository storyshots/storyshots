import { useEffect, useMemo, useState } from 'react';
import { assertNotEmpty } from '../../reusables/utils';
import { Devices } from '../create-configure-client/types';
import { createActor } from '../createActor';
import { EvaluatedStoryshotsNode } from '../reusables/channel';
import { StoryshotsNode } from '../types';
import { Props } from './types';

export function useManagerChannel(props: Props) {
  const manager = useMemo(() => {
    const top = window.top;

    assertNotEmpty(top, 'Preview should be wrapped in manager');

    return top.setStoriesAndGetState(
      toEvaluatedStories(props.stories, props.devices),
    );
  }, [props.stories]);

  const [current, setNext] = useState(manager.current);

  // TODO: Does it need cleanup?
  useEffect(() => {
    setNext(manager.current);

    manager.next(setNext);
  }, [manager]);

  return current;
}

function toEvaluatedStories(
  stories: StoryshotsNode[],
  modes: Devices,
): EvaluatedStoryshotsNode[] {
  return stories.map((node) => {
    if (node.type === 'group') {
      return { ...node, children: toEvaluatedStories(node.children, modes) };
    }

    return {
      id: node.id,
      title: node.title,
      type: node.type,
      modes,
      actions: node.act(createActor()).toMeta(),
    };
  });
}
