export type MaybePromise<T> = T | Promise<T>;

export type Next = () => MaybePromise<void>;

export type Middleware<C> = (ctx: C, next: Next) => MaybePromise<void>;

export function createMiddleware<C>(
  middleware: Middleware<C>
): Middleware<C> {
  return middleware;
}

export interface MiddlewareHandlerInterface {
  <C, R>(
    target: (ctx: C) => MaybePromise<R>,
    mw1: Middleware<C>
  ): (ctx: C) => Promise<R>;

  <C, R>(
    target: (ctx: C) => MaybePromise<R>,
    mw1: Middleware<C>,
    mw2: Middleware<C>
  ): (ctx: C) => Promise<R>;

  <C, R>(
    target: (ctx: C) => MaybePromise<R>,
    mw1: Middleware<C>,
    mw2: Middleware<C>,
    mw3: Middleware<C>
  ): (ctx: C) => Promise<R>;

  <C, R>(
    target: (ctx: C) => MaybePromise<R>,
    ...middlewares: Middleware<C>[]
  ): (ctx: C) => Promise<R>;
}

export const applyMiddleware: MiddlewareHandlerInterface = <
  C,
  R = unknown
>(
  target: (ctx: C) => MaybePromise<R>,
  ...middlewares: Middleware<C>[]
): ((ctx: C) => Promise<R>) => {
  return async function wrapped(ctx: C): Promise<R> {
    let result: R;

    // รัน handler ก่อน
    result = await target(ctx);

    let i = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= i) throw new Error('next() called multiple times');
      i = index;

      const fn = middlewares[index];
      if (!fn) return;
      await fn(ctx, () => dispatch(index + 1));
    };

    await dispatch(0);

    return result;
  };
};


export interface MyContext {
  role: string;
}

const withLogger = createMiddleware<MyContext>((ctx, next) => {
  console.log('🔍 Logger - role:', ctx.role);
  return next();
});

const withRoleCheck = (role: string) =>
  createMiddleware<MyContext>((ctx, next) => {
    if (ctx.role !== role) throw new Error('❌ Access denied');
    return next();
  });

const handler = async (ctx: MyContext) => {
  console.log('✅ Handler executed');
  return 'done';
};

const securedHandler = applyMiddleware(handler, withLogger, withRoleCheck('admin'));

securedHandler({ role: 'admin' }).then(console.log);
// ❌ ถ้าเป็น role: 'user' จะ throw Error