export const NODE_ENV = ['test', 'dev', 'qas', 'prd'] as const;

export type NodeEnv = (typeof NODE_ENV)[number];
