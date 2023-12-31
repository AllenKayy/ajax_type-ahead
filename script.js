const searchEl = document.querySelector('#search');
const suggestionsEl = document.querySelector('.search_result');

const apiURL = 'https://restcountries.com/v3.1/all';

const countries = [];

const fetchCountry = async () => {
    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error('Netwrok response not ok');
        }

        const data = await response.json();
        countries.push(...data)
    } catch (err) {
        console.error("Failed to fetch", err.message);
        suggestionsEl.innerHTML = "<li>Error fetching data. Kindly try again later.</li>";
        suggestionsEl.style.color = "#ff0000";
    }
};

const filterInput = (userInput) => {
    userInput = userInput.toLowerCase();
    
    return countries.filter((country) => {
        const countryName = country.name.common.toLowerCase().includes(userInput);
        const countryRegion = country.region.toLowerCase().includes(userInput);
        const officialName = country.cca3.toLowerCase().includes(userInput);

        return countryName || countryRegion ||  officialName;
    });
};

const displaySuggestions = (searchInput) => {
    const trimmedInput = searchInput.trim();

    if (trimmedInput === '') {
        suggestionsEl.innerHTML = '';
        return;
    }

    const suggestionArray = filterInput(trimmedInput);

    if (suggestionArray.length === 0) {
        suggestionsEl.innerHTML = "<li>No matching countries found</li>";
        suggestionsEl.style.color = "#ff0000";
        return;
    }

    const filteredList = suggestionArray
        .map(country =>
            `
            <li class="item_hover">
                <span >
                ${country.name.common}, ${country.cca3}
                </span>
                <span class="official_name">
                ${country.subregion}, ${country.region}
                </span>
            </li>
        `
        )
        .join('');
    suggestionsEl.innerHTML = filteredList;
    suggestionsEl.style.color = "#000";
};

const inputChange = () => {
    const searchInput = searchEl.value;
    displaySuggestions(searchInput);

    if (searchInput.trim() === '') {
        suggestionsEl.innerHTML = "<li>Please enter a search query</li>"
        suggestionsEl.style.color = "#ff0000";
    }
};

// searchEl.addEventListener('focus', () => {
//     const searchInput = searchEl.value;
//     if (searchInput.trim() === '') {
//         displaySuggestions(searchInput);
//     }
// });

// const clearInputAndSuggestions = () => {
//     searchEl.value = '';
//     suggestionsEl.innerHTML = '';
// };

const clickSuggestion = (e) => {
    if (e.target.tagName === "LI") {
        const selectedSuggestion = e.target.innerText;
        const country = selectedSuggestion.split(',')[0].trim();
        searchEl.value = country;
    }
};

const keyNavigation = (e) => {
    const suggestionItems = suggestionsEl.querySelectorAll('li');
    const activeItem = suggestionsEl.querySelector('.active');

    if (e.key === 'ArrowDown') {
        e.preventDefault();

        if (activeItem) {
            const nextItem = activeItem.nextElementSibling;
            if (nextItem) {
                activeItem.classList.remove('active');
                nextItem.classList.add('active');
            }
        } else if (suggestionItems.length > 0) {
            suggestionItems[0].classList.add('active');
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();

        if (activeItem) {
            const prevItem = activeItem.previousElementSibling;
            if (prevItem) {
                activeItem.classList.remove('active');
                prevItem.classList.add('active');
            }
        }
    } else if (e.key === 'Enter' && activeItem) {
        const selectedSuggestion = activeItem.innerText;
        const country = selectedSuggestion.split(',')[0].trim();
        searchEl.value = country;
    }
};

searchEl.addEventListener('input', inputChange);
searchEl.addEventListener('keydown', keyNavigation);
suggestionsEl.addEventListener('click', clickSuggestion);

fetchCountry();
