#!/usr/bin/env node
// Setup logger
const log = require('simple-node-logger').createSimpleLogger('actionLog.log');
log.setLevel('info');
log.info('Start-up commenced....');

// Get config
const config = require('./config').configurables;

// Setup ESPN
const espnApi = require('espn-fantasy-football-api/node');
const espn = new espnApi.Client({ leagueId: config.leagueId });
espn.setCookies({espnS2: config.espnS2, SWID: config.SWID});

// Setup slack web
const { WebClient } = require('@slack/web-api');
const web = new WebClient(config.oAuth);

// Setup slack events
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(config.signingSecret);

// Initialize an express app to listen for events
const app = require('express')();
const port = 3000;
app.use('/slack/events', slackEvents.expressMiddleware());
app.listen(port, () => console.log(`Listening on port ${port}!`));

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
    if (event.text.startsWith('!')) {
        let request = event.text.replace(/ .*/,'').substring(1);
        if (availablePlugins[request]) {
            log.info(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
            request = availablePlugins[request];
            let plugin = require('./plugins/' + request);
            plugin.plugin(espn,web,event,config);
        }
    }
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', log.error);

const availablePlugins = {
    player: 'player',
    p: 'player',
    scores: 'scores',
    s: 'scores',
    score: 'scores',
    a: 'about',
    about: 'about'
};