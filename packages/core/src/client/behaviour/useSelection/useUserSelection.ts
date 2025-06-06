import { DeviceName, ScreenshotName, StoryID } from '@core';
import { isNil } from '@lib';
import { useMemo } from 'react';
import { useSearchParams } from 'wouter';

/**
 * Untrusted, e.g. unvalidated user selection.
 *
 * Might be invalid due to the fact that this data is persisted as url query.
 */
export function useUserSelection() {
  const [params, setParams] = useSearchParams();

  return {
    selection: useSelection(),
    setStory: (id: StoryID) =>
      setSelection({
        type: 'story',
        id,
      }),
    setRecords: (id: StoryID, at: DeviceName) =>
      setSelection({ type: 'records', id, device: at }),
    setScreenshot: (id: StoryID, name: ScreenshotName, at: DeviceName) =>
      setSelection({ type: 'screenshot', id, name, device: at }),
  };

  function useSelection() {
    const selection = params.get('selection');

    return useMemo((): UserSelection => {
      if (isNil(selection)) {
        return { type: 'no-selection' };
      }

      return JSON.parse(selection) as UserSelection;
    }, [selection]);
  }

  function setSelection(selection: UserSelection) {
    setParams((prev) => {
      prev.set('selection', JSON.stringify(selection));

      return prev;
    });
  }
}

export type UserSelection =
  | {
      type: 'no-selection';
    }
  | { type: 'story'; id: StoryID }
  | {
      type: 'records';
      id: StoryID;
      device: DeviceName;
    }
  | {
      type: 'screenshot';
      id: StoryID;
      name: ScreenshotName;
      device: DeviceName;
    };
