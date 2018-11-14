$(document).ready(function () {
  
  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
var loggedEmail = readCookie('userEmail');
if(loggedEmail == null){
  $('.sign').show();
  $('.asign').hide();
}else{
  $('.sign').hide();
  $('.asign').show();
}
console.log(loggedEmail);
  var userIsAdmin = false;
  var config = {
    apiKey: "AIzaSyATzuQ-rguhSoRNnC3tYT_PuCKYcHeDlB0",
    authDomain: "train-schedular-5c12b.firebaseapp.com",
    databaseURL: "https://train-schedular-5c12b.firebaseio.com",
    projectId: "train-schedular-5c12b",
    storageBucket: "train-schedular-5c12b.appspot.com",
    messagingSenderId: "628379246469"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  database.ref('/users').orderByChild('email').equalTo(loggedEmail)
    .once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().admin) {
          userIsAdmin = true;
          $('.toDis').css('display', 'block');
          $('.toDisb').css('display', 'table-cell');
        }
      });
    }, function (error) {
      window.location.replace('index.html');
    });
  // Create a variable to reference the database.
  var database = firebase.database();

  // Initial Values
  var trainName = "";
  var destination = "";
  var nextTimeTrain = "";
  var frequency = "";
  var minutesAway = 0;
  var rowid = 0;
  // Capture Button Click
  $("#submit").on("click", function (event) {
    if (!userIsAdmin) {
      alert("you are not allowed to edit the database");
      return false;
    }
    event.preventDefault();

    // Grabbed values from text boxes
    trainName = $("#trainname").val().trim();
    destination = $("#destination").val().trim();
    timeInput = moment($("#ftt").val().trim(), "HH:mm").subtract(10, "years").format("X");;

    frequency = $("#frequency").val().trim();

    // Code for handling the push
    database.ref('/trains').push({
      trainName,
      destination,
      timeInput,
      frequency,
      rowid,
    });
    rowid++;
    $("#trainname").val("");
    $("#destination").val("");
    $("#ftt").val("");
    $("#frequency").val("");


  });

  // Firebase watcher .on("child_added"
  database.ref('/trains').on("child_added", function (snapshot) {
    var sv = snapshot.val();


    var timediff = moment().diff(moment.unix(sv.timeInput), "minutes");
    var remainmins = moment().diff(moment.unix(sv.timeInput), "minutes") % sv.frequency;
    var minutes = sv.frequency - remainmins;

    var nextTrainTime = moment().add(minutes, "m").format("hh:mm A");

    $('tbody').append(
      `<tr>
        <th id="tname" data-content=${sv.rowid} contenteditable>${sv.trainName}</th>
        <td id="dest" data-content=${sv.rowid} contenteditable>${sv.destination}</td>
        <td id="frq" data-content=${sv.rowid} contenteditable>${sv.frequency}</td>
        <td id="ntt" data-content=${sv.rowid}>${nextTrainTime}</td>
        <td id="mn" data-content=${sv.rowid}>${minutes}</td>
        <td class="toDisb">
          <button data-content="${sv.rowid}" id="up" class="btn btn-primary btn-xs" >
            <i class="fa fa-pencil-square-o"></i>update
          </button>
        </td>
        <td class="toDisb">
          <button data-content="${sv.rowid}" id="del" class="btn btn-danger btn-xs">
            <i class="fa fa-eraser"></i>delete
          </button>
        </td>
      </tr>`

    );
    if(!userIsAdmin){
      $('.toDis').css('display', 'none');
      $('.toDisb').css('display', 'none');
    }

    // Handle the errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
  $('tbody').on('click', '#del', function () {
    console.log($(this).attr('data-content'));
    database.ref('/trains').orderByChild('rowid').equalTo(parseInt($(this).attr('data-content')))
      .once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          //remove each child
          database.ref('trains').child(childSnapshot.key).remove();
          location.reload();
        });
      }, function (error) {
        alert("you are not allowed to edit the database");
      });
  });
  $('tbody').on('click', '#up', function () {
    console.log($(this).attr('data-content'));
    database.ref('/trains').orderByChild('rowid').equalTo(parseInt($(this).attr('data-content')))
      .once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          //remove each child
          database.ref('/trains').child(childSnapshot.key).update({
            trainName: $('tbody').find('#tname').text(),
            destination: $('tbody').find('#dest').text(),
            frequency: $('tbody').find('#freq').text(),
            minutesAway: $('tbody').find('#mn').text(),
            rowid,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
          });
          location.reload();
        });
      }, function (error) {
        alert("you are not allowed to edit the database");
      });
  });
});
var delete_cookie = function(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
function signout(){
  firebase.auth().signOut().then(function() {
   delete_cookie('userEmail');
    window.location.replace('index.html');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
}