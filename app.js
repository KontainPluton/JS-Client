let baliseVols = document.getElementById('vols')
let baliseChambres = document.getElementById('chambres')

getJSON("http://localhost:8080/java_restserver_war_exploded/api/compagnies/1/vols/17/places/17")
console.log

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
            //todo affichage
        } 
    )})
    .catch(err => console.log(err))

}