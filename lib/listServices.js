const docker = require('../lib/docker');

module.exports = async (name) => {
  // const services = await docker.listServices();
  const services = [
    { Spec: { Name: 'c' } },
    { Spec: { Name: 'Da' } },
    { Spec: { Name: 'a' } },
  ]
  const options = services.map(s => ({ text: s.Spec.Name, value: s.Spec.Name }));
  options.sort((a, b) => a.text - b.text);
  return [
    {
      name,
      text: 'pick a service...',
      type: 'select',
      options
    }
  ];
};
