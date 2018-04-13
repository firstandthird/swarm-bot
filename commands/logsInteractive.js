const listServices = require('../lib/listServices.js');

module.exports = {
  expression: '^logs$',
  async handler(slackPayload, match) {
    return {
      response_type: 'in_channel',
      attachments: [
        {
          text: 'Choose a service',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: await listServices('logs')
        }
      ]
    };
  },
  description: 'logs (interactive)'
};
