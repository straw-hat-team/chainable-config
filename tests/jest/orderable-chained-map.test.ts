import { OrderableChainedMap } from '../../src/orderable-chained-map';

describe('Given a OrderableChainedMap object', () => {
  describe('When calling .move()', () => {
    it('Then inserts the value before the other value', () => {
      const chainMap = new OrderableChainedMap(undefined, { asArray: true });
      chainMap.set('zero', 0);
      chainMap.set('one', 1);
      chainMap.set('two', 2);
      chainMap.move('two', ({ before }) => before('one'));
      const values = chainMap.toConfig();
      expect(values).toEqual([0, 2, 1]);
    });
    it('Then inserts the value after the other value', () => {
      const chainMap = new OrderableChainedMap(undefined, { asArray: true });
      chainMap.set('zero', 0);
      chainMap.set('one', 1);
      chainMap.set('two', 2);
      chainMap.set('three', 3);
      chainMap.set('four', 4);
      chainMap.move('two', ({ after }) => after('three'));

      const values = chainMap.toConfig();
      expect(values).toEqual([0, 1, 3, 2, 4]);
    });

    it('Then does not move the value if the keys do not exists', () => {
      const chainMap = new OrderableChainedMap(undefined, { asArray: true });
      chainMap.set('zero', 0);
      chainMap.set('one', 1);
      chainMap.set('two', 2);
      chainMap.set('three', 3);
      chainMap.set('four', 4);

      chainMap.move('five', ({ after }) => after('one'));
      chainMap.move('four', ({ after }) => after('six'));

      const values = chainMap.toConfig();
      expect(values).toEqual([0, 1, 2, 3, 4]);
    });
  });
  describe('Movable values', () => {
    describe('When calling .before()', () => {
      it('Then inserts the value before the other value', () => {
        const chainMap = new OrderableChainedMap<undefined, number>(undefined, { asArray: true });
        chainMap.set('zero', 0);
        chainMap.set('one', 1);
        chainMap.set('two', 2);
        chainMap.set('three', 3);

        const expected = chainMap.get('two').before('one').end().get('three').before('two').end().toConfig();

        expect(expected).toEqual([0, 3, 2, 1]);
      });
    });
    describe('When calling .after()', () => {
      it('Then inserts the value after the other value', () => {
        const chainMap = new OrderableChainedMap<undefined, number>(undefined, { asArray: true });
        chainMap.set('zero', 0);
        chainMap.set('one', 1);
        chainMap.set('two', 2);
        chainMap.set('three', 3);

        const expected = chainMap.get('zero').after('two').end().get('one').after('three').end().toConfig();

        expect(expected).toEqual([2, 0, 3, 1]);
      });
    });
  });
});
