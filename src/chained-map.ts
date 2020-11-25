import deepMerge from 'deepmerge';
import isMergeable from 'is-mergeable-object';
import { Chainable } from './chainable';
import { Configurable, ToStringOptions } from './configurable';

export type ChainedMapOptions = {
  name?: string;
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

  toString(options?: ToStringOptions) {
    const openBracket = this.options.asArray ? '[' : '{';
    const closeBracket = this.options.asArray ? ']' : '}';
    const output: string[] = [];

    Array.from(this.store).forEach(([key, value], index, list) => {
      const isLast = index === list.length - 1;
      const name = this.options.name ?? '';
      output.push(`/* ${name}.get('${key}') */ `);

      if (this.options.asArray) {
        output.push(`${Configurable.toString(value, options)}`);
      } else {
        output.push(`${Configurable.toString(key, options)}: ${Configurable.toString(value, options)}`);
      }

      // do not add trailing comma
      if (!isLast) {
        output.push(`, `);
      }
    });

    return `${openBracket}${output.join('').trim()}${closeBracket}`;
  }

  #asArrayConfig = (config: Record<any, any>, [_key, value]: [string, S]) => {
    config.push(Configurable.toConfig(value));
    return config;
  };

  #asMapConfig = (config: Record<any, any>, [key, value]: [string, S]) => {
    config[key] = Configurable.toConfig(value);
    return config;
  };
}
