module.exports = {
  apps : [{
    name: 'server',
    script: './packages/server/src/app.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    exec_mode  : 'cluster',
    env: {
      COMMON_VARIABLE: 'true'
    },
    env_production : {
      NODE_ENV: 'production'
    },
    env_development : {
      NODE_ENV: 'development'
    }
  }
],
  deploy: {
    production: {
      user: 'speech_eval',
      host: 'nam-vm2.tu-ilmenau.de',
      repo: 'git@avt10.rz.tu-ilmenau.de:egamboa/speechstandardeval.git',
      ref: 'origin/master',
      path: '/var/www/speech_eval/production',
      'post-deploy': "yarn install && yarn workspaces run build && pm2 startOrRestart ecosystem.config.js --env production"
    },
    development: {
      user: 'speech_eval',
      host: 'nam-vm2.tu-ilmenau.de',
      repo: 'git@avt10.rz.tu-ilmenau.de:egamboa/speechstandardeval.git',
      ref: 'origin/master',
      path: '/var/www/speech_eval/development',
      'post-deploy': 'yarn install && pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
};
