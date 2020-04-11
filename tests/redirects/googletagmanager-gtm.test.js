/* eslint-disable no-underscore-dangle, no-eval */
import { clearGlobalProps } from '../helpers';

const { test, module } = QUnit;
const name = 'googletagmanager-gtm';

module(name);

const evalWrapper = eval;

const mockGoogleTagManagerApi = (endCallback) => {
    window.dataLayer = {
        hide: {
            end() {
                endCallback();
            },
        },
        push() {},
    };

    return window.dataLayer;
};

test('UBO alias', (assert) => {
    const params = {
        name: 'ubo-googletagmanager_gtm.js',
        verbose: true,
    };
    window.__debug = () => { window.hit = 'FIRED'; };

    assert.expect(3);

    const endCallback = () => {
        assert.ok(true, 'hide.end() was executed');
    };
    // emulate API
    const dataLayer = mockGoogleTagManagerApi(endCallback);

    // run scriptlet
    const resString = window.scriptlets.redirects.getCode(params);
    evalWrapper(resString);

    const done = assert.async();
    dataLayer.push({
        eventCallback() {
            assert.ok(true, 'Event callback was executed');
            done();
        },
    });

    assert.strictEqual(window.hit, 'FIRED', 'hit function was executed');

    clearGlobalProps('__debug', 'hit');
});

test('UBO Syntax', (assert) => {
    const params = {
        name: 'googletagmanager_gtm.js',
        verbose: true,
    };
    window.__debug = () => { window.hit = 'FIRED'; };

    assert.expect(3);

    const endCallback = () => {
        assert.ok(true, 'hide.end() was executed');
    };
    // emulate API
    const dataLayer = mockGoogleTagManagerApi(endCallback);

    // run scriptlet
    const resString = window.scriptlets.redirects.getCode(params);
    evalWrapper(resString);

    const done = assert.async();
    dataLayer.push({
        eventCallback() {
            assert.ok(true, 'Event callback was executed');
            done();
        },
    });

    assert.strictEqual(window.hit, 'FIRED', 'hit function was executed');

    clearGlobalProps('__debug', 'hit');
});

test('AdGuard Syntax', (assert) => {
    const params = {
        name,
        verbose: true,
    };
    window.__debug = () => { window.hit = 'FIRED'; };

    assert.expect(3);

    const endCallback = () => {
        assert.ok(true, 'hide.end() was executed');
    };
    // emulate API
    const dataLayer = mockGoogleTagManagerApi(endCallback);

    // run scriptlet
    const resString = window.scriptlets.redirects.getCode(params);
    evalWrapper(resString);

    const done = assert.async();
    dataLayer.push({
        eventCallback() {
            assert.ok(true, 'Event callback was executed');
            done();
        },
    });

    assert.strictEqual(window.hit, 'FIRED', 'hit function was executed');

    clearGlobalProps('__debug', 'hit');
});