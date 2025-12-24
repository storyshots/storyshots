// TODO: Reuse generic utilities for async operation optimizations (async queues, pools)
export function createLocker() {
  let locked = false;
  const queue: Acquire[] = [];

  return {
    lock: () =>
      new Promise<void>((acquired) => {
        queue.push(acquired);

        checkForJobs();
      }),
    unlock: () => {
      locked = false;

      checkForJobs();
    },
  };

  function checkForJobs() {
    if (locked) {
      return;
    }

    const candidate = queue.shift();

    if (candidate === undefined) {
      return;
    }

    locked = true;

    candidate();
  }
}

type Acquire = () => void;
