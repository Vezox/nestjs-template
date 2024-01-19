module.exports = {
  apps: [
    {
      name: 'solar-cms',
      script: '.dist/main.js',
      instances: 0,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      time: true,
    },
  ],
};
