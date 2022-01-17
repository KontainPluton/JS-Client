let baliseVols = document.getElementById('vols')
let chambres = document.getElementById('chambres')

let submitHotelForm = document.getElementById('hotelForm')
let dateArrive = document.getElementById('dateArrive')
let dateDepart = document.getElementById('dateDepart')
let idSelectedRoom = null
let maxRoom = null
let onClickFirst = []
const serverName = "java_restserver_war"

let headers = new Headers()
headers.append('Content-Type', 'application/json')
headers.append('Accept', 'application/json')
headers.append('Access-Control-Allow-Origin', '*')
headers.append('Access-Control-Allow-Credentials', 'true')
headers.append('GET', 'POST', 'OPTIONS')

function initKeycloak() {
    var keycloak = new Keycloak();
    keycloak.init({
        onLoad:'login-required'
    }).then(function(authenticated) {
        alert(authenticated ? 'authenticated' : 'not authenticated');
        headers.append('Authorization', 'Bearer ' + keycloak.token)
        console.log(keycloak.token)
        init()
    }).catch(function(err) {
        console.log(err)
        alert('failed to initialize');
    });
}

function init() {
    initPlaces("http://localhost:8090/" + serverName + "/api/compagnies/company_1/vols/17/places")
    initChambres("http://localhost:8090/" + serverName + "/api/rooms")
    initForm()
}

function initForm() {
    dateDepart.setAttribute('disabled', 'disabled')
    dateArrive.addEventListener('change', function() {
        if(dateArrive.value != "") {
            dateDepart.removeAttribute('disabled')
            dateDepart.setAttribute('min', dateArrive.value)
        }
        else {
            dateDepart.setAttribute('disabled', 'disabled')
        }
    })

    submitHotelForm.addEventListener('submit', function(event) {
        event.preventDefault()
        if(idSelectedRoom == null) {
            alert("Veuillez sélectionner une chambre")
        }
        else {
        let url = "http://localhost:8090/" + serverName + "/api/rooms/" + idSelectedRoom 
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({dateDepart: dateDepart.value, dateArrive: dateArrive.value})})
        .then(function(response) {
            response.json().then(function(response) {
                response ? alert('Réservation réussis') : alert('Impossible de réserver à ces dates')
                location.reload()
            })
        })
        }
    })
}

function initPlaces(url) {
    fetch(url, {
        method: 'GET',
        headers: headers})
    .then(function(response) {
        response.json().then(function(response) {
            response.forEach(element => {
                let button = document.createElement('a')
                button.innerHTML = element.numero_place
                button.className = element.available ? 'btn btn-success' : 'btn btn-dark disabled'
                button.setAttribute('role', 'button')
                if(element.available) {
                    button.addEventListener('click', function(event) {
                        fetch(url + "/" + element.numero_place, {
                            method: 'POST',
                            headers: headers
                        })
                        .then(function(response) {
                            response.json().then(function(response) {
                                response ? alert('Réservation réussis') : alert('Impossible de réserver cette place')
                                location.reload()
                            })
                        })
                        .catch(err => console.error(err))
                    })
                }
                baliseVols.appendChild(button)
            });
        }
    )})
    .catch(err => console.error(err))
}

function initChambres(url) {
    fetch(url, {
        method: 'GET',
        headers: headers})
    .then(function(response) {
        response.json().then(function(response) {
            let i = 1
            response.forEach(element => {
                let button = document.createElement('a')
                button.innerHTML = element.room_number
                button.className = 'btn btn-success'
                button.id = i
                button.setAttribute('role', 'button')
                onClickFirst[i] = listenerFirstClick.bind(null, element.room_number)
                button.addEventListener('click', onClickFirst[i])
                chambres.appendChild(button)
                i++
            })
            maxRoom = i
        })
    })
    .catch(err => console.error(err))
}

function listenerFirstClick(index) {
    idSelectedRoom = index
    for(j = 1; j < maxRoom; j++) {
        btn = document.getElementById(j)
        btn.removeEventListener('click', onClickFirst[j])
        if(j != idSelectedRoom) {
            btn.className = 'btn btn-dark disabled'
        }
        else {
            btn.className = 'btn btn-warning'
            btn.addEventListener('click', listenerSecondClick)
        }
    }
}

function listenerSecondClick() {
    for(j = 1; j < maxRoom; j++) {
        btn = document.getElementById(j)
        if(j == idSelectedRoom) {
            btn.removeEventListener('click', listenerSecondClick)
        }
        btn.className = 'btn btn-success'
        onClickFirst[j] = listenerFirstClick.bind(null, j)
        btn.addEventListener('click', onClickFirst[j])
    }
    idSelectedRoom = null
}