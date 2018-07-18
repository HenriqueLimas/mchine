import {predicate, compare} from './types';

export class List<T> {
  list: T[];

  constructor(origin?: T[]) {
    this.list = [].concat(origin || []);
  }

  head(): T {
    return this.list[0];
  }

  tail(): List<T> {
    return new List(this.list.slice(1));
  }

  size(): number {
    return this.list.length;
  }

  isEmpty(): boolean {
    return !this.size();
  }

  forEach(callback: ((item: T) => void)): List<T> {
    this.list.forEach(callback);
    return this;
  }

  append(elem: T): List<T> {
    this.list.push(elem);
    return this;
  }

  concat(external: List<T>): List<T> {
    return new List<T>(this.list.concat(external.list));
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
