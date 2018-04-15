const docker = require('../lib/docker');

module.exports = async(data, title, filter) => {
  const containers = await docker.listContainers({});
  const send = {
    response_type: 'in_channel',
    text: title,
    attachments: data.sort((a, b) => {
      // sorted by state, running is always first and bad states go last:
      const p = ['running', 'created', 'restarting', 'pending', 'paused', 'removing', 'exited', 'dead', 'failed', 'shutdown'];
      return p.indexOf(a.Status.State) - p.indexOf(b.Status.State);
    }).map((d) => {
      containers.forEach(c => {
        if (c.Id === d.Status.ContainerStatus.ContainerID) {
          d.Name = (c.Names && c.Names.length > 0) ? c.Names[0] : `${d.ID} (name unknown)`;
        }
      });
      const attachment = {
        title: `Task: ${d.Name}`,
        fields: [
          { title: 'Task Id', value: d.ID, short: true },
          { title: 'Node Id', value: d.NodeID, short: true },
          { title: 'Slot', value: d.Slot, short: true },
          { title: 'ServiceID', value: d.ServiceID, short: true },
          { title: 'Status/Desired Status', value: `${d.Status.State}/${d.DesiredState}`, short: true },
          { title: 'Since', value: d.Status.Timestamp, short: true }
        ]
      };
      // add container id if is available:
      if (d.Status && d.Status.ContainerStatus && d.Status.ContainerStatus.ContainerID) {
        attachment.fields.splice(2, 0, { title: 'Container', value: d.Status.ContainerStatus.ContainerID, short: true });
      }
      // add container image if available:
      if (d.Spec && d.Spec.ContainerSpec && d.Spec.ContainerSpec.Image) {
        attachment.fields.splice(3, 0, { title: 'Image', value: d.Spec.ContainerSpec.Image, short: true });
      }

      // color-code based on the run state:
      switch (d.Status.State) {
        case 'running':
          attachment.color = 'good';
          break;
        case 'pending':
          attachment.color = 'warning';
          break;
        case 'restarting':
          attachment.color = 'warning';
          break;
        case 'created':
          attachment.color = 'warning';
          break;
        default:
          attachment.color = 'danger';
      }
      return attachment;
    })
  };
  return send;
};
