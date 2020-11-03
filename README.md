# @straw-hat/chainable-config

Use a chaining API to generate and simplify the modification of configurations.

## Usage

```typescript
import {
  ChainedMap,
  OrderableChainedMap,
  ChainedSet,
} from '@straw-hat/chainable-config';

const chainedMap = new ChainedMap();

// ..or

export class DevServer<P> extends ChainedMap<P> {
  bonjour(value: boolean) {
    return this.set('bonjour', value);
  }
}

class WebpackChain extends ChainedMap {
  // your own methods here..
  constructor() {
    super(undefined);
    this.set('devServer', new DevServer(this));
  }

  get devServer(): DevServer<WebpackChain> {
    return this.get('devServer');
  }

  bail(value: boolean) {
    return this.set('bail', value);
  }
}

const myConfig = new WebpackChain();

myConfig.bail(true).devServer.bonjour(true);

// Return the config
myConfig.toConfig();
// {
//   bail: true,
//   devServer: {
//     bonjour: true
//   }
// }
```
