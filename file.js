const toggleBtn = document.getElementById("toggle-btn");
const AccessBtn = document.getElementById("accessibility-btn");
const theme = document.getElementsByTagName("main");
let darkMode = localStorage.getItem("dark-mode");
let accessMode = localStorage.getItem("accessibility-mode");
var location;
var mess_length = 0;
var continua_input = false;
var link_insert = false;
let receiver_type = "";
let receiverValid = false;
let messagesnewgroup = 0;

//ogni user è composto da nickname, fullname, email, cell, password, version, char_d, char_w, char_m : 7000
//ogni messaggio è composto da sender, body, date, hour, pos_reactions, neg_reactions, url, location, category, channels
//ogni gruppo è composto da name,type,list_mess,creator,silenceable,list_users, list_modifier
//ogni list_mess è composto da un messaggio(con tutte le componenti),type(temporizzato o no)

if(!localStorage.getItem("lista_gruppi")){
    localStorage.setItem("lista_gruppi",JSON.stringify([]));
}
let lista_gruppi = JSON.parse(localStorage.getItem("lista_gruppi"));

if(!localStorage.getItem("lista_messaggi")){
    localStorage.setItem("lista_messaggi",JSON.stringify([]));
}
let lista_messaggi = JSON.parse(localStorage.getItem("lista_messaggi"));

let user = JSON.parse(localStorage.getItem("actualuser"));
let users = JSON.parse(localStorage.getItem("users"));

window.onload = () => {
    document.getElementById("welcomemex").innerText = "Welcome "+ user.nickname;
    document.getElementById("fullnameprofile").value = user.fullname;
    document.getElementById("emailprofile").value = user.email;
    document.getElementById("passwordprofile").value = user.password;
    document.getElementById("cellprofile").value = user.cell;
}

var max_char = mx_char();
var max_char2 = max_char;  //variabile d'appoggio per verificare che i messaggi inviati non siano vuoti


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
    document.getElementById("payment").style = "display:none";
}

function searchbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:inline";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
    document.getElementById("payment").style = "display:none";
}

function squealerbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:inline";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
    document.getElementById("quotarimanente").innerHTML = "The remaining character quota is: " + max_char;
    document.getElementById("newgroup").style = "display:none";
    document.getElementById("messaggio").style = "display:none";
    document.getElementById("squealer_page").style = "display:flex";
    document.getElementById("payment").style = "display:none";
}

function infoprofilebtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:inline";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
    document.getElementById("payment").style = "display:none";
}

function favouritesbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:inline";
    document.getElementById("settings").style = "display:none";
    document.getElementById("payment").style = "display:none";
}

function settingsbtn(){
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:inline";
    document.getElementById("payment").style = "display:none";
}

function public_mess(){
    
    if(max_char!=max_char2){
    const data = new Date();
    let sender = user.nickname;
    let body = document.getElementById("textmessaggio").value;
    let date = data.getDate() + "/" + (data.getMonth()+1) + "/" + data.getFullYear();
    let minutes = data.getMinutes();
    if(minutes<10){
        minutes = "0" + minutes;
    }
    let hour = data.getHours() + ":" + minutes;
    if(document.getElementById("urlmessaggio").value!=""){
    fetchURL(document.getElementById("urlmessaggio").value);
    }
    let url = document.getElementById("urlmessaggio").value;
    let location = document.getElementById("location").innerHTML;
    let channels = document.getElementById("receivermessaggio").value;
    user.char_w -= max_char2 - max_char;
    user.char_m -= max_char2 - max_char;
    user.char_d -= max_char2 - max_char;
    lista_messaggi.push({sender:sender, body:body, date:date, hour:hour, pos_reactions:0, neg_reactions:0, url:url, location:location, category:undefined, channels:channels});
    localStorage.setItem("lista_messaggi",JSON.stringify(lista_messaggi));
    localStorage.setItem("actualuser",JSON.stringify(user));
    for(i=0;i<users.length;i++){
        if(user.nickname==users[i].nickname){
            users[i]=user;
            localStorage.setItem("users",JSON.stringify(users));
        }
    }
    document.getElementById("textmessaggio").value = "";
    document.getElementById("urlmessaggio").value = "";
    document.getElementById("location").innerHTML = "";
    document.getElementById("receivermessaggio").value = "";
    document.getElementById("locationdiv").style = "visibility:hidden";
    document.getElementById("quotarimanente").style = "display:none";
    } else {
        alert("The message is empty!");
    }
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
            for(i=0;i<lista_gruppi.length;i++){
                if((lista_gruppi[i].type==firstCharacter)&((document.getElementById("receivermessaggio").value).slice(1)==lista_gruppi[i].name)&((document.getElementById("receivermessaggio").value).slice(1)!=user.nickname)){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "display:none";
                return("individuo");
            }
            else return ("");
        case "#":
            for(i=0;i<lista_gruppi.length;i++){
                if((lista_gruppi[i].type==firstCharacter)&((document.getElementById("receivermessaggio").value).slice(1)==lista_gruppi[i].name)){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "display:inline";
                return("keyword");
            }
            else return ("");
        case "&":
            for(i=0;i<lista_gruppi.length;i++){
                if((lista_gruppi[i].type==firstCharacter)&((document.getElementById("receivermessaggio").value).slice(1)==lista_gruppi[i].name)){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "display:inline";
                return("canale");
            }
            else return ("");
        case "$":
            for(i=0;i<lista_gruppi.length;i++){
                if((lista_gruppi[i].type==firstCharacter)&((document.getElementById("receivermessaggio").value).slice(1)==lista_gruppi[i].name)){
                    receiverValid = true;
                }
            }
            if(receiverValid==true){
                document.getElementById("quotarimanente").style = "display:inline";
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
        document.getElementById("quotarimanente").style = "display:none";
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
    document.getElementById("home").style = "display:none";
    document.getElementById("search").style = "display:none";
    document.getElementById("squealer").style = "display:none";
    document.getElementById("infoprofile").style = "display:none";
    document.getElementById("favourites").style = "display:none";
    document.getElementById("settings").style = "display:none";
});

document.getElementById("esci").addEventListener("click", () =>{
    localStorage.removeItem("actualuser");
    window.location.href = 'accesso.html';
});

document.getElementById("creategroup").addEventListener("click", ()=>{
    document.getElementById("newgroup").style = "display:flex";
    document.getElementById("squealer_page").style = "display:none";
});

document.getElementById("createsqueal").addEventListener("click", ()=>{
    document.getElementById("messaggio").style = "display:flex";
    document.getElementById("squealer_page").style = "display:none";
});

document.getElementById("creationgroup").addEventListener("click", ()=>{
    let isValid = true;
    let name = document.getElementById("namenewgroup").value;
    //controllo validità nome gruppo
    for(i=0;i<lista_gruppi.length;i++){
        if(name==lista_gruppi[i].name){   //per evitare che ci siano più gruppi con lo stesso nome
            isValid = false;
            alert("Name already used");
        }
    }
    let type = document.getElementById("typenewgroup").value;
    let creator = user.nickname;
    let list_mess = [];
    for(i=0;i<messagesnewgroup;i++){
        let body_mess = document.getElementById("bodymessgroup"+(i+1)).innerText;
        let type_mess = document.getElementById("typemessgroup"+(i+1)).innerText;
        let request_mess;
        let time_mess; 
        switch(type_mess){
            case "answer":
            request_mess = document.getElementById("requestmessgroup"+(i+1)).innerHTML;
            list_mess.push({body_mess:body_mess,type_mess:type_mess,time_mess:undefined,request_mess:request_mess});
            break;
        case "reminder":
            time_mess = document.getElementById("timemessgroup"+(i+1)).innerHTML;
            list_mess.push({body_mess:body_mess,type_mess:type_mess,time_mess:time_mess,request_mess:undefined});
            break;
        default:
            list_mess.push({body_mess:body_mess,type_mess:type_mess,time_mess:undefined,request_mess:undefined});
            break;
        }
        
    }
    //controllo lista messaggi del gruppo, almeno 3
    if(messagesnewgroup<3){
        isValid = false;
        alert("All the groups must have at least 3 automatic messages");
    }
    let silenceable;
    if(document.getElementById("silenceablenewgroup").checked){
        silenceable = true;
    } else {
        silenceable = false;
    }
    if(isValid){
    lista_gruppi.push({name:name, type:type, list_mess:list_mess, creator:creator, silenceable:silenceable, list_users:[creator], list_modifier:[creator]});
    localStorage.setItem("lista_gruppi",JSON.stringify(lista_gruppi));
    alert("Gruppo "+name+" creato con successo!");
    document.getElementById("namenewgroup").value = "";
    document.getElementById("messagesnewgroup").innerHTML = "<label>Add messages</label>";
    messagesnewgroup = 0;
    }
})

document.getElementById("addmessagesnewgroup").addEventListener("click", ()=>{
    document.getElementById("newgroup").style = "display:none";
    document.getElementById("messagegroup").style = "display:flex";
});

document.getElementById("addmessage").addEventListener("click", ()=>{
    let body = document.getElementById("bodymessagegroup").value;
    let type = document.getElementById("typemessagegroup").value;
    let request = document.getElementById("requestmessagegroup").value;
    let time = document.getElementById("timemessagegroup").value;
    if(body!=""){
    messagesnewgroup += 1;
    switch(type){
        case "answer":
            if(request!=""){
            document.getElementById("messagesnewgroup").innerHTML += '<div id="messgroup'+messagesnewgroup+'" class="messgroup"><p id="bodymessgroup'+messagesnewgroup+'">'+body+'</p><p id="typemessgroup'+messagesnewgroup+'">'+type+'</p><p id="requestmessgroup'+messagesnewgroup+'">'+request+'</p></div>';
            } else {
                alert("Please insert the request message of the client");
            }
            break;
        case "reminder":
                document.getElementById("messagesnewgroup").innerHTML += '<div id="messgroup'+messagesnewgroup+'" class="messgroup"><p id="bodymessgroup'+messagesnewgroup+'">'+body+'</p><p id="typemessgroup'+messagesnewgroup+'">'+type+'</p><p id="timemessgroup'+messagesnewgroup+'">'+time+'</p></div>';
            break;
        default:
            document.getElementById("messagesnewgroup").innerHTML += '<div id="messgroup'+messagesnewgroup+'" class="messgroup"><p id="bodymessgroup'+messagesnewgroup+'">'+body+'</p><p id="typemessgroup'+messagesnewgroup+'">'+type+'</p></div>';
            break;
    }
    document.getElementById("newgroup").style = "display:flex";
    document.getElementById("messagegroup").style = "display:none";
    document.getElementById("bodymessagegroup").value = "";
    document.getElementById("requestmessagegroup").value = "";
    } else {
        alert("the message is empty");
    }
});

document.getElementById("typemessagegroup").addEventListener("change",()=>{
    switch(document.getElementById("typemessagegroup").value){
        case "answer":
            document.getElementById("requestmessagegroup").style = "display:inline";
            document.getElementById("timemessagegroup").style = "display:none";
            break;
        case "reminder":
            document.getElementById("requestmessagegroup").style = "display:none";
            document.getElementById("requestmessagegroup").value = "";
            document.getElementById("timemessagegroup").style = "display:inline";
            break;
        default:
            document.getElementById("requestmessagegroup").style = "display:none";
            document.getElementById("timemessagegroup").style = "display:none";
            break;
    }
});