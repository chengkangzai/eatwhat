var uploader = $("#progressBar");
var fileBtn = $("#fileBtn");

fileBtn.on('change', e => {
    //Get File 
    var file = e.target.files[0];
    console.log(file);
    //Create storage ref
    const storageRef = firebase.storage().ref("pic/" + file.name);
    //Upload file 

    var task = storageRef.put(file);
    //Update progress bar
    task.on('state_changed',
        function progress(snap) {
            var percentage = (snap.byteTransferred / snap.totalBytes) * 100;
            uploader.value = percentage;
        },
        function() {
            task.snapshot.ref.getDownloadURL().then(downloadUrl => {
                console.log(downloadUrl);
            })
        },
    )
});

particleJS()
makeFloatOnParticle("content-wrapper");