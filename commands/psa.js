const listTasks = require('../lib/listTasks');
const docker = require('../lib/docker');

module.exports = {
  expression: '^psa (.*)',
  handler: async (slackPayload, match) => {
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
