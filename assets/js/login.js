$(document).ready(function(){
//once the document is ready this function will be used to 
//read the email cookie saved
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
//loggedEmail will hold the email cookie
var loggedEmail = readCookie('userEmail');
//if there is cookie with the email will be directed to schedule page
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
//when google login clicked this function get called
function onGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;
            createUser(user);
        })
        .catch(console.log)
}
//this function will be used to redirect to next page or to create
//new user and then redirect to next page
async function createUser(user) {
    //get the user email from the provider
    var loggedEmail = user.email
    //prepare admin element to be false for any new user
    var admin = false;
    //emailNotFound will be used to check if this is new user
    var emailNotFound =true;
    //search the email if it is exist then just redirect hime
    //to schedule page
        database.ref('/users').orderByChild('email').equalTo(loggedEmail)
        .once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                emailNotFound = false;
                console.log(emailNotFound);
                document.cookie = 'userEmail='+ user.email;
                window.location.replace("schedule.html");
                return true;
            });
                
        },function(err){
            alert(err);
        });
        //if the user is not exist then a new user account will
        //be created in the database
        /**
         * i used await because javascript will jump and execute 
         * this code before the search for the email get done in firebase
         * which caused me a problem that make double records in the data base
         * using await let the search done then visit this code
         */
        //a function to push the new user to the database
        let a = await function(){
        if(emailNotFound){
            document.cookie = 'userEmail='+ user.email;
            database.ref(`/users`).push({
                email: user.email,
                admin: admin
            },function(err){
                console.log(err);
            });
            window.location.replace("schedule.html");
        }
    }
}
//this function called when the user use github auth
function onGit() {
    const provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider)

    .then(result => {
        const user = result.user;
        createUser(user);
    })
    .catch(console.log)

}
