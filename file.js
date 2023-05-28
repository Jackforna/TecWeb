const toggleBtn = document.getElementById("toggle-btn");
const AccessBtn = document.getElementById("accessibility-btn");
const theme = document.getElementsByTagName("main");
let darkMode = localStorage.getItem("dark-mode");
let accessMode = localStorage.getItem("accessibility-mode");
var location;
var max_char;
var mess_length = 0;
var continua_input = false;

let user = {        //dati user
    name : "Jack",      
    password : "",
    fee_paid : 0,      //quota pagata dall'utente
    char_d : 300,      //caratteri disponibili al giorno
    char_w : 2000,     //caratteri disponibili a settimana
    char_m : 7000,     //caratteri disponibili al mese
}

let el_mess = [];

let mess = {        //dati messaggio
    body : "",
    destination : "",//#
    date : "",
    hour : "",
    pos_reactions : 0,
    neg_reactions : 0,
    image_url: "",
    video_url: "",
    location: "",
    category : "",
    channels : "",
}

const enableDarkMode = () => {
    for(i=0;i<theme.length;i++){
    theme[i].classList.add("dark-mode-theme");
    theme[i].classList.remove("dark-mode-toggle");
    }
    toggleBtn.classList.remove("dark-mode-toggle");
    localStorage.setItem("dark-mode", "enabled");
    toggleBtn.checked = true;
}

const enableAccessibilityMode = () =>{
    localStorage.setItem("accessibility-mode", "enabled");
    AccessBtn.checked = true;
}

const disableDarkMode = () => {
    for(i=0;i<theme.length;i++){
    theme[i].classList.add("dark-mode-toggle");
    theme[i].classList.remove("dark-mode-theme");
    }
    toggleBtn.classList.remove("dark-mode-theme");
    localStorage.setItem("dark-mode", "disabled");
    toggleBtn.checked = false;
}

const disableAccessibilityMode = () =>{
    localStorage.setItem("accessibility-mode", "disabled");
    AccessBtn.checked = false;
}

if(darkMode === "enabled"){
    enableDarkMode();
} else {
    localStorage.setItem("dark-mode", "disabled");
}

if(accessMode === "enabled"){
    enableAccessibilityMode();
} else {
    localStorage.setItem("accessibility-mode", "disabled");
}

toggleBtn.addEventListener("click", () =>{
    darkMode = localStorage.getItem("dark-mode");
    if(darkMode === "disabled"){
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

AccessBtn.addEventListener("click", () =>{
    accessMode = localStorage.getItem("accessibility-mode");
    if(accessMode === "disabled"){
        enableAccessibilityMode();
    } else {
        disableAccessibilityMode();
    }
});

document.getElementById("menubtn").addEventListener("click", ()=>{
    document.getElementById("menuoptions").style = "display:inline";
    document.getElementById("profileoptions").style = "display:none";
    document.getElementById("settingsoptions").style = "display:none";
});

document.getElementById("settingsbtn").addEventListener("click", ()=>{
    document.getElementById("menuoptions").style = "display:none";
    document.getElementById("profileoptions").style = "display:none";
    document.getElementById("settingsoptions").style = "display:inline";
});

document.getElementById("profilebtn").addEventListener("click", ()=>{
    document.getElementById("menuoptions").style = "display:none";
    document.getElementById("profileoptions").style = "display:inline";
    document.getElementById("settingsoptions").style = "display:none";
});

function homebtn(){
    document.getElementById("home").style = "display:inline";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("welcome").style = "display:none";
    document.getElementById("settings").style = "display:none";
}

function searchbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:inline";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
}

function squealerbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:inline";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
    max_char = mx_char();
    document.getElementById("quotarimanente").innerHTML = "The remaining character quota is: " + max_char;
}

function infoprofilebtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:inline";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
}

function favouritesbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:inline";
    document.getElementById("settings").style = "display:none";
}

function settingsbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:inline";
}

function public_mess(mess){

    el_mess.unshift(mess);
}

function search_mess(property, type){  //property deve essere del tipo mess.property quando viene passato
    let el_search_mess = el_mess.filter(mess => property === type);
    return(el_search_mess);
}

document.getElementById("locationbtn").addEventListener("click", ()=>{
    if(checkchar(125)){
        writeLocation();
    } else {
        alert("The number of yuor characters available has run out! An extra payment will be required for sending the message.");
        writeLocation();
    }
});

document.getElementById("el_locationbtn").addEventListener("click", ()=>{
    document.getElementById("locationdiv").style = "visibility:hidden";
    document.getElementById("locationbtn").style = "display:inline";
    document.getElementById("el_locationbtn").style = "display:none";
    document.getElementById("location").innerHTML = "";
    aggiorna_quota(125);
});

function writeLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocation);
    } else {
        alert("Geolocation not supported on this browser.");
    }
}

const getLocation = async (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let response = await fetch('https://nominatim.openstreetmap.org/reverse?lat='+latitude+'&lon='+longitude+'&format=json');

    let data = await response.json();
    document.getElementById("locationdiv").style = "visibility:visible";
    document.getElementById("locationbtn").style = "display:none";
    document.getElementById("el_locationbtn").style = "display:inline";
    aggiorna_quota(-125);
    if(data.address.house_number!=undefined){
    var road = data.address.road + ", " + data.address.house_number;
    } else {
        var road = data.address.road;
    }
    let city = data.address.city;
    let country = data.address.country;
    document.getElementById("location").innerHTML += road + " " + city + " " + country;
};

function mx_char(){
    if ((user.char_d<=user.char_w)&&(user.char_d<=user.char_m)){
        max_char = user.char_d;
    } else if (user.char_w<=user.char_m){
        max_char = user.char_w;
    } else {
        max_char = user.char_m;
    }
    return(max_char);
}

function checkchar(x){
    if(max_char>=x){
        return true;
    } else {
        return false;
    }
}

function aggiorna_quota(x){ 
    if (receiver_type()!="individuo"){
    max_char += x;
    document.getElementById("quotarimanente").innerText = "The remaining character quota is: " + max_char;
    }
}

function receiver_type(){
    //capire tipo del destinatario del messaggio e ritornare stringa con tipo
    return("canale"); //o Canale, pubblico, privato
}

document.getElementById("textmessaggio").addEventListener("input", (event)=>{
    let x = document.getElementById("textmessaggio").value.length;
    if (x>mess_length){
        if (checkchar(x-mess_length)){
            aggiorna_quota(mess_length-x);
        } else {
            if(continua_input==false){
            alert("The number of yuor characters available has run out! An extra payment will be required for sending the message.");
            continua_input = true;
            }
            aggiorna_quota(mess_length-x);
        }
    } else {
        aggiorna_quota(mess_length-x);
        if((continua_input==true)&&(max_char>=0)){
            continua_input = false;
        }
    }
    mess_length = x;
});