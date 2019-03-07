module.exports = {


  // takes the raw data from the stream and edits each
  // object so we can know how often they have been
  // updated
  payload: function(data) {
      let payload = JSON.parse(data);
      // the time stamp
      // this will be appended to each
      // player, so we know exactly
      // what date each player was last updated on
      let lastUpdatedOn = new Date().toDateString();
      // the player stats array
      let playerStats = payload.playerStatsTotals;
      console.log(playerStats.length);
      let response = [];
      for(let i = 0; i < playerStats.length; i++) {
          // derive player stats here
          response.push({"lastUpdatedOn":lastUpdatedOn, "player":(playerStats[i]).player, "team":(playerStats[i]).team, "stats":(playerStats[i]).stats});
      }
      // create a new player object
      return response;
  }
};