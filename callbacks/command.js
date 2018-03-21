module.exports = {
  name: 'command',
  handler(payload, actionName, actionValue) {
    return this.runCommand(actionValue, payload);
  }
};
