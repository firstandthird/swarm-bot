const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^remove$',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
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
              name: 'removeConfirm',
              text: 'pick a command...',
              type: 'select',
              options
            }
          ]
        }
      ]
    };
  },
  description: 'redeploy (interactive)'
};
