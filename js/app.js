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

/// for testing
$("#add-info").on("click", function(event){
  event.preventDefault();
  $("#train-name-input").val("NJ Transit");
  $("#destination-input").val("Willowbrook Mall");
  $("#time-input").val("03:30");
  $("#frequency-input").val("12");
})

$("#add-train").on("click", function(event) {
  event.preventDefault();

  // if blank call them out
  inputName = $("#train-name-input").val().trim();
  inputDest = $("#destination-input").val().trim();
  inputTime = $("#time-input").val().trim();
  inputFreq = $("#frequency-input").val().trim();

  // console.log(firstTime);
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

        // var randomDate = "02/23/1999";
        // var randomFormat = "MM/DD/YYYY";
        // var convertedDate = moment(randomDate, randomFormat);
        // console.log(moment(convertedDate).format("X"));
        // console.log(moment(moment(randomDate, randomFormat)).format("X"));
        "<td>" + childSnapshot.val().trainFreq + "</td>" +
        // next arrival is time -
        // "<td>" + moment(nextTrain).format("h:hh A") + "</td><hr />" +
        // "<td>" + nextTrain + " " + moment(moment(nextTrain).format("X")).format("hh:mm A") + "</td><hr />" +
        "<td>" + nextTrain + " " + "</td><hr />" +
        // "<td>" + nextTrain +  "</td><hr />" +
        // mins away should be now time - the mins arriving
        "<td>" + tMinutesTillTrain + "</td><hr /></tr>"
    );

    // Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


// // Assumptions
// var tFrequency = 3;
//
// // Time is 3:30 AM
// var firstTime = "03:30";
//
// // First Time (pushed back 1 year to make sure it comes before current time)
// var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
// console.log(firstTimeConverted);
//
// // Current Time
// var currentTime = moment();
// console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
//
// // Difference between the times
// var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
// console.log("DIFFERENCE IN TIME: " + diffTime);
//
// // Time apart (remainder)
// var tRemainder = diffTime % tFrequency;
// console.log(tRemainder);
//
// // Minute Until Train
// var tMinutesTillTrain = tFrequency - tRemainder;
// console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
//
// // Next Train
// var nextTrain = moment().add(tMinutesTillTrain, "minutes");
// console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



// var randomDate = "02/23/1999";
// var randomFormat = "MM/DD/YYYY";
// var convertedDate = moment(randomDate, randomFormat);
//
// // Using scripts from moment.js write code below to complete each of the following.
// // Console.log to confirm the code changes you made worked.
//
// // 1 ...to convert the randomDate into three other date formats
// console.log(moment(convertedDate).format("MM/DD/YY"));
// console.log(moment(convertedDate).format("MMM Do, YYYY hh:mm:ss"));
// console.log(moment(convertedDate).format("X"));
// console.log("----------------------------------------");
//
// // 2 ...to determine the time in years, months, days between today and the randomDate
// console.log(moment(convertedDate).toNow());
// console.log(moment(convertedDate).diff(moment(), "years"));
// console.log(moment(convertedDate).diff(moment(), "months"));
// console.log(moment(convertedDate).diff(moment(), "days"));
// console.log("----------------------------------------");
//
// // 3 ...to determine the number of days between the randomDate and 02/14/2001
// var newDate = moment("02/14/2001", randomFormat);
// console.log(moment(convertedDate).diff(moment(newDate), "days"));
//
// // 4 ...to convert the randomDate to unix time (be sure to look up what unix time even is!!!)
// console.log(moment(convertedDate).format("X"));
// console.log("----------------------------------------");
//
// // 5 ...to determine what day of the week and what week of the year this randomDate falls on.
// console.log(moment(convertedDate).format("DDD"));
// console.log(moment(convertedDate).format("dddd"));






// --------------------------------------------------------------
// boilerplate
// add firebase config
// connect to firebase
// get a refernce to the database via firebase
// moment.unix(moment().format('X')).format("hh:mm");
//$('#SOME_BUTTON_GOES_HERE').on('click', function() {
  // collect the data from the html form, create variables to hold the data
  // train name, .... etc
  // when retrieving the "first train" data, make sure to parse it into a Unix timestamp

  // `push` that data into firebase (assume that the `child_added` listener updates HTML)

  // alert that train was added

  // clear out our HTML form for the next input
// });


//something.on('child_added', function(childSnapshot) {
  //console.log('the childSnapshot data', childSnapshot.val());

  // create local variables to store the data from firebase

// FIRST MAKE THE table row show up with empty strings for `timeInMinutes` / `tArrival `

// THEN DO THIS MATH
        // compute the difference in time from 'now' and the first train, store in var
                  // i added moment().format("hh:mm") - moment().format("hh:mm")
        // get the remainder of time after using `mod` with the frequency, store in var
        // subtract the remainder from the frequency, store in var `timeInMinutes`
        // format `timeInMinutes` ()"make pretty") and store in var `tArrival`

// ITS OKAY TO JUST SHOW EMPTY STRINGS for `timeInMinutes` / `tArrival`
  // append to our table of trains, inside the `tbody`, with a new row of the train data

// });
