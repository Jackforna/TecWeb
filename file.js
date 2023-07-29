const toggleBtn = document.getElementById("toggle-btn");
const AccessBtn = document.getElementById("accessibility-btn");
const theme = document.getElementsByTagName("main");
let darkMode = localStorage.getItem("dark-mode");
let accessMode = localStorage.getItem("accessibility-mode");
var location;
var mess_length = 0;
var continua_input = false;
var link_insert = false;
let receiver_type;
let receiverValid = false;
let lista_individui = ["Giacomo","Gabriel"];
let lista_keyword = [];
let lista_canale = ["unibo"];
let lista_Canale = ["fuoricorso"];

const user = JSON.parse(localStorage.getItem("actualuser"));

window.onload = () => {
    document.getElementById("welcomemex").innerText = "Welcome "+ user.nickname;
    document.getElementById("fullnameprofile").value = user.fullname;
    document.getElementById("emailprofile").value = user.email;
    document.getElementById("passwordprofile").value = user.password;
    document.getElementById("cellprofile").value = user.cell;
}

var max_char = mx_char();
var max_char2 = max_char;  //variabile d'appoggio per verificare che i messaggi inviati non siano vuoti

let el_mess = [];

let mess = {        //dati messaggio
    sender : "",
    body : "",
    date : "",
    hour : "",
    pos_reactions : 0,
    neg_reactions : 0,
    url: "",
    location: "",
    category : undefined,
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

function public_mess(){
    if(max_char!=max_char2){
    const data = new Date();
    mess.sender = user.name;
    mess.body = document.getElementById("textmessaggio").value;
    mess.date = data.getDate() + "/" + (data.getMonth()+1) + "/" + data.getFullYear();
    let minutes = data.getMinutes();
    if(minutes<10){
        minutes = "0" + minutes;
    }
    mess.hour = data.getHours() + ":" + minutes;
    mess.pos_reactions = 0;
    mess.neg_reactions = 0;
    if(document.getElementById("urlmessaggio").value!=""){
    fetchURL(document.getElementById("urlmessaggio").value);
    }
    mess.url = document.getElementById("urlmessaggio").value;
    mess.location = document.getElementById("location").innerHTML;
    mess.category = undefined;                                               //fare in base alle reazioni
    mess.channels = document.getElementById("receivermessaggio").value;
    el_mess.unshift(mess);
    user.char_w -= max_char2 - max_char;
    user.char_m -= max_char2 - max_char;
    user.char_d -= max_char2 - max_char;
    } else {
        alert("The message is empty!");
    }
}

function search_mess(property, type){  //property deve essere del tipo mess.property quando viene passato
    let el_search_mess = el_mess.filter(mess => property === type);
    return(el_search_mess);
}

document.getElementById("locationbtn").addEventListener("click", ()=>{
    if(checkchar(125)){
        writeLocation();
    } else {
        alert("The number of your characters available has run out! An extra payment will be required for sending the message.");
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
    if(receiver_type==""){
        alert("inserire prima un destinatario valido");
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLocation);
        } else {
            alert("Geolocation not supported on this browser.");
        }
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
    if(data.address.house_number!=undefined){
    var road = data.address.road + ", " + data.address.house_number;
    } else {
        var road = data.address.road;
    }
    let city = data.address.city;
    let country = data.address.country;    
    if(document.getElementById("location").innerHTML == ""){
    document.getElementById("location").innerHTML += road + " " + city + " " + country;
    aggiorna_quota(-125);
    }
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
    if (receiver_type!="individuo"){
    max_char += x;
    document.getElementById("quotarimanente").innerText = "The remaining character quota is: " + max_char;
    }
}

function findreceiver_type(){
    let firstCharacter = document.getElementById("receivermessaggio").value.charAt(0);
    receiverValid = false;
    switch(firstCharacter){
        case "@":
            for(i=0;i<lista_individui.length;i++){
                if((document.getElementById("receivermessaggio").value).slice(1)==lista_individui[i]){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "visibility:hidden";
                return("individuo");
            }
            else return ("");
        case "#":
            for(i=0;i<lista_individui.length;i++){
                if((document.getElementById("receivermessaggio").value).slice(1)==lista_keyword[i]){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "visibility:visible";
                return("keyword");
            }
            else return ("");
        case "&":
            for(i=0;i<lista_individui.length;i++){
                if((document.getElementById("receivermessaggio").value).slice(1)==lista_canale[i]){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "visibility:visible";
                return("canale");
            }
            else return ("");
        case "$":
            for(i=0;i<lista_individui.length;i++){
                if((document.getElementById("receivermessaggio").value).slice(1)==lista_Canale[i]){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "visibility:visible";
                return("Canale");
            }
            else return ("");
        default:
            return("");
    }
}

document.getElementById("receivermessaggio").addEventListener("input", ()=>{
        document.getElementById("textmessaggio").value = "";
        max_char = mx_char();
        document.getElementById("quotarimanente").innerText = "The remaining character quota is: " + max_char;
        document.getElementById("locationdiv").style = "visibility:hidden";
        document.getElementById("locationbtn").style = "display:inline";
        document.getElementById("el_locationbtn").style = "display:none";
        document.getElementById("location").innerHTML = "";
        document.getElementById("urlmessaggio").value = "";
        document.getElementById("quotarimanente").style = "visibility:hidden";
        receiver_type = findreceiver_type();
})

document.getElementById("textmessaggio").addEventListener("input", ()=>{
    if(receiver_type==""){
        alert("inserire prima un destinatario valido");
        document.getElementById("textmessaggio").value = "";
    } else {
        let x = document.getElementById("textmessaggio").value.length;
        if (x>mess_length){
            if (checkchar(x-mess_length)){
                aggiorna_quota(mess_length-x);
            } else {
                if(continua_input==false){
                alert("The number of your characters available has run out! An extra payment will be required for sending the message.");
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
    }
});

document.getElementById("urlmessaggio").addEventListener("input", ()=>{
    if(receiver_type==""){
        alert("inserire prima un destinatario valido");
        document.getElementById("urlmessaggio").value = "";
    } else {
        if(checkchar(125)!=true){
            alert("The number of your characters available has run out! An extra payment will be required for sending the message.");
        }

        if(document.getElementById("urlmessaggio").value == ""){
            aggiorna_quota(125);
            link_insert = false;
        } else if(link_insert==false){
            aggiorna_quota(-125);
            link_insert = true;
        }
    }
});

async function fetchURL(url){ //migliorare
    try{
        const data = await fetch(url);
        const blob = await data.blob();
        const fileURL = URL.createObjectURL(blob);
    } catch {
        alert("Failed to download the link!");
    }
}

document.getElementById("buy_proversion").addEventListener("click", ()=>{
    document.getElementById("payment").style = "display:inline";
});

document.getElementById("sfondoopaco").addEventListener("click", ()=>{
    document.getElementById("payment").style = "display:none";
});

document.getElementById("esci").addEventListener("click", () =>{
    localStorage.removeItem("actualuser");
    window.location.href = 'accesso.html';
})