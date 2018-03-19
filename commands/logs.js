const docker = require('../lib/docker');

module.exports = {
  expression: '^logs (.*)',
  handler: async (slackPayload, match) => {
    const serviceName = match[1];
    const service = await docker.getService(serviceName);
    const opts = {
      stdout: true,
      stderr: true,
      timestamps: true,
      tail: 100
    };
    const logStream = await service.logs(opts);
    let logs = '';
    return new Promise((resolve, reject) => {
      logStream.on('data', (s) => logs += s.toString());
      logStream.on('end', () => {
        resolve({
          text: logs
        });
      });
    });
  },
  description: 'logs for [service]'
};
