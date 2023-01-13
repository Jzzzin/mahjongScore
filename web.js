const concurrently = require('concurrently');
const upath = require('upath');

const browserSyncPath = upath.resolve(upath.dirname(__filename), './node_modules/.bin/browser-sync');

concurrently([
    // { command: 'node scripts/sb-watch.js', name: 'SB_WATCH', prefixColor: 'bgBlue.bold' },
    { command: 'node dist', name: 'MAHJONG_SCORE_API', prefixColor: 'bgYellow.bold' },
    // {
    //     command: `"${browserSyncPath}" --port 8001 --reload-delay 2000 --reload-debounce 2000 dist -w --no-online`,
    //     name: 'SB_BROWSER_SYNC',
    //     prefixColor: 'bgGreen.bold',
    // }
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
