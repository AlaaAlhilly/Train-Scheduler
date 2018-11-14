$(document).ready(function(){

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
if (loggedEmail != null) {
    window.location.replace("schedule.html");
}
});
// Initialize Firebase

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
var emailNotFound = true;
function onGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;
            if (document.cookie['userEmail'] && document.cookie['userEmail'] == user.email) {
                window.location.replace("schedule.html");

            } else {
                createUser(user);
            }
        })
        .catch(console.log)


}
function createUser(user) {
    var admin = false;
    
    database.ref('/users').orderByChild('email').equalTo(user.email)
        .once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val().email);
                emailNotFound = false;
                document.cookie = 'userEmail='+ user.email;
                window.location.replace("schedule.html");
                return;
            }).then(function(){
                if(emailNotFound){
                    document.cookie = 'userEmail='+ user.email;
                    database.ref('/users').push({
                        email: user.email,
                        admin: admin
                    });
                    window.location.replace("schedule.html");
                }
            });
                
        });
        
    
}
function onGit() {
    const provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider)

    .then(result => {
        const user = result.user;
        if (document.cookie['userEmail'] && document.cookie['userEmail'] == user.email) {
            window.location.replace("schedule.html");

        } else {
            createUser(user);
        }
    })
    .catch(console.log)

}
