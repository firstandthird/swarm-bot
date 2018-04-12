const docker = require('../lib/docker');

module.exports = async (name) => {
  const services = await docker.listServices();
  const options = services.map(s => ({ text: s.Spec.Name, value: s.Spec.Name }));
  return [
    {
      name,
      text: 'pick a service...',
      type: 'select',
      options
    }
  ];
};
