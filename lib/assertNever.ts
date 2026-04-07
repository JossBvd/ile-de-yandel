export function assertNever(value: never, message?: string): never {
  throw new Error(
    message ?? `Valeur inattendue (union non exhaustive) : ${String(value)}`,
  );
}
