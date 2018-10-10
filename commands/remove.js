const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^remove (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const serviceName = match[1];
    // if they selected the abort option:
    if (serviceName.startsWith('-9999')) {
      return {
        response_type: 'in_channel',
        text: `Will not remove the service ${serviceName.split('!!')[1]}.`,
        attachments: []
      };
    }
    const service = await docker.getService(serviceName);
    const result = await service.remove();
    const send = {
      response_type: 'in_channel',
      text: `Removed service ${serviceName}`,
      attachments: []
    };
    return send;
  },
  description: 'inspect [service]'
};
