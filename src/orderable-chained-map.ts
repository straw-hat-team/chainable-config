import { ChainedMap, OrderPositions } from './chained-map';

export class OrderableChainedMap<P> extends ChainedMap<ChainedMap<P>> {
  private key: string;

  constructor(parent: ChainedMap<P>, key: string) {
    super(parent);
    this.key = key;
  }

  before(key: string) {
    return this.parent.move(this.key, OrderPositions.Before, key);
  }

  after(key: string) {
    return this.parent.move(this.key, OrderPositions.After, key);
  }
}
