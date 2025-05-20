/**
 * Represents a custom typed error with optional metadata.
 *
 * This class extends the native `Error` class, allowing you to associate
 * structured metadata with the error in a type-safe manner.
 * 
 * Can be extended to define specific error types in your application.
 *
 * @template TMeta - The shape of metadata attached to the error. Defaults to a generic object.
 *
 * @example
 * ```ts
 * class UserNotFoundError extends TypedError<{ id: string }> {}
 *
 * try {
 *   throw new UserNotFoundError('User not found', { id: '123' });
 * } catch (err) {
 *   if (err instanceof UserNotFoundError) {
 *     console.error(err.meta?.id); // Logs: 123
 *   }
 * }
 * ```
 */
export class TypedError<TMeta = Record<string, unknown>> extends Error {
  /** Identifies this error as a typed error. */
  public readonly isTypedError = true;

  /**
   * Creates a new instance of TypedError.
   *
   * @param name - The name of the error.
   * @param meta - Optional metadata to provide additional context for the error.
   */
  constructor(
    public override name: string,
    public meta?: TMeta
  ) {
    super(name);
    this.name = name;
  }
}
