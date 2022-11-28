/**
 * @typedef WorkerEntry
 * @property {string} id
 * @property {Worker} worker
 * @property {boolean} busy
 */

export class ThreadPool {
  /** @type {WorkerEntry[]} */
  #workers = [];
  #busyCount = 0;
  #size = 0;

  /**
   * @param {string} filename
   * @param {number} size
   */
  constructor(filename, size = navigator.hardwareConcurrency) {
    this.#size = size;
    this.startPool(filename);
  }

  /**
   * @param {string} filename
   */
  startPool(filename) {
    for (let index = 0; index < this.#size; index++) {
      const worker = new Worker(filename);

      this.#workers.push({
        worker,
        busy: false,
        id: Math.random().toString(16).slice(3),
      });
    }
  }

  /**
   * @param {(worker: Worker) => void} callback
   */
  enqueue(callback) {
    if (this.isBusy()) {
      throw new Error("Pool is starving!");
    }

    for (const workerEntry of this.#workers) {
      if (workerEntry.busy) {
        continue;
      }

      console.log("Enqueueing to", workerEntry.id);

      workerEntry.busy = true;
      this.#busyCount++;

      callback(workerEntry.worker);

      break;
    }
  }

  /**
   * @param {(data: any) => void}
   */
  onMessage(callback) {
    for (const workerEntry of this.#workers) {
      workerEntry.worker.addEventListener("message", (event) => {
        workerEntry.busy = false;
        this.#busyCount--;

        callback(event.data);
      });
    }
  }

  isBusy() {
    return this.#busyCount === this.#size;
  }
}
