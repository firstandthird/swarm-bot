module.exports = {
  expression: '^removeConfirm (.*)',
  async handler(slackPayload, match) {
    const selectedService = slackPayload.actions[0].selected_options[0].value;
    return {
      response_type: 'in_channel',
      attachments: [
        {
          text: `Really remove service ${selectedService}?`,
          attachment_type: 'default',
          callback_id: 'commandWithName',
          actions: [
            {
              name: 'remove',
              text: `Remove service ${selectedService}`,
              type: 'select',
              options: [
                { text: 'Yes', value: selectedService },
                { text: 'No', value: `-9999!!${selectedService}` },
              ]
            }
          ]
        }
      ]
    };
  },
  description: 'redeploy (interactive)'
};
