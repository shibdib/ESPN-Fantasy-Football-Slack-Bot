module.exports.plugin = function (espn, web, event) {
    (async () => {
        await web.chat.postMessage({ channel: event.channel,
            text: '*ESPN FF Slack Bot*' + '\n' +
            ' _Creator_ - Shibdib (Bob Sardinia)' + '\n' +
            ' _Current Plugins_ - Player Lookup (!p player_name), About (!a)' + '\n' +
            '<https://github.com/shibdib/ESPN-Slack-FF|Github Link>'
        });
    })();
};
