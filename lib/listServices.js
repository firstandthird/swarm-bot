const docker = require('../lib/docker');

module.exports = async (name) => {
  const services = await docker.listServices();
  console.log('===============');
  const options = services.map(s => ({ text: s.Spec.Name, value: s.Spec.Name }));
  console.log(options);
  options.sort((a, b) => {
    console.log(a.text);
    console.log(b.text);
    return a.text.toLowerCase() > b.text.toLowerCase();
  });
  console.log('after');
  console.log(options);
  return [
    {
      name,
      text: 'pick a service...',
      type: 'select',
      options
    }
  ];
};
