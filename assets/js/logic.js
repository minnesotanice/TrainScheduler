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


  // console.log("///////////////////////////////////////////////");

  // console.log("trainName is " + trainName);

  // console.log("trainDest is " + trainDest);

  // console.log("trainFirstTime is " + trainFirstTime);

  // console.log("trainFreq as entered: " + trainFreq);

  // console.log("trainFirstTimeConverted is " + trainFirstTimeConverted);

  // console.log("currentTime is " + currentTime);

  // console.log("currentTime with formatting " + moment(currentTime).format("hh:mm"));

  // console.log("diffTime " + diffTime);

  // console.log("trainRemainder is " + trainRemainder);

  // console.log("trainNext is " + trainNext);

  // console.log("trainNext formatted is " + moment(trainNext).format("hh:mm"));

  // console.log("trainMinutesTill is " + trainMinutesTill);

  // console.log("trainNextArrival is " + trainNextArrival);

  // console.log("trainMinAway is " + trainMinAway);

  // console.log("///////////////////////////////////////////////");


  // create tempoary object to hold submitted data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    first: trainFirstTime,
    frequency: trainFreq,
    arrival: trainNext,
    minutes: trainMinutesTill
  };

  // push to database
  database.ref().push(newTrain);

  // data from database logged to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.first);
  // console.log(newTrain.frequency);
  // console.log(newTrain.arrival);
  // console.log(newTrain.minutes);

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

  // console.log(childSnapshot.val());

  // break down information retrieved from database so each value has its own variable
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainFirstTime = childSnapshot.val().first;
  var trainFreq = childSnapshot.val().frequency;
  var trainNext = childSnapshot.val().arrival;
  var trainMinutesTill = childSnapshot.val().minutes;

  // console the variables to check for accuracy
  // console.log(trainName);
  // console.log(trainDest);
  // console.log(trainFirstTime);
  // console.log(trainFreq);
  // console.log(trainNext);
  // console.log(trainMinutesTill);

  // add data into html table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    trainFreq + "</td><td>" + trainNext + "</td><td>" + trainMinutesTill + "</td></tr>");
});