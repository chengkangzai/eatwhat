particleJS();
makeFloatOnParticle("content-wrapper");

var food = [];
var tableCounter = 0;

$("#submitBtn").on('click', function() { addRecord(event) });
$("#findBtn").on('click', function() { chooseFood() });

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

function helpToEnter(event) {
    if (event.keyCode == 13) { addRecord(event); }
}

function renderFood(doc) {
    var data = doc.data();
    if (tableCounter <= 9) {
        var dom = `
            <tr data-id="${doc.id}" id="row_${tableCounter}">
            <td>${data.food}</td>
            <td><a class="btn btn-danger text-white" onclick="deleteFood('${doc.id}')">Delete</a></td>
            </tr>
            `;
        $("#foodContainer").append(dom);
    }
    tableCounter++;
}

function clearTable() {
    $("#foodContainer").replaceWith(
        `<tbody id="foodContainer"></tbody>`
    );
}

function chooseFood() {
    var j = 0
    var i = 0;
    var text = $("#resultFood");
    var interval = setInterval(change, 50);

    function change() {
        text.text(food[i]);
        if (i == food.length) {
            i = 0;
        } else {
            i++;
            j++;
        }
        if (j >= Math.floor(Math.random() * (100 - 70 + 1) + 70)) {
            clearInterval(interval);
        }
    }

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

function getFromFirebase() {
    db.collection("user")
        .doc(`${firebase.auth().currentUser.uid}`)
        .collection("food")
        .onSnapshot(snapShot => {
            clearTable();
            food = [];
            if (snapShot.empty) {
                renderNoRecord();
            }
            snapShot.docs.forEach(doc => {
                renderFood(doc);
                food.push(doc.data().food);
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