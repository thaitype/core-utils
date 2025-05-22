# @thaitype/core-utils

[![CI](https://github.com/thaitype/core-utils/actions/workflows/main.yml/badge.svg)](https://github.com/thaitype/core-utils/actions/workflows/main.yml) [![NPM Version](https://img.shields.io/npm/v/@thaitype/core-utils) ](https://www.npmjs.com/package/@thaitype/core-utils)[![npm downloads](https://img.shields.io/npm/dt/@thaitype/core-utils)](https://www.npmjs.com/package/@thaitype/core-utils)

> ✨ Reusable utilities for TypeScript projects – including logging, typed errors, and more.

This package gives you two core tools for building robust, developer-friendly applications:

- 🧩 `TypedError` — custom errors with structured metadata
- 🎨 `PrettyLogger` — colorful, pluggable logger that implements a shared `ILogger` interface
- ⛓️ `applyMiddleware` — lightweight, type-safe function middleware (inspired by web frameworks)

## 🚀 Installation

```bash
npm install @thaitype/core-utils
# or
pnpm add @thaitype/core-utils
```

## 🔥 Quick Start

### TypedError — Custom Error with Metadata

```ts
import { TypedError } from '@thaitype/core-utils';

class UserNotFoundError extends TypedError<{ id: string }> {}

try {
  throw new UserNotFoundError('User not found', { id: '123' });
} catch (err) {
  if (err instanceof UserNotFoundError) {
    console.error(err.meta?.id); // Logs: 123
  }
}
```

Great for precise error types, clean stack traces, and useful debugging info.

### PrettyLogger — Flexible Console Logger

```ts
import { PrettyLogger } from '@thaitype/core-utils';

const logger = new PrettyLogger();

logger.info('Server started');
logger.warn('Disk space low');
logger.error('Unexpected error occurred', { code: 500 });
logger.debug('Loading config', { path: '/etc/app.json' });
```

- ✨ Automatically color-coded
- 🧠 Optional metadata support
- 🔁 Fully pluggable with the shared `ILogger` interface

## 🧠 Swap Loggers with `ILogger`

Use `ILogger` in your code and plug in different loggers depending on your environment:

```ts
import type { ILogger } from '@thaitype/core-utils';
import { PrettyLogger, InMemoryLogger } from '@thaitype/core-utils';

class App {
  constructor(private readonly logger: ILogger) {}

  run() {
    this.logger.info('App running...');
  }
}

// ✅ Use in dev
const logger = new PrettyLogger();
new App(logger).run();

// ✅ Use in tests
const InMemoryLogger = new InMemoryLogger();
new App(InMemoryLogger).run();
console.log(InMemoryLogger.logs); // Assert logs in unit tests
```

## 🧪 Other Loggers

* **InMemoryLogger** – keeps logs in memory, perfect for tests
* **NoopLogger** – disables all logging (no-op implementation)
* **ConsoleLogger** – simple console logger

```ts
import { InMemoryLogger, NoopLogger, ConsoleLogger } from '@thaitype/core-utils';

const testLogger = new InMemoryLogger();
const silentLogger = new NoopLogger();
const consoleLogger = new ConsoleLogger();
```

## ⛓️ applyMiddleware — Chain Middleware in Plain Functions

Inspired by web frameworks like Hono, `applyMiddleware` lets you compose behavior around any function — without needing a full server.

```ts
import {
  applyMiddleware,
  createMiddleware,
  type Middleware
} from '@thaitype/core-utils';

type Context = { user?: { role: string } };

const withLogger = createMiddleware<Context>(async (ctx, next) => {
  console.log('🟡 Logger START');
  await next();
  console.log('🟣 Logger END');
});

const withRoleCheck = (role: string) =>
  createMiddleware<Context>(async (ctx, next) => {
    if (ctx.user?.role !== role) {
      throw new Error('Unauthorized');
    }
    await next();
  });

const handler = async (ctx: Context) => {
  return '🎉 Done!';
};

const run = applyMiddleware(handler, withLogger, withRoleCheck('admin'));

await run({ user: { role: 'admin' } }); // ✅ OK
await run({ user: { role: 'guest' } }); // ❌ Error: Unauthorized
```

### Features

* ✅ Supports both `async` and `sync` functions
* 🧠 Fully type-safe for context and return types
* 🔁 Simple functional pattern: no decorators, no frameworks
* 🔍 Useful for CLI tools, business logic, tests, and more


## 📦 Exports

```ts
// Core
import { TypedError, PrettyLogger, MemoryLogger, NoopLogger } from '@thaitype/core-utils';

// Namespaced (optional)
import * as logger from '@thaitype/core-utils/logger';
import * as error from '@thaitype/core-utils/error';
import * as middleware from '@thaitype/core-utils/middleware';
```

## 🛠 When to Use

| Use Case                  | Recommended Utility |
| ------------------------- | ------------------- |
| Throwing typed errors     | `TypedError`        |
| Dev-time logs with colors | `PrettyLogger`      |
| Silent mode or production | `NoopLogger`        |
| Log capture for tests     | `MemoryLogger`      |
| Middleware for functions  | `applyMiddleware`   |

## 💙 Maintained by [ThaiType](https://github.com/thaitype)

We build tools that stay out of your way and help you write better TypeScript.

PRs welcome!

