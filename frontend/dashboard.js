// dashboard.js - COMPLETE SUPABASE VERSION

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

async function fetchAnimals() {

    const { data, error } =
        await supabaseClient
        .from('animals')
        .select(`
            animal_id,
            common_name,
            estimated_population,
            image_emoji
        `);

    if (error) {

        console.error(
            'ANIMALS ERROR:',
            error
        );

        return [];
    }

    return data;
}

async function fetchSightings() {

    const { data, error } =
        await supabaseClient
        .from('v_sighting_dashboard')
        .select('*')
        .order(
            'sighting_date',
            { ascending: false }
        );

    if (error) {

        console.error(
            'SIGHTINGS ERROR:',
            error
        );

        return [];
    }

    return data;
}

async function fetchLocations() {

    const { data, error } =
        await supabaseClient
        .from('locations')
        .select(`
            location_id
        `);

    if (error) {

        console.error(
            'LOCATIONS ERROR:',
            error
        );

        return [];
    }

    return data;
}

async function fetchResearchers() {

    const { data, error } =
        await supabaseClient
        .from('users')
        .select(`
            user_id
        `)
        .neq(
            'role_id',
            4
        );

    if (error) {

        console.error(
            'USERS ERROR:',
            error
        );

        return [];
    }

    return data;
}

async function loadDashboardData() {

    const user =
        getCurrentUser();

    if (!user) {

        window.location.href =
            'index.html';

        return;
    }

    document.getElementById(
        'welcomeUserName'
    ).textContent =
        user.name;

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

    const animals =
        await fetchAnimals();

    const sightings =
        await fetchSightings();

    const locations =
        await fetchLocations();

    const researchers =
        await fetchResearchers();

    document.getElementById(
        'totalAnimals'
    ).textContent =
        animals.length;

    document.getElementById(
        'totalSightings'
    ).textContent =
        sightings.length;

    document.getElementById(
        'totalLocations'
    ).textContent =
        locations.length;

    document.getElementById(
        'totalResearchers'
    ).textContent =
        researchers.length;

    const recentSightings =
        sightings.slice(0, 5);

    const sightingsHtml =
        recentSightings.map(
            sighting => `

            <div class="timeline-item">

                <div class="timeline-icon">
                    <i class="fas fa-camera"></i>
                </div>

                <div class="timeline-content">

                    <div class="timeline-title">

                        <strong>
                            ${sighting.animal}
                        </strong>

                        <span class="timeline-date">
                            ${sighting.sighting_date}
                        </span>

                    </div>

                    <div class="timeline-location">
                        <i class="fas fa-location-dot"></i>
                        ${sighting.location || 'Unknown'}
                    </div>

                    <div class="timeline-count">
                        <i class="fas fa-paw"></i>
                        ${sighting.animal_count} animals observed
                    </div>

                    <div class="timeline-observer">
                        <i class="fas fa-user-check"></i>
                        ${sighting.observer}
                    </div>

                </div>

            </div>
        `
        ).join('');

    document.getElementById(
        'recentSightingsList'
    ).innerHTML =
        sightingsHtml ||

        `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No sightings recorded yet</p>
        </div>
        `;

    const sortedAnimals =
        [...animals]
        .sort(
            (a, b) =>
            (b.estimated_population || 0)
            -
            (a.estimated_population || 0)
        )
        .slice(0, 5);

    let speciesHtml = '';

    if (sortedAnimals.length > 0) {

        sortedAnimals.forEach(
            (animal, index) => {

                const percentage =
                    (
                        (animal.estimated_population || 0)
                        /
                        (sortedAnimals[0]
                        ?.estimated_population || 1)
                    ) * 100;

                speciesHtml += `

                    <div class="species-item">

                        <div class="species-info">

                            <span class="species-rank">
                                #${index + 1}
                            </span>

                            <span class="species-name">
                                ${animal.image_emoji || '🦁'}
                                ${animal.common_name}
                            </span>

                            <span class="species-population">
                                ${(animal.estimated_population || 0).toLocaleString()}
                            </span>

                        </div>

                        <div class="species-bar">

                            <div
                                class="species-bar-fill"
                                style="width:${percentage}%;">
                            </div>

                        </div>

                    </div>
                `;
            }
        );
    }

    document.getElementById(
        'speciesList'
    ).innerHTML =
        speciesHtml;
}

async function generateReport() {

    const user =
        getCurrentUser();

    const animals =
        await fetchAnimals();

    const sightings =
        await fetchSightings();

    const locations =
        await fetchLocations();

    const reportContent = `

WILDLIFE CONSERVATION REPORT

Generated by:
${user.name} (${user.role})

Date:
${formatDate()}

----------------------------------------

SUMMARY STATISTICS

- Total Protected Species:
${animals.length}

- Total Sightings:
${sightings.length}

- Active Conservation Sites:
${locations.length}

----------------------------------------

TOP SPECIES

${animals.map(a => `
- ${a.common_name}
Population:
${(a.estimated_population || 0).toLocaleString()}
`).join('')}

----------------------------------------

RECENT SIGHTINGS

${sightings.slice(0, 5).map(s => `
- ${s.animal}
at ${s.location}
on ${s.sighting_date}
(${s.animal_count} animals)
`).join('')}

----------------------------------------

Wildlife Conservation Monitoring System

`;

    const blob =
        new Blob(
            [reportContent],
            { type: 'text/plain' }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement('a');

    a.href = url;

    a.download =
        `wildlife_report_${
            new Date()
            .toISOString()
            .split('T')[0]
        }.txt`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    alert(
        '📄 Report generated successfully!'
    );
}

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        updateDateTime();

        await loadDashboardData();

        setInterval(
            updateDateTime,
            60000
        );
    }
);