module.exports.playerTeam = function (player, espn) {
    espn.getTeams({ seasonId: 2018, scoringPeriodId: 1 }).then((teams) => {
        // Do whatever with teams
    });
}