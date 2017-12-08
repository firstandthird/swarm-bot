const SlackCommand = require('slack-command');
const token = process.env.TOKEN;
const port = process.env.PORT || 8080;
const Docker = require('dockerode');
const docker = new Docker();
const serviceUpdate = require('docker-service-update');
const getDockerAuth = require('./lib/auth');
const auth = getDockerAuth();

const main = async function() {
  const slackCommand = new SlackCommand(port, {
    token,
    routeToListen: '/'
  });

  await slackCommand.start();
  slackCommand.register('ls', async () => {
    const services = await docker.listServices();
    const send = {
      response_type: 'in_channel',
      text: 'Services running:',
      attachments: services.map(d => ({ title: d.Spec.Name })).sort((a, b) => a.title.localeCompare(b.title))
    };
    return send;
  }, 'list out services');

  const listTasks = (data, title, filter) => {
    const send = {
      response_type: 'in_channel',
      text: title,
      attachments: data.sort((a, b) => a.Slot - b.Slot).map((d) => ({
        title: `Task ID: ${d.ID}`,
        fields: [
          { title: 'Slot', value: d.Slot, short: true },
          { title: 'NodeID', value: d.NodeID, short: true },
          { title: 'Status', value: d.Status.State, short: true },
          { title: 'Since', value: d.Status.Timestamp, short: true }
        ]
      }))
    };
    return send;
  };

  slackCommand.register('^ps (.*)', async (payload, match) => {
    const service = match[1];
    const filter = {
      filters: {
        service: { [service]: true },
        'desired-state': { running: true }
      }
    };
    const data = await docker.listTasks(filter);
    return listTasks(data, `Tasks running in ${service} service`, filter);
  }, 'list running tasks for a [service]');

  slackCommand.register('^psa (.*)', async (payload, match) => {
    const service = match[1];
    const filter = {
      filters: {
        service: { [service]: true }
      }
    };
    const data = await docker.listTasks(filter);
    return listTasks(data, `Tasks all in ${service} service`, filter);
  }, 'list all tasks for a [service]');

  slackCommand.register('redeploy (.*)', async (payload, match) => {
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
      text: `${serviceName} is redeploying...`
    };
  }, 'redeploy a [service]');

  slackCommand.register('scale (.*) (.*)', async (payload, match) => {
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
  }, 'scale [service] [number]');


  slackCommand.register('logs (.*)', async (payload, match) => {
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
  }, 'logs for [service]');

  slackCommand.register('nodes', async (payload, match) => {
    const data = await docker.listNodes();
    const send = {
      response_type: 'in_channel',
      text: 'Listing nodes...',
      attachments: data.map((d) => ({
        title: `Node ID: ${d.ID}`,
        fields: [
          { title: 'ID', value: d.ID, short: true },
          { title: 'Role', value: d.Spec.Role, short: true },
          { title: 'Availability', value: d.Spec.Availability, short: true },
          { title: 'Status', value: d.Status.State, short: true },
          { title: 'Hostname', value: d.Description.Hostname, short: true },
          { title: 'Leader', value: d.ManagerStatus.Leader, short: true },
          { title: 'Reachability', value: d.ManagerStatus.Reachability, short: true }
        ]
      }))
    };
    return send;
  }, 'list the nodes in the swarm');

  slackCommand.register('node ps (.*)', async (payload, match) => {
    const nodeId = match[1];
    const filter = {
      filters: {
        node: { [nodeId]: true }
      }
    };
    const data = await docker.listTasks(filter);
    console.log(data);
    return listTasks(data, `Tasks running on node ${nodeId}`, filter);
  }, 'list containers running on a [nodeId]');
};
main();
