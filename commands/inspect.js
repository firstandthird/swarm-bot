const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^inspect (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const serviceName = match[1];
    const service = await docker.getService(serviceName);
    const inspect = await service.inspect();
    const send = {
      response_type: 'in_channel',
      text: `${serviceName} service info`,
      attachments: [
        {
          text: JSON.stringify(inspect, null, 2)
        }
      ]
    };
    return send;
  },
  description: 'inspect [service]'
};
