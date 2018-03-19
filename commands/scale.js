const docker = require('../lib/docker');
const serviceUpdate = require('docker-service-update');
const getDockerAuth = require('../lib/auth');
const auth = getDockerAuth();

module.exports = {
  expression: '^scale (.*) (.*)',
  handler: async (slackPayload, match) => {
    const serviceName = match[1];
    const scale = match[2];
    await serviceUpdate({
      docker,
      auth,
      serviceName,
      scale: parseInt(scale, 10)
    });
    return {
      text: `${serviceName} is scaling to ${scale}...`
    };
  },
  description: 'scale [service] [number]'
};
