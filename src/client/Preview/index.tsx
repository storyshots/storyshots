import React from 'react';
import { FinalClientConfig } from '../create-configure-client/types';
import { StoryshotsNode } from '../types';
import ReactDOM from 'react-dom/client';
import {
  FromManagerToPreviewMessage,
  FromPreviewToManagerMessage,
  SerializableStoryshotsNode,
} from '../reusables/channel';
import { createActor } from '../createActor';
import { createFinder } from '../createFinder';
import { Preview } from './Preview';

export async function createPreviewApp(config: FinalClientConfig) {
  const { port, message } = await waitForManagerConnection();

  sendStoriesToManager(port, config.stories);

  const div = document.createElement('div');

  div.setAttribute('id', 'root');

  document.body.appendChild(div);

  ReactDOM.createRoot(div).render(<Preview {...config} id={message.story} />);
}

type ManagerResponse = {
  port: MessagePort;
  message: FromManagerToPreviewMessage;
};

function waitForManagerConnection() {
  return new Promise<ManagerResponse>((resolve) => {
    const onMessage = (message: MessageEvent<FromManagerToPreviewMessage>) => {
      if (message.data.type === 'select-story') {
        window.removeEventListener('message', onMessage);

        resolve({ port: message.ports[0], message: message.data });
      }
    };

    window.addEventListener('message', onMessage);
  });
}

function sendStoriesToManager(port: MessagePort, stories: StoryshotsNode[]) {
  const message: FromPreviewToManagerMessage = {
    type: 'stories-changed',
    stories: toSerializableStories(stories),
  };

  port.postMessage(message);
}

function toSerializableStories(
  stories: StoryshotsNode[],
): SerializableStoryshotsNode[] {
  return stories.map((node) => {
    if (node.type === 'group') {
      return { ...node, children: toSerializableStories(node.children) };
    }

    return {
      id: node.id,
      title: node.title,
      type: node.type,
      actions: node.act(createActor(), createFinder()).toMeta(),
    };
  });
}
