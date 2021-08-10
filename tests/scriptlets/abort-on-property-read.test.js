/* eslint-disable no-underscore-dangle */
import { runScriptlet, clearGlobalProps } from '../helpers';

const { test, module } = QUnit;
const name = 'abort-on-property-read';
const PROPERTY = 'aaa';
const CHAIN_PROPERTY = 'aaa.bbb';

const changingProps = [PROPERTY, 'hit', '__debug'];

const beforeEach = () => {
    window.__debug = () => {
        window.hit = 'FIRED';
    };
};

const afterEach = () => {
    clearGlobalProps(...changingProps);
};

module(name, { beforeEach, afterEach });

test('Checking if alias name works', (assert) => {
    const adgParams = {
        name,
        engine: 'test',
        verbose: true,
    };
    const uboParams = {
        name: 'ubo-aopr',
        engine: 'test',
        verbose: true,
    };
    const abpParams = {
        name: 'abp-abort-on-property-read',
        engine: 'test',
        verbose: true,
    };

    const codeByAdgParams = window.scriptlets.invoke(adgParams);
    const codeByUboParams = window.scriptlets.invoke(uboParams);
    const codeByAbpParams = window.scriptlets.invoke(abpParams);

    assert.strictEqual(codeByAdgParams, codeByUboParams, 'ubo name - ok');
    assert.strictEqual(codeByAdgParams, codeByAbpParams, 'abp name - ok');
});

test('simple', (assert) => {
    window[PROPERTY] = 'value';
    const scriptletArgs = [PROPERTY];
    runScriptlet(name, scriptletArgs);

    assert.throws(
        () => window[PROPERTY],
        /ReferenceError/,
        `should throw Reference error when try to access property ${PROPERTY}`,
    );
    assert.strictEqual(window.hit, 'FIRED', 'hit fired');
});

test('dot notation', (assert) => {
    window.aaa = {
        bbb: 'value',
    };
    const scriptletArgs = [CHAIN_PROPERTY];
    runScriptlet(name, scriptletArgs);

    assert.throws(
        () => window.aaa.bbb,
        /ReferenceError/,
        `should throw Reference error when try to access property ${CHAIN_PROPERTY}`,
    );
    assert.strictEqual(window.hit, 'FIRED', 'hit fired');
});

test('dot notation deferred defenition', (assert) => {
    const scriptletArgs = [CHAIN_PROPERTY];
    runScriptlet(name, scriptletArgs);

    window.aaa = {};
    window.aaa.bbb = 'value';
    assert.throws(
        () => window.aaa.bbb,
        /ReferenceError/,
        `should throw Reference error when try to access property ${CHAIN_PROPERTY}`,
    );
    assert.strictEqual(window.hit, 'FIRED', 'hit fired');
});

test('simple, matches stack', (assert) => {
    window[PROPERTY] = 'value';
    const stackMatch = 'tests.js';
    const scriptletArgs = [PROPERTY, stackMatch];
    runScriptlet(name, scriptletArgs);

    assert.throws(
        () => window[PROPERTY],
        /ReferenceError/,
        `should throw Reference error when try to access property ${PROPERTY}`,
    );
    assert.strictEqual(window.hit, 'FIRED', 'hit fired');
});

test('simple, does NOT match stack', (assert) => {
    window[PROPERTY] = 'value';
    const noStackMatch = 'no_match.js';
    const scriptletArgs = [PROPERTY, noStackMatch];
    runScriptlet(name, scriptletArgs);

    assert.strictEqual(window.hit, undefined, 'hit should NOT fire');
});

test('simple, matches stack of our own script', (assert) => {
    window[PROPERTY] = 'value';
    const selfMatch = 'abortOnPropertyRead';
    const scriptletArgs = [PROPERTY, selfMatch];
    runScriptlet(name, scriptletArgs);

    assert.strictEqual(window.hit, undefined, 'hit should NOT fire');
});

test('invalid regex for stack matching -> match all', (assert) => {
    window[PROPERTY] = 'value';
    const stackMatch = '/\\/';
    const scriptletArgs = [PROPERTY, stackMatch];
    runScriptlet(name, scriptletArgs);

    assert.throws(
        () => window[PROPERTY],
        /ReferenceError/,
        `should throw Reference error when try to access property ${PROPERTY}`,
    );
    assert.strictEqual(window.hit, 'FIRED', 'hit fired');
});
