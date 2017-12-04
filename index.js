const SlackCommand = require('slack-command').SlackCommand;
const token = process.env.TOKEN;
const command = process.env.COMMAND || '/swarm';
const port = process.env.PORT || 8080;
const Docker = require('dockerode');
const docker = new Docker();
const serviceUpdate = require('docker-service-update');
const getDockerAuth = require('./lib/auth');
const auth = getDockerAuth();

const slackCommand = new SlackCommand(token);

slackCommand.register(command, {
  async ls(payload, match, done) {
    const services = await docker.listServices();
    const send = {
      response_type: 'in_channel',
      text: 'Services running:',
      attachments: services.map(d => ({ title: d.Spec.Name }))
    };
    done(null, send);
  },
  async 'ps (.*)'(payload, match, done) {
    const service = match[1];
    const filter = { filters: JSON.stringify({ service: { [service]: true } }) };
    const data = await docker.listTasks(filter);
    const send = {
      response_type: 'in_channel',
      text: `Tasks running in ${service} service`,
      attachments: data.map((d) => ({
        title: `Task ID: ${d.ID}`,
        fields: [
          { title: 'Slot', value: d.Slot, short: true },
          { title: 'NodeID', value: d.NodeID, short: true },
          { title: 'Status', value: d.Status.State, short: true }
        ]
      }))
    };
    done(null, send);
  },
  async 'redeploy (.*)'(payload, match, done) {
    const serviceName = match[1];

    let res;
    try {
      res = await serviceUpdate({
        docker,
        auth,
        serviceName,
        environment: {
          UPDATE: new Date().getTime()
        }
      });
    } catch (e) {
      return done(e);
    }
    done(null, {
      text: `${serviceName} is redeploying...`
    });
  },
  async 'scale (.*) (.*)'(payload, match, done) {
    const serviceName = match[1];
    const scale = match[2];
    let res;
    try {
      res = await serviceUpdate({
        docker,
        auth,
        serviceName,
        scale: parseInt(scale, 10)
      });
    } catch (e) {
      return done(e);
    }
    done(null, {
      text: `${serviceName} is scaling to ${scale}...`
    });
  },
  async '*'(payload, done) {
    console.log(arguments);
    done(null, {
      text: 'help'
    });
  }
});

slackCommand.listen(port);
