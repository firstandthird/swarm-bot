const docker = require('../lib/docker');

module.exports = {
  expression: '^ps$',
  handler: async (slackPayload, match) => {
    const services = await docker.listServices();
    const options = services.map(s => ({ text: s.Spec.Name, value: s.Spec.Name }));
    return {
      response_type: 'in_channel',
      attachments: [
        {
          text: 'Choose a service',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: [
            {
              name: 'ps',
              text: 'pick a command...',
              type: 'select',
              options
            }
          ]
        }
      ]
    };
  },
  description: 'ps (interactive)'
};
