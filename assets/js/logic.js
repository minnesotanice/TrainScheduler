// use fromNow() to figure out when next train comes?

// Users from many different machines must be able to view same train times. 

// update based on current time
// possibly update every minute

// validation for entering time



// INITIALIZE FIREBASE
var config = {
  // below is code from the firebase project I created
  // i'm not sure if I need to enter a value for storageBucket below
  // anyone can read or write to this database // do i need to change for this project?
  apiKey: "AIzaSyAvl43LiMcvSazMWmt7tX1YxlqMWzxYoOU",
  authDomain: "train-scheduler-45e1d.firebaseapp.com",
  databaseURL: "https://train-scheduler-45e1d.firebaseio.com",
  projectId: "train-scheduler-45e1d",
  storageBucket: "",
  messagingSenderId: "929057237293"
};

firebase.initializeApp(config);

var database = firebase.database();


// CURRENT TIME 
var currentTime = moment();


// GET DATA FROM DATABASE / CALCULATE / POPULATE TABLE
/* COULD NOT GET THIS TO WORK
var printSchedule = function () {

  // break down information retrieved from database so each value has its own variable
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainFirstTime = childSnapshot.val().first;
  var trainFreq = childSnapshot.val().frequency;

  // research subtracting one year a little more
  var trainFirstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");

  // Time apart (remainder)
  var trainRemainder = diffTime % trainFreq;

  // Minute Until Train
  var trainMinutesTill = trainFreq - trainRemainder;

  // Next Train Calculation
  var trainNext = moment().add(trainMinutesTill, "minutes");

  // Next Train Format
  var formatTrainNext = moment(trainNext).format("hh:mm");

  // add data into html table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + formatTrainNext + "</td><td>" + trainMinutesTill + "</td></tr>");

};
*/



// SUBMIT TRAIN INFORMATION
$("#add-train-btn").on("click", function (event) {

  event.preventDefault();

  // get input from form, format if needed, store as variables
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();

  // get time input and format as military time
  // currently will get a numerical entry like 123 and convert to military time 01:23 but sees entry such as 1:23 as an invalid entry 
  // do i need to validate this form? 
  var trainFirstTime = moment($("#first-train-time-input").val().trim(), "hmm").format("HH:mm");

  var trainFirstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");

  // Current Time
  var currentTime = moment();

  // Difference between the times
  var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");


  var trainFreq = $("#frequency-input").val().trim();

  // Time apart (remainder)
  var trainRemainder = diffTime % trainFreq;

  // Next Train
  var trainNext = moment().add(trainMinutesTill, "minutes");
  var trainNext = moment(trainNext).format("hh:mm");

  // Minute Until Train
  var trainMinutesTill = trainFreq - trainRemainder;


  // create tempoary object to hold submitted data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    first: trainFirstTime,
    frequency: trainFreq // ,
    // arrival: trainNext,
    // minutes: trainMinutesTill
  };

  // push to database
  database.ref().push(newTrain);

  // alert
  alert("Train successfully added");

  // clear form
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");

});



// ADD ROW TO 'CURRENT TRAIN SCHEDULE' TABLE WITH DATA RETRIEVED FROM THE MOST RECENT RECORD OF THE DATABASE
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  // COULD NOT GET THIS TO WORK
  // printSchedule();

  // break down information retrieved from database so each value has its own variable
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainFirstTime = childSnapshot.val().first;
  var trainFreq = childSnapshot.val().frequency;

  // research subtracting one year a little more
  var trainFirstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");

  // Difference between the times
  var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");

  // Time apart (remainder)
  var trainRemainder = diffTime % trainFreq;

  // Minute Until Train
  var trainMinutesTill = trainFreq - trainRemainder;

  // Next Train Calculation
  var trainNext = moment().add(trainMinutesTill, "minutes");

  // Next Train Format
  var formatTrainNext = moment(trainNext).format("hh:mm");

  // add data into html table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + formatTrainNext + "</td><td>" + trainMinutesTill + "</td></tr>");
  
});

//REFRESH CURRENT TIMES EVERY MINUTE WITHOUT RELOADING PAGE
setInterval(function () {

  // EMPTY TABLE
  $("#train-table > tbody").empty();

  // GET DATA FROM DATABASE AND POPLATE TABLE WITH IT

  database.ref().on("child_added", function (childSnapshot) {

    // COULD NOT GET THIS TO WORK
    // printSchedule();

    // break down information retrieved from database so each value has its own variable
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().first;
    var trainFreq = childSnapshot.val().frequency;

    // research subtracting one year a little more
    var trainFirstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(trainFirstTimeConverted), "minutes");

    // Time apart (remainder)
    var trainRemainder = diffTime % trainFreq;

    // Minute Until Train
    var trainMinutesTill = trainFreq - trainRemainder;

    // Next Train Calculation
    var trainNext = moment().add(trainMinutesTill, "minutes");

    // Next Train Format
    var formatTrainNext = moment(trainNext).format("hh:mm");

    // add data into html table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
      trainFreq + "</td><td>" + formatTrainNext + "</td><td>" + trainMinutesTill + "</td></tr>");

  })
}, 60000)