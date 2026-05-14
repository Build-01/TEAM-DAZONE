const winston = require("winston");

const logger = winston.getLogger ? winston.getLogger() : console;

class NotificationService {
  static async notifyUser(userId, subject, message) {
    logger.info(`Notify user ${userId}: ${subject} - ${message}`);
    return {
      success: true,
      userId,
      subject,
      message,
    };
  }
}

module.exports = NotificationService;
