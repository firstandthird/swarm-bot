const Services = require('@firstandthird/docker-services');

module.exports = {
  expression: '^redeploy (.*)',
  handler(slackPayload, match) {
    const serviceName = match[1];

    const services = new Services();

    services.adjust(serviceName, {
      force: true,
      env: {
        UPDATED: new Date().getTime()
      }
    });

    return {
      response_type: 'in_channel',
      text: `${serviceName} is redeploying...`
    };
  },
  description: 'redeploy a [service]'
};
