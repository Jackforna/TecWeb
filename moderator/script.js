
let users = JSON.parse(localStorage.getItem("users"));
let squeals = JSON.parse(localStorage.getItem("lista_messaggi"));
let channels = JSON.parse(localStorage.getItem("lista_gruppi"));
let arruser = users;
let arrsqueals = [];
let arrchannels = [];


document.getElementById("squealbtn").addEventListener("click",()=>{
    document.getElementById("squealhome").style = "display:flex";
    document.getElementById("usershome").style = "display:none";
    document.getElementById("channelshome").style = "display:none";
});

document.getElementById("usersbtn").addEventListener("click",()=>{
    document.getElementById("squealhome").style = "display:none";
    document.getElementById("usershome").style = "display:flex";
    document.getElementById("channelshome").style = "display:none";
    if((arruser.length>0)&(arruser.length<10)){
        for(i=0;i<arruser.length;i++)
        document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i].nickname+', '+arruser[i].version+'</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i].nickname+', '+arruser[i].version+'</p>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    }
});

document.getElementById("channelsbtn").addEventListener("click",()=>{
    document.getElementById("squealhome").style = "display:none";
    document.getElementById("usershome").style = "display:none";
    document.getElementById("channelshome").style = "display:flex";
});

document.getElementById("searchuser").addEventListener("input",()=>{
    document.getElementById("listuser_find").innerHTML = "";
    document.getElementById("filterusertype").value = "all";
    let input = document.getElementById("searchuser").value;
    let inputsearch = input.toLowerCase();
    arruser = [];
    if(inputsearch!=""){
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arruser.push(users[i]);
            }
        }
        if((arruser.length>0)&(arruser.length<10)){
            for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i].nickname+', '+arruser[i].version+'</p>';
        } else if(arruser.length==0){
            document.getElementById("listuser_find").innerHTML += '<h5>No Results</h5><p>There were no result for "'+inputsearch+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++){
            document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i].nickname+', '+arruser[i].version+'</p>';
            }
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    } else {
        arruser = users;
        if((arruser.length>0)&(arruser.length<10)){
            for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i].nickname+', '+arruser[i].version+'</p>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i].nickname+', '+arruser[i].version+'</p>';
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

function showmore1(){
    document.getElementById("listuser_find").innerHTML = "";
    for(i=0;i<arruser.length;i++)
        document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i]+'</p>';
    document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
}

function showless1(){
    document.getElementById("listuser_find").innerHTML = "";
    for(i=0;i<7;i++)
        document.getElementById("listuser_find").innerHTML += '<p class="found">'+arruser[i]+'</p>';
    document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
}

document.getElementById("filterusertype").addEventListener("change",()=>{
    if(arruser.length!=0){
        document.getElementById("listuser_find").innerHTML = "";
        let filterusertype = document.getElementById("filterusertype").value;
        let arrusertype = [];
        if (filterusertype!="all"){
            for(i=0;i<arruser.length;i++){
                if(arruser[i].version==filterusertype){
                    arrusertype.push(arruser[i]);
                }
            }
        } else {
            arrusertype = arruser;
        }
        if((arrusertype.length>0)&(arrusertype.length<10)){
            for(i=0;i<arrusertype.length;i++)
            document.getElementById("listuser_find").innerHTML += '<p class="found">'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p>';
        } else if(arrusertype.length==0){
            document.getElementById("listuser_find").innerHTML += '<h5>No Results</h5><p>There were no result for "'+inputsearch+'" as "'+filterusertype+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++){
            document.getElementById("listuser_find").innerHTML += '<p class="found">'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p>';
            }
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});