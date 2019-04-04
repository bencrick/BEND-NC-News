process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const connection = require('../db/connection');

const {
  createRefObj,
  makeTimestamp,
  objArrMap,
  objRenameKey,
  objHasKeys,
  selectTableColValues,
  noRowsThrow404
} = require('../utils');

function doesNotReturnOrMutate(func, inObj, ...args) {
  const beforeObjStr = JSON.stringify(inObj);
  const outObj = func(inObj, ...args);
  const afterObjStr = JSON.stringify(inObj);
  expect(outObj).to.not.equal(inObj);
  expect(beforeObjStr).to.equal(afterObjStr);
}

describe('objRenameKey', () => {
  it('does not return or mutate the original input object', () => {
    const inObj = {
      keyA: 'valA',
      keyB: 'valB'
    };
    doesNotReturnOrMutate(objRenameKey, inObj);
  });
  it('returns a new object with the specified key renamed but corresponding to the original value', () => {
    const inObj = {
      keyA: 'valA',
      keyB: 'valB'
    };
    const outObj = objRenameKey(inObj, 'keyB', 'keyZ');
    expect(outObj).to.eql({
      keyA: 'valA',
      keyZ: 'valB'
    });
  });
});

describe('createRef', () => {
  it('does not return or mutate the original input object', () => {
    const inObjArr = [
      {
        propA: 'valA1',
        propB: 'valB1'
      },
      {
        propA: 'valA2',
        propB: 'valB2'
      }
    ];
    doesNotReturnOrMutate(createRefObj, inObjArr);
  });
  it('returns an object with a key-value pair composed from the keyProp and valProp of each object in the input array', () => {
    const inObjArr = [
      {
        propA: 'valA1',
        propB: 'valB1'
      },
      {
        propA: 'valA2',
        propB: 'valB2'
      }
    ];
    expect(createRefObj(inObjArr, 'propA', 'propB')).to.eql({
      valA1: 'valB1',
      valA2: 'valB2'
    });
  });
});

describe('makeTimestamp', () => {
  it('returns the current date/time formatted like yyyy-mm-dd hh:mm:ss', () => {
    expect(makeTimestamp(1289996514171)).to.equal('2010-11-17 12:21:54');
  });
});

describe('objArrMap', () => {
  it('does not return or mutate the original input array or the objects it contains', () => {
    const inObjArr = [
      {
        propA: 1,
        propB: 2
      },
      {
        propA: 3,
        propB: 4
      }
    ];
    function doubler(num) {
      return num * 2;
    }
    doesNotReturnOrMutate(objArrMap, inObjArr, 'propB', doubler);
  });
  it('performs the given function on the specified property of each object', () => {
    const inObjArr = [
      {
        propA: 1,
        propB: 2
      },
      {
        propA: 3,
        propB: 4
      }
    ];
    function doubler(num) {
      return num * 2;
    }
    expect(objArrMap(inObjArr, 'propB', doubler)).to.eql([
      {
        propA: 1,
        propB: 4
      },
      {
        propA: 3,
        propB: 8
      }
    ]);
  });
});

describe('objHasKeys', () => {
  it('does not return or mutate the original input object', () => {
    const inObj = {
      keyA: 'valA',
      keyB: 'valB'
    };
    const keys = ['keyA'];
    doesNotReturnOrMutate(objHasKeys, inObj, keys);
  });
  it('returns false if input object does not contain all input keys', () => {
    const inObj = {
      keyA: 'valA',
      keyB: 'valB'
    };
    const keys = ['keyB', 'keyC'];
    expect(objHasKeys(inObj, keys)).to.be.false;
  });
  it('returns true if input object contains all input keys', () => {
    const inObj = {
      keyA: 'valA',
      keyB: 'valB'
    };
    const keys = ['keyB'];
    expect(objHasKeys(inObj, keys)).to.be.true;
  });
});

describe('selectTableColValues', () => {
  beforeEach(() => connection.seed.run());
  // after(() => connection.destroy());
  it('returns all values from the specified table column satisfying the conditions of the input where-object', () => {
    selectTableColValues(connection, 'users', 'name', {
      username: 'icellusedkars'
    }).then(userRows => {
      expect(userRows[0].name).to.equal('sam');
    });
  });
});

describe('noRowsThrow404', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it('returns a status of 404 when a nonexistent parameter is supplied', () => {
    expect(() =>
      noRowsThrow404(connection, 'articles', { article_id: 999999999 })
    ).to.throw({ code: 404 });
  });
});
