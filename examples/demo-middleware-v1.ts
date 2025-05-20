export type Next = () => Promise<void>;

export type Middleware<C> = (
  ctx: C,
  next: Next
) => Promise<void> | void;

export function createMiddleware<C>(
  middleware: Middleware<C>
): Middleware<C> {
  return middleware;
}

export interface MiddlewareHandlerInterface {
  <C>(target: (ctx: C) => any, mw1: Middleware<C>): (ctx: C) => any;
  <C>(target: (ctx: C) => any, mw1: Middleware<C>, mw2: Middleware<C>): (ctx: C) => any;
  <C>(target: (ctx: C) => any, mw1: Middleware<C>, mw2: Middleware<C>, mw3: Middleware<C>): (ctx: C) => any;
  <C>(target: (ctx: C) => any, ...middlewares: Middleware<C>[]): (ctx: C) => any;
}

export const applyMiddleware: MiddlewareHandlerInterface = <C>(
  target: (ctx: C) => any,
  ...middlewares: Middleware<C>[]
): (ctx: C) => any => {
  return async function wrapped(ctx: C) {
    let i = -1;

    const dispatch = async (index: number): Promise<void> => {
      if (index <= i) throw new Error('next() called multiple times');
      i = index;

      const fn = middlewares[index] || target;
      return await fn(ctx, () => dispatch(index + 1));
    };

    return dispatch(0);
  };
};

export interface MyContext {
  role: string;
}

const withLogger = createMiddleware<MyContext>((ctx, next) => {
  console.log('🔍 Logger middleware - role:', ctx.role);
  return next();
});

const withRoleCheck = (role: string) =>
  createMiddleware<MyContext>((ctx, next) => {
    if (ctx.role !== role) throw new Error('❌ Access denied');
    return next();
  });

const handler = async (ctx: MyContext) => {
  console.log('✅ Handler called' + ctx.role);
  return 'done';
};

const run = applyMiddleware(handler, withLogger, withRoleCheck('admin'));

run({ role: 'admin' }); // ✅ ผ่าน
// run({ role: 'user' }); // ❌ Throw "Access denied"