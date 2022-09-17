const marker = document.querySelector('#marker')
const cityContainer = document.getElementById('cityContainer')
const displayTime = document.getElementById('time')
let zoneTime

// Get coordinates and size for slider wrt the selected city
function indicator(e){
    marker.style.left = e.offsetLeft+"px"
    marker.style.width = e.offsetWidth+"px"
}

/* On city click, remove text styles from all elements, 
    and add them to the selected city */
function highlightCity(e){
    let cityTags = document.querySelectorAll('nav ul li')
    cityTags.forEach(data => {
        data.style.color = 'rgba(0, 0, 0, 0.33)'
        data.classList.add('cityHover', 'pointer')
    })
    e.style.color = '#000'
    e.classList.remove('cityHover', 'pointer')
}

// Get time in selected city's timezone
function getTime(zone){
    let getTime = new Date().toLocaleTimeString("en-US", {
        timeZone:zone,
        timeStyle:'full',
        hourCycle:'h24'
    })
    let reqTime = getTime.split(' ')[0]
    displayTime.innerHTML = `${reqTime}`
}

function displayCities(data){
    // Map data from navigation and add class / data
    data.forEach((city, idx) => {
        let listItem = document.createElement('li')
        listItem.setAttribute('class', 'cityTag')
        listItem.innerHTML = city.label
        /* On click, add changes to slider and text.
            Clear previous time and add selected city time */
        listItem.addEventListener('click', (e) => {
            indicator(e.target)
            highlightCity(e.target)
            clearInterval(zoneTime)
            zoneTime = setInterval(getTime, 500, city.timeZone)
        })

        cityContainer.appendChild(listItem)

        // Pre-select first city on app start, add non-selected options to the rest.
        if(idx === 0){
            listItem.style.color = '#000'
            indicator(listItem)
            zoneTime = setInterval(getTime, 500, city.timeZone)
        } else {
            listItem.classList.add('cityHover', 'pointer')
        }
    })
}

// get city data from navigation.
fetch('./data/navigation.json')
    .then(res => {
        if(res.ok){
            return res.json()
        } else {
            throw new Error('Something went wrong!')
        }
    })
    .then(data => displayCities(data.cities))
