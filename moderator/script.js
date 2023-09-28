let users = JSON.parse(localStorage.getItem("users"));
let squeals = JSON.parse(localStorage.getItem("lista_messaggi"));
let channels = JSON.parse(localStorage.getItem("lista_gruppi"));
let arruser = users;
let arrusertype = [];
let arrsqueals = squeals;
let arrsquealsdate = [];
let arrchannels = [];
let arrsearchchannel = [];
let arrchannelpopularity = [];
let arrCHANNELS = [];
let arruserpopularity = [];
let input;
let inputsearch;
let edit;
let editchannel;
let editsqueal;
const filtersqueal = document.getElementById("filtersqueal");

window.onload = function() {
    for(i=0;i<arrsqueals.length;i++){
        document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body+'</p><p class="card-text">'+arrsqueals[i].location+'</p><a class="card-text" href="'+arrsqueals[i].url+'">'+arrsqueals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
        if(arrsqueals[i].image==""){
            document.getElementById("imgsquealer").style = "display:none";
        }
        if(arrsqueals[i].photoprofile==""){
            document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
        }
        document.getElementById("imgprofilesquealer").removeAttribute("id");
        document.getElementById("imgsquealer").removeAttribute("id");
    }
}

document.getElementById("gotosquealer").addEventListener("click",()=>{
    window.location.href = "../Squealer App/public/index.html";
});

document.getElementById("usersbtn").addEventListener("click",()=>{
    document.getElementById("squealhome").style = "display:none";
    document.getElementById("usershome").style = "display:flex";
    document.getElementById("channelshome").style = "display:none";
    document.getElementById("listuser_find").innerHTML = "";
    document.getElementById("searchuser").value = "";
    document.getElementById("filterusertype").value = "all";
    document.getElementById("filteruserpopularity").value = "nothing";
    document.getElementById("sectionedituser").style = "display:none";
    arruserpopularity = [];
    arrusertype = [];
    if((users.length>0)&(users.length<7)){
        for(i=0;i<users.length;i++)
        document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+users[i].nickname+', '+users[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+users[i].nickname+', '+users[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    }
});

document.getElementById("searchuser").addEventListener("input",()=>{
    document.getElementById("listuser_find").innerHTML = "";
    document.getElementById("filterusertype").value = "all";
    arrusertype = [];
    document.getElementById("filteruserpopularity").value = "nothing";
    arruserpopularity = [];
    input = document.getElementById("searchuser").value;
    inputsearch = input.toLowerCase();
    arruser = [];
    if(inputsearch!=""){
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arruser.push(users[i]);
            }
        }
        if((arruser.length>0)&(arruser.length<7)){
            for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else if(arruser.length==0){
            document.getElementById("listuser_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    } else {
        arruser = users;
        if((arruser.length>0)&(arruser.length<7)){
            for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

function showmore1(){
    document.getElementById("listuser_find").innerHTML = "";
    if(arruserpopularity.length>0){
        for(i=0;i<arruserpopularity.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
    } else if(arrusertype.length>0){
        for(i=0;i<arrusertype.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
    } else {
        for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
    }
}

function showless1(){
    document.getElementById("listuser_find").innerHTML = "";
    if(arruserpopularity.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    } else if(arrusertype.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    }
}

document.getElementById("filterusertype").addEventListener("change",()=>{
    if(arruser.length>0){
        document.getElementById("listuser_find").innerHTML = "";
        let filterusertype = document.getElementById("filterusertype").value;
        document.getElementById("filteruserpopularity").value = "nothing";
        arrusertype = [];
        arruserpopularity = [];
        if (filterusertype!="all"){
            for(i=0;i<arruser.length;i++){
                if(arruser[i].version==filterusertype){
                    arrusertype.push(arruser[i]);
                }
            }
        } else {
            arrusertype = arruser;
        }
        if((arrusertype.length>0)&(arrusertype.length<7)){
            for(i=0;i<arrusertype.length;i++)
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else if(arrusertype.length==0){
            document.getElementById("listuser_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'" as "'+filterusertype+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++){
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            }
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

document.getElementById("filteruserpopularity").addEventListener("change",()=>{
    if(arruser.length>0){
        let filterpopularity = document.getElementById("filteruserpopularity").value;
        switch(filterpopularity){
            case "top":
                if(arrusertype.length>0){
                    arruserpopularity = arrusertype;
                    arruserpopularity.sort(function(a,b){
                        return b.popularity - a.popularity;
                    });
                } else {
                    arruserpopularity = arruser;
                    document.getElementById("filterusertype").value = "all";
                    arruserpopularity.sort(function(a,b){
                        return b.popularity - a.popularity;
                    });
                }
            break;
            case "down":
                if(arrusertype.length>0){
                    arruserpopularity = arrusertype;
                    arruserpopularity.sort(function(a,b){
                        return a.popularity - b.popularity;
                    });
                } else {
                    arruserpopularity = arruser;
                    document.getElementById("filterusertype").value = "all";
                    arruserpopularity.sort(function(a,b){
                        return a.popularity - b.popularity;
                    });
                }
            break;
            default:
                if(arrusertype.length>0){
                    arruserpopularity = arrusertype;
                } else {
                    arruserpopularity = arruser;
                }
            break;
        }
        document.getElementById("listuser_find").innerHTML = "";
        if((arruserpopularity.length>0)&(arruserpopularity.length<7)){
            for(i=0;i<arruserpopularity.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++){
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            }
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

function edituser(x){
    if(arruserpopularity.length>0){
        edit = arruserpopularity[x];
    } else if(arrusertype.length>0){
        edit = arrusertype[x];
    } else {
        edit = arruser[x];
    }
    document.getElementById("sectionedituser").style = "display:flex";
    if(edit.photoprofile!="")
        document.getElementById("sectionedituserphoto").src = edit.photoprofile;
    else 
        document.getElementById("sectionedituserphoto").src = "img/profile_photo1.png";
    document.getElementById("sectioneditusername").innerText = edit.nickname;
    if(edit.blocked)
        document.getElementById("sectionedituserblock").innerText = "Unblock";
    else 
        document.getElementById("sectionedituserblock").innerText = "Block";
    document.getElementById("sectionedituserdaily").innerText = "Remaining daily characters: "+edit.char_d;
    document.getElementById("sectionedituserweekly").innerText = "Remaining weekly characters: "+edit.char_w;
    document.getElementById("sectioneditusermonthly").innerText = "Remaining monthly characters: "+edit.char_m;
}

function addchardaily(){
    let add = document.getElementById("sectionedituserdailyinsert").value;
    edit.char_d = JSON.parse(edit.char_d) + parseInt(add);
    document.getElementById("sectionedituserdaily").innerText = "Remaining daily characters: "+edit.char_d;
    savechangesuser();
}

function addcharweekly(){
    let add = document.getElementById("sectionedituserweeklyinsert").value;
    edit.char_w = JSON.parse(edit.char_w) + parseInt(add);
    document.getElementById("sectionedituserweekly").innerText = "Remaining daily characters: "+edit.char_w;
    savechangesuser();
}

function addcharmonthly(){
    let add = document.getElementById("sectioneditusermonthlyinsert").value;
    edit.char_m = JSON.parse(edit.char_m) + parseInt(add);
    document.getElementById("sectioneditusermonthly").innerText = "Remaining daily characters: "+edit.char_m;
    savechangesuser();
}

document.getElementById("sectionedituserblock").addEventListener("click",()=>{
    if(edit.blocked){
        document.getElementById("sectionedituserblock").innerText = "Block";
        edit.blocked = false;
    } else {
        document.getElementById("sectionedituserblock").innerText = "Unblock";
        edit.blocked = true;
    }
    savechangesuser();
});

function savechangesuser(){
    for(i=0;i<users.length;i++){
        if(edit.nickname==users[i].nickname){
            users[i] = edit;
        }
    }
    localStorage.setItem("users",JSON.stringify(users));
}

document.getElementById("closeedituser").addEventListener("click", ()=>{
    document.getElementById("sectionedituser").style = "display:none";
});

/*------------------------------------------------------------------------------------------------------------*/

document.getElementById("squealbtn").addEventListener("click",()=>{
    document.getElementById("squealhome").style = "display:flex";
    document.getElementById("usershome").style = "display:none";
    document.getElementById("channelshome").style = "display:none";
    document.getElementById("listsqueals_find").innerHTML = "";
    document.getElementById("datesqueal").value = "";
    document.getElementById("filtersqueal").value = "sender";
    document.getElementById("searchsqueal").value = "";
    document.getElementById("searchsqueal").placeholder = "Search sender";
    arrsquealsdate = [];
    for(i=0;i<squeals.length;i++){
        document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body+'</p><p class="card-text">'+squeals[i].location+'</p><a class="card-text" href="'+squeals[i].url+'">'+squeals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
        if(squeals[i].image==""){
            document.getElementById("imgsquealer").style = "display:none";
        }
        document.getElementById("imgsquealer").removeAttribute("id");
        if(squeals[i].photoprofile==""){
            document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
        }
        document.getElementById("imgprofilesquealer").removeAttribute("id");
    }
});

document.getElementById("filtersqueal").addEventListener("change",()=>{
    document.getElementById("datesqueal").value = "";
    document.getElementById("searchsqueal").value = "";
    document.getElementById("listsqueals_find").innerHTML = "";
    switch(filtersqueal.value){
        case "sender":
            document.getElementById("searchsqueal").placeholder = "Search sender";
            for(i=0;i<squeals.length;i++){
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body+'</p><p class="card-text">'+squeals[i].location+'</p><a class="card-text" href="'+squeals[i].url+'">'+squeals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].image==""){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        break;
        case "receiver":
            document.getElementById("searchsqueal").placeholder = "Search receiver";
            for(i=0;i<squeals.length;i++){
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body+'</p><p class="card-text">'+squeals[i].location+'</p><a class="card-text" href="'+squeals[i].url+'">'+squeals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].image==""){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        break;
    }
});

document.getElementById("datesqueal").addEventListener("change",()=>{
    let datesqueal = document.getElementById("datesqueal").value;
    document.getElementById("listsqueals_find").innerHTML = "";
    let j = 0;
    arrsquealsdate = [];
    if(arrsqueals.length==0){
        for(i=0;i<squeals.length;i++){
            if(datesqueal==squeals[i].date){
                arrsquealsdate.push(squeals[i]);
                j += 1;
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body+'</p><p class="card-text">'+squeals[i].location+'</p><a class="card-text" href="'+squeals[i].url+'">'+squeals[i].url+'</a><div class="text-center"><img src="'+squeals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+(j-1)+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].image==""){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        }
        if(j==0){
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">Nothing was found by this search. Try with other input.</p>';
        }
    } else {
        for(i=0;i<arrsqueals.length;i++){
                if(datesqueal==arrsqueals[i].date){
                arrsquealsdate.push(arrsqueals[i]);
                j += 1;
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body+'</p><p class="card-text">'+arrsqueals[i].location+'</p><a class="card-text" href="'+arrsqueals[i].url+'">'+arrsqueals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+(j-1)+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                if(arrsqueals[i].image==""){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(arrsqueals[i].photoprofile==""){
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        }
        if(j==0){
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">Nothing was found by this search. Try with other input.</p>';
        }
    }
});

document.getElementById("searchsqueal").addEventListener("input",()=>{
    let searchsqueal = document.getElementById("searchsqueal").value;
    arrsqueals = [];
    document.getElementById("listsqueals_find").innerHTML = "";
    document.getElementById("datesqueal").value = "";
    input = document.getElementById("searchsqueal").value;
    inputsearch = input.toLowerCase();
    if(inputsearch!=""){
        if(filtersqueal.value=="sender"){
            for(i=0;i<squeals.length;i++){
                let mex = ((squeals[i].sender).slice(0,inputsearch.length)).toLowerCase();
                if(searchsqueal==mex){
                    arrsqueals.push(squeals[i]);
                }
            }
        } else if(filtersqueal.value=="receiver"){
            for(i=0;i<squeals.length;i++){
                for(j=0;j<squeals[i].receivers.length;j++){
                    let mex = ((squeals[i].receivers[j]).slice(1,(inputsearch.length+1))).toLowerCase();
                    if(inputsearch==mex){
                        arrsqueals.push(squeals[i]);
                    }
                }
            }
        }
        if(arrsqueals.length!=0){
            for(i=0;i<arrsqueals.length;i++){
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body+'</p><p class="card-text">'+arrsqueals[i].location+'</p><a class="card-text" href="'+arrsqueals[i].url+'">'+arrsqueals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                if(arrsqueals[i].image==""){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(arrsqueals[i].photoprofile==""){
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        } else{
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        arrsqueals = squeals;
        for(i=0;i<arrsqueals.length;i++){
            document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body+'</p><p class="card-text">'+arrsqueals[i].location+'</p><a class="card-text" href="'+arrsqueals[i].url+'">'+arrsqueals[i].url+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].image+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
            if(arrsqueals[i].image==""){
                document.getElementById("imgsquealer").style = "display:none";
            }
            document.getElementById("imgsquealer").removeAttribute("id");
            if(arrsqueals[i].photoprofile==""){
                document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
            }
            document.getElementById("imgprofilesquealer").removeAttribute("id");
        }
    }
});

function editmex(x){
    if(arrsquealsdate.length>0)
        editsqueal = arrsquealsdate[x];
    else if(arrsqueals.length>0)
        editsqueal = arrsqueals[x];
    else
        editsqueal = squeals[x];
    document.getElementById("sectioneditsqueal").style = "display:flex";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceivers").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button class="btn btn-outline-primary">Delete</button></div>';
    }
    document.getElementById("sectioneditsquealreceivers").innerHTML += '<button class="btn btn-outline-primary">Add Receiver</button>';
}

function savechangessqueal(){
    for(i=0;i<squeals.length;i++){
        if(editsqueal.id==squeals[i].id){
            squeals[i] = editsqueal;
        }
    }
    localStorage.setItem("lista_messaggi",JSON.stringify(squeals));
}

document.getElementById("closeeditsqueal").addEventListener("click", ()=>{
    document.getElementById("sectioneditsqueal").style = "display:none";
});

document.getElementById("sectioneditsquealreactionssection").addEventListener("click",()=>{
    document.getElementById("sectioneditsquealreactions").style = "display:flex";
    document.getElementById("sectioneditsquealreceivers").style = "display:none";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:1px solid white";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3>Reactions<h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:100px">'+editsqueal.pos_reactions+'</p><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><input type="number"><button class="btn btn-outline-primary">Edit characters</button></div><div><p style="min-width:100px">'+editsqueal.neg_reactions+'</p><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><input type="number"><button class="btn btn-outline-primary">Edit characters</button></div>';
});

document.getElementById("sectioneditsquealreceiverssection").addEventListener("click",()=>{
    document.getElementById("sectioneditsquealreactions").style = "display:none";
    document.getElementById("sectioneditsquealreceivers").style = "display:flex";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:1px solid white";
    document.getElementById("sectioneditsquealreceivers").innerHTML = '<h3>Receivers<h3>';
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceivers").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button class="btn btn-outline-primary">Delete</button></div>';
    }
    document.getElementById("sectioneditsquealreceivers").innerHTML += '<button class="btn btn-outline-primary">Add Receiver</button>';
});

/*--------------------------------------------------------------------------------------------------------------*/

document.getElementById("channelsbtn").addEventListener("click",()=>{
    document.getElementById("squealhome").style = "display:none";
    document.getElementById("usershome").style = "display:none";
    document.getElementById("channelshome").style = "display:flex";
    document.getElementById("filterchannel").style = "display:inline; color:white; background-color:#141619";
    document.getElementById("filterchannelpopularity").style = "display:inline; color:white; background-color:#141619";
    document.getElementById("filterchannelp").style = "display:inline";
    document.getElementById("filterchannelpopularityp").style = "display:inline";
    document.getElementById("createnewCHANNEL").style = "display:none";
    document.getElementById("filterchannel").value = "name";
    document.getElementById("filterchannelpopularity").value = "nothing";
    document.getElementById("searchchannel").value = "";
    document.getElementById("searchchannel").placeholder = "Search channel";
    document.getElementById("searchchannel").type = "text";
    document.getElementById("listchannel_find").innerHTML = "";
    document.getElementById("filterchanneltype").value = "channels";
    arrchannels = [];
    arrCHANNELS = [];
    arrchannelpopularity = [];
    arrsearchchannel = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="&"){
            arrchannels.push(channels[i]);
        } else if(channels[i].type=="$"){
            arrCHANNELS.push(channels[i]);
        }
    }
    if((arrchannels.length>0)&(arrchannels.length<7)){
        for(i=0;i<arrchannels.length;i++)
        document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
    } else if(arrchannels.length==0){
        document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    }
});

document.getElementById("filterchanneltype").addEventListener("change",()=>{
    let channeltype = document.getElementById("filterchanneltype").value;
    document.getElementById("searchchannel").value = "";
    arrCHANNELS = [];
    arrchannels = [];
    arrchannelpopularity = [];
    arrsearchchannel = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="&"){
            arrchannels.push(channels[i]);
        } else if(channels[i].type=="$"){
            arrCHANNELS.push(channels[i]);
        }
    }
    switch(channeltype){
        case "channels":
            document.getElementById("filterchannel").style = "display:inline; color:white; background-color:#141619";
            document.getElementById("filterchannelpopularity").style = "display:inline; color:white; background-color:#141619";
            document.getElementById("filterchannelp").style = "display:inline";
            document.getElementById("filterchannelpopularityp").style = "display:inline";
            document.getElementById("createnewCHANNEL").style = "display:none";
            document.getElementById("filterchannel").value = "name";
            document.getElementById("filterchannelpopularity").value = "nothing";
            document.getElementById("searchchannel").placeholder = "Search channel";
            document.getElementById("searchchannel").type = "text";
            document.getElementById("listchannel_find").innerHTML = "";
            if((arrchannels.length>0)&(arrchannels.length<7)){
                for(i=0;i<arrchannels.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            } else if(arrchannels.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
            }
        break;
        case "CHANNELS":
            document.getElementById("filterchannel").style = "display:none";
            document.getElementById("filterchannelpopularity").style = "display:none";
            document.getElementById("filterchannelp").style = "display:none";
            document.getElementById("filterchannelpopularityp").style = "display:none";
            document.getElementById("createnewCHANNEL").style = "display:inline";
            document.getElementById("searchchannel").placeholder = "Search CHANNEL";
            document.getElementById("searchchannel").type = "text";
            document.getElementById("listchannel_find").innerHTML = "";
            if((arrCHANNELS.length>0)&(arrCHANNELS.length<7)){
                for(i=0;i<arrCHANNELS.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Edit</button></div>';
            } else if(arrCHANNELS.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
            }
        break;
    }
});

document.getElementById("filterchannel").addEventListener("change",()=>{
    let filterchannel = document.getElementById("filterchannel").value;
    switch(filterchannel){
        case "name":
            document.getElementById("searchchannel").placeholder = "Search channel";
            document.getElementById("searchchannel").type = "text";
        break;
        case "owner":
            document.getElementById("searchchannel").placeholder = "Search channel owner";
            document.getElementById("searchchannel").type = "text";
        break;
        case "post":
            document.getElementById("searchchannel").placeholder = "Search number of posts";
            document.getElementById("searchchannel").type = "number";
        break;
    }
});

document.getElementById("searchchannel").addEventListener("input",()=>{
    let filterchannel = document.getElementById("filterchannel").value;
    input = document.getElementById("searchchannel").value;
    inputsearch = input.toLowerCase();
    document.getElementById("listchannel_find").innerHTML = "";
    document.getElementById("filterchannelpopularity").value = "nothing";
    arrsearchchannel = [];
    arrchannelpopularity = [];
    if(inputsearch!=""){
        switch(filterchannel){
            case "name":
                for(i=0;i<arrchannels.length;i++){
                    let channel = ((arrchannels[i].name).slice(0,inputsearch.length)).toLowerCase();
                        if(inputsearch==channel){
                            arrsearchchannel.push(arrchannels[i]);
                        }
                    }
            break;
            case "owner":
                for(i=0;i<arrchannels.length;i++){
                    for(j=0;j<arrchannels[i].list_modifier.length;j++){
                    let channel = ((arrchannels[i].list_modifier[j]).slice(0,inputsearch.length)).toLowerCase();
                        if(inputsearch==channel){
                            arrsearchchannel.push(arrchannels[i]);
                        }
                    }
                }
            break;
            case "post":
                for(i=0;i<arrchannels.length;i++){
                    let channel = arrchannels[i].list_posts.length;
                        if(inputsearch==channel){
                            arrsearchchannel.push(arrchannels[i]);
                        }
                    }
            break;
        }
        if((arrsearchchannel.length>0)&(arrsearchchannel.length<7)){
            for(i=0;i<arrsearchchannel.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        } else if(arrsearchchannel.length==0){
            document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
        }
    } else {
        arrsearchchannel = arrchannels;
        if((arrsearchchannel.length>0)&(arrsearchchannel.length<7)){
            for(i=0;i<arrsearchchannel.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
        }
    }
});

document.getElementById("filterchannelpopularity").addEventListener("change",()=>{
    if(arrchannels.length>0){
        let filterpopularity = document.getElementById("filterchannelpopularity").value;
        switch(filterpopularity){
            case "top":
                if(arrsearchchannel.length>0){
                    arrchannelpopularity = arrsearchchannel;
                    arrchannelpopularity.sort(function(a,b){
                        return b.list_users.length - a.list_users.length;
                    });
                } else {
                    arrchannelpopularity = arrchannels;
                    document.getElementById("filterchannel").value = "name";
                    arrchannelpopularity.sort(function(a,b){
                        return b.list_users.length - a.list_users.length;
                    });
                }
            break;
            case "down":
                if(arrsearchchannel.length>0){
                    arrchannelpopularity = arrsearchchannel;
                    arrchannelpopularity.sort(function(a,b){
                        return a.list_users.length - b.list_users.length;
                    });
                } else {
                    arrchannelpopularity = arrchannels;
                    document.getElementById("filterchannel").value = "name";
                    arrchannelpopularity.sort(function(a,b){
                        return a.list_users.length - b.list_users.length;
                    });
                }
            break;
            default:
                if(arrsearchchannel.length>0){
                    arrchannelpopularity = arrsearchchannel;
                } else {
                    arrchannelpopularity = arrchannels;
                }
            break;
        }
        document.getElementById("listchannel_find").innerHTML = "";
        if((arrchannelpopularity.length>0)&(arrchannelpopularity.length<7)){
            for(i=0;i<arrchannelpopularity.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++){
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            }
            document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
        }
    }
});

function showmore2(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrchannelpopularity.length>0){
        for(i=0;i<arrchannelpopularity.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless2()">Show less</p>';
    } else if(arrsearchchannel.length>0){
        for(i=0;i<arrsearchchannel.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless2()">Show less</p>';
    } else {
        for(i=0;i<arrchannels.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless2()">Show less</p>';
    }
}

function showless2(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrchannelpopularity.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    } else if(arrsearchchannel.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    }
}

document.getElementById("closeeditchannel").addEventListener("click",()=>{
    document.getElementById("sectioneditchannel").style = "display:none";
    document.getElementById("listchannel_find").innerHTML = "";
    arrchannels = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="&"){
            arrchannels.push(channels[i]);
        }
    }
    if((arrchannels.length>0)&(arrchannels.length<7)){
        for(i=0;i<arrchannels.length;i++)
        document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
    } else if(arrchannels.length==0){
        document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    }
});

function editchan(x){
    if(arrchannelpopularity.length>0){
        editchannel = arrchannelpopularity[x];
    } else if(arrsearchchannel.length>0){
        editchannel = arrsearchchannel[x];
    } else {
        editchannel = arrchannels[x];
    }
    document.getElementById("sectioneditchannel").style = "display:flex";
    document.getElementById("sectioneditchannelowners").innerHTML = '<h3>Owners</h3>';
    if(editchannel.photoprofile!="")
        document.getElementById("sectioneditchannelphoto").src = editchannel.photoprofile;
    else 
        document.getElementById("sectioneditchannelphoto").src = "img/group_photo1.png";
    document.getElementById("sectioneditchannelname").value = editchannel.name;
    if(editchannel.blocked)
        document.getElementById("sectioneditchannelblock").innerText = "Unblock";
    else 
        document.getElementById("sectioneditchannelblock").innerText = "Block";
    for(i=0;i<editchannel.list_modifier.length;i++){
        document.getElementById("sectioneditchannelowners").innerHTML += '<div><p>'+editchannel.list_modifier[i]+'</p><button class="btn btn-outline-primary" onclick="deleteownerchannel('+i+')">Delete</button></div>';
    }
}

document.getElementById("sectioneditchannelblock").addEventListener("click",()=>{
    if(editchannel.blocked){
        document.getElementById("sectioneditchannelblock").innerText = "Block";
        editchannel.blocked = false;
    } else {
        document.getElementById("sectioneditchannelblock").innerText = "Unblock";
        editchannel.blocked = true;
    }
    savechangeschannel();
});

function savechangeschannel(){
    for(i=0;i<channels.length;i++){
        if(editchannel.name==channels[i].name){
            channels[i] = editchannel;
        }
    }
    localStorage.setItem("lista_gruppi",JSON.stringify(channels));
}

document.getElementById("sectioneditchannelchangename").addEventListener("click",()=>{
    let isValid = true;
    let name = document.getElementById("sectioneditchannelname").value;
    let name_empty = name.replace(/\s/g,"");
    if((name_empty!="")&(name_empty.length>=3)){
    //controllo validità nome gruppo
        for(i=0;i<channels.length;i++){
            if(name==channels[i].name){   //per evitare che ci siano più gruppi con lo stesso nome
                isValid = false;
                alert("Name already used");
            }
        }
    } else {
        isValid = false;
        alert("Please, insert a valid name for the group");
    }
    if(isValid){
        //salvo il nuovo nome del channel e aggiorno la lista dei canali
        editchannel.name = name;
    }
    savechangeschannel();
})

function deleteownerchannel(x){
    if(editchannel.list_modifier.length<2){
        alert("There must be at least one owner of the channel. This owner can't be deleted");
    } else {
        editchannel.list_modifier.splice(x, 1);
    }
    savechangeschannel();
    document.getElementById("sectioneditchannelowners").innerHTML = '<h3>Owners</h3>';
    for(i=0;i<editchannel.list_modifier.length;i++){
        document.getElementById("sectioneditchannelowners").innerHTML += '<div><p>'+editchannel.list_modifier[i]+'</p><button class="btn btn-outline-primary" onclick="deleteownerchannel('+i+')">Delete</button></div>';
    }
}