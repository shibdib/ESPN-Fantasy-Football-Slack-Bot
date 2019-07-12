module.exports.plugin = function (espn, web, event, config) {
    espn.getFreeAgents({ seasonId: 2018, scoringPeriodId: 1 }).then((freeAgents) => {
        let found = freeAgents.filter((p) => p.player.fullName.toLowerCase().replace(/\s+/g, '') === event.text.substr(event.text.indexOf(" ") + 1).replace(/\s+/g, ''))[0];
        if (found) {
            let injured = '';
            if (found.player.isInjured) injured = ' *INJURED*';
            (async () => {
                await web.chat.postMessage({ channel: event.channel, text: '*' + found.player.fullName + ' ('+ found.player.proTeamAbbreviation +'-'+ found.player.defaultPosition + ')*' + injured + '\n' +
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
    });
};

function getProjectedPoints(projectedStats, config) {
    let points = 0;
    for (let attribute in projectedStats) {
        if (!config.scoreWeighting[attribute]) continue;
        points += config.scoreWeighting[attribute] * projectedStats[attribute];
    }
    return points;
}