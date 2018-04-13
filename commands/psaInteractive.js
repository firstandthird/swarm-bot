const docker = require('../lib/docker');

module.exports = {
  expression: '^psa$',
  async handler(slackPayload, match) {
    const services = await docker.listServices();
    const options = services.map(s => ({ text: s.Spec.Name, value: s.Spec.Name }));
    return {
      attachments: [
        {
          text: 'Choose a service',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: [
            {
              name: 'psa',
              text: 'pick a command...',
              type: 'select',
              options
            }
          ]
        }
      ]
    };
  },
  description: 'psa (interactive)'
};
