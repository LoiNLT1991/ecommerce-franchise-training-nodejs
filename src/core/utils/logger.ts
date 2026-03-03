import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      if (stack) {
        return `[${timestamp}] ${level}: ${message}\n${stack}`;
      }
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

// const logger: winston.Logger = winston.createLogger({
//     // transports: [
//     //     // - Write all logs with importance level of `error` or less to `error.log`
//     //     // - Write all logs with importance level of `info` or less to `combined.log`
//     //     new winston.transports.File({ filename: "./logs/error.log", level: "error" }),
//     //     new winston.transports.File({ filename: "./logs/combined.log" }),
//     // ],
//     // format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
// });

// If we're not in production then log to the `console` with the format:
if (process.env.NODE_ENV !== "production") {
    // logger.add(
    //     new winston.transports.Console({
    //         format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
    //     })
    // );
}

export default logger;
