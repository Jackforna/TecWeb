let users = JSON.parse(localStorage.getItem("users"));
let squeals = JSON.parse(localStorage.getItem("lista_messaggi"));
let channels = JSON.parse(localStorage.getItem("lista_gruppi"));
let actualuser = JSON.parse(localStorage.getItem("actualuser"));
let arruser = users;
let arrusertype = [];
let arrsqueals = squeals;
let arrsquealsdate = [];
let arrchannels = [];
let arrsearchchannel = [];
let arrchannelpopularity = [];
let arrCHANNELS = [];
let arrsearchCHANNEL = [];
let arruserpopularity = [];
let arrsquealreceiversusers = [];
let arrsquealreceiverschannels = [];
let input;
let inputsearch;
let edit;
let editchannel;
let editCHANNEL;
let editsqueal;
let arrcreateCHANNELowners = [];
let arrcreateCHANNELownersadd = [];
let arrcreateCHANNELmessages = [];
const CHANNELsilenceable = document.getElementById("sectioncreateCHANNELsilenceable");
let num_message;
const filtersqueal = document.getElementById("filtersqueal");

window.onload = function() {
    for(i=0;i<arrsqueals.length;i++){
        document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+arrsqueals[i].body.position+'</p><a class="card-text" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
        if(arrsqueals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
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
        document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+squeals[i].body.position+'</p><a class="card-text" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
        if(squeals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
            document.getElementById("imgsquealer").style = "display:none";
        }
        document.getElementById("imgsquealer").removeAttribute("id");
        if(squeals[i].photoprofile==""){
            if(users.find(item => item.nickname === squeals[i].sender))
                document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
            else 
                document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
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
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+squeals[i].body.position+'</p><a class="card-text" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    if(users.find(item => item.nickname === squeals[i].sender))
                        document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        break;
        case "receiver":
            document.getElementById("searchsqueal").placeholder = "Search receiver";
            for(i=0;i<squeals.length;i++){
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+squeals[i].body.position+'</p><a class="card-text" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    if(users.find(item => item.nickname === squeals[i].sender))
                        document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
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
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+squeals[i].body.position+'</p><a class="card-text" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center"><img src="'+squeals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+(j-1)+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    if(users.find(item => item.nickname === squeals[i].sender))
                        document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
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
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+arrsqueals[i].body.position+'</p><a class="card-text" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+(j-1)+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                if(arrsqueals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(arrsqueals[i].photoprofile==""){
                    if(users.find(item => item.nickname === arrsqueals[i].sender))
                        document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
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
                    const inreceivers = arrsqueals.find(oggetto => {
                        return oggetto == squeals[i];
                      });
                    if(!inreceivers)
                        arrsqueals.push(squeals[i]);
                }
            }
        } else if(filtersqueal.value=="receiver"){
            for(i=0;i<squeals.length;i++){
                for(j=0;j<squeals[i].receivers.length;j++){
                    let mex = ((squeals[i].receivers[j]).slice(1,(inputsearch.length+1))).toLowerCase();
                    if(searchsqueal==mex){
                        const inreceivers = arrsqueals.find(oggetto => {
                            return oggetto == squeals[i];
                          });
                        if(!inreceivers)
                            arrsqueals.push(squeals[i]);
                    }
                }
            }
        }
        if(arrsqueals.length!=0){  
            for(i=0;i<arrsqueals.length;i++){
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+arrsqueals[i].body.position+'</p><a class="card-text" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                if(arrsqueals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                document.getElementById("imgsquealer").removeAttribute("id");
                if(arrsqueals[i].photoprofile==""){
                    if(users.find(item => item.nickname === arrsqueals[i].sender))
                        document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        } else{
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        arrsqueals = squeals;
        for(i=0;i<arrsqueals.length;i++){
            document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+arrsqueals[i].body.position+'</p><a class="card-text" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
            if(arrsqueals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                document.getElementById("imgsquealer").style = "display:none";
            }
            document.getElementById("imgsquealer").removeAttribute("id");
            if(arrsqueals[i].photoprofile==""){
                if(users.find(item => item.nickname === arrsqueals[i].sender))
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
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
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = '';
    document.getElementById("searchaddreceivers").value = "";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
    }
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
    document.getElementById("listsqueals_find").innerHTML = "";
    document.getElementById("datesqueal").value = "";
    document.getElementById("filtersqueal").value = "sender";
    document.getElementById("searchsqueal").value = "";
    document.getElementById("searchsqueal").placeholder = "Search sender";
    arrsquealsdate = [];
    for(i=0;i<squeals.length;i++){
        document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text">'+squeals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+squeals[i].body.position+'</p><a class="card-text" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+squeals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+squeals[i].neg_reactions+'</span></div></div></div>';
        if(squeals[i].body.img=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
            document.getElementById("imgsquealer").style = "display:none";
        }
        document.getElementById("imgsquealer").removeAttribute("id");
        if(squeals[i].photoprofile==""){
            if(users.find(item => item.nickname === squeals[i].sender))
                document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
            else 
                document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
        }
        document.getElementById("imgprofilesquealer").removeAttribute("id");
    }
});

document.getElementById("sectioneditsquealreactionssection").addEventListener("click",()=>{
    document.getElementById("sectioneditsquealreactions").style = "display:flex";
    document.getElementById("sectioneditsquealreceivers").style = "display:none";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:1px solid white";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3 style="margin-bottom:2%">Reactions</h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:30px">'+editsqueal.pos_reactions+'</p><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt="" style="margin-right:50px"><input type="number" id="editpositivereactions"><button class="btn btn-outline-primary"  onclick="editpositivereactions()">Edit reactions</button></div><div><p style="min-width:30px">'+editsqueal.neg_reactions+'</p><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt="" style="margin-right:50px"><input type="number" id="editnegativereactions"><button class="btn btn-outline-primary" onclick="editnegativereactions()">Edit reactions</button></div>';
});

document.getElementById("sectioneditsquealreceiverssection").addEventListener("click",()=>{
    document.getElementById("sectioneditsquealreactions").style = "display:none";
    document.getElementById("sectioneditsquealreceivers").style = "display:flex";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:1px solid white";
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = '';
    document.getElementById("searchaddreceivers").value = "";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
    }
});

function editpositivereactions(){
    let add = document.getElementById("editpositivereactions").value;
    editsqueal.pos_reactions = JSON.parse(editsqueal.pos_reactions) + parseInt(add);
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3 style="margin-bottom:2%">Reactions</h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:30px">'+editsqueal.pos_reactions+'</p><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt="" style="margin-right:50px"><input type="number" id="editpositivereactions"><button class="btn btn-outline-primary"  onclick="editpositivereactions()">Edit reactions</button></div><div><p style="min-width:30px">'+editsqueal.neg_reactions+'</p><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt="" style="margin-right:50px"><input type="number" id="editnegativereactions"><button class="btn btn-outline-primary" onclick="editnegativereactions()">Edit reactions</button></div>';
    savechangessqueal();
    }

function editnegativereactions(){
    let add = document.getElementById("editnegativereactions").value;
    editsqueal.neg_reactions = JSON.parse(editsqueal.neg_reactions) + parseInt(add);
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3 style="margin-bottom:2%">Reactions</h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:30px">'+editsqueal.pos_reactions+'</p><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt="" style="margin-right:50px"><input type="number" id="editpositivereactions"><button class="btn btn-outline-primary"  onclick="editpositivereactions()">Edit reactions</button></div><div><p style="min-width:30px">'+editsqueal.neg_reactions+'</p><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt="" style="margin-right:50px"><input type="number" id="editnegativereactions"><button class="btn btn-outline-primary" onclick="editnegativereactions()">Edit reactions</button></div>';
    savechangessqueal();
    }

document.getElementById("searchaddreceivers").addEventListener("input",()=>{
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = '';
    input = document.getElementById("searchaddreceivers").value;
    inputsearch = input.toLowerCase();
    arrsquealreceiversusers = [];
    arrsquealreceiverschannels = [];
    if(inputsearch!=""){   
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arrsquealreceiversusers.push(users[i]);
            }
        }
        for(i=0;i<channels.length;i++){
            let user = ((channels[i].name).slice(0,inputsearch.length)).toLowerCase();
                if(inputsearch==user){
                    arrsquealreceiverschannels.push(channels[i]);
                }
            }
        let len = arrsquealreceiverschannels.length + arrsquealreceiversusers.length;
        if(len>0){
            for(i=0;i<arrsquealreceiversusers.length;i++){
                const inreceivers = editsqueal.receivers.find(oggetto => {
                    return oggetto == "@"+arrsquealreceiversusers[i].nickname;
                  });
                if(inreceivers)
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="deleteuserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Remove</button></div>';
                else 
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="adduserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Add</button></div>';
            }
            for(i=0;i<arrsquealreceiverschannels.length;i++){
                const inreceivers = editsqueal.receivers.find(oggetto => {
                    return oggetto == arrsquealreceiverschannels[i].type + arrsquealreceiverschannels[i].name;
                  });
                if(inreceivers)
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="deletechannelreceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
                else 
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="addchannelreceiver('+i+')" class="btn btn-outline-primary">Add</button></div>';
            }
        } else{
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        arrsquealreceiversusers = [];
        arrsquealreceiverschannels = [];
        for(i=0;i<editsqueal.receivers.length;i++)
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button><br></div>';
    }
});

function rewritereceiverlist(){
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = "";
    for(i=0;i<arrsquealreceiversusers.length;i++){
        const inreceivers = editsqueal.receivers.find(oggetto => {
            return oggetto == "@"+arrsquealreceiversusers[i].nickname;
          });
        if(inreceivers)
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="deleteuserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Remove</button></div>';
        else 
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="adduserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Add</button></div>';
    }
    for(i=0;i<arrsquealreceiverschannels.length;i++){
        const inreceivers = editsqueal.receivers.find(oggetto => {
            return oggetto == arrsquealreceiverschannels[i].type + arrsquealreceiverschannels[i].name;
          });
        if(inreceivers)
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="deletechannelreceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
        else 
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="addchannelreceiver('+i+')" class="btn btn-outline-primary">Add</button></div>';
    }
}

function deletereceiver(x){
    editsqueal.receivers.splice(x,1);
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = "";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
    }
    savechangessqueal();
}

function deleteuserreceiver(x){
    let y;
    for(i=0;i<editsqueal.receivers.length;i++){
        if(editsqueal.receivers[i]=="@"+arrsquealreceiversusers[x].nickname){
            y = i;
        }
    }
    editsqueal.receivers.splice(y,1);
    savechangessqueal();
    rewritereceiverlist();
}

function adduserreceiver(x){
    editsqueal.receivers.push("@"+arrsquealreceiversusers[x].nickname);
    savechangessqueal();
    rewritereceiverlist();
}

function deletechannelreceiver(x){
    let y;
    for(i=0;i<editsqueal.receivers.length;i++){
        if(editsqueal.receivers[i]==arrsquealreceiverschannels[x].type + arrsquealreceiverschannels[x].name){
            y = i;
        }
    }
    editsqueal.receivers.splice(y,1);
    savechangessqueal();
    rewritereceiverlist();
}

function addchannelreceiver(x){
    editsqueal.receivers.push(arrsquealreceiverschannels[x]);
    savechangessqueal();
    rewritereceiverlist();
}

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
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else if(arrCHANNELS.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
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
    let filterchanneltype = document.getElementById("filterchanneltype").value;
    input = document.getElementById("searchchannel").value;
    inputsearch = input.toLowerCase();
    document.getElementById("listchannel_find").innerHTML = "";
    if(filterchanneltype=="channels"){
        let filterchannel = document.getElementById("filterchannel").value;
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
    } else {
        arrsearchCHANNEL = [];
        if(inputsearch!=""){
            for(i=0;i<arrCHANNELS.length;i++){
                let channel = ((arrCHANNELS[i].name).slice(0,inputsearch.length)).toLowerCase();
                if(inputsearch==channel){
                    arrsearchCHANNEL.push(arrCHANNELS[i]);
                }
            }
            if((arrsearchCHANNEL.length>0)&(arrsearchCHANNEL.length<7)){
                for(i=0;i<arrsearchCHANNEL.length;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else if(arrsearchCHANNEL.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
            }
        } else {
            arrsearchCHANNEL = arrCHANNELS;
            if((arrsearchCHANNEL.length>0)&(arrsearchCHANNEL.length<7)){
                for(i=0;i<arrsearchCHANNEL.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
            }
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

function showmore3(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrchannelpopularity.length>0){
        for(i=0;i<arrchannelpopularity.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless3()">Show less</p>';
    } else if(arrsearchchannel.length>0){
        for(i=0;i<arrsearchchannel.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless3()">Show less</p>';
    } else {
        for(i=0;i<arrchannels.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless3()">Show less</p>';
    }
}

function showless3(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrchannelpopularity.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
    } else if(arrsearchchannel.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
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
        document.getElementById("sectioneditchannelowners").innerHTML += '<div><p>'+editchannel.list_modifier[i]+'</p><button class="btn btn-outline-primary" onclick="deleteownerchannel('+i+')">Remove</button></div>';
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
        document.getElementById("sectioneditchannelowners").innerHTML += '<div><p>'+editchannel.list_modifier[i]+'</p><button class="btn btn-outline-primary" onclick="deleteownerchannel('+i+')">Remove</button></div>';
    }
}

document.getElementById("createnewCHANNEL").addEventListener("click",()=>{
    document.getElementById("sectioncreateCHANNEL").classList.add("d-flex");
    document.getElementById("sectioncreateCHANNEL").classList.remove("d-none");
    arrcreateCHANNELowners = [];
    arrcreateCHANNELmessages = [];
    arrcreateCHANNELownersadd = [];
    CHANNELsilenceable.checked = false;
    arrcreateCHANNELowners.push(actualuser);
    document.getElementById("sectioncreateCHANNELphoto").value = "";
    document.getElementById("sectioncreateCHANNELname").value = "";
    document.getElementById("sectioncreateCHANNELdescription").value = "";
    document.getElementById("imgnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("imgrequestnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("textnewmessageCHANNEL").value = "";
    document.getElementById("typenewmessageCHANNEL").value = "welcome";
    document.getElementById("userrequestnewmessageCHANNEL").value = "";
    document.getElementById("remindernewmessageCHANNEL").value = "day";
    document.getElementById("linknewmessageCHANNEL").value = "";
    document.getElementById("positionnewmessageCHANNEL").value = "";
    document.getElementById("linkrequestnewmessageCHANNEL").value = "";
    document.getElementById("positionrequestnewmessageCHANNEL").value = "";
    document.getElementById("searchaddownerCHANNEL").value = "";
    document.getElementById("searchaddownerCHANNELlist").classList.add('d-none');
    if(!document.getElementById("viewCHANNELownerslist").classList.contains('d-none')){
        document.getElementById("viewCHANNELownerslist").classList.add('d-none');
        document.getElementById("viewCHANNELowners").classList.remove('d-none');
    }
    if(!document.getElementById("addautomaticmessage").classList.contains('collapsed')){
        document.getElementById("addautomaticmessage").classList.add('collapsed');
        document.getElementById("flush-collapseOne").classList.add('collapse');
    }
    if(!document.getElementById("viewCHANNELmessageslist").classList.contains('d-none')){
        document.getElementById("viewCHANNELmessageslist").classList.add('d-none');
        document.getElementById("viewCHANNELmessages").classList.remove('d-none');
    }
});

document.getElementById("closecreateCHANNEL").addEventListener("click",()=>{
    document.getElementById("sectioncreateCHANNEL").classList.remove("d-flex");
    document.getElementById("sectioncreateCHANNEL").classList.add("d-none");
});

document.getElementById("closeeditCHANNEL").addEventListener("click",()=>{
    document.getElementById("sectioneditCHANNEL").style = "display:none";
});

function editCHAN(x){
    if(arrsearchCHANNEL.length>0){
        editCHANNEL = arrsearchCHANNEL[x];
    } else {
        editCHANNEL = arrCHANNELS[x];
    }
    document.getElementById("sectioneditCHANNEL").style = "display:flex";
    document.getElementById("sectioneditCHANNELsquealers").innerHTML = '<div><h3 class="me-3">Squealers</h3><button class="btn btn-outline-primary" onclick="createnewCHANNELsqueal()">Create</button><div>';
    if(editCHANNEL.photoprofile!="")
        document.getElementById("sectioneditCHANNELphoto").src = editCHANNEL.photoprofile;
    else 
        document.getElementById("sectioneditCHANNELphoto").src = "img/group_photo1.png";
    document.getElementById("sectioneditCHANNELname").innerText = editCHANNEL.name;
    document.getElementById("sectioneditCHANNELdescription").value = editCHANNEL.description;
    for(i=0;i<editCHANNEL.list_posts.length;i++){
        document.getElementById("sectioneditCHANNELsquealers").innerHTML += '<div class="card border-light mb-3" style="width: 50%;"><div class="card-header" style="background-color: #141619"><p class="card-text">'+arrsqueals[i].date+'</p></div><div class="card-body" style=" background-color: #141619"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+arrsqueals[i].body.position+'</p><a class="card-text" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center"><img id="imgsquealer" src="'+arrsqueals[i].body.img+'" class="rounded" alt="..." style="max-height: 150px;"></div></div><div class="card-footer" style="background-color: #141619;"><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletesquealCHANNEL('+i+')">Delete</button><div class="reactions" style="margin-left:40%;margin-right:5%"><img src="img/reaction_positive1.png" alt=""><img src="img/reaction_positive2.png" alt=""><img src="img/reaction_positive3.png" alt=""><span style="color:white">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="img/reaction_negative1.png" alt=""><img src="img/reaction_negative2.png" alt=""><img src="img/reaction_negative3.png" alt=""><span style="color:white">'+arrsqueals[i].neg_reactions+'</span></div></div></div>'; 
    }
}

function createnewCHANNELsqueal(){
    document.getElementById("writenewsqueal").classList.remove('d-none');
    document.getElementById("bodynewsqueal").innerHTML = "";
    document.getElementById("linknewsqueal").value = "";
    document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("positionnewsqueal").value = "";
}

document.getElementById("closewritenewsqueal").addEventListener("click",()=>{
    document.getElementById("writenewsqueal").classList.add('d-none');
});

function deletesquealerCHANNEL(x){

    savechangesCHANNEL();
}

document.getElementById("sectioneditCHANNELdelete").addEventListener("click",()=>{
    for(i=0;i<channels.length;i++){
        if(channels[i]==editCHANNEL){
            channels.splice(i,1);
        }
    }
    localStorage.setItem("lista_gruppi",JSON.stringify(channels));
    document.getElementById("sectioneditCHANNEL").style = "display:none";
    arrCHANNELS = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="$"){
            arrCHANNELS.push(channels[i]);
        }
    }
    document.getElementById("listchannel_find").innerHTML = '';
    arrsearchCHANNEL = arrCHANNELS;
    if((arrsearchCHANNEL.length>0)&(arrsearchCHANNEL.length<7)){
        for(i=0;i<arrsearchCHANNEL.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
    }
});

document.getElementById("sectioneditCHANNELdescription").addEventListener("input",()=>{
    editCHANNEL.description = document.getElementById("sectioneditCHANNELdescription").value;
    savechangesCHANNEL();
});

function savechangesCHANNEL(){
    for(i=0;i<channels.length;i++){
        if(editCHANNEL.name==channels[i].name){
            channels[i] = editCHANNEL;
        }
    }
    localStorage.setItem("lista_gruppi",JSON.stringify(channels));
}

document.getElementById("viewCHANNELowners").addEventListener("click",()=>{
    document.getElementById("viewCHANNELownerslist").classList.remove('d-none');
    document.getElementById("viewCHANNELownerslist").innerHTML = '<h3>List owners CHANNEL</h3>';
    for(i=0;i<arrcreateCHANNELowners.length;i++)
        document.getElementById("viewCHANNELownerslist").innerHTML += '<div><p>'+arrcreateCHANNELowners[i].nickname+'</p><button class="btn btn-outline-primary" onclick="removeownerCHANNEL('+i+')">Remove</button></div>';
    document.getElementById("viewCHANNELownerslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELownerslist()">Hide CHANNEL owners</button>';
    document.getElementById("viewCHANNELowners").classList.add('d-none');
});

function closeCHANNELownerslist(){
    document.getElementById("viewCHANNELownerslist").classList.add('d-none');
    document.getElementById("viewCHANNELowners").classList.remove('d-none');
}

document.getElementById("viewCHANNELmessages").addEventListener("click",()=>{
    document.getElementById("viewCHANNELmessageslist").classList.remove('d-none');
    document.getElementById("viewCHANNELmessageslist").innerHTML = '<h3>List messages CHANNEL</h3>';
    if(arrcreateCHANNELmessages.length==0){
        document.getElementById("viewCHANNELmessageslist").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no messages already added</p>';
    }
    for(i=0;i<arrcreateCHANNELmessages.length;i++){
        switch(arrcreateCHANNELmessages[i].type){
            case 'welcome':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
            break;
            case 'answer':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><p class="card-text m-1 fs-6">Request: '+arrcreateCHANNELmessages[i].request.text+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
            break;
            case 'reminder':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><p class="card-text m-1 fs-6">Remind: every '+arrcreateCHANNELmessages[i].frequency+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
            break;
        }
    }
    document.getElementById("viewCHANNELmessageslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELmessageslist()">Hide CHANNEL messages</button>';
    document.getElementById("viewCHANNELmessages").classList.add('d-none');
});

function closeCHANNELmessageslist(){
    document.getElementById("viewCHANNELmessageslist").classList.add('d-none');
    document.getElementById("viewCHANNELmessages").classList.remove('d-none');
}

document.getElementById("addautomaticmessage").addEventListener("click",()=>{
    if(document.getElementById("addautomaticmessage").classList.contains('collapsed')){
        document.getElementById("addautomaticmessage").classList.remove('collapsed');
        document.getElementById("flush-collapseOne").classList.remove('collapse');
    } else {
        document.getElementById("addautomaticmessage").classList.add('collapsed');
        document.getElementById("flush-collapseOne").classList.add('collapse');
    }
});

document.getElementById("searchaddownerCHANNEL").addEventListener("input",()=>{
    document.getElementById("searchaddownerCHANNELlist").classList.remove('d-none');
    document.getElementById("searchaddownerCHANNELlist").innerHTML = "";
    input = document.getElementById("searchaddownerCHANNEL").value;
    inputsearch = input.toLowerCase();
    arrcreateCHANNELownersadd = [];
    if(inputsearch!=""){
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arrcreateCHANNELownersadd.push(users[i]);
            }
        }
        if(arrcreateCHANNELownersadd.length>0){
            for(i=0;i<arrcreateCHANNELownersadd.length;i++){
                const inreceivers = arrcreateCHANNELowners.find(oggetto => {
                    return oggetto.nickname == arrcreateCHANNELownersadd[i].nickname;
                  });
                if(!inreceivers){
                    document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="addownerCHANNEL('+i+')">Add</button></div>';
                } else {
                    document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Added</button></div>';
                }
            }
        } else {
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        document.getElementById("searchaddownerCHANNELlist").classList.add('d-none');
    }
});

function addownerCHANNEL(x){
    let userselected = arrcreateCHANNELownersadd[x];
    arrcreateCHANNELowners.push(userselected);
    document.getElementById("viewCHANNELownerslist").innerHTML = '<h3>List owners CHANNEL</h3>';
    for(i=0;i<arrcreateCHANNELowners.length;i++)
        document.getElementById("viewCHANNELownerslist").innerHTML += '<div><p>'+arrcreateCHANNELowners[i].nickname+'</p><button class="btn btn-outline-primary" onclick="removeownerCHANNEL('+i+')">Remove</button></div>';
    document.getElementById("viewCHANNELownerslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELownerslist()">Hide CHANNEL owners</button>';
    document.getElementById("searchaddownerCHANNELlist").innerHTML = "";
    for(i=0;i<arrcreateCHANNELownersadd.length;i++){
        const inreceivers = arrcreateCHANNELowners.find(oggetto => {
            return oggetto.nickname == arrcreateCHANNELownersadd[i].nickname;
          });
        if(!inreceivers){
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="addownerCHANNEL('+i+')">Add</button></div>';
        } else {
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Added</button></div>';
        }
    }
}

function removeownerCHANNEL(x){
    arrcreateCHANNELowners.splice(x,1);
    document.getElementById("viewCHANNELownerslist").innerHTML = '<h3>List owners CHANNEL</h3>';
    for(i=0;i<arrcreateCHANNELowners.length;i++)
        document.getElementById("viewCHANNELownerslist").innerHTML += '<div><p>'+arrcreateCHANNELowners[i].nickname+'</p><button class="btn btn-outline-primary" onclick="removeownerCHANNEL('+i+')">Remove</button></div>';
    document.getElementById("viewCHANNELownerslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELownerslist()">Hide CHANNEL owners</button>';
    document.getElementById("searchaddownerCHANNELlist").innerHTML = "";
    for(i=0;i<arrcreateCHANNELownersadd.length;i++){
        const inreceivers = arrcreateCHANNELowners.find(oggetto => {
            return oggetto.nickname == arrcreateCHANNELownersadd[i].nickname;
          });
        if(!inreceivers){
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="addownerCHANNEL('+i+')">Add</button></div>';
        } else {
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Added</button></div>';
        }
    }
}

document.getElementById("typenewmessageCHANNEL").addEventListener("change",()=>{
    let select = document.getElementById("typenewmessageCHANNEL").value;
    switch(select){
        case 'welcome':
            document.getElementById("remindernewmessageCHANNEL").classList.add('d-none');
            document.getElementById("requestnewmessageCHANNEL").classList.add('d-none');
        break;
        case 'answer':
            document.getElementById("remindernewmessageCHANNEL").classList.add('d-none');
            document.getElementById("requestnewmessageCHANNEL").classList.remove('d-none');

        break;
        case 'reminder':
            document.getElementById("remindernewmessageCHANNEL").classList.remove('d-none');
            document.getElementById("requestnewmessageCHANNEL").classList.add('d-none');
        break;
    }
});

document.getElementById("addnewmessageCHANNEL").addEventListener("click",()=>{
    let textmessage = document.getElementById("textnewmessageCHANNEL").value;
    let textmessage_empty = textmessage.replace(/\s/g,"");
    let select = document.getElementById("typenewmessageCHANNEL").value;
    let userrequesttext = document.getElementById("userrequestnewmessageCHANNEL").value;
    let request = userrequesttext.replace(/\s/g,"");
    let frequencymessage = document.getElementById("remindernewmessageCHANNEL").value;
    let link = document.getElementById("linknewmessageCHANNEL").value;
    let photo = document.getElementById("imgnewmessageCHANNEL").src;
    let position = document.getElementById("positionnewmessageCHANNEL").value;
    let linkrequest = document.getElementById("linkrequestnewmessageCHANNEL").value;
    let photorequest = document.getElementById("imgrequestnewmessageCHANNEL").src;
    let positionrequest = document.getElementById("positionrequestnewmessageCHANNEL").value;
    let newmessage;
    switch(select){
        case 'welcome':
            if((textmessage_empty!="")|(link!="")|(photo!="")|(position!="")){
            newmessage = {type:select, text:textmessage, link:link, photo:photo, position:position};
            arrcreateCHANNELmessages.push(newmessage);
            } else {
                alert("The message is empty!");
            }
        break;
        case 'answer':
            if((textmessage_empty!="")|(link!="")|(photo!="")|(position!="")){
                if(request!=""){
                newmessage = {type:select, request:{text:userrequesttext, link:linkrequest, photo:photorequest, position:positionrequest}, text:textmessage, link:link, photo:photo, position:position};
                arrcreateCHANNELmessages.push(newmessage);
                } else {
                    alert("User request not valid");
                }
            } else {
                alert("The message is empty!");
            }
        break;
        case 'reminder':
            if((textmessage_empty!="")|(link!="")|(photo!="")|(position!="")){
                newmessage = {type:select, frequency:frequencymessage, text:textmessage, link:link, photo:photo, position:position};
                arrcreateCHANNELmessages.push(newmessage);
            } else {
                alert("The message is empty!");
            }
        break;
    }
    if(!document.getElementById("viewCHANNELmessageslist").classList.contains('d-none')){
    document.getElementById("viewCHANNELmessageslist").innerHTML = '<h3>List messages CHANNEL</h3>';
        for(i=0;i<arrcreateCHANNELmessages.length;i++){
            switch(arrcreateCHANNELmessages[i].type){
                case 'welcome':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
                break;
                case 'answer':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><p class="card-text m-1 fs-6">Request: '+arrcreateCHANNELmessages[i].request.text+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
                break;
                case 'reminder':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><p class="card-text m-1 fs-6">Remind: every '+arrcreateCHANNELmessages[i].frequency+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
                break;
            }
        }
        document.getElementById("viewCHANNELmessageslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELmessageslist()">Hide CHANNEL messages</button>';
    }
    document.getElementById("textnewmessageCHANNEL").value = "";
    document.getElementById("typenewmessageCHANNEL").value = "welcome";
    document.getElementById("userrequestnewmessageCHANNEL").value = "";
    document.getElementById("remindernewmessageCHANNEL").value = "day";
    document.getElementById("linknewmessageCHANNEL").value = "";
    document.getElementById("imgnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("positionnewmessageCHANNEL").value = "";
    document.getElementById("linkrequestnewmessageCHANNEL").value = "";
    document.getElementById("imgrequestnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("positionrequestnewmessageCHANNEL").value = "";
    if(!document.getElementById("remindernewmessageCHANNEL").classList.contains('d-none'))
        document.getElementById("remindernewmessageCHANNEL").classList.add('d-none');
    if(!document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
        document.getElementById("requestnewmessageCHANNEL").classList.add('d-none');
});

function deletenewmessageCHANNEL(x){
    arrcreateCHANNELmessages.splice(x,1);
    document.getElementById("viewCHANNELmessageslist").innerHTML = '<h3>List messages CHANNEL</h3>';
        for(i=0;i<arrcreateCHANNELmessages.length;i++){
            switch(arrcreateCHANNELmessages[i].type){
                case 'welcome':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
                break;
                case 'answer':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><p class="card-text m-1 fs-6">Request: '+arrcreateCHANNELmessages[i].request.text+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
                break;
                case 'reminder':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card bg-transparent border-0" style="width: 70%"><section class="card-body"><p class="card-text m-1 fs-6">Type: '+arrcreateCHANNELmessages[i].type+'</p><p class="card-text m-1 fs-6 text-center">Message: '+arrcreateCHANNELmessages[i].text+'</p><p class="card-text m-1 fs-6">Remind: every '+arrcreateCHANNELmessages[i].frequency+'</p><button class="btn btn-primary mt-2" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></section></div>';
                break;
            }
        }
    document.getElementById("viewCHANNELmessageslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELmessageslist()">Hide CHANNEL messages</button>';
}

document.getElementById("btncreatenewCHANNEL").addEventListener("click",()=>{
    let photo = document.getElementById("sectioncreateCHANNELphoto").value;
    let name = document.getElementById("sectioncreateCHANNELname").value;
    let description = document.getElementById("sectioncreateCHANNELdescription").value;
    let silenceable = CHANNELsilenceable.checked;
    let list_modifier = arrcreateCHANNELowners;
    let list_mess = arrcreateCHANNELmessages;
    let creator = actualuser.nickname;
    let name_empty = name.replace(/\s/g,"");
    let Valid = true;
    if((name_empty!="")&(name_empty.length>=3)&(description!="")&(list_modifier.length>0)&(list_mess.length>=3)){
        for(i=0;i<channels.length;i++){
            if(name==channels[i].name){   //per evitare che ci siano più gruppi con lo stesso nome
                Valid = false;
                alert("Name already used");
            }
        }
        if(Valid){
        let newCHANNEL = {creator:creator, photoprofile:photo, name:name, description:description, silenceable:silenceable, list_modifier:list_modifier, list_mess:list_mess, type:'$', list_posts:[], list_users:[]};
        channels.push(newCHANNEL);
        localStorage.setItem("lista_gruppi",JSON.stringify(channels));
        alert("CHANNEL creation successfully");
        document.getElementById("sectioncreateCHANNEL").classList.remove("d-flex");
        document.getElementById("sectioncreateCHANNEL").classList.add("d-none");
        document.getElementById("sectioncreateCHANNEL").innerHTML = "";
        document.getElementById("listchannel_find").innerHTML = "";
        for(i=0;i<channels.length;i++){
            if(channels[i].type=="$"){
                arrCHANNELS.push(channels[i]);
            }
        }
            if((arrCHANNELS.length>0)&(arrCHANNELS.length<7)){
                for(i=0;i<arrCHANNELS.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else if(arrCHANNELS.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:white">No Results</h5><p style="color:white">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore3()">Show more</p>';
            }
        }
    } else {
        alert("Some information are invalid or missing! Please try again.");
    }
});

function clearnewsqueal(){
    document.getElementById("bodynewsqueal").innerHTML = "";
    document.getElementById("textnewsqueal").value = ""
    document.getElementById("linknewsqueal").value = "";
    document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("positionnewsqueal").value = "";
}

document.getElementById("linknewsqueal").addEventListener("input",()=>{
    if(document.getElementById("linknewsqueal").value!="");
    document.getElementById("bodynewsqueal").innerHTML += '<p class="text-light text-start mt-3"><a  href="'+document.getElementById("linknewsqueal").value+'" style="width:100%">'+document.getElementById("linknewsqueal").value+'</a></p>';
});

document.getElementById("sendnewsqueal").addEventListener("click",()=>{
    let text = document.getElementById("textnewsqueal").value;
    let link = document.getElementById("linknewsqueal").value;
    let img = document.getElementById("imgnewsqueal").src;
    let position = document.getElementById("positionnewsqueal").value;
    if((text!="")|(link!="")|(img!="")|(position!="")){
        const data = new Date();
        let sender = editCHANNEL.name;
        let month;
        if((data.getMonth()+1)<10){
            month = "0" + (data.getMonth()+1);
        } else {
            month = data.getMonth()+1;
        }
        let day;
        if(data.getDate()<10){
            day = "0" + data.getDate();
        } else {
            day = data.getDate();
        }
        let date = data.getFullYear() + "-" + month + "-" + day;
        let minutes = data.getMinutes();
        if(minutes<10){
            minutes = "0" + minutes;
        }
        let hour = data.getHours() + ":" + minutes;
        let receivers = [];
        for(i=0;i<editCHANNEL.list_users.length;i++){
            receivers.push("@" + editCHANNEL.list_users[i].nickname);
        }
        for(i=0;i<editCHANNEL.list_modifier.length;i++){
            receivers.push("@" + editCHANNEL.list_modifier[i].nickname);
        }
        squeals.unshift({sender:sender, body:{text:text, link:link, img:img, position:position}, date:date, hour:hour, photoprofile:editCHANNEL.photoprofile, pos_reactions:0, neg_reactions:0, category:undefined, receivers:receivers});
        localStorage.setItem("lista_messaggi",JSON.stringify(squeals));
        editCHANNEL.list_posts.push({sender:sender, body:{text:text, link:link, img:img, position:position}, date:date, hour:hour, photoprofile:editCHANNEL.photoprofile, pos_reactions:0, neg_reactions:0, category:undefined, receivers:receivers});
        document.getElementById("textnewsqueal").value = "";
        document.getElementById("linknewsqueal").value = "";
        document.getElementById("positionnewsqueal").value = "";
        document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        savechangesCHANNEL();
        document.getElementById("writenewsqueal").classList.add('d-none');
    } else {
        alert("The message is empty!");
    }
});

/*-------------------------------------Accesso fotocamera---------------------------------------------------- */

const videoElement = document.getElementById('webcam');
const startButton = document.getElementById('avviaFotocamera');
const captureButton = document.getElementById('catturaFoto');
const canvas = document.getElementById('canvas');
const capturedPhoto = document.getElementById('fotoCatturata');
const usePhoto = document.getElementById('usephoto');
let mediaStream = null;


function accesscamera(x){
    num_message = x;
    document.getElementById("access-camera").classList.remove("d-none");
    document.getElementById("access-camera").classList.add("d-flex");
}

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.classList.remove("d-none");
        videoElement.srcObject = stream;
        capturedPhoto.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        capturedPhoto.classList.add("d-none");
        usePhoto.classList.add("d-none");
        mediaStream = stream;
    } catch (error) {
        console.error('Errore durante l\'accesso alla fotocamera:', error);
    }
});

captureButton.addEventListener('click', () => {
    if (mediaStream) {
        // Cattura un'immagine dalla fotocamera e visualizzala su un elemento canvas
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Mostra l'immagine catturata su un elemento immagine
        capturedPhoto.src = canvas.toDataURL('image/jpeg');
        if(num_message==1){
            document.getElementById("imgnewmessageCHANNEL").src = capturedPhoto.src;
        } else if(num_message==2){
            document.getElementById("imgrequestnewmessageCHANNEL").src = capturedPhoto.src;
        } else if(num_message==3){
            document.getElementById("imgnewsqueal").src = capturedPhoto.src;
            document.getElementById("bodynewsqueal").innerHTML += '<img class="img-fluid mt-3" style="width:160px;height:120px" src="'+capturedPhoto.src+'"></img>';
        }
        capturedPhoto.classList.remove("d-none");
        videoElement.classList.add("d-none");
        usePhoto.classList.remove("d-none");
        //blocca il mediaStream
        mediaStream.getTracks().forEach(track => track.stop());
    }
});

usePhoto.addEventListener("click",()=>{
    document.getElementById("access-camera").classList.add("d-none");
    capturedPhoto.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    capturedPhoto.classList.add("d-none");
    usePhoto.classList.add("d-none");
});

document.getElementById("closetakephoto").addEventListener("click",()=>{
    document.getElementById("access-camera").classList.add("d-none");
    capturedPhoto.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    capturedPhoto.classList.add("d-none");
    usePhoto.classList.add("d-none");
});

/*-------------------------------------Accesso geolocalizzazione----------------------------------------------*/

function getposition(x){
    num_message = x;
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
    if(data.address.house_number!=undefined){
    var road = data.address.road + ", " + data.address.house_number;
    } else {
        var road = data.address.road;
    }
    let city = data.address.city;
    let country = data.address.country;    
    if(num_message==1){
        document.getElementById("positionnewmessageCHANNEL").value += road + " " + city + " " + country;
    } else if(num_message==2){
        document.getElementById("positionrequestnewmessageCHANNEL").value += road + " " + city + " " + country;
    } else if(num_message==3){
        document.getElementById("bodynewsqueal").innerHTML += '<p class="text-light mt-3 text-start">Position: '+road + " " + city + " " + country+'</p>';
    }
};