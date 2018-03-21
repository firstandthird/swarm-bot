const docker = require('../lib/docker');

module.exports = {
  expression: '^ls',
  async handler(slackPayload) {
    const services = await docker.listServices();
    const send = {
      response_type: 'in_channel',
      text: 'Services running:',
      attachments: services.map(d => ({ title: d.Spec.Name })).sort((a, b) => a.title.localeCompare(b.title))
    };
    return send;
  },
  description: 'list out services'
};
