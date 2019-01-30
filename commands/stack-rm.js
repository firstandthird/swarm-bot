const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^stack remove (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const stackName = match[1];
    const services = await docker.listServices();
    const stacks = [];
    const removedServices = [];
    services.forEach(s => {
      if (s.Spec.Labels && s.Spec.Labels['com.docker.stack.namespace'] && s.Spec.Labels['com.docker.stack.namespace'] === stackName) {
        stacks.push(new Promise(async resolve => {
          const service = await docker.getService(s.Spec.Name);
          const result = await service.remove();
          removedServices.push(s.Spec.Name);
          resolve();
        }));
      }
    });
    await Promise.all(stacks);
    const send = {
      response_type: 'in_channel',
      text: `Removed stack ${stackName}`,
      attachments: removedServices.map(d => ({ title: `Removed service ${d}` }))
    };
    return send;
  },
  description: 'Remove a stack'
};
