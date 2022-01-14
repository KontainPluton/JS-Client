let baliseVols = document.getElementById('vols')
let chambres = document.getElementById('chambres')

let submitHotelForm = document.getElementById('hotelForm')
let dateArrive = document.getElementById('dateArrive')
let dateDepart = document.getElementById('dateDepart')
let idSelectedRoom = null

let headers = new Headers()
headers.append('Content-Type', 'application/json')
headers.append('Accept', 'application/json')
headers.append('Access-Control-Allow-Origin', 'http://localhost:8090')
headers.append('Access-Control-Allow-Credentials', 'true')
headers.append('GET', 'POST', 'OPTIONS')

init()

function init() {
    initPlaces("http://localhost:8090/java_restserver_war_exploded/api/compagnies/1/vols/17/places")
    initChambres("http://localhost:8090/java_restserver_war_exploded/api/rooms")
    initForm()
}

function initForm() {
    console.log('init form')
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
        let url = "http://localhost:8090/java_restserver_war_exploded/api/rooms/" + idSelectedRoom 
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
        console.log(dateArrive.value)
        console.log(dateDepart.value)
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
                        fetch(url + element.numero_place, {
                            method: 'POST',
                            headers: headers
                        })
                        .then(function(response) {
                            response.json().then(function(response) {
                                //todo gérer la réponse
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
                button.addEventListener('click', function(event) {
                    button.className = 'btn btn-warning'
                    idSelectedRoom = element.room_number
                    for(j = 1; j < i; j++) {
                        if(j != idSelectedRoom) {
                            btn = document.getElementById(j)
                            btn.className = 'btn btn-dark disabled'
                            btn.addEventListener('click', null)
                        }
                    }
                })
                chambres.appendChild(button)
                i++
            })
        })
    })
    .catch(err => console.error(err))
}