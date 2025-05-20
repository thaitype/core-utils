import type { MaybePromise } from "../types.js";
import type { Middleware } from "./types.js";

export const createMiddleware = <C>(fn: Middleware<C>): Middleware<C> => fn;

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