# Match-Client

[![Build Status:](https://github.com/Kareem-Emad/match-js/workflows/Build/badge.svg)](https://github.com/Kareem-Emad/match-js/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

match is a multiplayer game server that manages all logic behind starting a new game, matching/connecting online players, inviting friends to a game for you so you could focus on building the game itself without worrying about such networking details.
learn more at <https://github.com/Kareem-Emad/match>

match-client is a web sdk for match server.

## setup

make sure you set up the env variable properlly for:

- `MATCH_SERVER_URL` url of the match server to connect to

## how to use

```js
const Match = require('match-client');
// first initalize the match client object with the user identifying info plus callbacks for events triggers
const matchClient = new Match(username, jwtToken, newJoinCB, leaveCB, gameStartedCB, gameEndedCB);

matchClient.pairPlayer();// requests to start a new game for this player with random players

matchClient.markPlayerReady(); // announce that player is ready to play if min players required avaiable and ready

matchClient.leaveGame(); // announce that player is no longer willing to start the game, therefore will be kicked out of the room if game started already or not.

matchClient.endGame(); // announce game ended to all other players, usually announced by the winning player.
```

constructor params:

- `username` user identifier in the game
- `jwtToken` jwt token to verify user identity at server side
- `newJoinCB` function to call whenever a new comer joins the game room sample params passed:

```js
{
    user_id: 200,
    username: 'newComerUsername',
    all_players: [
        { username: 'testak', user_id: 400, room: 'room#0', ready: false },
        { username: 'newComerUsername', user_id: 200, room: 'room#0', ready: false }
    ],
},
```

- `readyCB` function to trigger when any player in the room announce that he is ready (to do any ui update for player status)

```js
{
    user_id: 123,
    username: 'readyUserName',
    total_ready_count: 20,
}
```

- `leaveCB` function to trigger when a player in the room disconnects/leaves, sample params passed:

```js
{
    user_id: 500,
    username: 'ToLeaveUserName',
}
```

- `gameStartedCB` function to call when the game should start to change screens or whatever necessary in the game frontend
- `gameEndedCB` function to reannounce that game ended after winning player announced to server, this to make sure if any player lagging in calculations get the final update that game ended.
