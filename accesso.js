const formsign = document.getElementById("formsign");
const formcell = document.getElementById("formcell");
let sign = true;
let security = false;
let actualuser;
var range;
let access = false;

if(!localStorage.users){
    const user = [{
        nickname : "Jack",
        fullname : "CEO",
        email: "giacomo.fornaciari@studio.unibo.it",
        cell: "3333122042",      
        password : "Fenice13!",
        version : "base",      //versione di squealer dell'utente
        char_d : 300,      //caratteri disponibili al giorno
        char_w : 2000,     //caratteri disponibili a settimana
        char_m : 7000,     //caratteri disponibili al mese
    }]
    localStorage.setItem("users",JSON.stringify(user));
}

let users = JSON.parse(localStorage.getItem("users"));

const requirements = [
    {regex: /.{8,}/, index: 0},     //minimo di 8 caratteri
    {regex: /[0-9]/, index: 1},     //almeno un numero
    {regex: /[a-z]/, index: 2},     //almeno una lettera minuscola
    {regex: /[^A-Za-z0-9]/, index: 3}, //almeno un carattere speciale
    {regex: /[A-Z]/, index: 4},     //almeno una lettera maiuscola
]
    
document.getElementById("signin").addEventListener("click", ()=>{
    formsign.classList.remove("translateform");
    document.getElementById("fullnamesign1").style = "display:none";
    document.getElementById("emailsign1").style = "display:none";
    document.getElementById("type_user").style = "display:none";
    sign = true;
    access = true;
});
    
document.getElementById("signup").addEventListener("click", ()=>{
    formsign.classList.add("translateform");
    document.getElementById("fullnamesign1").style = "display:inline";
    document.getElementById("emailsign1").style = "display:inline";
    document.getElementById("type_user").style = "display:inline";
    sign = false;
    access = true;
});

document.getElementById("signincell").addEventListener("click", ()=>{
    formcell.classList.remove("turnform");
    sign = true;
    access = true;
});
    
document.getElementById("signupcell").addEventListener("click", ()=>{
    formcell.classList.add("turnform");
    sign = false;
    access = true;
});

document.getElementById("passwordsign1").addEventListener("input", (e) => {
    range = document.getElementById("range_security1");
    range.value = 100;
    requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);

        if(!isValid) {
            range.value -= 20;    //essendo 5 condizioni decrementa dal massimo 100, 20 per ogni condizione non convalidata
        }
    })
    if(range.value==100){
        security = true;

    } else {
        security = false;

    }
});

document.getElementById("passwordsign3").addEventListener("input", (e) => {
    range = document.getElementById("range_security3");
    range.value = 100;
    requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);

        if(!isValid) {
            range.value -= 20;    //essendo 5 condizioni decrementa dal massimo 100, 20 per ogni condizione non convalidata
        }
    })
    if(range.value==100){
        security = true;

    } else {
        security = false;

    }
});

function login(x){
    let nickname = document.getElementById("nicknamesign"+x).value;
    let email = document.getElementById("emailsign"+x).value;
    let password = document.getElementById("passwordsign"+x).value;
    let fullname = document.getElementById("fullnamesign"+x).value; 
    let valid = false;
    if(sign){
        for(i=0;i<users.length;i++){
            if(((nickname==users[i].nickname)||(email==users[i].email))&&(password==users[i].password)){
                valid = true;
                actualuser = users[i];
                localStorage.setItem("actualuser",JSON.stringify(actualuser));
            }
        }
        if(valid){
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    } else {
        for(i=0;i<users.length;i++){
            if(((nickname==users[i].nickname)||(email==users[i].email))||(password==users[i].password)){
                valid = true;
            }
        }
        if(!valid){
            if(security){
            users.push({nickname : nickname, email : email, password : password, fullname : fullname, cell : "", version : "base", char_d : 300, char_w : 2000,char_m : 7000});
            localStorage.setItem("users",JSON.stringify(users));
            actualuser = users[users.length-1];
            localStorage.setItem("actualuser",JSON.stringify(actualuser));
            window.location.href = 'index.html';
            } else {
                alert("Password not strong enough");
            }
        } else {
            alert("Credentials already used");
        }
    }
}

function password_security(x){
    if(!sign){
        document.getElementById("pass_security"+x).style = "display:inline";
        document.getElementById("range_security"+x).value = 0;
    }
}

function blur_password(x){
    if(!sign){
        document.getElementById("pass_security"+x).style = "display:none";
    }
}

document.getElementById("infopassword").addEventListener("mouseover", ()=>{
    document.getElementById("divinfopassword").style = "display:inline";
});

document.getElementById("infopassword").addEventListener("mouseout", ()=>{
    document.getElementById("divinfopassword").style = "display:none";
});

document.getElementById("notsign").addEventListener("click", ()=>{
    window.location.href="index.html";
    actualuser = "not sign";
    localStorage.setItem("actualuser",JSON.stringify(actualuser));
});

document.getElementById("notsigncell").addEventListener("click", ()=>{
    window.location.href="index.html";
    actualuser = "not sign";
    localStorage.setItem("actualuser",JSON.stringify(actualuser));
});