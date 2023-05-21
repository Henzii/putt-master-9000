/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const fs = require('fs');
const currentApp = require('../app.json');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const clonedApp = JSON.parse(JSON.stringify(currentApp));
const writeAppJson = (newAppObject) => {
    const jsonString = JSON.stringify(newAppObject, null, 2);
    fs.writeFile('./app.json', jsonString, err => { if (err) throw new Error(err); });
};

const getUpdatedVersion = (type, version) => {
    let [major, minor, patch] = version.split('.');
    switch(type) {
        case 'patch':
            patch++;
            break;
        case 'minor':
            minor++;
            patch = 0;
            break;
        case 'major':
            major++;
            minor=0;
            patch=0;
            break;
        default: throw new Error('Unknown patch type');
    }
    return `${major}.${minor}.${patch}`;
};

const updateType = process.argv[2];
const updatedVersion = getUpdatedVersion(updateType, currentApp.expo.version);

clonedApp.expo.version = updatedVersion;
clonedApp.expo.android.versionCode++;

console.log(`
Update type:\t${updateType}
Version:\t${currentApp.expo.version}\t->\t${clonedApp.expo.version}
Version code:\t${currentApp.expo.android.versionCode}\t->\t${clonedApp.expo.android.versionCode}
`);

if (process.argv[3] === 'commit') {
    writeAppJson(clonedApp);
    (async function runCommands() {
        await exec('git add app.json');
        await wait(250);
        await exec('git commit -m "update app.json"', (_err, stdout) => console.log(stdout));
        await wait(250);
        await exec(`git tag ${updatedVersion}`);
    })();
}

async function wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

