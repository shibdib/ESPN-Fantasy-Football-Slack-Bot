#!/usr/bin/env node
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
        console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
        let request = event.text.replace(/ .*/,'').substring(1);
        if (availablePlugins[request]) {
            request = availablePlugins[request];
            let plugin = require('./plugins/' + request);
            plugin.plugin(espn,web,event,config);
        }
    }
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

const availablePlugins = {
    player: 'player',
    p: 'player',
    scores: 'scores',
    s: 'scores',
    score: 'scores',
    a: 'about',
    about: 'about'
};