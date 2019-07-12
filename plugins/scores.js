module.exports.plugin = function (espn, web, event, config) {
    let week = event.text.substr(event.text.indexOf(" ") + 1).replace(/\s+/g, '') || 1;
    espn.getBoxscoreForWeek({seasonId: 2019, scoringPeriodId: 1, matchupPeriodId: 1}).then((boxscores) => {
        console.log(boxscores)
    });
};
