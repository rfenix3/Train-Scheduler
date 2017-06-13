// Initialize Firebase (YOUR OWN APP)
// Make sure that your configuration matches your firebase script version

 // Initialize Firebase

var config = {
  apiKey: "AIzaSyB_br14_idfL-dAmM0Jw9_tddwYcTUJ7TI",
  authDomain: "train-scheduler-cfd7e.firebaseapp.com",
  databaseURL: "https://train-scheduler-cfd7e.firebaseio.com",
  projectId: "train-scheduler-cfd7e",
  storageBucket: "train-scheduler-cfd7e.appspot.com",
  messagingSenderId: "851125449790"
};

firebase.initializeApp(config);

// var database = ...
var database = firebase.database();

var trainName = "RichTrain";
var destination = "Atlanta";
var trainStart = "10:00"
var frequency = 15;

// Whenever a user clicks the submit button, we add the record into the database.
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "hh:mm").format("hh:mm");
  var frequency = parseInt($("#frequency-input").val().trim());

      // console.log ("trainName : " + trainName);
      // console.log("Destination: " + destination);
      // console.log("Start: " + trainStart);
      // console.log("Frequency: " + frequency);

  database.ref().push({
    ftrainName: trainName,
    fdestination: destination,
    ftrainStart: trainStart,
    ffrequency: frequency
  });

    //console.log("push success!");
      
});

// Get snapshot of Database when a record is added (child_added).
database.ref().on("child_added", function(childSnapshot, prevChildkey) {

    // Use console.log to see the value of snapshot
    // console.log("childSnapshot:" + childSnapshot.val());

    // Store everything into a variable.
  var trainName = childSnapshot.val().ftrainName;
  var destination = childSnapshot.val().fdestination;
  var trainStart = childSnapshot.val().ftrainStart;
  var frequency = childSnapshot.val().ffrequency;

    // Train Info that is read from the databse
    // console.log("trainName: " + trainName);
    // console.log("destination: " + destination);
    // console.log("trainStart: " + trainStart);
    // console.log("frequency: " + frequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
  var trainStartConverted = moment(trainStart, "hh:mm").subtract(1, "years");
  // console.log("trainStartConverted: " + trainStartConverted);

    // Current Time
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(trainStartConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  // console.log("tRemainder is " + tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  nextTrain = moment(nextTrain).format("hh:mm");

  // Add each train's data and display the info in the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
     frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><tr>");
  
  }, function(errorObject) {

      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
});

