import deepMerge from 'deepmerge';
import isMergeable from 'is-mergeable-object';
import { Chainable } from './chainable';
import { Configurable } from './configurable';

export type ChainedMapOptions = {
  asArray?: boolean;
};

export class ChainedMap<P, S = unknown> extends Chainable<P> {
  protected store = new Map<string, S>();
  private options: ChainedMapOptions;

  constructor(parent: P, options: ChainedMapOptions = {}) {
    super(parent);
    this.parent = parent;
    this.options = {
      asArray: false,
      ...options,
    };
  }

  private computeAndSet<T extends S>(key: string, fn: () => T) {
    const value = fn();
    this.set(key, value);
  }

  static isChainedMap(value: unknown) {
    return value instanceof ChainedMap;
  }

  clear() {
    this.store.clear();
    return this;
  }

  delete(key: string) {
    this.store.delete(key);
    return this;
  }

  get<T extends S>(key: string): T {
    return (this.store.get(key) as unknown) as T;
  }

  set<T extends S>(key: string, value: T) {
    this.store.set(key, value);
    return this;
  }

  has(key: string) {
    return this.store.has(key);
  }

  entries() {
    return this.store.entries();
  }

  keys() {
    return this.store.keys();
  }

  values() {
    return this.store.values();
  }

  getOrCompute<T extends S>(key: string, fn: () => T): T {
    if (!this.has(key)) {
      this.computeAndSet(key, fn);
    }

    return this.get<T>(key)!;
  }

  merge(values: Record<string, any>, omit: string[] = []) {
    Object.keys(values).forEach((key) => {
      if (omit.includes(key)) {
        return;
      }

      const currentValue = this.get<any>(key);
      const nextValue = values[key];

      if (ChainedMap.isChainedMap(currentValue)) {
        // @ts-ignore TODO: figure out the casting from S to ChainedMap
        currentValue!.merge(nextValue);
        return;
      }

      if (isMergeable(currentValue) && isMergeable(nextValue)) {
        const mergedValue = deepMerge<any>(currentValue!, nextValue);
        this.set(key, mergedValue);
        return;
      }

      this.set(key, nextValue);
    });

    return this;
  }

  toConfig() {
    if (this.options.asArray) {
      return Array.from(this.store).reduce(this.#asArrayConfig, []);
    }

    return Array.from(this.store).reduce(this.#asMapConfig, {});
  }

  #asArrayConfig = (config: Record<any, any>, [_key, value]: [string, S]) => {
    config.push(Configurable.getConfig(value));
    return config;
  };

  #asMapConfig = (config: Record<any, any>, [key, value]: [string, S]) => {
    config[key] = Configurable.getConfig(value);
    return config;
  };
}
