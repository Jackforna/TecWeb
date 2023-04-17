/*switch to darkmode*/

const toggleBtn = document.getElementById("toggle-btn");
const theme = document.getElementsByTagName("main");
let darkMode = localStorage.getItem("dark-mode");

const enableDarkMode = () => {
    for(i=0;i<theme.length;i++){
    theme[i].classList.add("dark-mode-theme");
    theme[i].classList.remove("dark-mode-toggle");
    }
    toggleBtn.classList.remove("dark-mode-toggle");
    localStorage.setItem("dark-mode", "enabled");
    toggleBtn.checked = true;
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

if(darkMode === "enabled"){
    enableDarkMode();
} else {
    localStorage.setItem("dark-mode", "disabled");
}

toggleBtn.addEventListener("click", (e) =>{
    darkMode = localStorage.getItem("dark-mode");
    if(darkMode === "disabled"){
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});