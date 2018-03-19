const docker = require('../lib/docker');
const serviceUpdate = require('docker-service-update');
const getDockerAuth = require('../lib/auth');
const auth = getDockerAuth();

module.exports = {
  expression: '^redeploy (.*)',
  handler: async (slackPayload, match) => {
    const serviceName = match[1];

    await serviceUpdate({
      docker,
      auth,
      serviceName,
      environment: {
        UPDATE: new Date().getTime()
      }
    });
    return {
      response_type: 'in_channel',
      text: `${serviceName} is redeploying...`
    };
  },
  description: 'redeploy a [service]'
};
