export class Queue<T> {
  private queue: T[];

  constructor(fromArray?: T[]) {
    this.queue = fromArray || [];
  }

  enqueue(item: T) {
    this.queue.push(item);
  }

  dequeue(): T {
    return this.queue.shift();
  }

  isEmpty(): boolean {
    return !this.queue.length;
  }
}
