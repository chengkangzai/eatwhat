function renderFeedback(doc) {
    const data = doc.data();

    var timestamp, dom;
    (!data.timestamp) ? timestamp = "n/a":
        timestamp = new Date(data.timestamp.toDate()).toLocaleDateString('en-GB');

    (!data.user) ? username = "n/a":
        username = data.user;

    dom = `
    <tr id="${doc.id}">
        <td>${data.feedback}</td>
        <td>${timestamp}</td>
        <td>${username}</td>
        <td><a class="btn btn-danger text-white" onclick="deleteEntry('${doc.id}');">Delete </a></td>
    </tr>
    `;

    $('#feedback-list').append(dom);
    $('body').show();
}

function deleteEntry(docId) {
    db.collection("feedback")
        .doc(docId)
        .delete()
        .then(function() {
            console.log("Document successfully deleted!");
            $("#" + docId).hide();
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
}


db.collection('feedback')
    .get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            renderFeedback(doc);
        });
    }).catch(function(error) {
        if (error.code == "permission-denied") {
            window.location.href = "404.html";
        }
    });

particleJS()
makeFloatOnParticle("content-wrapper");