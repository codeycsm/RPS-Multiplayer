// Initialize Firebase
var config = {
  apiKey: "AIzaSyAHL7Q6olrqEOiR3rvvnGAxKaEDOhodmBI",
  authDomain: "rps-multiplayer-99e63.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-99e63.firebaseio.com",
  projectId: "rps-multiplayer-99e63",
  storageBucket: "rps-multiplayer-99e63.appspot.com",
  messagingSenderId: "863489482024"
};
firebase.initializeApp(config);
// database reference
let database = firebase.database();
// timer for playGame function
let timer = null;
// player objects
let player1Db;
let player2Db;

let player1 = {
  id: 0,
  name: "",
  choice: "",
  wins: 0,
  losses: 0,
  ties: 0,
  messages: []
};
let player2 = {
  id: 0,
  name: "",
  choice: "",
  wins: 0,
  losses: 0,
  ties: 0,
  messages: []
};

$(document).ready(function() {
  $("#rpsGame").hide();
  $("h1").hide();

  // click event on instructions container to play game
  $("#playButton").on("click", function() {
    //grabs the values of player 1 and player 2 names and checks if there empty.
    database.ref().once("value", function(snapshot) {
      player1Db = snapshot.val().player1.name;
      player2Db = snapshot.val().player2.name;
    });
    $("#playerName").empty();
    if (player1Db !== undefined && player2Db !== undefined) {
      alert("The game is already being played....Sorry!");
    } else if ($("#playerName").val() === "") {
      alert("Whats your name first?");
    } else {
      assignPlayer();
    }
  });

  database.ref().on("value", function(snapshot) {
    $("#player1Name").text(snapshot.val().player1.name);
    $("#player1Wins").text(snapshot.val().player1.wins);
    $("#player1Losses").text(snapshot.val().player1.losses);
    $("#player1Choice").text(snapshot.val().player1.choice);
    $("#player1Ties").text(snapshot.val().player1.ties);
    $("#player2Name").text(snapshot.val().player2.name);
    $("#player2Wins").text(snapshot.val().player2.wins);
    $("#player2Losses").text(snapshot.val().player2.losses);
    $("#player2Choice").text(snapshot.val().player2.choice);
    $("#player2Ties").text(snapshot.val().player2.ties);
  });
});

function assignPlayer() {
  if (player1Db === undefined) {
    player1.name = $("#playerName").val();
    player1.id = 1;
    database.ref("/player1/").set(player1);
    $("#player2Options").hide();
  } else if (player2Db === undefined) {
    player2.name = $("#playerName").val();
    player2.id = 2;
    database.ref("/player2/").set(player2);
    $("#player1Options").hide();
  }
  $("#instructions").hide();
  $("#rpsGame").show();
  $("h1").show();
  playGame();
}

function playGame() {
  $("#player1Options, #player2Options").on("click", "button", function() {
    $("#player1Options, #player2Options").unbind();
    if (
      $(this)
        .parent()
        .attr("id") === "player1Options"
    ) {
      player1.choice = $(this)
        .text()
        .trim();
      database.ref("player1/choice").set(player1.choice);
    } else {
      player2.choice = $(this)
        .text()
        .trim();
      database.ref("player2/choice").set(player2.choice);
    }
  });
  timer = setInterval(function() {
    console.log("check");
    updatePlayers();
    if (player1.choice !== "" && player2.choice !== "") {
      clearTimeout(timer);
      checkWinner();
    }
  }, 1000);
}
function checkWinner() {
  updatePlayers();
  if (player1.choice === "Rock" && player2.choice === "Scissors") {
    player1.wins++;
    player2.losses++;
    database.ref("/player1/wins").set(player1.wins);
    database.ref("/player2/losses").set(player2.losses);
  } else if (player1.choice === "Rock" && player2.choice === "Paper") {
    player1.losses++;
    player2.wins++;
    database.ref("/player1/losses").set(player1.losses);
    database.ref("/player2/wins").set(player2.wins);
  } else if (player1.choice === "Paper" && player2.choice === "Rock") {
    player1.wins++;
    player2.losses++;
    database.ref("/player1/wins").set(player1.wins);
    database.ref("/player 2/losses").set(player2.losses);
  } else if (player1.choice === "Paper" && player2.choice === "Scissors") {
    player1.losses++;
    player2.wins++;
    database.ref("/player1/losses").set(player1.losses);
    database.ref("/player2/wins").set(player2.wins);
  } else if (player1.choice === "Scissors" && player2.choice === "Paper") {
    player1.wins++;
    player2.losses++;
    database.ref("/player1/wins").set(player1.wins);
    database.ref("/player2/losses").set(player2.losses);
  } else if (player1.choice === "Scissors" && player2.choice === "Rock") {
    player1.losses++;
    player2.wins++;
    database.ref("/player1/losses").set(player1.losses);
    database.ref("/player2/wins").set(player2.wins);
  } else {
    player1.ties++;
    player2.ties++;
    database.ref("/player1/ties").set(player1.ties);
    database.ref("/player2/ties").set(player2.ties);
  }
  console.log(player1);
  console.log(player2);
  timer = setTimeout(function(){
    database.ref("/player1/choice").set("");
    database.ref("/player2/choice").set("");
    playGame();
  },2000);
}
function updatePlayers() {
  database.ref().once("value", function(snapshot) {
    player1.choice = snapshot.val().player1.choice;
    player1.wins = snapshot.val().player1.wins;
    player1.losses = snapshot.val().player1.losses;
    player1.ties = snapshot.val().player1.ties;
    player2.choice = snapshot.val().player2.choice;
    player2.wins = snapshot.val().player2.wins;
    player2.losses = snapshot.val().player2.losses;
    player2.ties = snapshot.val().player2.ties;
  });
}
// resets the database when user is done playing
function leaveGame() {
  //if (player1.id === 1 && player2.id === 0) {
  database.ref("/player1/").set("");
  //} else if (player2.id === 2 && player1.id === 0) {
  database.ref("/player2/").set("");
  //}
  $("#rpsGame").hide();
  $("h1").hide();
  $("#instructions").show();
}
