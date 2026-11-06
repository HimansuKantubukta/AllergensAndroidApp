/* eslint-disable class-methods-use-this */
let logger = null;
const loggerEnabled = true;

export default class Logger {
  static getLogger() {
    if (!logger) {
      logger = new Logger();
      logger.insertLog = console.log.bind(console);
    }
    return logger;
  }

  setInsertFn(fn) {
    this.insertLog = fn;
  }

  trace(component, msg) {
    // console.log(`${component}: ${msg}`);
    if (loggerEnabled) {
      if (msg) {
        this.insertLog(`${component}: ${msg}`);
      } else {
        this.insertLog(`${component}`);
      }
    }
  }

  error(component, msg) {
    if (loggerEnabled) {
      this.insertLog(`Error: ${component}: ${msg}`);
    }
  }

  debug(component, msg) {
    let msg2 = msg;
    if (loggerEnabled) {
      if (typeof msg !== 'string') {
        msg2 = JSON.stringify(msg);
      }
      this.insertLog(`DEBUG: ${component}: ${msg2}`);
    }
  }

  traceRequest(url, method, key, payload, headers) {
    if (loggerEnabled) {
      this.insertLog(
        `NETWORK: ${method} ${url} Payload: ${JSON.stringify(
          payload
        )} Headers: ${JSON.stringify(headers)}`
      );
    }
  }

  notificationReceivedInFg(notification) {
    this.insertLog(
      `NOTIFICATION: received in foreground: ${JSON.stringify(notification)}`
    );
  }

  logTimeDifference(op, t1, t2) {
    this.insertLog(
      `Operation ${op} took ${t2 - t1} ms (${(t2 - t1) / 1000} s)`
    );
    return t2;
  }
}
