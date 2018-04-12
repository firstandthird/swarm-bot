const Services = require('@firstandthird/docker-services');

module.exports = {
  expression: '^redeploy (.*)',
  handler(slackPayload, match) {
    const serviceName = match[1];

    const services = new Services();
    const f = async () => {
      await services.adjust(serviceName, {
        force: true,
        env: {
          UPDATED: new Date().getTime()
        }
      });
      this.server.slackCommand.sendMessage(slackPayload.response_url, {
        response_type: 'in_channel',
        text: `Finished redeploying ${serviceName}.`
      });
    };
    // don't block. callbacks will sendMessage to slack when it is ready:
    f();
    return {
      response_type: 'in_channel',
      text: `${serviceName} is redeploying...`
    };
  },
  description: 'redeploy a [service]'
};
