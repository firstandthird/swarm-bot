const docker = require('../lib/docker');

module.exports = {
  expression: '^ls',
  handler: async slackPayload => {
    const services = await docker.listServices();
    const send = {
      text: 'Services running:',
      attachments: services.map(d => ({ title: d.Spec.Name })).sort((a, b) => a.title.localeCompare(b.title))
    };
    return send;
  },
  description: 'list out services'
};
