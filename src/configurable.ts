import { toString } from './helper';

export class Configurable {
  static isConfigurable(value: unknown) {
    return value instanceof Configurable;
  }

  static getConfig(value: unknown) {
    return Configurable.isConfigurable(value) ? ((value as unknown) as Configurable).toConfig() : value;
  }

  toConfig() {
    throw new Error('toConfig method not implemented');
  }

  toString(options?: { verbose: boolean }) {
    const config = this.toConfig();
    return toString(config, options);
  }
}
