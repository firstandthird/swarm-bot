const listTasks = require('../lib/listTasks');
const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^psa (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
    const service = match[1];
    const filter = {
      filters: {
        service: { [service]: true }
      }
    };
    const data = await docker.listTasks(filter);
    return listTasks(data, `Tasks all in ${service} service`, filter);
  },
  description: 'list all tasks for a [service]'
};
