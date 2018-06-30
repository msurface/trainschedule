$(document).ready(function(){
    //initialize firebase API
    //firebase website isn't working?
    var config = {
        apiKey: ,
        authDomain: " ",
        databaseURL: " ",
        projectId: " ",
        storageBucket: " ",
        messagingSenderId: " ",
    };
    firebase.initializeApp(config);

    //storing firebase method in a variable
    var database = firebase.database();

    //onclick function to store form variables
    $('#submit-button').on('click', function(){
        event.preventDefault();
        name = $('#train-name').val().trim();
        destination = $('#destination').val().trim();
        firstTrainTime = $('#first-train-time').val().trim();
        frequency = $('#frequency').val().trim();

        //creating an object to store above variables in firebase
        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        //making sure form values on index clear after submitting
        $('#train-name').val(' ');
        $('#destination').val(' ');
        $('#first-train-time').val(' ');
        $('#frequency').val(' ');

    });
    //function to get information from firebase and into my table
    database.ref().on("child_added", function(snapshot){
        snapshotValue = snapshot.val();

        //calculate when the next train will arrive from frequency time
        var nextArrival = moment(snapshotValue.firstTrainTime, "HH.mm");
        console.log("nextArrival: " + nextArrival);

        var frequency = snapshotValue.frequency;
        console.log("frequency: " + frequency);

        var ETA = frequency - (moment().diff(moment.unix(nextArrival, "HH.mm"), "minutes") % frequency);
        console.log("ETA: " + ETA);

        var waitingTime = moment().diff(moment.unix(nextArrival, "HH:mm"), "minutes");
        console.log("waitingTime: " + waitingTime);

        var nextTrain = parseInt((nextArrival) + ((waitingTime + ETA) * 60));
        console.log("nextTrain: " + nextTrain);

        var trainMessage = moment.unix(nextTrain).format("LT");
        console.log(trainMessage);

        // add each train's data into my table
        $('#train-table > tbody').append('<tr><td>' + name + '</td></tr>' + destination + '</td></tr>' + frequency + '</td></tr>' + ETA + '</td></tr>' + trainMessage + '</td></tr>');

    })
})