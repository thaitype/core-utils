import { TypedError } from "@thaitype/core-utils/error";

class UserNotFoundError extends TypedError<{ id: string }> { }

try {
  throw new UserNotFoundError('User not found', { id: '123' });
} catch (err) {
  if (err instanceof UserNotFoundError) {
    console.error(err.meta?.id); // Logs: 123
  }
}