export class TaskManager {
  delay: number;
  private prevRunTime: number = Date.now();

  currentCalls = 0;

  constructor(config: Config) {
    this.delay = config.delay || 0;
  }

  private promiseMap = new Map();

  private tasks: Array<() => Promise<any>> = [];

  exec(task: () => Promise<unknown>) {
    this.tasks.push(task);
    return new Promise((resolve, reject) => {
      this.promiseMap.set(task, { resolve, reject });
      this.runTask();
    });
  }

  private async runTask() {
    if (this.tasks.length === 0) {
      return;
    }
    const task = this.tasks.shift();
    if (!task) {
      return;
    }

    const promise = this.promiseMap.get(task);
    const delay = Math.max(this.delay - (Date.now() - this.prevRunTime), 0);

    try {
      this.currentCalls++;
      await wait(delay);
      const result = await task();
      promise.resolve(result);
    } catch (error) {
      promise.reject(error);
    } finally {
      this.currentCalls--;
      this.promiseMap.delete(task);
      this.prevRunTime = Date.now();
      this.runTask();
    }
  }
}

function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

interface Config {
  delay: number;
}
