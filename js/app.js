console.log("in");

var config = {
  apiKey: "AIzaSyDzghDuEEwVxF9u_fffO6BH4Gr-CKiwl6w",
  authDomain: "station-to-station.firebaseapp.com",
  databaseURL: "https://station-to-station.firebaseio.com",
  projectId: "station-to-station",
  storageBucket: "station-to-station.appspot.com",
  messagingSenderId: "189233039863"
};

firebase.initializeApp(config);

var database = firebase.database();

var inputName = "";
var inputDest = "";
var inputTime = "";
var inputFreq = "";

database.ref().on("value", function(snapshot) {
  // console.log(snapshot);
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

$("#add-info").on("click", function(event){
  event.preventDefault();
  $("#train-name-input").val("NJ Transit");
  $("#destination-input").val("Willowbrook Mall");
  $("#time-input").val("03:30");
  $("#frequency-input").val("12");
})

$("#add-train").on("click", function(event) {
  event.preventDefault();

  inputName = $("#train-name-input").val().trim();
  inputDest = $("#destination-input").val().trim();
  inputTime = $("#time-input").val().trim();
  inputFreq = $("#frequency-input").val().trim();

  database.ref().push({
    trainName: inputName,
    trainDest: inputDest,
    firstTime: inputTime,
    trainFreq: inputFreq,
    dataAdded: firebase.database.ServerValue.TIMESTAMP
  });

  function clearInputs() {
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  }

  clearInputs();

});

database.ref().orderByChild("tMinutesTillTrain").on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val());
    // console.log(childSnapshot.val().trainDest);
    // console.log(childSnapshot.val().firstTime);
    // var convertedDate = moment(randomDate, randomFormat);

    var tFrequency = childSnapshot.val().trainFreq;

    // Time is 3:30 AM
    var firstTime = childSnapshot.val().firstTime;
    // console.log(firstTime);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(moment(firstTime, "hh:mm").subtract(1, "years")), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder); // time till next train

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment(moment().add(tMinutesTillTrain, "minutes")).format("hh:mm A");
    console.log(nextTrain);

    // console.log(tMinutesTillTrain);

    // console.log(moment(amOrPm).format("A"));
    var amOrPM = function(time){
      if (time < 1200) {
        return "AM";
      } else if (time >= 1200) {
        return "PM";
      }
    }
    // console.log(nextTrain.toString().replace(":", ""), amOrPM(nextTrain.toString().replace(":", "")));

    $("tbody").append(
        "<tr><td>" + childSnapshot.val().trainName + "</td>" +
        "<td>" + childSnapshot.val().trainDest + "</td>" +
        "<td>" + childSnapshot.val().trainFreq + "</td>" +
        "<td>" + nextTrain + " " + "</td><hr />" +
        "<td>" + tMinutesTillTrain + "</td><hr /></tr>"
    );
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
