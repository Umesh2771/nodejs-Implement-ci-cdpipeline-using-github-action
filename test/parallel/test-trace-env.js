'use strict';

// This tests that --trace-env works.
require('../common');
const { spawnSyncAndAssert } = require('../common/child_process');
const assert = require('assert');
const fixtures = require('../common/fixtures');

// Check reads from the Node.js internals.
spawnSyncAndAssert(process.execPath, ['--trace-env', fixtures.path('empty.js')], {
  stderr(output) {
    // This is a non-exhaustive list of the environment variables checked
    // during startup of an empty script at the time this test was written.
    // If the internals remove any one of them, the checks here can be updated
    // accordingly.
    assert.match(output, /get environment variable "NODE_ICU_DATA":/);
    assert.match(output, /get environment variable "OPENSSL_CONF":/);
    assert.match(output, /get environment variable "NODE_EXTRA_CA_CERTS":/);
    assert.match(output, /get environment variable "NODE_DEBUG_NATIVE":/);
    assert.match(output, /get environment variable "NODE_COMPILE_CACHE":/);
    assert.match(output, /get environment variable "NODE_NO_WARNINGS":/);
    assert.match(output, /get environment variable "NODE_V8_COVERAGE":/);
    assert.match(output, /get environment variable "NODE_DEBUG":/);
    assert.match(output, /get environment variable "NODE_CHANNEL_FD":/);
    assert.match(output, /get environment variable "NODE_UNIQUE_ID":/);
    assert.match(output, /get environment variable "HOME":/);
    assert.match(output, /get environment variable "NODE_PATH":/);
    assert.match(output, /get environment variable "WATCH_REPORT_DEPENDENCIES":/);
  }
});

// Check get from user land.
spawnSyncAndAssert(process.execPath, ['--trace-env', fixtures.path('process-env', 'get.js') ], {
  env: {
    ...process.env,
    FOO: 'FOO',
    BAR: undefined,
  }
}, {
  stderr(output) {
    assert.match(output, /get environment variable "FOO": "FOO"/);
    assert.match(output, /get environment variable "BAR": undefined/);
  }
});

// Check set from user land.
spawnSyncAndAssert(process.execPath, ['--trace-env', fixtures.path('process-env', 'set.js') ], {
  stderr(output) {
    assert.match(output, /set environment variable "FOO" = "FOO"/);
  }
});

// Check define from user land.
spawnSyncAndAssert(process.execPath, ['--trace-env', fixtures.path('process-env', 'define.js') ], {
  stderr(output) {
    assert.match(output, /set environment variable "FOO" = "FOO"/);
  }
});

// Check query from user land.
spawnSyncAndAssert(process.execPath, ['--trace-env', fixtures.path('process-env', 'query.js') ], {
  env: {
    ...process.env,
    FOO: 'FOO',
    BAR: undefined,
    BAZ: undefined,
  }
}, {
  stderr(output) {
    assert.match(output, /query environment variable "FOO": is set/);
    assert.match(output, /query environment variable "BAR": is not set/);
    assert.match(output, /query environment variable "BAZ": is not set/);
  }
});

// Check delete from user land.
spawnSyncAndAssert(process.execPath, ['--trace-env', fixtures.path('process-env', 'delete.js') ], {
  stderr(output) {
    assert.match(output, /delete environment variable "FOO"/);
  }
});
