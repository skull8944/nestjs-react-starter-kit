declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'test' | 'dev' | 'qas' | 'prd';
    APP_PORT: string | number;

    dbConnectionString: string;

    azureStorageDomainUrl: string;
    azureStorageConnectionString: string;
    azureStorageDefaultShareName: string;

    AAD_CLIENT_ID: string;
    AAD_TENANT_ID: string;
    aadClientSecret: string;

    SERVER_TYPE: 'web' | 'job';
    [key]: string;
  }
}
