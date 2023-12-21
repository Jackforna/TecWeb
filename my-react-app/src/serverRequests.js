export async function getUsers(){
    try {
        const response = await fetch('http://localhost:8080/get-users');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function addUser(userData) {
    try {
        const response = await fetch('http://localhost:8080/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const response = await fetch(`http://localhost:8080/get-user/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function getActualUser() {
    try {
        let actualUserId = JSON.parse(localStorage.getItem("actualUserId"));
        const response = await fetch(`http://localhost:8080/get-user/${actualUserId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function getListChannels() {
    try {
        const response = await fetch('http://localhost:8080/get-listChannels');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function getListSqueals() {
    try {
        const response = await fetch('http://localhost:8080/get-listSqueals');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data.reverse();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function updateUsers(updatedUsers) {
    try {
        const response = await fetch('http://localhost:8080/update-users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUsers)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function updateSqueals(updatedSqueals) {
    try {
        const response = await fetch('http://localhost:8080/update-squeals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSqueals)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function updateChannels(updatedChannels) {
    try {
        const response = await fetch('http://localhost:8080/update-channels', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedChannels)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

export async function addSqueal(squealData) {
    try {
        const response = await fetch('http://localhost:8080/add-squeal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(squealData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

export async function addChannel(channelData) {
    try {
        const response = await fetch('http://localhost:8080/add-channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(channelData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}