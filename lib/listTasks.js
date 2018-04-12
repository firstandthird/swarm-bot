module.exports = (data, title, filter) => {
  const send = {
    response_type: 'in_channel',
    text: title,
    attachments: data.sort((a, b) => {
      // sorted by state:
      const p = ['running', 'pending', 'failed'];
      return p.indexOf(a.Status.State) - p.indexOf(b.Status.State);
    }).map((d) => {
      const attachment = {
        title: `Task: ${d.Name}`,
        fields: [
          { title: 'Task Id', value: d.ID, short: true },
          { title: 'Slot', value: d.Slot, short: true },
          { title: 'ServiceID', value: d.ServiceID, short: true },
          { title: 'Status', value: d.Status.State, short: true },
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
          attachment.color = '#00ff00';
          break;
        case 'pending':
          attachment.color = '#FFFF00';
          break;
        default:
          attachment.color = '#ff0000';
      }
      return attachment;
    })
  };
  return send;
};
