var currentTurn = "X"; //X or O
var turnNumber = 0;

function generateFields() {
  var y = 1;
  var top = 50;
  for (var i = 0; i < 9; i++) {
    var x = $("#board").append(
      "<div class='field hover-field' id='" + "nr" + i + "'></div>"
    );
    var fieldI = $("#nr" + i);

    if (i == 0 || i == 3 || i == 6) {
      fieldI.css("margin-left", "5px");
    }
    if (i >= 3 && i <= 8) {
      fieldI.css("margin-top", "15px");
    }

    fieldI.click(chooseField);
  }
}

$(generateFields());

/* 
How table looks like:
    var fieldsOnBoard = 
    ["nr0", "nr1", "nr2",
    "nr3", "nr4", "nr5",
    "nr6", "nr7", "nr8",];
 */

function chooseField() {
  if (currentTurn == "X") {
    $(this).html(
      "<img class='cross' src='https://s18.postimg.org/s90kaibmh/cross.png'>"
    );
    currentTurn = "O";
  } else if (currentTurn == "O") {
    $(this).html(
      "<img class='circle' src='https://s18.postimg.org/e2ktfag6x/circle.png'>"
    );
    currentTurn = "X";
  }

  $(this).css({ opacity: 0, scale: 0 });
  $(this).removeClass("hover-field");
  $(this).transition({ opacity: 1, scale: 1 }, "in-out");

  turnNumber++;

  $(".flipper").toggleClass("flipped");

  $(this).off("click");
  if (checkIfWin() != null) {
    endOfGame(checkIfWin());
  }
}

function checkIfWin() {
  var winConditions = [
    ["nr0", "nr1", "nr2"],
    ["nr3", "nr4", "nr5"],
    ["nr6", "nr7", "nr8"],
    ["nr0", "nr3", "nr6"],
    ["nr1", "nr4", "nr7"],
    ["nr2", "nr5", "nr8"],
    ["nr0", "nr4", "nr8"],
    ["nr2", "nr4", "nr6"]
  ];
  for (var x in winConditions) {
    // $("#" + winConditions[x][0] + "> img").attr("class");
    //console.log($("#" + winConditions[x][0] + "> img").attr("class") + " " + $("#" + winConditions[x][0] + "> img").attr("class") + " " + $("#" + winConditions[x][0] + "> img").attr("class"));

    var field1 = $("#" + winConditions[x][0] + "> img").attr("class");
    var field2 = $("#" + winConditions[x][1] + "> img").attr("class");
    var field3 = $("#" + winConditions[x][2] + "> img").attr("class");
    //console.log(`pierwsza = ${field1} druga = ${field2} trzecia = ${field3}`);
    if (field1 != undefined && field2 != undefined && field3 != undefined) {
      if (field1 === field2 && field2 === field3 && field1 === field3) {
        return field1;
      }
    }
  }

  var fieldsOnBoard = [
    "nr0",
    "nr1",
    "nr2",
    "nr3",
    "nr4",
    "nr5",
    "nr6",
    "nr7",
    "nr8"
  ];
  for (var z in fieldsOnBoard) {
    var full = false;

    if ($("#" + fieldsOnBoard[z] + "> img").attr("class") == undefined) {
      break;
    }
    full = true;
  }
  if (full) {
    return "draw";
  }

  return null;
}

function endOfGame(x) {
  console.log(x);

  $("." + x)
    .first()
    .clone()
    .removeClass(".field, " + x)
    .attr("id", "winned")
    .appendTo("#board");
  $(".field, #lines").hide();
  $("#winned").transition({ height: "100px", width: "100px" });
  $("#winned").transition({
    height: "200px",
    width: "200px",
    color: "#e74c3c"
  });
  if (x != "draw") {
    $("#board").append("<p id='win-text'>HAS WON!</p>");
  } else {
    $("#board").append("<p id='win-text'>DRAW</p>");
    setTimeout(() => resetBoard(), 2000);
  }
  $("#winned").click(() => {
    resetBoard();
  });

  function resetBoard() {
    $(".field, #lines").show();
    $("#board").transition({ scale: 0, rotate: "-90deg" });
    $("#board")
      .children("[id != 'lines']")
      .remove();
    generateFields();
    $("#board").transition({ scale: 1, rotate: "0deg" });
  }
}