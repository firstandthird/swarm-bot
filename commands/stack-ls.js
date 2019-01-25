const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^stack ls',
  async handler(slackPayload) {
    const docker = dockerspawn();
    const services = await docker.listServices();
    const stacks = [];
    services.forEach(s => {
      if (s.Spec.Labels && s.Spec.Labels['com.docker.stack.namespace']) {
        stacks.push(s.Spec.Labels['com.docker.stack.namespace']);
      }
    });
    const send = {
      response_type: 'in_channel',
      text: 'Stacks running:',
      attachments: stacks.map(d => ({ title: d }))
    };
    return send;
  },
  description: 'list out stacks'
};
