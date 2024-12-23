async function fetchAllCountries() {
    const url_all = `https://restcountries.com/v3.1/all`;

    try {
        const response = await fetch(url_all);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const response_json = await response.json();

        return response_json;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}

async function fetchCountriesByName(name) {
    const url_name = `https://restcountries.com/v3.1/name/${name}`;

    try {
        const response = await fetch(url_name);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const response_json = await response.json();
        return response_json;
    } catch (error) {
        console.error('Error fetching country by name:', error);
        return [];
    }
}

async function insertCountries(countries) {
    const bodyCountries = document.querySelector('.body-countries');
    bodyCountries.innerHTML = '';

    let regioes = []

    if (countries.length === 0) {
        bodyCountries.innerHTML = '<p>No countries found</p>';
        return;
    }

    for (let i = 0; i < countries.length; i++) {
        if (!regioes.includes(countries[i].region)) {
            regioes.push(countries[i].region)
        }

        bodyCountries.innerHTML += `
            <div class="card">
                <img class="card-img-top" src=${countries[i].flags.svg} alt="Flag of ${countries[i].name.common}">
                <div class="card-body">
                    <h5 class="card-title">${countries[i].name.common}</h5>
                    <span>Population: ${countries[i].population}</span>
                    </br>
                    <span>Region: ${countries[i].region}</span>
                    </br>
                    <span>Capital: ${countries[i].capital || 'N/A'}</span>
                </div>
            </div>
        `;
    }
}

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

async function main() {
    const allCountries = await fetchAllCountries();

    const inputSearch = document.querySelector('.form-control');
    const formSelect = document.querySelector('.form-select');

    insertCountries(allCountries);

    const handleSearch = debounce(async (event) => {
        const searchValue = event.target.value.trim();

        if (searchValue) {
            const filteredCountries = await fetchCountriesByName(searchValue)
            
            let newfilteredCountries = filteredCountries.filter(country => 
                country.name.common.toLowerCase().startsWith(searchValue.toLowerCase())
            );  
              
            insertCountries(newfilteredCountries);
        } else {
            insertCountries(allCountries);
        }
    }, 300);
    inputSearch.addEventListener('keydown', handleSearch);

    formSelect.addEventListener('change', async (event) => {
        const region = event.target.value;

        if (region === 'all') {
            insertCountries(allCountries);
            return;
        }

        const filteredCountries = allCountries.filter((country) => country.region === region);
        insertCountries(filteredCountries);
    });
}

main();
