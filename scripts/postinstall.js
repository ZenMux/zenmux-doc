const fs = require('fs');

const vitepresspath = require.resolve('vitepress').replace(/\/vitepress\/.*$/g, '/vitepress/dist/client/app/router.js');

fs.writeFileSync(vitepresspath, fs.readFileSync(__dirname + '/fake-router.js'));
