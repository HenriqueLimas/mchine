import {predicate, compare} from './types';

export class List<T> {
  list: T[];

  constructor(origin?: T[]) {
    this.list = [].concat(origin || []);
  }

  head(): T {
    return this.list[0];
  }

  tail(): T {
    return this.list[this.list.length - 1];
  }

  append(elem: T): List<T> {
    this.list.push(elem);
    return this;
  }

  filter(predicate: predicate<T>): List<T> {
    return new List(this.list.filter(predicate));
  }

  some(predicate: predicate<T>): boolean {
    return this.list.some(predicate);
  }

  every(predicate: predicate<T>): boolean {
    return this.list.every(predicate);
  }

  sort(compareFunction?: compare<T>): List<T> {
    return new List([].concat(this.list).sort(compareFunction));
  }
}
