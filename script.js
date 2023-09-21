const searchEl = document.querySelector('#search');
const suggestionsEl = document.querySelector('.search_result')

const apiURL = 'https://restcountries.com/v3.1/all'

const countries = [];
const fetchCountry = async () => {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        countries.push(...data)
        // countries = data
            // .then(res => res.json())
            // .then(data => countries.push(...data), console.log(countries))

        
    } catch (error) {
        console.error(error)
    }
}

const filterInput = (userInput, countries) => {
    userInput = userInput.toLowerCase()
    return countries.filter(country => {
        const countryName = country.name.common.toLowerCase().includes(userInput);
        const countryRegion = country.region.toLowerCase().includes(userInput);
        const officialName = country.name.official.toLowerCase().includes(userInput);

        return countryName || countryRegion || officialName;
        
    })
    // return filteredCountries;
}

const displaySuggestions = (searchInput) => {
    const trimmedInput = searchInput.trim();
    if (trimmedInput === '') {
        suggestionsEl.innerHTML = "<li>Please enter a search query</li>";
        suggestionsEl.style.color = "#ff0000";
        return;
    }
    const suggestionArray = filterInput(searchInput.value, countries);
    if (suggestionArray.length === 0) {
        suggestionsEl.innerHTML = "<li>No matching countries found</li>";
        suggestionsEl.style.color = "#ff0000";
        return;
    }

    const filteredList = suggestionArray.map(country => 
        `
            <li>
                ${country.name.common}, ${country.region}
                <span class="official_name">${country.name.official}</span>
            </li>
        `
    ).join('');
    suggestionsEl.innerHTML = filteredList;
}

const inputChange = (searchInput) => {
    searchInput = searchEl.value;
    displaySuggestions(searchInput);
}

const clickSuggestion = (e) => {
    if(e.target.tagName === "LI") {
        searchEl.value = e.target.innerText;
        suggestionsEl.style.display = "none";
    }
}

searchEl.addEventListener('input', inputChange);
searchEl.addEventListener('keyup', displaySuggestions);
suggestionsEl.addEventListener('click', clickSuggestion)

fetchCountry();