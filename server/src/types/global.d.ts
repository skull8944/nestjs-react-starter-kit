export {};

declare global {
  type ValueOf<T extends Record<string, unknown>> = T[keyof T];

  type Nillable<T> = T | null | undefined;
}
