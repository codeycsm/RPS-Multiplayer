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
// timer to display both players choice
let timer = null;
// user gets assigned values
let player = {
  id: 0,
  name: "",
  choice: "",
  wins: 0,
  losses: 0,
  ties: 0,
  message: ""
};

$(document).ready(function() {
  $("#rpsGame").hide();
  $("#header button, #header h1").hide();

  // click event on instructions container to play game.
  $("#playButton").on("click", function() {
    player.name = $("#playerName").val();
    // grabs the values of player 1 and player 2 names and assignes user accordingly.
    database.ref().once("value", function(snapshot) {
      if ($("#playerName").val() === "") {
        alert("I need to know your name first");
      } else if (
        snapshot.val().player1.name !== "" &&
        snapshot.val().player2.name !== ""
      ) {
        alert("The game is full");
      } else if (snapshot.val().player1.name === "") {
        database.ref("/player1/name").set(player.name);
        player.id = snapshot.val().player1.id;
        $("#instructions").hide();
        $("#header button, #header h1").show();
        $("#rpsGame").show();
        $("#player2Options button").hide();
      } else if (snapshot.val().player2.name === "") {
        database.ref("/player2/name").set(player.name);
        player.id = snapshot.val().player2.id;
        $("#instructions").hide();
        $("#header button, #header h1").show();
        $("#rpsGame").show();
        $("#player1Options button").hide();
      }
    });
    $("#player1ChoiceContainer, #player2ChoiceContainer").hide();
  });

  // Player choice click event.
  $("#player1Options, #player2Options").on("click", "button", function() {
    player.choice = $(this)
      .text()
      .trim();
    if (player.id === 1) {
      database.ref("/player1/choice").set(player.choice);
      $("#player1Options button").hide();
      $("#player1ChoiceContainer").show();
    } else if (player.id === 2) {
      database.ref("/player2/choice").set(player.choice);
      $("#player2Options button").hide();
      $("#player2ChoiceContainer").show();
    }
    calculateWin();
  });

  // Changes HTML based on database changes
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
    $("#messages").prepend(snapshot.val().message);
  });
  // event handler for when player closes the browser.
  $(window).on("beforeunload", function() {
    if (player.id === 1) {
      database.ref("/player1/name").set("");
      database.ref("/player1/choice").set("");
      database.ref("/player1/wins").set(0);
      database.ref("/player1/losses").set(0);
      database.ref("/player1/ties").set(0);
    } else if (player.id === 2) {
      database.ref("/player2/name").set("");
      database.ref("/player2/choice").set("");
      database.ref("/player2/wins").set(0);
      database.ref("/player2/losses").set(0);
      database.ref("/player2/ties").set(0);
    }
  });
});
// Calculates who wins, who looses or if it was a tie.
function calculateWin() {
  database.ref().once("value", function(snapshot) {
    let player1 = {
      choice: snapshot.val().player1.choice,
      wins: snapshot.val().player1.wins,
      losses: snapshot.val().player1.losses,
      ties: snapshot.val().player1.ties
    };
    let player2 = {
      choice: snapshot.val().player2.choice,
      wins: snapshot.val().player2.wins,
      losses: snapshot.val().player2.losses,
      ties: snapshot.val().player2.ties
    };

    if (player1.choice !== "" && player2.choice !== "") {
      $("#player2ChoiceContainer, #player1ChoiceContainer").show();
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
        database.ref("/player2/losses").set(player2.losses);
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
      setTimeout(function() {
        if (player.id === 1) {
          $("#player1Options button").show();
          database.ref("/player1/choice").set("");
        } else if (player.id === 2) {
          $("#player2Options button").show();
          database.ref("/player2/choice").set("");
        }
        $("#player2ChoiceContainer, #player1ChoiceContainer").hide();
      }, 3000);
    } else {
      timer = setInterval(function() {
        database.ref().once("value", function(snapshot) {
          if (
            snapshot.val().player1.choice !== "" &&
            snapshot.val().player2.choice !== ""
          ) {
            clearInterval(timer);
            $("#player2ChoiceContainer, #player1ChoiceContainer").show();
            setTimeout(function() {
              if (player.id === 1) {
                $("#player1Options button").show();
                database.ref("/player1/choice").set("");
              } else if (player.id === 2) {
                $("#player2Options button").show();
                database.ref("/player2/choice").set("");
              }
              $("#player2ChoiceContainer, #player1ChoiceContainer").hide();
            }, 2000);
          }
        });
      }, 1000);
    }
  });
}

function postMessage() {
  player.message = $("#message").val();
  if (player.message === "") {
    alert("You need to enter a message first.");
  } else if (player.id === 1) {
    database
      .ref("/message")
      .set(
        "<p class='bg-primary text-center my-2 py-1 px-1 text-wrap rounded'>" +
          player.message +
          "</p>"
      );
    database.ref("/message").set("");
  } else if (player.id === 2) {
    database
      .ref("message")
      .set(
        "<p class='p2 bg-success text-center my-2 py-1 px-1 text-wrap rounded'>" +
          player.message +
          "</p>"
      );
    database.ref("message").set("");
  }
  $("#message").val("");
}
// button for player to leave game
function leaveGame() {
  $("#playerName").val("");
  if (player.id === 1) {
    database.ref("/player1/name").set("");
    database.ref("/player1/choice").set("");
    database.ref("/player1/wins").set(0);
    database.ref("/player1/losses").set(0);
    database.ref("/player1/ties").set(0);
  } else if (player.id === 2) {
    database.ref("/player2/name").set("");
    database.ref("/player2/choice").set("");
    database.ref("/player2/wins").set(0);
    database.ref("/player2/losses").set(0);
    database.ref("/player2/ties").set(0);
  }
  database.ref("message").set("");
  $("#rpsGame").hide();
  $("#header button, #header h1").hide();
  $("#instructions").show();
}
