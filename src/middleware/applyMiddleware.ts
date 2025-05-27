import type { MaybePromise } from '../types.js';
import type { Middleware } from './types.js';

/**
 * Creates a middleware function with type-safe context.
 *
 * This is a helper to define a middleware that receives a context object
 * and a `next()` function to continue the execution chain.
 *
 * @template C - The type of the shared context passed through the middleware chain
 * @param fn - A middleware function that receives context and next
 * @returns A middleware function
 */
export const createMiddleware = <C>(fn: Middleware<C>): Middleware<C> => fn;

/**
 * Applies a chain of middleware around a target handler function.
 *
 * Middleware will be executed in the order they are provided,
 * wrapping the handler in a "sandwich" pattern:
 *
 * ```
 * middleware1 -> middleware2 -> ... -> target -> ... <- middleware2 <- middleware1
 * ```
 *
 * Each middleware must call `await next()` to proceed to the next middleware or the target.
 * If a middleware does not call `next()`, the chain will stop at that point.
 *
 * @template C - The type of context passed through the chain
 * @template R - The return type of the handler
 * @param target - The target function to execute at the center of the middleware chain
 * @param middlewares - A list of middleware to wrap the target
 * @returns A new function that applies the middleware chain to the target
 *
 * @example
 * ```ts
 * const logger = createMiddleware<Context>(async (ctx, next) => {
 *   console.log("Start");
 *   await next();
 *   console.log("End");
 * });
 *
 * const handler = async (ctx: Context) => "done";
 * const run = applyMiddleware(handler, logger);
 *
 * await run({ userId: "123" });
 * ```
 */
export function applyMiddleware<C, R>(
  target: (ctx: C) => MaybePromise<R>,
  ...middlewares: Middleware<C>[]
): (ctx: C) => Promise<R> {
  return async function wrapped(ctx: C): Promise<R> {
    let result: R;
    let i = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= i) throw new Error('next() called multiple times');
      i = index;

      const fn = middlewares[index];
      if (!fn) {
        result = await target(ctx);
        return;
      }

      await fn(ctx, () => dispatch(index + 1));
    };

    await dispatch(0);
    return result!;
  };
}
