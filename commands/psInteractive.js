const listServices = require('../lib/listServices.js');

module.exports = {
  expression: '^ps$',
  handler: async (slackPayload, match) => {
    return {
      attachments: [
        {
          text: 'Choose a service (debug version)',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: await listServices('ps')
        }
      ]
    };
  },
  description: 'ps (interactive)'
};
