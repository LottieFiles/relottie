/**
 * Copyright 2023 Design Barn Inc.
 */

export class Stack<T, K extends { i: number } = { i: number }> {
  private readonly _keys: K[] = [];

  private readonly _storage = new WeakMap<K, T>();

  public constructor(private readonly _capacity: number = Infinity) {}

  public get(index: number): T | undefined {
    const key = this._keys[index];

    return key ? this._storage.get(key) : undefined;
  }

  public peek(): T | undefined {
    const size = this.size();
    const key = this._keys[size - 1];

    return key ? this._storage.get(key) : undefined;
  }

  public pop(): T | undefined {
    const key = this._keys.pop();

    if (key === undefined) {
      return undefined;
    } else {
      const item = this._storage.get(key);

      this._storage.delete(key);

      return item;
    }
  }

  public push(item: T): void {
    if (this.size() === this._capacity) {
      throw Error('Stack has reached max capacity, you cannot add more items');
    }

    const key = { i: this._keys.length } as K;

    this._storage.set(key, item);
    this._keys.push(key);
  }

  public size(): number {
    return this._keys.length;
  }
}
