//global variables
var username = "";
// var useremail = "";
var currentColor = 'black';
var userID = firebase.database().ref('images').push().key;;
var currentOption = "pencil";
var isPreview = false;
var imagesRef;
var timer = 0;
var isStarted = false;

//declare variables for DOM elements
var usernameDiv = document.getElementById("username_div");
var sketchDiv = document.getElementById("sketch_div");
var generateDiv = document.getElementById("generate_div");
var navDiv = document.getElementById("nav_div");
var shareDiv = document.getElementById("share_div");
// var backBtnDiv = document.getElementById("back_btn_div");

var usernameInput = document.getElementById("username_input");
// var emailInput = document.getElementById("email_input");
var usernameBtn = document.getElementById("username_confirm");

var sketchPanel = document.getElementById("sketch_panel");
var imageBtn = document.getElementById("image_confirm");
// var resetBtn = document.getElementById("reset_btn");
var optionBtnArr = document.getElementsByClassName("color_option");
var colorBtnArr = document.getElementsByClassName("color_btn");
var canvas = document.getElementById("defaultCanvas0");
var reviewCanvas = document.getElementById("review_canvas");

var previewBG = document.getElementById("generate_bg");
var previewImage = document.getElementById("generate_preview");
var saveBtn = document.getElementById("save_btn");
var imageBackBtn = document.getElementById("image_back_btn");

// var navUsername = document.getElementById("nav_username");
// var backBtn = document.getElementById("back_btn");
var naviBtnArr = document.getElementsByClassName("navi_btn");
var instruTitle = document.getElementById("instruction_title");
var instruP = document.getElementById("instruction_p");
var shareBtn = document.getElementById("share_btn");

// var downloadBtn = document.getElementById("share_btn_download");
var shareBackBtn = document.getElementById("share_btn_back");
var shareImg = document.getElementById("share_content_img");

// function makeNewPosition(){

//     // Get viewport dimensions (remove the dimension of the div)
//     var h = $(window).height() - 50;
//     var w = $(window).width() - 50;

//     var nh = Math.floor(Math.random() * h);
//     var nw = Math.floor(Math.random() * w);

//     return [nh,nw];

// }


//     setInterval(function(){
//         var newq = makeNewPosition();
//         $('.circle_animated').animate({ top: newq[0], left: newq[1] });
//     }, 2000);



//save username
usernameBtn.addEventListener("click", function(){
    // if(usernameInput.value && emailInput.value){
    if(usernameInput.value){
        // backBtnDiv.setAttribute("style", "height: 40px");
        username = usernameInput.value;
        // useremail = emailInput.value;
        usernameDiv.setAttribute("class", "div_hide");
        sketchDiv.setAttribute("class", "div_show");
        clear();
    }else{
        // alert("Please leave your name and email!")
        alert("Please leave your name!")
    }
})

//reset canvas
// resetBtn.addEventListener("click", function(){
//     var confirmed = confirm("Reset the master piece?");
//     if(confirmed){
//         clear();
//     };
// })

//generate the preview of canvas
imageBtn.addEventListener("click", function(){
    isPreview = true;

    reviewCanvas.height = 100;
    reviewCanvas.width = 100;
    reviewCanvas.getContext('2d').fillStyle = "white";
    reviewCanvas.getContext('2d').fillRect(0, 0, 100, 100);
    reviewCanvas.getContext('2d').drawImage(canvas, 0, 0, 100, 100);

    // var img = new Image();
    // img.onload = function(){
        //     reviewCanvas.src = img.src;
        // }
        // img.src = reviewCanvas.toDataURL

    var imageUri = reviewCanvas.toDataURL();
    var previewUri = canvas.toDataURL();

    reviewCanvas.setAttribute("style", "height: 0");
    reviewCanvas.setAttribute("style", "width: 0");

    sketchDiv.setAttribute("class", "div_hide");
    generateDiv.setAttribute("class", "div_show");
    previewBG.style.height = window.innerWidth - 36 + "px";
    previewBG.style.width = window.innerWidth - 36 + "px";
    previewImage.style.height = "100%";
    previewImage.style.width = "100%";
    previewImage.style.backgroundImage = `url(${previewUri})`;
    previewImage.style.backgroundSize = "contain";
    previewImage.style.backgroundPosition = "center";
})

//return to canvas to keep drawing
imageBackBtn.addEventListener("click", function(){
    isPreview = false;
    generateDiv.setAttribute("class", "div_hide");
    sketchDiv.setAttribute("class", "div_show");
})

//save canvas with the name of input username
saveBtn.addEventListener("click", function(){
    // save(username + '.png');
    // saveToStorage(username, useremail, reviewCanvas);
    saveToStorage(username, reviewCanvas);
    generateDiv.setAttribute("class", "div_hide");
    // navUsername.innerHTML = username;
    navDiv.setAttribute("class", "div_show");

})

//click title to hide instruction
instruTitle.addEventListener("click", function(){
    if(instruP.style.height === "0px"){
        instruTitle.innerHTML = "CONTROL INFO <i class='fas fa-minus-square'></i>";
        instruP.setAttribute("style", "height: fit-content");
    }else{
        instruTitle.innerHTML = "CONTROL INFO <i class='fas fa-plus-square'></i>"
        instruP.style.height = 0;
    }
})

//give color option button event listeners
for(var i = 0; i < optionBtnArr.length; i ++){
    optionBtnArr[i].addEventListener("click", function(){
        currentOption = this.getAttribute("value");
        changeSelectedOptionBtn();
    })
};

function changeSelectedOptionBtn(){
    for(var i = 0; i < optionBtnArr.length; i ++){
        if(optionBtnArr[i].getAttribute("value") == currentOption){
            optionBtnArr[i].setAttribute("class", "color_option color_option_selected");
        }else{
            optionBtnArr[i].setAttribute("class", "color_option color_option_normal");
        }
    }
}

//change current color
for(var i = 0; i < colorBtnArr.length; i ++){
    colorBtnArr[i].addEventListener("click", function(){
        currentColor = this.getAttribute("value");
        changeSelectedColorBtn();
    })
}

function changeSelectedColorBtn(){
    for(var i = 0; i < colorBtnArr.length; i ++){
        if(colorBtnArr[i].getAttribute("value") == currentColor){
            colorBtnArr[i].setAttribute("class", "color_btn color_btn_selected");
        }else{
            colorBtnArr[i].setAttribute("class", "color_btn color_btn_normal");
        }
    }
}

//back to first page function
// backBtn.addEventListener("click", function(){
//     var confirmed = confirm("Want a brand new design?");
//     if(confirmed){
//         username = "";
//         useremail = "";
//         navUsername.innerHTML = "";
//         usernameInput.value = "";
//         // emailInput.value = "";

//         sketchDiv.setAttribute("class", "div_hide");
//         navDiv.setAttribute("class", "div_hide");
//         usernameDiv.setAttribute("class", "div_show");
//         // backBtnDiv.setAttribute("style", "height: 0");
//     };
// })

//share button on nav page
shareBtn.addEventListener("click", function(){
    navDiv.setAttribute("class", "div_hide");
    shareDiv.setAttribute("class", "div_show");
    isStarted = false;
    timer = 0;

    var userData;

    firebase.database().ref('images/' + userID).once('value')
    .then(function(snapshot){
        userData = snapshot.val();
        firebase.database().ref('images/' + userID).update({
            isRetrieving: true,
        })
    })
    .then(function(){
        var currentRef = firebase.database().ref('images/' + userID);
        currentRef.on("child_added", function(snapshot){
            if(snapshot.key == "shareImg"){
                shareImg.setAttribute("src", snapshot.val());
                // downloadBtn.setAttribute("href", snapshot.val());
                firebase.database().ref('images/' + userID).update({
                    isRetrieving: false,
                })
            }
        })
    })
})

//back button on share page
shareBackBtn.addEventListener("click", function(){
    shareDiv.setAttribute("class", "div_hide");
    navDiv.setAttribute("class", "div_show");
    firebase.database().ref('images/' + userID).once('value')
    .then(function(snapshot){
        userData = snapshot.val();
        firebase.database().ref('images/' + userID).set({
            username: userData.username,
            // email: userData.email,
            imageUri: userData.imageUri,
            isRetrieving: false,
            xForce: 0,
            yForce: 0,
            zForce: 0
        })
    })
    shareImg.setAttribute("src", "Images/loading_img.png");
    isStarted = true;
})

//-------------p5 stuff --------------
//set up canvas
function setup() {
    var newCanvas;
    newCanvas = createCanvas(window.innerWidth - 36, window.innerWidth - 36);
    newCanvas.parent(sketchPanel);
}

function draw() {
    ctx = canvas.getContext("2d");

    if (mouseIsPressed && !isPreview) {
        canvas.ontouchmove = (e) => {
            e.preventDefault();
        }
        if(currentOption == "pencil"){
            ctx.globalCompositeOperation = "source-over";
            stroke(currentColor);
            strokeWeight(10);
            line(mouseX, mouseY, pmouseX, pmouseY);
        }else if(currentOption == "square"){
            fill(currentColor);
            noStroke();
            square(mouseX, mouseY, 20, 10);
        }else{
            ctx.beginPath();
            ctx.globalCompositeOperation = "destination-out";
            // ctx.arc(mouseX, mouseY,10,0,Math.PI*2,false);
            // ctx.fill();
            stroke(currentColor);
            strokeWeight(10);
            line(mouseX, mouseY, pmouseX, pmouseY);
        }
    }
}
//----------------------------------------

//save username, email and url (generated by firebase storage) to firebase database
// function writeUserImage(user, email, url){
function writeUserImage(user, url){
    imagesRef = firebase.database().ref('images/' + userID);
    imagesRef.set({
        username: user,
        // email: email,
        imageUri: url,
        isRetrieving: false,
        xForce: 0,
        yForce: 0,
        zForce: 0
    })

    imagesRef.onDisconnect().remove();

    var userInfoRef = firebase.database().ref('info/' + userID);
    userInfoRef.set({
        username: user,
        // email: email,
        imageUri: url
    });
}

//store canvas as image to firebase storage, generate a url for firebase database
// function saveToStorage(user, email, element){
function saveToStorage(user, element){
    // startCounting();
    isStarted = true;
    // userID = firebase.database().ref('images').push().key;
    var storageRef = firebase.storage().ref('Images/' + userID);
    element.toBlob(function(blob){
        storageRef.put(blob)
        .then(function(snapshot){
            snapshot.ref.getDownloadURL().then(function(downloadURL) {
                // writeUserImage(user, email, downloadURL);
                writeUserImage(user, downloadURL);
                assignNaviBtns(userID);
            });
        });
    })
}

//assign navigation button functions
function assignNaviBtns(id){
    var userRef = firebase.database().ref('images/' + id);
    var userData = {};
    firebase.database().ref('images/' + id)
    .once('value')
    .then(function(snapshot){
        userData = snapshot.val();
        for(var i = 0; i < naviBtnArr.length; i ++){
            switch (naviBtnArr[i].getAttribute("name")){
                case "xforce_btn":
                    naviBtnArr[i].addEventListener("mousedown", function(){
                        timer = 0;
                        userRef.update({
                            xForce: this.value
                        })
                    });
                    naviBtnArr[i].addEventListener("touchstart", function(){
                        timer = 0;
                        userRef.update({
                            xForce: this.value,
                        })
                    });
                    break;
                case "yforce_btn":
                    naviBtnArr[i].addEventListener("mousedown", function(){
                        timer = 0;
                        userRef.update({
                            yForce: this.value,
                        })
                    });
                    naviBtnArr[i].addEventListener("touchstart", function(){
                        timer = 0;
                        userRef.update({
                            yForce: this.value,
                        })
                    });
                    break;
                case "zforce_btn":
                    naviBtnArr[i].addEventListener("mousedown", function(){
                        timer = 0;
                        userRef.update({
                            zForce: this.value
                        })
                    });
                    naviBtnArr[i].addEventListener("touchstart", function(){
                        timer = 0;
                        userRef.update({
                            zForce: this.value
                        })
                    });
                    break;
                default:
                 break;
            }
            naviBtnArr[i].addEventListener("mouseup", function(){
                userRef.update({
                    xForce: 0,
                    yForce: 0,
                    zForce: 0
                })
            });
            naviBtnArr[i].addEventListener("touchend", function(){
                userRef.update({
                    xForce: 0,
                    yForce: 0,
                    zForce: 0
                })
            });
        }
    })
}

// var startCounting = function(){
    setInterval(function(){
        if(timer >= 120 && isStarted){
            firebase.database().ref("images/" + userID).remove();
            // username = "";
            // currentColor = 'black';
            // userID = firebase.database().ref('images').push().key;;
            // currentOption = "pencil";
            // isPreview = false;
            timer = 0;
            isStarted = false;
            // sketchDiv.setAttribute("class", "div_hide");
            // generateDiv.setAttribute("class", "div_hide");
            // navDiv.setAttribute("class", "div_hide");
            // usernameDiv.setAttribute("class", "div_show");
            alert("It's been for a while. Please design your new light sail!");
            location.reload();
            return;
        }else if(timer < 120 && isStarted){
            timer += 1;
            // console.log(timer);
        }
    }, 1000);
// }
