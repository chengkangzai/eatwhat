particleJS();
makeFloatOnParticle("content-wrapper");

$("#submitBtn").on('click', function() { addRecord(event) });

var tableCounter = 0;

function deleteFood(id) {
    db
        .doc(`user/${firebase.auth().currentUser.uid}/food/${id}`)
        .delete()
        .then(function(doc) {
            console.log(doc);
            getFromFirebase()
        })
        .catch(function(error) {
            console.log(error)
        })
}

function addRecord(event) {
    event.preventDefault();
    var foodLabel = $("#foodLabel");
    if (foodLabel.val() == "") {
        alert("You cant submit empty food");
    } else {
        db
            .collection(`user/${firebase.auth().currentUser.uid}/food`)
            .add({
                food: foodLabel.val(),
                user: firebase.auth().currentUser.uid
            })
            .then(function(response) {
                foodLabel.val("");
                getFromFirebase()
            })
            .catch(function(error) {
                console.log(error)
            });
    }
}

function renderFood(doc) {
    var data = doc.data();
    var dom = `
            <tr data-id="${doc.id}" id="row_${tableCounter}">
            <td>${data.food}</td>
            <td><a class="btn btn-danger text-white" onclick="deleteFood('${doc.id}')">Delete</a></td>
            </tr>
            `;
    $("#foodContainer").append(dom);
}

function clearTable() {
    $("#foodContainer").replaceWith(
        `<tbody id="foodContainer"></tbody>`
    );
}

function renderNoRecord() {
    var dom = `
            <tr rowspan="2">
                <td colspan="2" class="text-white text-center">
                    <h2>You have empty list!</h2>
                    <h5>Type few food that you like and hit enter to submit</h5>
                </td>
            </tr>
            `;
    $("#foodContainer").append(dom);
}

function helpToEnter(event) {
    if (event.keyCode == 13) { addRecord(event); }
}

function getFromFirebase() {
    db.collection("user")
        .doc(`${firebase.auth().currentUser.uid}`)
        .collection("food")
        .onSnapshot(snapShot => {
            clearTable();
            if (snapShot.empty) {
                renderNoRecord();
            }
            snapShot.docs.forEach(doc => {
                renderFood(doc);
                tableCounter++;
            })
            $("#tableCounter").text(tableCounter);
            tableCounter = 0;
        });
}

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../index.html";
    } else {
        getFromFirebase()
    }
});