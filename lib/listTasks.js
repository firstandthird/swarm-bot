module.exports = (data, title, filter) => {
  const send = {
    response_type: 'in_channel',
    text: title,
    attachments: data.sort((a, b) => a.Slot - b.Slot).map((d) => {
      const attachment = {
        title: `Task ID: ${d.ID}`,
        fields: [
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
