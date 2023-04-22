/*switch to darkmode*/

const toggleBtn = document.getElementById("toggle-btn");
const AccessBtn = document.getElementById("accessibility-btn");
const theme = document.getElementsByTagName("main");
let darkMode = localStorage.getItem("dark-mode");
let accessMode = localStorage.getItem("accessibility-mode");

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