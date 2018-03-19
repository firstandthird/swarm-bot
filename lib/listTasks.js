module.exports = (data, title, filter) => {
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
