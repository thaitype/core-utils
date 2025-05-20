# @thaitype/core-utils

[![CI](https://github.com/thaitype/core-utils/actions/workflows/main.yml/badge.svg)](https://github.com/thaitype/core-utils/actions/workflows/main.yml) [![NPM Version](https://img.shields.io/npm/v/@thaitype/core-utils) ](https://www.npmjs.com/package/@thaitype/core-utils)[![npm downloads](https://img.shields.io/npm/dt/@thaitype/core-utils)](https://www.npmjs.com/package/@thaitype/core-utils)

> ✨ Reusable utilities for TypeScript projects – including logging, typed errors, and more.

This package gives you two core tools for building robust, developer-friendly applications:

- 🧩 `TypedError` — custom errors with structured metadata
- 🎨 `PrettyLogger` — colorful, pluggable logger that implements a shared `ILogger` interface

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
import { PrettyLogger, MemoryLogger } from '@thaitype/core-utils';

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
const memoryLogger = new MemoryLogger();
new App(memoryLogger).run();
console.log(memoryLogger.logs); // Assert logs in unit tests
```

## 🧪 Other Loggers

* **MemoryLogger** – keeps logs in memory, perfect for tests
* **NoopLogger** – disables all logging (no-op implementation)

```ts
import { MemoryLogger, NoopLogger } from '@thaitype/core-utils';

const testLogger = new MemoryLogger();
const silentLogger = new NoopLogger();
```

## 📦 Exports

```ts
// Core
import { TypedError, PrettyLogger, MemoryLogger, NoopLogger } from '@thaitype/core-utils';

// Namespaced (optional)
import * as logger from '@thaitype/core-utils/logger';
import * as error from '@thaitype/core-utils/error';
```

## 🛠 When to Use

| Use Case                  | Recommended Utility |
| ------------------------- | ------------------- |
| Throwing typed errors     | `TypedError`        |
| Dev-time logs with colors | `PrettyLogger`      |
| Silent mode or production | `NoopLogger`        |
| Log capture for tests     | `MemoryLogger`      |

## 💙 Maintained by [ThaiType](https://github.com/thaitype)

We build tools that stay out of your way and help you write better TypeScript.

PRs welcome!

