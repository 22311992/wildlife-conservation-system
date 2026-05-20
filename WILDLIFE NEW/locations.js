// locations.js - COMPLETE FIXED SUPABASE VERSION

function getCurrentUser() {

    const stored =
        localStorage.getItem(
            'wildlife_conservation_user'
        );

    if (stored) {
        return JSON.parse(stored);
    }

    return null;
}

function logout() {

    localStorage.removeItem(
        'wildlife_conservation_user'
    );

    window.location.href =
        'index.html';
}

function formatDate() {

    const options = {

        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Date()
        .toLocaleDateString(
            'en-US',
            options
        );
}

function updateDateTime() {

    const dateElement =
        document.getElementById(
            'currentDate'
        );

    if (dateElement) {

        dateElement.textContent =
            formatDate();
    }
}

function getCountryFlag(country) {

    const flags = {

        'Morocco':'🇲🇦',
        'Kenya':'🇰🇪',
        'Tanzania':'🇹🇿',
        'South Africa':'🇿🇦',
        'India':'🇮🇳',
        'China':'🇨🇳',
        'Brazil':'🇧🇷',
        'Australia':'🇦🇺'
    };

    return flags[country] || '📍';
}

async function fetchAnimals() {

    const { data, error } =
        await supabaseClient
        .from('animals')
        .select(`
            animal_id,
            common_name,
            image_emoji
        `)
        .order(
            'common_name',
            { ascending: true }
        );

    if (error) {

        console.error(
            'ANIMALS ERROR:',
            error
        );

        return [];
    }

    console.log(
        'ANIMALS:',
        data
    );

    return data;
}

async function loadAnimalDropdown() {

    const select =
        document.getElementById(
            'locationPrimarySpecies'
        );

    if (!select) return;

    const animals =
        await fetchAnimals();

    select.innerHTML =
        `
        <option value="">
            -- Select a primary species --
        </option>
        `;

    if (animals.length === 0) {

        select.innerHTML +=
            `
            <option value="">
                No animals found
            </option>
            `;

        return;
    }

    animals.forEach(animal => {

        const option =
            document.createElement(
                'option'
            );

        option.value =
            animal.common_name;

        option.textContent =
            `${animal.image_emoji || '🦁'} ${animal.common_name}`;

        select.appendChild(option);
    });
}

async function fetchLocations() {

    const { data, error } =
        await supabaseClient
        .from('locations')
        .select(`
            location_id,
            location_name,
            area_km2,
            latitude,
            longitude,
            location_type,
            countries (
                country_name
            )
        `)
        .order(
            'location_name',
            { ascending: true }
        );

    if (error) {

        console.error(
            'LOCATIONS ERROR:',
            error
        );

        return [];
    }

    return data;
}

async function renderLocations() {

    let locations =
        await fetchLocations();

    const searchTerm =
        document.getElementById(
            'searchInput'
        )?.value
        .toLowerCase() || '';

    if (searchTerm) {

        locations =
            locations.filter(l =>

                l.location_name
                ?.toLowerCase()
                .includes(searchTerm)

                ||

                l.countries
                ?.country_name
                ?.toLowerCase()
                .includes(searchTerm)
            );
    }

    document.getElementById(
        'totalLocationsCount'
    ).textContent =
        locations.length;

    const uniqueCountries =
        [
            ...new Set(
                locations.map(
                    l => l.countries?.country_name
                )
            )
        ];

    document.getElementById(
        'totalCountriesCount'
    ).textContent =
        uniqueCountries.length;

    const totalArea =
        locations.reduce(
            (sum, l) =>
                sum + (l.area_km2 || 0),
            0
        );

    document.getElementById(
        'totalAreaCount'
    ).textContent =
        totalArea.toLocaleString();

    const container =
        document.getElementById(
            'locationsContainer'
        );

    if (!container) return;

    if (locations.length === 0) {

        container.innerHTML =
            `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <p>No locations found</p>
            </div>
            `;

        return;
    }

    let html =
        '<div class="locations-grid">';

    locations.forEach(loc => {

        html += `
            <div class="location-card">

                <div class="location-card-header">

                    <div class="location-emoji">
                        ${getCountryFlag(
                            loc.countries?.country_name
                        )}
                    </div>

                    <div class="location-title">

                        <h3>
                            ${loc.location_name}
                        </h3>

                        <p class="location-country">
                            ${loc.countries?.country_name || 'Unknown'}
                        </p>

                    </div>

                </div>

                <div class="location-card-body">

                    <div class="location-detail-item">
                        <i class="fas fa-ruler-combined"></i>
                        ${loc.area_km2 || 0} km²
                    </div>

                    <div class="location-detail-item">
                        <i class="fas fa-location-dot"></i>
                        ${loc.latitude || 0},
                        ${loc.longitude || 0}
                    </div>

                    <div class="location-detail-item">
                        <i class="fas fa-tree"></i>
                        ${loc.location_type || '-'}
                    </div>

                </div>

            </div>
        `;
    });

    html += '</div>';

    container.innerHTML =
        html;
}

function closeLocationModal() {

    document.getElementById(
        'locationModal'
    ).style.display =
        'none';

    document.getElementById(
        'locationForm'
    ).reset();
}

function showToast(message, type) {

    const toast =
        document.createElement(
            'div'
        );

    toast.className =
        `toast ${type}`;

    toast.innerHTML =
        `
        <i class="fas ${
            type === 'success'
            ? 'fa-check-circle'
            : 'fa-exclamation-circle'
        }"></i>
        ${message}
        `;

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);
}

async function initLocationsPage() {

    const user =
        getCurrentUser();

    if (!user) {

        window.location.href =
            'index.html';

        return;
    }

    document.getElementById(
        'sidebarUserName'
    ).textContent =
        user.name;

    document.getElementById(
        'sidebarUserRole'
    ).textContent =
        user.role;

    const userAvatar =
        document.getElementById(
            'userAvatar'
        );

    if (
        user.role === 'Administrator'
    ) {

        userAvatar.innerHTML =
            '👑';

    } else if (
        user.role === 'Researcher'
    ) {

        userAvatar.innerHTML =
            '🔬';

    } else {

        userAvatar.innerHTML =
            '🛡️';
    }

    const addBtn =
        document.getElementById(
            'addLocationBtn'
        );

    if (addBtn) {

        if (
            user.role === 'Administrator'
        ) {

            addBtn.style.display =
                'flex';

        } else {

            addBtn.style.display =
                'none';
        }
    }

    updateDateTime();

    await loadAnimalDropdown();

    await renderLocations();

    const searchInput =
        document.getElementById(
            'searchInput'
        );

    if (searchInput) {

        searchInput.addEventListener(
            'input',
            async function() {

                await renderLocations();
            }
        );
    }
}

document.addEventListener(
    'DOMContentLoaded',
    function() {

        const form =
            document.getElementById(
                'locationForm'
            );

        if (form) {

            form.addEventListener(
                'submit',
                async function(e) {

                    e.preventDefault();

                    const user =
                        getCurrentUser();

                    if (
                        user?.role !== 'Administrator'
                    ) {

                        alert(
                            'No permission'
                        );

                        return;
                    }

                    const name =
                        document.getElementById(
                            'locationName'
                        ).value;

                    const country =
                        document.getElementById(
                            'locationCountry'
                        ).value;

                    const area =
                        parseFloat(
                            document.getElementById(
                                'locationArea'
                            ).value
                        );

                    const species =
                        document.getElementById(
                            'locationPrimarySpecies'
                        ).value;

                    const type =
                        'National Park';

                    const latitude = 0;

                    const longitude = 0;

                    const {
                        data: countryData
                    } =
                    await supabaseClient
                    .from('countries')
                    .select('country_id')
                    .eq(
                        'country_name',
                        country
                    )
                    .single();

                    if (!countryData) {

                        alert(
                            'Country not found'
                        );

                        return;
                    }

                    const { error } =
                        await supabaseClient
                        .from('locations')
                        .insert([
                            {
                                location_name:
                                    name,

                                country_id:
                                    countryData.country_id,

                                latitude:
                                    latitude,

                                longitude:
                                    longitude,

                                area_km2:
                                    area,

                                location_type:
                                    type
                            }
                        ]);

                    if (error) {

                        console.error(
                            'INSERT ERROR:',
                            error
                        );

                        alert(
                            'Insert failed'
                        );

                        return;
                    }

                    showToast(
                        '✅ Location added successfully',
                        'success'
                    );

                    closeLocationModal();

                    await renderLocations();
                }
            );
        }

        const addBtn =
            document.getElementById(
                'addLocationBtn'
            );

        if (addBtn) {

            addBtn.addEventListener(
                'click',
                async function() {

                    const user =
                        getCurrentUser();

                    if (
                        user?.role !== 'Administrator'
                    ) {

                        alert(
                            'No permission'
                        );

                        return;
                    }

                    document.getElementById(
                        'locationForm'
                    ).reset();

                    await loadAnimalDropdown();

                    document.getElementById(
                        'locationModal'
                    ).style.display =
                        'flex';
                }
            );
        }

        document.addEventListener(
            'click',
            function(e) {

                if (
                    e.target.classList &&
                    e.target.classList.contains(
                        'modal'
                    )
                ) {

                    e.target.style.display =
                        'none';
                }
            }
        );

        setInterval(
            updateDateTime,
            60000
        );

        initLocationsPage();
    }
);