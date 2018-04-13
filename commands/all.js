module.exports = {
  expression: '*',
  handler: (slackPayload, match) => ({
    attachments: [
      {
        text: 'Choose a command',
        attachment_type: 'default',
        callback_id: 'command',
        actions: [
          {
            name: 'command_list',
            text: 'pick a command...',
            type: 'select',
            options: [
              {
                text: 'list out services',
                value: 'ls'
              },
              {
                text: 'list out nodes',
                value: 'nodes'
              },
              {
                text: 'list tasks for a node',
                value: 'node ps'
              },
              {
                text: 'tasks for a service',
                value: 'ps'
              },
              {
                text: 'all tasks for a service',
                value: 'psa'
              },
              {
                text: 'inspect a service',
                value: 'inspect'
              },
              {
                text: 'redeploy a service',
                value: 'redeploy'
              },
              {
                text: 'logs for a service',
                value: 'logs'
              },
            ]
          }
        ]
      }
    ]
  })
};
