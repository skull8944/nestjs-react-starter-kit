import { ConfidentialClientApplication, LogLevel, type NodeSystemOptions } from '@azure/msal-node';

import { Logger } from '@nestjs/common';

type MsalClientOptions = {
  clientId: string;
  tenantId: string;
  clientSecret: string;
  logger: Logger;
};

export class AzureService {
  private static createMsalLoggerCallback(
    logger: Logger,
  ): Exclude<NodeSystemOptions['loggerOptions'], undefined>['loggerCallback'] {
    return (level: LogLevel, message: string, _containsPii: boolean) => {
      switch (level) {
        case LogLevel.Error:
          return logger.error(message);
        case LogLevel.Warning:
          return logger.warn(message);
        case LogLevel.Info:
          return logger.log(message);
        case LogLevel.Verbose:
          return logger.verbose(message);
        case LogLevel.Trace:
          return logger.debug(message);
        default:
          return;
      }
    };
  }

  static createMsalClient(options: MsalClientOptions): ConfidentialClientApplication {
    return new ConfidentialClientApplication({
      auth: {
        clientId: options.clientId,
        authority: `https://login.microsoftonline.com/${options.tenantId}`,
        clientSecret: options.clientSecret,
      },
      system: {
        loggerOptions: {
          loggerCallback: this.createMsalLoggerCallback(options.logger),
          piiLoggingEnabled: false,
          logLevel: LogLevel.Info,
        },
      },
    });
  }

  private constructor() {}
}
