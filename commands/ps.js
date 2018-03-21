const docker = require('../lib/docker');
const listTasks = require('../lib/listTasks');

module.exports = {
  expression: '^ps (.*)',
  async handler(payload, match) {
    const service = match[1];
    const filter = {
      filters: {
        service: { [service]: true },
        'desired-state': { running: true }
      }
    };
    const data = await docker.listTasks(filter);
    return listTasks(data, `Tasks running in ${service} service`, filter);
  },
  description: 'list running tasks for a [service]'
};
