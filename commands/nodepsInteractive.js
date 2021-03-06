const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^node ps$',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const nodes = await docker.listNodes();
    const options = nodes.map(n => ({ text: `${n.Description.Hostname} [${n.ID}]`, value: n.ID }));
    return {
      response_type: 'in_channel',
      attachments: [
        {
          text: 'Choose a node',
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: [
            {
              name: 'node ps',
              text: 'pick a command...',
              type: 'select',
              options
            }
          ]
        }
      ]
    };
  },
  description: 'node ps (interactive)'
};
