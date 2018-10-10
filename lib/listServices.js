const dockerspawn = require('../lib/docker');

module.exports = async (name) => {
  const docker = dockerspawn();
  const services = await docker.listServices();
  const options = services.map(s => ({ text: s.Spec.Name, value: s.Spec.Name }));
  options.sort((a, b) => a.text.localeCompare(b.text));
  return [
    {
      name,
      text: 'pick a service...',
      type: 'select',
      options
    }
  ];
};
