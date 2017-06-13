// Initialize Firebase (YOUR OWN APP)
// Make sure that your configuration matches your firebase script version

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBzFSRQxvW3qimlhJqp5zDZ2d_4bRvIcDM",
    authDomain: "employee-time-sheet-e495c.firebaseapp.com",
    databaseURL: "https://employee-time-sheet-e495c.firebaseio.com",
    projectId: "employee-time-sheet-e495c",
    storageBucket: "employee-time-sheet-e495c.appspot.com",
    messagingSenderId: "407524840032"
  };
  firebase.initializeApp(config);

// var database = ...
var database = firebase.database();


 

// We are now inside our .on function...    
// Console.log the "snapshot" value (a point-in-time representation of the database)
// This "snapshot" allows the page to get the most current values in firebase.
// Change the value of our clickCounter to match the value in the database
// ___________ = snapshot.val().______________________
// Console Log the value of the clickCounter
// Change the HTML using jQuery to reflect the updated clickCounter value
// Then include Firebase error logging
// HINT: }, function(errorObject)
// --------------------------------------------------------------
// Whenever a user clicks the click button
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    var  trainName = $("#train-name-input").val().trim();
    var destination = $("#detination-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "DD/MM/YY").format("X");
    var frequency = parseInt($("#frequency-input").val().trim());

      console.log ("trainName : " + trainName);
      console.log("Destination: " + destination);
      console.log("Start: " + trainStart);
      console.log("Frequency: " + frequency);

    database.ref().push({
   //       clickCount: clickCounter
      ftrainName: trainName,
      fdestination: destination,
      ftrainStart: trainStart,
      ffrequency: frequency
      });
      
  });

  database.ref().on("child_added", function(childSnapshot, prevChildkey) {

    // Then we console.log the value of snapshot
    console.log("childSnapshot:" + childSnapshot.val());

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().ftrainName;
    var destination = childSnapshot.val().fdestination;
    var trainStart = childSnapshot.val().ftrainStart;
    var frequency = childSnapshot.val().ffrequency;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(trainStart);
    console.log(frequency);

    // Prettify the train start
    var trainStartPretty = moment.unix(trainStart).format("MM/DD/YY");

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment.unix(empStart, "X"), "months");
    console.log(empMonths);

    // Calculate the total billed frequency
    var empBilled = empMonths * empRate;
    console.log(empBilled);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    trainStartPretty + "</td><td>" + trainMonths + "</td><td>" + frequency + "</td><td>" + empBilled + "</td></tr>");
  
    }, function(errorObject) {

      // In case of error this will print the error
      console.log("The read failed: " + errorObject.code);
    });

