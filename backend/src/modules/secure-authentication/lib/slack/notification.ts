import fetch from 'isomorphic-fetch';

const rlcText:any = {
  failure: 'Rolling code blocked',
  success: 'Rolling code validation succeeds',
};

const slackColor:any = {
  failure: '#FF0000',
  success: '#36a64f',
};

const getSlackMessage = (userIdentity:any) => {
  const { sourceIp, status, error, device, redirect } = userIdentity;
  return `${rlcText[status]} ${
    error ? '`' + error + '`' : ''
  } for \`${sourceIp}\` running on \`${device}\` using \`${redirect}\` `;
};

const formatSlackMessage = (slackMessage:any, status:any) => {
  const time = Date.now().toString();
  const ts = Number(`${time.substring(0, 10)}.${time.substr(10)}`);

  return {
    attachments: [
      {
        color: slackColor[status],
        text: slackMessage,
        mrkdwn_in: ['text'],
        ts,
      },
    ],
  };
};

export default (params:any) => {
  const { logger, status, isRollingCodeTag, slackWebUrl } = params;

  if (!isRollingCodeTag) {
    return Promise.resolve('slack notification not sent: not a rolling code tag');
  }

  const slackmessage = getSlackMessage(params);
  const msg = formatSlackMessage(slackmessage, status);

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(msg),
  };

  logger.info({ status, slackWebUrl }, 'sending slack notification');

  return fetch(slackWebUrl, options)
    .then(() => {
      logger.info('slack notification sent');
      return 'slack notification sent: a rolling code tag';
    })
    .catch((err:any) => {
      logger.error({ err }, 'Error: Failed to send message to slack');
    });
};
