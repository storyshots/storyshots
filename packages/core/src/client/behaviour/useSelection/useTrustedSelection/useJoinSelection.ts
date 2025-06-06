import { Device, DeviceName, find, StoryTree } from '@core';
import { assertNotEmpty } from '@lib';
import { useMemo } from 'react';
import { Selection } from '../types';
import { ManagerConfig } from '../useManagerConfig';
import { UserSelection } from '../useUserSelection';

/**
 * Gathers final **source of truth** object.
 *
 * Validates untrusted user inputs by comparing it with actual config received from manager and preview.
 */
export function useJoinSelection(
  untrusted: UserSelection,
  manager: ManagerConfig,
  stories: StoryTree | undefined,
): Selection {
  return useMemo(() => {
    if (stories === undefined) {
      return { type: 'initializing' };
    }

    if (untrusted.type === 'no-selection') {
      return {
        stories,
        type: 'no-selection',
      };
    }

    const story = find(untrusted.id, stories);

    if (story === undefined) {
      return {
        stories,
        type: 'no-selection',
      };
    }

    if (untrusted.type === 'records') {
      return {
        stories,
        story,
        type: 'records',
        device: ensureSelectedDevice(manager.devices, untrusted.device),
      };
    }

    if (untrusted.type === 'screenshot') {
      return {
        stories,
        story,
        type: 'screenshot',
        name: untrusted.name,
        device: ensureSelectedDevice(manager.devices, untrusted.device),
      };
    }

    return {
      stories,
      story,
      type: 'story',
      progress: {
        type: 'not-played',
      },
    };
  }, [untrusted, manager.devices, stories]);
}

function ensureSelectedDevice(devices: Device[], name: DeviceName): Device {
  const found = devices.find((it) => it.name === name);

  assertNotEmpty(found, 'Device is not defined. Press F5 to update');

  return found;
}
