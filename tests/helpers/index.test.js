import {
    toRegExp,
} from '../../src/helpers';

const { test, module } = QUnit;
const name = 'scriptlets-redirects helpers';

module(name);

test('Test toRegExp for valid inputs', (assert) => {
    const defaultRegexp = new RegExp('.?');
    let inputStr;
    let expRegex;

    inputStr = '/abc/';
    expRegex = /abc/;
    assert.deepEqual(toRegExp(inputStr), expRegex);

    inputStr = '/[a-z]{1,9}/';
    expRegex = /[a-z]{1,9}/;
    assert.deepEqual(toRegExp(inputStr), expRegex);

    inputStr = '';
    assert.deepEqual(toRegExp(inputStr), defaultRegexp);

    // return 'default regexp' for matching every case
    // if passed string can not be converted to regexp
    inputStr = '/\\/';
    assert.deepEqual(toRegExp(inputStr), defaultRegexp);

    inputStr = '/[/';
    assert.deepEqual(toRegExp(inputStr), defaultRegexp);

    inputStr = '/*/';
    assert.deepEqual(toRegExp(inputStr), defaultRegexp);

    inputStr = '/[0-9]++/';
    assert.deepEqual(toRegExp(inputStr), defaultRegexp);
});
