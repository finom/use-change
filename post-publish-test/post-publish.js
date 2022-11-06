/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const { execSync } = require('child_process');

execSync('rm -rf node_modules && npm i --legacy-peer-deps --no-package-lock', { cwd: __dirname });
// remove root dependencies to avoid usage of them
execSync('rm -rf ../node_modules', { cwd: __dirname });

const expect = require('expect.js');

const {
  default: useChange, useValue, useGet, useSet, useSilent,
  listenChange, unlistenChange, Context, Provider,
} = require('use-change');

for (const f of [useChange, useValue, useGet, useSet, useSilent, listenChange, unlistenChange]) {
  expect(typeof f === 'function').to.be(true);
}

expect(Context.Provider).to.be(Provider);

// return main dependencies back
execSync('npm i --legacy-peer-deps --prefix ..', { cwd: __dirname });
