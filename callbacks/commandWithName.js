module.exports = {
  name: 'commandWithName',
  handler(payload, actionName, actionValue) {
    return this.runCommand(`${actionName} ${actionValue}`, payload);
  }
};
