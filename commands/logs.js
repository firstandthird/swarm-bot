const dockerspawn = require('../lib/docker');

module.exports = {
  expression: '^logs (.*)',
  async handler(slackPayload, match) {
    const docker = dockerspawn();
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
      logStream.on('data', (s) => {
        logs += s.toString().replace(/\[\d+m/g, '');
      });
      logStream.on('end', () => {
        resolve({
          response_type: 'in_channel',
          text: `${serviceName} last 100 logs`,
          attachments: [{
            text: logs
          }]
        });
      });
    });
  },
  description: 'logs for [service]'
};
