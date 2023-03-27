import { logger } from "../../../libs/logger";
var constant = require('../utils/constant');
const { EmailClient } = require("@azure/communication-email");
const connectionString =  process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const client = new EmailClient(connectionString);
const sender = process.env.SENDER
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import { requestPasswordRequest } from "./templates/requestPasswordReset";
import { EMAIL } from "../utils/constant";


export async function EmailService(email:any,payload:any,template:any) {
  const toRecipients = {
    to: [
      { email: email},
    ],
  };

  let message
  if(template!=undefined){
    const compiledTemplate = handlebars.compile(template)
    
    message = compiledTemplate(payload)
  }

  const emailContent = {
    subject: payload.subject || constant.SUBJECT,
    plainText: constant.PLAINTEXT,
    html: message || EMAIL,
  };

  try {
    const emailMessage = {
      sender: sender,
      content: emailContent,
      recipients: toRecipients,
    };

    const sendResult = await client.send(emailMessage);

    if (sendResult && sendResult.messageId) {
      // check mail status, wait for 5 seconds, check for 60 seconds.
      const messageId = sendResult.messageId;
      if (messageId === null) {
        logger.info("Message Id not found.");
        return;
      }

      let counter = 0;
      const statusInterval = setInterval(async function () {
        counter++;
        try {
          const response = await client.getSendStatus(messageId);
          if (response) {
            if (response.status.toLowerCase() !== "queued" || counter > 12) {
              clearInterval(statusInterval);
            }
          }
        } catch (e) {
          logger.error("Error in checking send mail status: ");
          return Promise.reject(e)
        }
      }, constant.TIMEOUT);
    } else {
      logger.error("Something went wrong when trying to send this email: ");
      return Promise.resolve(sendResult)
    }
  } catch (e) {
    logger.error("################### Exception occoured while sending email #####################", );
    return Promise.reject(e)
  }
}


