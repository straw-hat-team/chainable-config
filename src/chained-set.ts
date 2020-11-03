import { Chainable } from './chainable';
import { Configurable } from './configurable';

export class ChainedSet<P> extends Chainable<P> {
  private store = new Set<any>();

  add<T = unknown>(value: T) {
    this.store.add(value);
    return this;
  }

  prepend<T = unknown>(value: T) {
    this.store = new Set([value, ...this.store]);
    return this;
  }

  clear() {
    this.store.clear();
    return this;
  }

  delete<T = unknown>(value: T) {
    this.store.delete(value);
    return this;
  }

  values() {
    return this.store.values();
  }

  has<T = unknown>(value: T) {
    return this.store.has(value);
  }

  merge<T = unknown>(values: T[]) {
    this.store = new Set([...this.store, ...values]);
    return this;
  }

  toConfig() {
    return Array.from(this.values()).map((value: unknown) => {
      return Configurable.isConfigurable(value) ? (value as Configurable).toConfig() : value;
    });
  }
}
