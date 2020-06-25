function logout() {
    firebase.auth().signOut()
        .then(function() {
            window.location.href = '../index.html';
        }).catch(function(error) {
            console.log(error)
        });
}