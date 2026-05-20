// sightings.js - COMPLETE FINAL FIXED VERSION

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
            image_emoji
        `)
        .order(
            'common_name',
            { ascending: true }
        );

    if (error) {

        console.error(
            'FETCH ANIMALS ERROR:',
            error
        );

        return [];
    }

    return data;
}

async function loadAnimalDropdown() {

    const select =
        document.getElementById(
            'animalSelect'
        );

    if (!select) return;

    const animals =
        await fetchAnimals();

    select.innerHTML =
        `
        <option value="">
            -- Select Animal --
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
            animal.animal_id;

        option.textContent =
            `${animal.image_emoji || '🦁'} ${animal.common_name}`;

        select.appendChild(option);
    });
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
            'FETCH SIGHTINGS ERROR:',
            error
        );

        return [];
    }

    console.log(
        'SIGHTINGS:',
        data
    );

    return data;
}

async function renderSightings() {

    const sightings =
        await fetchSightings();

    // TOTAL SIGHTINGS
    document.getElementById(
        'totalSightingsCount'
    ).textContent =
        sightings.length;

    // TOTAL UNIQUE ANIMALS
    const uniqueAnimals =
        [
            ...new Set(
                sightings.map(
                    s => s.animal
                )
            )
        ];

    document.getElementById(
        'totalAnimalsCount'
    ).textContent =
        uniqueAnimals.length;

    const container =
        document.getElementById(
            'sightingsContainer'
        );

    if (!container) return;

    if (sightings.length === 0) {

        container.innerHTML =
            `
            <div class="empty-state">
                <i class="fas fa-eye-slash"></i>
                <p>No sightings found</p>
            </div>
            `;

        return;
    }

    let html = `
        <div class="sightings-table-wrapper">

        <table class="sightings-table">

        <thead>
            <tr>
                <th>Animal</th>
                <th>Location</th>
                <th>Date</th>
                <th>Count</th>
                <th>Observer</th>
                <th>Notes</th>
            </tr>
        </thead>

        <tbody>
    `;

    sightings.forEach(s => {

        html += `
            <tr>

                <td>
                    ${s.image_emoji || '🦁'}
                    ${s.animal || 'Unknown'}
                </td>

                <td>
                    ${s.location || '-'}
                </td>

                <td>
                    ${s.sighting_date || '-'}
                </td>

                <td>
                    ${s.animal_count || 0}
                </td>

                <td>
                    ${s.observer || 'Unknown'}
                </td>

                <td>
                    ${s.notes || '-'}
                </td>

            </tr>
        `;
    });

    html += `
        </tbody>
        </table>
        </div>
    `;

    container.innerHTML =
        html;
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

function closeSightingModal() {

    document.getElementById(
        'sightingModal'
    ).style.display =
        'none';

    document.getElementById(
        'sightingForm'
    ).reset();

    document.getElementById(
        'sightingDate'
    ).value =
        new Date()
        .toISOString()
        .split('T')[0];
}

async function initSightingsPage() {

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

    } else if (
        user.role === 'Field Ranger'
    ) {

        userAvatar.innerHTML =
            '🛡️';

    } else {

        userAvatar.innerHTML =
            '👤';
    }

    const addBtn =
        document.getElementById(
            'addSightingBtn'
        );

    if (addBtn) {

        if (
            user.role === 'Administrator' ||
            user.role === 'Researcher'
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

    await renderSightings();
}

document.addEventListener(
    'DOMContentLoaded',
    function() {

        const form =
            document.getElementById(
                'sightingForm'
            );

        if (form) {

            form.addEventListener(
                'submit',
                async function(e) {

                    e.preventDefault();

                    const user =
                        getCurrentUser();

                    if (
                        user?.role !== 'Administrator' &&
                        user?.role !== 'Researcher'
                    ) {

                        alert(
                            'You do not have permission'
                        );

                        return;
                    }

                    const animalId =
                        parseInt(
                            document.getElementById(
                                'animalSelect'
                            ).value
                        );

                    if (!animalId) {

                        alert(
                            'Please select animal'
                        );

                        return;
                    }

                    const count =
                        parseInt(
                            document.getElementById(
                                'sightingCount'
                            ).value
                        );

                    const date =
                        document.getElementById(
                            'sightingDate'
                        ).value;

                    const notes =
                        document.getElementById(
                            'sightingNotes'
                        ).value;

                    const location =
                        document.getElementById(
                            'sightingLocation'
                        ).value;

                    const { error } =
                        await supabaseClient
                        .from('sightings')
                        .insert([
                            {
                                animal_id:
                                    animalId,

                                observer_id:
                                    1,

                                sighting_date:
                                    date,

                                animal_count:
                                    count,

                                notes:
                                    notes,

                                location_text:
                                    location
                            }
                        ]);

                    if (error) {

                        console.error(
                            'INSERT ERROR:',
                            error
                        );

                        alert(
                            'Failed to insert sighting'
                        );

                        return;
                    }

                    showToast(
                        '✅ Sighting added successfully',
                        'success'
                    );

                    closeSightingModal();

                    await renderSightings();
                }
            );
        }

        const addBtn =
            document.getElementById(
                'addSightingBtn'
            );

        if (addBtn) {

            addBtn.addEventListener(
                'click',
                async function() {

                    const user =
                        getCurrentUser();

                    if (
                        user?.role !== 'Administrator' &&
                        user?.role !== 'Researcher'
                    ) {

                        alert(
                            'No permission'
                        );

                        return;
                    }

                    document.getElementById(
                        'sightingForm'
                    ).reset();

                    document.getElementById(
                        'sightingDate'
                    ).value =
                        new Date()
                        .toISOString()
                        .split('T')[0];

                    await loadAnimalDropdown();

                    document.getElementById(
                        'sightingModal'
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

        initSightingsPage();
    }
);