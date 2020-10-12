const io = require('socket.io-client');

const MATCH_SERVER_URL = process.env.MATCH_SERVER_URL || 'https://localhost:3000';

class MatchClient {
  /**
   * @function {constructor}
   * @param username (string) identifier of the user used in the game
   * @param token (string) jwt token to authenticate the user in server side
   * @param newJoinUpdateCallback (function) function to trigger whenever a new player joins the room
   * @param readyUpdateCallback (function) function to trigger whenever a player announces he is ready to start game
   * @param leaveUpdateCallback (function) function to trigger whenever a user disconnects/leaves the room
   * @param gameStartedCallback (function) function to trigger when the game is ready to start(enough/max players reached)
   * @param gameEndedCallback (function) function to trigger when the game is finished
  */
  constructor(username, token, newJoinUpdateCallback, readyUpdateCallback, leaveUpdateCallback, gameStartedCallback, gameEndedCallback){
    this.socket = io(MATCH_SERVER_URL, {
      query: {
        username,
        token,
      },
    });

    this.events = {
      leaveEvent: 'leave',
      playerLeaveEvent: 'player_leave',
      gameStartedEvent: 'game_start',
      pairRequestEvent: 'pair_me',
      gameEndedEvent: 'game_ended',
      newPlayerEvent: 'new_player',
      playerDisconnectedEvent: 'disconnect',
      playerEndGameEvent: 'end_game_notification',
      playerReadyEvent: 'player_ready',
      announcePlayerReadyEvent: 'player_ready_announcement',
    };

    this.socket.on(this.events.newPlayerEvent, newJoinUpdateCallback);
    this.socket.on(this.events.leaveEvent, leaveUpdateCallback);
    this.socket.on(this.events.announcePlayerReadyEvent, leaveUpdateCallback);
    this.socket.on(this.events.gameStartedEvent, gameStartedCallback);
    this.socket.on(this.events.gameEndedEvent, gameEndedCallback);
  }

  /**
   * @function {pairPlayer}
   * @summary requests available room to join current player in a game
  */
  pairPlayer(){
    this.socket.emit(this.events.pairRequestEvent, {});
  }

  /**
   * @function {markPlayerReady}
   * @summary announce that current player is ready to start the game if enough ready players is available
  */
  markPlayerReady(){
    this.socket.emit(this.events.playerReadyEvent, {});
  }

  /**
   * @function {endGame}
   * @summary announce that game has ended, usually the winner is the one who anounces this event
  */
  endGame(){
    this.socket.emit(this.events.playerEndGameEvent, {});
  }

  /**
   * @function {leaveGame}
   * @summary signals to all other players that you are leaving this game and removes you from this room messages
  */
  leaveGame(){
    this.socket.emit(this.events.playerLeaveEvent, {});
  }
}

module.exports = {
  MatchClient,
};

