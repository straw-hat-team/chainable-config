import { ChainedMap } from './chained-map';

export class OrderableChainedMap<P> extends ChainedMap<ChainedMap<P>> {
  private key: string;

  constructor(parent: ChainedMap<P>, key: string) {
    super(parent);
    this.key = key;
  }

  before(key: string) {
    return this.parent.move(this.key, ({ before }) => before(key));
  }

  after(key: string) {
    return this.parent.move(this.key, ({ after }) => after(key));
  }
}
