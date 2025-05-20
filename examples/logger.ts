import { PrettyLogger, type ILogger } from "@thaitype/core-utils";

export class Main {

  constructor(public logger: ILogger) {}

  public run() {
    this.logger.info("This is an info message");
    this.logger.warn("This is a warning message");
    this.logger.error("This is an error message");
    this.logger.debug("This is a debug message");
  }
}

const logger = new PrettyLogger();
new Main(logger).run();