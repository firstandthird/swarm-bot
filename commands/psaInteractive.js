const listServices = require('../lib/listServices.js');

module.exports = {
  expression: '^psa$',
  async handler(slackPayload, match) {
    return {
      response_type: 'in_channel',
      attachments: [
        {
          text: 'Choose a service',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: await listServices('psa')
        }
      ]
    };
  },
  description: 'psa (interactive)'
};
