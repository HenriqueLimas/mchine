import { predicate } from './types';
import { List } from "./List";

export class OrderedSet<T> {
  private set: Set<T>;

  constructor(fromArray?: T[]) {
    this.set = new Set<T>(fromArray);
  }

  add(item: T) {
    this.set.add(item);
  }

  delete(item: T) {
    this.set.delete(item);
  }

  union(orderedSet: OrderedSet<T>) {
    const list = orderedSet.toList().list;

    this.set = new Set(Array.from(this.set).concat(list));
  }

  isMember(item: T): boolean {
    return this.set.has(item);
  }

  some(predicate: predicate<T>): boolean {
    return Array.from(this.set).some(predicate);
  }

  every(predicate: predicate<T>): boolean {
    return Array.from(this.set).every(predicate);
  }

  hasIntersection(orderedSet: OrderedSet<T>): boolean {
    return this.some((item: T) => orderedSet.isMember(item));
  }

  isEmpty() {
    return !this.set.size;
  }

  clear() {
    this.set.clear();
  }

  toList(): List<T> {
    return new List(Array.from(this.set));
  }
}