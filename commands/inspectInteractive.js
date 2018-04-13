const listServices = require('../lib/listServices.js');

module.exports = {
  expression: '^inspect$',
  async handler(slackPayload, match) {
    return {
      attachments: [
        {
          text: 'Choose a service',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: await listServices('inspect')
        }
      ]
    };
  },
  description: 'inspect (interactive)'
};
