import type { MaybePromise } from "../types.js";

export type Middleware<C> = (
  ctx: C,
  next: () => Promise<void>
) => MaybePromise<void>;
