import { applyMiddleware, createMiddleware } from "@thaitype/core-utils/middleware";

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

// Example of a class-based handler
// class MyHandler {
//   async run(ctx: Context) {
//     console.log('🟢 MyHandler running...');
//     return '🎉 MyHandler Done!';
//   }
// }
// const myHandler = new MyHandler();
// const run = applyMiddleware(myHandler.run.bind(myHandler), withLogger, withRoleCheck('admin'));


(async () => {
  try {
    const result = await run({ user: { role: 'admin' } });
    // const result = await run({ user: { role: 'user' } }); // Uncomment to test unauthorized case
    console.log('✅ Result:', result);
  } catch (e) {
    if (e instanceof Error) {
      console.error('❌ Error:', e.message);
    } else {
      console.error('❌ Unknown error:', e);
    }
  }
})();

// The result should be:
// 🟡 Logger START
// 🔐 Checking role...
// 🟢 Handler running...
// 🟣 Logger END
// ✅ Result: 🎉 Done!