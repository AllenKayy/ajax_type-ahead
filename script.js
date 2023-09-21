const searchEl = document.querySelector('#search');
const sugestionsEl = document.querySelector('.search_result')

const apiURL = 'https://restcountries.com/v3.1/all'

const countries = [];
const fetchCountry = async () => {
    try {
        const response = await fetch(apiURL)
        const data = await response.json()
        countries.push(...data)
        // countries = data
            // .then(res => res.json())
            // .then(data => countries.push(...data), console.log(countries))

        
    } catch (error) {
        console.log(error)
    }
}

const filterInput = (userInput, countries) => {
    const filteredCountries = countries.filter(country => {
        const regex = new RegExp(userInput, 'gi')
        return country.name.common.match(regex) || country.name.official.match(regex)
        
    })

    console.log(filteredCountries)
}

const displaySuggestions = () => {
    const suggestionsArray = filterInput(cities)
}

searchEl.addEventListener('keyup', displaySuggestions)

fetchCountry();
