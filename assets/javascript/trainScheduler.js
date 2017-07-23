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

// var trainName = "RichTrain";
// var destination = "Atlanta";
// var trainStart = "10:00"
// var frequency = 15;

// Whenever a user clicks the submit button, we add the record into the database.
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "hh:mm").format("hh:mm");
  var frequency = parseInt($("#frequency-input").val().trim());

      console.log ("trainName : " + trainName);
      console.log(typeof trainName);
      console.log("Destination: " + destination);
      console.log(typeof destination);
      console.log("Start: " + trainStart);
      console.log(typeof trainStart);
      console.log("Frequency: " + frequency);
      console.log(typeof frequency);

  // Adding some form/input validations
  if (trainName.length == 0 || destination.length == 0 || trainStart.length == 0) {
      alert("All fields must be filled out");
      return; 
  };  

  if (trainStart == "Invalid date") {
    alert("Please input a valid First Train Time(HH:mm - military time).");
    return; 
  };  

  if (isNaN(frequency) || frequency < 1) {
    alert("Please input a valid frequency (min).");
    return; 
  };  

  database.ref().push({
    ftrainName: trainName,
    fdestination: destination,
    ftrainStart: trainStart,
    ffrequency: frequency
  });

  // Alert user that data has been successfully added into the Database.
  alert("Train Schedule added!");

  // Clear the form
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val(0);

  $(".train-row").empty();      
});

function refreshTable(){
// Get snapshot of Database when a record is added (child_added).
database.ref().on("child_added", function(childSnapshot, prevChildkey) {

    // Use console.log to see the value of snapshot
    console.log("childSnapshot: " + childSnapshot.val());
    console.log("prevChildkey: " + prevChildkey );

    // Store everything into a variable.
  var childKey = childSnapshot.key;
  var trainName = childSnapshot.val().ftrainName;
  var destination = childSnapshot.val().fdestination;
  var trainStart = childSnapshot.val().ftrainStart;
  var frequency = childSnapshot.val().ffrequency;

    // Train Info that is read from the databse
     console.log("childKey: " + childKey);
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
  // nextTrain = moment(nextTrain).format("hh:mm");
  nextTrain = moment(nextTrain).format("LT");

  // Add each train's data and display the info in the table
  $("#train-table > tbody").append("<tr id=\"myRow\" class=\"train-row\" data-key=" + childKey + "><td>" + trainName + "</td><td>" + destination + "</td><td>" +
     frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><tr>");
  
  }, function(errorObject) {

      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
});
};

// function updateDelete(){
//   var key = this.getAttribute("data-key");
//   if (confirm("Do you want to delete this row?") == true) {
//     console.log("You pressed OK!");
//     console.log(key);
//     database.ref(key).remove();
//     $(".train-row").empty();
//     refreshTable();
//   } else {
//     alert("You pressed Cancel!");
//     return;
//   }
// };

function updateDelete(){
  //event.preventDefault();

  // get the firebase key for the clicked row
  var key = this.getAttribute("data-key");
  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the row that opens the modal
  //var row = document.getElementById("myRow");

  var deleteBtn = document.getElementById("delete-train-btn");
  var cancelBtn = document.getElementById("cancel-train-btn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // open the modal 
  modal.style.display = "block";

  // When the user clicks on delete, delete the row and close the modal
  deleteBtn.onclick = function() {
    if (confirm("Are you sure you want to delete this row?") == true) {
      console.log("firebase db key: " + key)
      database.ref(key).remove();
      alert("Train data deleted!");
      modal.style.display = "none";
      $(".train-row").empty();
      refreshTable();
    } else {
      return;
    }
  };

  cancelBtn.onclick = function() {
    modal.style.display = "none";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  };

    // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }
};


$(document).on("click", ".train-row", updateDelete);

refreshTable();

