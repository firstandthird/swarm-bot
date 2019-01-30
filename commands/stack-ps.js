const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^stack ps (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const stackName = match[1];
    const services = await docker.listServices();
    const stackServices = [];
    services.forEach(s => {
      if (s.Spec.Labels && s.Spec.Labels['com.docker.stack.namespace'] && s.Spec.Labels['com.docker.stack.namespace'] === stackName) {
        stackServices.push(s.Spec.Name);
      }
    });
    const send = {
      response_type: 'in_channel',
      text: `Listing services for stack ${stackName}`,
      attachments: stackServices.map(d => ({ title: d }))
    };
    return send;
  },
  description: 'List services for a stack'
};
