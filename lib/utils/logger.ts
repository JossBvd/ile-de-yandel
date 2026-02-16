const isDevelopment = process.env.NODE_ENV === 'development';

export function logDebug(message: string, ...args: any[]): void {
  if (isDevelopment) {
    console.log(message, ...args);
  }
}

export function logError(message: string, error?: Error | unknown): void {
  if (error instanceof Error) {
    console.error(message, error);
  } else if (error !== undefined) {
    console.error(message, error);
  } else {
    console.error(message);
  }
}

export function logInfo(message: string, ...args: any[]): void {
  if (isDevelopment) {
    console.info(message, ...args);
  }
}

export function logWarn(message: string, ...args: any[]): void {
  if (isDevelopment) {
    console.warn(message, ...args);
  } else {
    console.warn(message, ...args);
  }
}
