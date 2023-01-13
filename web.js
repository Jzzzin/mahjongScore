const concurrently = require('concurrently');
const upath = require('upath');
const fs = require('fs');

const browserSyncPath = upath.resolve(upath.dirname(__filename), './browser-sync');
const sbPath = upath.resolve(upath.dirname(__filename), './scripts/sb-watch.js');
const apiPath = upath.resolve(upath.dirname(__filename), './dist');
console.log(browserSyncPath, fs.existsSync(browserSyncPath));

concurrently([
    { command: `node ${sbPath}`, name: 'SB_WATCH', prefixColor: 'bgBlue.bold' },
    { command: `node ${apiPath}`, name: 'MAHJONG_SCORE_API', prefixColor: 'bgYellow.bold' },
    {
        command: `"${browserSyncPath}" --port 8001 --reload-delay 2000 --reload-debounce 2000 dist -w --no-online`,
        name: 'SB_BROWSER_SYNC',
        prefixColor: 'bgGreen.bold',
    }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
}).then(success, failure);

function success() {
    console.log('Success');
}

function failure() {
    console.log('Failure');
}
