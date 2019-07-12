module.exports.plugin = function (espn, web, event, config) {
    (async () => {
        await web.chat.postMessage({ channel: event.channel,
            text: '*ESPN Fantasy Football Slack Bot*' + '\n' +
            ' _Creator_ - Shibdib (Bob Sardinia)' + '\n' +
            ' _Current Plugins_ - Player Search (!p playern_name), About (!a)' + '\n' +
            '<https://github.com/shibdib/ESPN-Slack-FF' + found.player.id + '/|Github Link>'
        });
    })();
};