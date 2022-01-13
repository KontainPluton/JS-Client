let baliseVols = document.getElementById('vols')
let baliseChambres = document.getElementById('chambres')

let submitHotelForm = document.getElementById('hotelForm')
let dateArrive = document.getElementById('dateArrive')
let dateDepart = document.getElementById('dateDepart')

init()

function init() {
    getJSON("http://localhost:8080/java_restserver_war_exploded/api/compagnies/1/vols/17/places")
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
        
        console.log(dateArrive.value)
        console.log(dateDepart.value)
    })
}

function getJSON(url) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')
    headers.append('Access-Control-Allow-Origin', 'http://localhost:8080')
    headers.append('Access-Control-Allow-Credentials', 'true')
    headers.append('GET', 'POST', 'OPTIONS')

    fetch(url, {
        method: 'GET',
        headers: headers})
    .then(function(response) {
        response.json().then(function(response) {
            console.log(response)
            response.forEach(element => {
                let button = document.createElement('a')
                button.innerHTML = element.numero_place
                button.className = element.available ? 'btn btn-success' : 'btn btn-dark disabled'
                button.setAttribute('role', 'button')
                baliseVols.appendChild(button)
            });
        } 
    )})
    .catch(err => console.log(err))
}