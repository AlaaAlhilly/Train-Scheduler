
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
                if (childSnapshot.val().email) {
                    document.cookie = 'userEmail='+ user.email;
                    setTimeout(window.location.replace("schedule.html"),2000);
                } else {
                    document.cookie = 'userEmail='+ user.email;
                    database.ref('/users').push({
                        email: user.email,
                        admin: admin
                    });
                    window.location.replace("schedule.html");
                }
            });
                document.cookie = 'userEmail='+ user.email;
                database.ref('/users').push({
                    email: user.email,
                    admin: admin
                });
                window.location.replace("schedule.html");
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