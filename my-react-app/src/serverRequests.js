export function getUsers(){
    fetch('http://localhost:8080/get-users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        return(data);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
}

export function addUser(userData) {
    fetch('http://localhost:8080/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

export function getUserById(id) {
    fetch(`http://localhost:8080/get-user/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

function getActualUser(){
    let actualUserId = JSON.parse(localStorage.getItem("actualUserId"));
    fetch(`http://localhost:8080/get-user/${actualUserId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        actualuser = data;
        console.log(actualuser);
    })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

export function getListChannels(){
    fetch('http://localhost:8080/get-listChannels')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return(data);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
}

export function getListSqueals(){
    fetch('http://localhost:8080/get-listSqueals')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return(data.reverse());
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
}

export function updateUsers(updatedUsers) {
    fetch('http://localhost:8080/update-users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUsers)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            getActualUser();
            console.log(data);
        })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

export function updateSqueals(updatedSqueals) {
    fetch('http://localhost:8080/update-squeals', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSqueals)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            console.log(data);
        })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

export function updateChannels(updatedChannels) {
    fetch('http://localhost:8080/update-channels', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedChannels)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            console.log(data);
        })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

export function addSqueal(squealData) {
    fetch('http://localhost:8080/add-squeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(squealData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

export function addChannel(channelData) {
    fetch('http://localhost:8080/add-channel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channelData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}