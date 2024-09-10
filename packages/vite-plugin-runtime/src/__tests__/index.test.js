import fs from 'fs/promises';
import path from 'path';

import { deepFreeze, range } from '@douglasneuroinformatics/libjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';

import { runtime } from '../index.js';
import * as runtimeResolve from '../resolve.js';

/** @type {runtimeResolve.RuntimeVersionInfo} */
const runtimeVersionInfoStub = deepFreeze(
  {
    baseDir: '',
    importPaths: [],
    manifest: {
      declarations: [],
      sources: []
    },
    version: ''
  },
  {
    readonlyType: false
  }
);

describe('runtime', () => {
  /** @type {import('vitest').MockInstance<any[], Promise<runtimeResolve.RuntimeVersionInfo[]>>} */
  let resolvePackages;

  beforeEach(() => {
    resolvePackages = vi.spyOn(runtimeResolve, 'resolvePackages').mockResolvedValue([runtimeVersionInfoStub]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should return false if disabled', () => {
    expect(runtime({ disabled: true })).toBe(false);
  });
  it('should return an object by default', () => {
    expect(runtime()).not.toBeNull();
    expect(runtime()).toBeTypeOf('object');
  });
  describe('buildStart', async () => {
    it('should invoke fs.cp and fs.writeFile for each item returned by resolvePackages', async () => {
      vi.spyOn(fs, 'cp').mockImplementation(vi.fn());
      vi.spyOn(fs, 'writeFile').mockImplementation(vi.fn());
      resolvePackages.mockResolvedValueOnce(range(3).map(() => structuredClone(runtimeVersionInfoStub)));
      /** @type {any} */
      const plugin = runtime();
      await plugin.buildStart();
      expect(fs.cp).toHaveBeenCalledTimes(3);
      expect(fs.writeFile).toHaveBeenCalledTimes(3);
    });
    it('should invoke path.resolve from the packageRoot, if produced', async () => {
      vi.spyOn(fs, 'cp').mockImplementation(vi.fn());
      vi.spyOn(fs, 'writeFile').mockImplementation(vi.fn());
      vi.spyOn(path, 'resolve');
      resolvePackages.mockResolvedValueOnce(
        range(3).map(() => ({ ...structuredClone(runtimeVersionInfoStub), version: 'v0' }))
      );
      /** @type {any} */
      const plugin = runtime({
        packageRoot: '/home/dev/test'
      });
      await plugin.buildStart();
      expect(path.resolve).toHaveBeenCalledWith('/home/dev/test', 'dist/runtime/v0');
    });
  });
  describe('config', () => {
    it('should exclude the import paths resolved', () => {
      resolvePackages.mockResolvedValueOnce([
        { ...structuredClone(runtimeVersionInfoStub), importPaths: ['/path1', '/path2'] },
        { ...structuredClone(runtimeVersionInfoStub), importPaths: ['/path3', '/path4'] }
      ]);
      /** @type {any} */
      const plugin = runtime();
      expect(plugin.config()).resolves.toMatchObject({
        optimizeDeps: {
          exclude: ['/path1', '/path2', '/path3', '/path4']
        }
      });
    });
  });
  describe('configureServer', async () => {
    /** @type {{ middlewares: { use: import('vitest').Mock }; }} */
    let server;

    beforeEach(() => {
      server = { middlewares: { use: vi.fn() } };
    });

    it('should call the server.middlewares.use method', () => {
      /** @type {any} */
      const plugin = runtime();
      plugin.configureServer(server);
      expect(server.middlewares.use).toHaveBeenCalledOnce();
      const [route, handler] = server.middlewares.use.mock.lastCall;
      expect(route).toBeTypeOf('string');
      expect(handler).toBeTypeOf('function');
    });
  });
});
