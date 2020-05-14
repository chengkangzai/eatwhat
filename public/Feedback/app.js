function submitFeedback() {
    var feedback = $("#feedbackValue");
    var timestamp = firebase.firestore.Timestamp.fromDate(new Date());

    // Add a new document in collection "cities"
    db.collection("feedback").add({
            "feedback": feedback.val(),
            "timestamp": timestamp,
            "user": firebase.auth().currentUser.email
        })
        .then(function() {
            alert("Thanks for your feedback !");
            feedback.val("");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            alert("What a shame... there is an error" + error);
        });
}

function checkIfIsEnter(event) {
    if (event.keyCode == 13) submitFeedback()
}

db.collection("feedback")
    .get()
    .then(function(snap) {
        $(".form-group").append(
            `<a class="btn btn-primary mt-3" href="read.html" role="button">View Feedback </a>`
        );
    })
particleJS();
makeFloatOnParticle("content-wrapper");