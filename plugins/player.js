// Player lookup
let players = [];
let playerCacheTimer;
module.exports.plugin = function (espn, web, event, config, log) {
    let found;
    // Cache player info for 6 hours
    log.debug(`Player cache: currentTimer ${playerCacheTimer} currentTime ${Date.now()}`);
    if (!players[0] || !playerCacheTimer || playerCacheTimer + (60000 * (60 * 6)) < Date.now()) {
        log.debug(`Player cache: Creating cache`);
        espn.getFreeAgents({ seasonId: 2019, scoringPeriodId: 1 }).then((freeAgents) => {
            found = freeAgents.filter((p) => p.player.fullName.toLowerCase().replace(/\s+/g, '') === event.text.substr(event.text.indexOf(" ") + 1).toLowerCase().replace(/\s+/g, ''))[0];
            players = freeAgents;
            playerCacheTimer = Date.now();
            sendPlayerInfo(found, event, web, config);
        });
    } else {
        found = players.filter((p) => p.player.fullName.toLowerCase().replace(/\s+/g, '') === event.text.substr(event.text.indexOf(" ") + 1).toLowerCase().replace(/\s+/g, ''))[0];
        sendPlayerInfo(found, event, web, config);
    }
};

// Send player info back to channel
function sendPlayerInfo(found, event, web, config) {
    // If match found
    if (found) {
        let injured = '';
        if (found.player.isInjured) injured = ' *INJURED*';
        (async () => {
            await web.chat.postMessage({ channel: event.channel,
                text: '*' + found.player.fullName + ' ('+ found.player.proTeamAbbreviation +'-'+ found.player.defaultPosition + ')*' + injured + '\n' +
                ' _Status_ - ' + found.player.availabilityStatus + '\n' +
                ' _Projected Points_ - ' + Math.round(getProjectedPoints(found.projectedRawStats, config)) + '\n' +
                '_ADP_ - ' + Math.round(found.player.averageDraftPosition) + '\n' +
                ' _%Own/Start_ - ' + Math.round(found.player.percentOwned) + '/' + Math.round(found.player.percentStarted) + '\n' +
                '<https://www.espn.com/nfl/player/_/id/' + found.player.id + '/|ESPN Link>'
            });
        })();
    } else {
        (async () => {
            await web.chat.postMessage({ channel: event.channel, text: event.text.substr(event.text.indexOf(" ") + 1) + ' could not be found.' });
        })();
    }
}

function getProjectedPoints(projectedStats, config) {
    let points = 0;
    for (let attribute in projectedStats) {
        if (!config.scoreWeighting[attribute]) continue;
        points += config.scoreWeighting[attribute] * projectedStats[attribute];
    }
    return points;
}