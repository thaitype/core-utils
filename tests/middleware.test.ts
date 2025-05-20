import { describe, it, expect, vi } from 'vitest';
import { applyMiddleware, createMiddleware } from '@thaitype/core-utils';

type Context = { trace?: string };

describe('applyMiddleware', () => {
  it('should run middlewares in order and call target', async () => {
    const log: string[] = [];

    const mw1 = createMiddleware<Context>(async (ctx, next) => {
      log.push('mw1 start');
      await next();
      log.push('mw1 end');
    });

    const mw2 = createMiddleware<Context>(async (ctx, next) => {
      log.push('mw2 start');
      await next();
      log.push('mw2 end');
    });

    const target = vi.fn(async (_ctx: Context) => {
      log.push('handler');
      return 'done';
    });

    const run = applyMiddleware(target, mw1, mw2);
    const result = await run({});

    expect(result).toBe('done');
    expect(log).toEqual([
      'mw1 start',
      'mw2 start',
      'handler',
      'mw2 end',
      'mw1 end',
    ]);
    expect(target).toHaveBeenCalledOnce();
  });

  it('should not call target if middleware does not call next', async () => {
    const target = vi.fn(async (_ctx: Context) => 'done');

    const blockingMiddleware = createMiddleware<Context>(async (_ctx, _next) => {
      // intentionally does not call next
    });

    const run = applyMiddleware(target, blockingMiddleware);
    const result = await run({});

    expect(result).toBeUndefined();
    expect(target).not.toHaveBeenCalled();
  });

  it('should throw if next() is called multiple times', async () => {
    const badMiddleware = createMiddleware<Context>(async (_ctx, next) => {
      await next();
      await next(); // this should break
    });

    const target = vi.fn();

    const run = applyMiddleware(target, badMiddleware);
    await expect(() => run({})).rejects.toThrow('next() called multiple times');
  });

  it('should pass context correctly to target and middlewares', async () => {
    const target = vi.fn(async (ctx: Context) => {
      expect(ctx.trace).toBe('123');
      return 'ok';
    });

    const run = applyMiddleware(target);
    const result = await run({ trace: '123' });

    expect(result).toBe('ok');
    expect(target).toHaveBeenCalledOnce();
  });
});