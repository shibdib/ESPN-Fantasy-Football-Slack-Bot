const { WebClient } = require('@slack/web-api');
// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);
// The current date
const currentTime = new Date().toTimeString();

const espn = require('espn-fantasy-football-api/dist/index-node.js');

espn.BaseAPIObject.setCookies({ espnS2: 'AEAy%2BgFMHtxebZWlHsViBlUKwYzyuCyef8oqsJ0XWsJDVnl5DPBeSwmSaFv4iycxUKRlsnb3eO3inHzUkAuGrxdWwUkft9HegBT%2BBNIMswpYnykMuEdV4lI0U7TPTut1Ig8uPpoG4ksf3FkfgDC2dpUtdABJTjf9fZVzMkfCn3FSfHOgq49hIt3cgo3qUIkUEiE7fxC1aJCzO4ilvDu%2B%2BlYsWeYqRSvOJrH%2FTYHDXU7rl8JbZ%2Fn5MrS13VO3b5Gx4H%2F4iOJZ%2BBOk%2B7LD6iRHCsP1', SWID: '{A979E7A6-D12E-4F3B-85E0-F96B254908AE}' }); // fire and forget

const league = new espn.League({ leagueId: 12041, seasonId: 2018 });
league.read().then(() => console.log(league)); // Prints loaded league

(async () => {
    // Use the `auth.test` method to find information about the installing user
    const res = await web.auth.test()

    // Find your user id to know where to send messages to
    const userId = res.user_id

    // Use the `chat.postMessage` method to send a message from this app
    await web.chat.postMessage({
        channel: userId,
        text: `The current time is ${currentTime}`,
    });

    console.log('Message posted!');
})();
