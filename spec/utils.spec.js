const { expect } = require('chai');
const objRenameKey = require('../utils/objRenameKey');
const createRefObj = require('../utils/createRefObj');
const makeTimestamp = require('../utils/makeTimestamp');
const objArrMap = require('../utils/objArrMap');

function doesNotReturnOrMutate(func, inObj) {
  const beforeObjStr = JSON.stringify(inObj);
  const outObj = func(inObj, 'keyB', 'keyZ');
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
    console.log(makeTimestamp(1289996514171));
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
    const inObjArrBeforeStr = JSON.stringify(inObjArr);
    expect(objArrMap(inObjArr, 'propB', doubler)).to.not.equal(inObjArr);
    const inObjArrAfterStr = JSON.stringify(inObjArr);
    expect(inObjArrBeforeStr).to.equal(inObjArrAfterStr);
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
