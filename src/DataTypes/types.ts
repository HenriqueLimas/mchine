export type predicate<T> = ((item: T) => boolean);
export type compare<T> = ((a: T, b: T) => number);