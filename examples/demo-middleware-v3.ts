import { applyMiddleware, createMiddleware } from "@thaitype/core-utils";

type Context = {
  user?: { role: string };
};

const withLogger = createMiddleware<Context>(async (ctx, next) => {
  console.log('🟡 Logger START');
  await next();
  console.log('🟣 Logger END');
});

const withRoleCheck = (role: string) =>
  createMiddleware<Context>(async (ctx, next) => {
    console.log('🔐 Checking role...');
    if (ctx.user?.role !== role) {
      throw new Error('Unauthorized');
    }
    await next();
  });

const handler = async (ctx: Context) => {
  console.log('🟢 Handler running...');
  return '🎉 Done!';
};

const run = applyMiddleware(handler, withLogger, withRoleCheck('admin'));

// ✅ รัน middleware
(async () => {
  try {
    const result = await run({ user: { role: 'admin' } });
    console.log('✅ Result:', result);
  } catch (e) {
    if (e instanceof Error) {
      console.error('❌ Error:', e.message);
    } else {
      console.error('❌ Unknown error:', e);
    }
  }
})();