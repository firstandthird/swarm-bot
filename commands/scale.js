module.exports = {
  expression: '^scale (.*) (.*)',
  handler(slackPayload, match) {
    return 'not supported right now';
  },
  description: 'scale [service] [number]'
};
