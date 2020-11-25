import { ChainedMap, ChainedMapOptions } from './chained-map';

export class OrderableChainedMap<P, S = unknown> extends ChainedMap<ChainedMap<P>, S> {
  private key: string;

  constructor(parent: ChainedMap<P>, key: string, options?: ChainedMapOptions) {
    super(parent, options);
    this.key = key;
  }

  before(key: string) {
    return this.parent.move(this.key, ({ before }) => before(key));
  }

  after(key: string) {
    return this.parent.move(this.key, ({ after }) => after(key));
  }
}
