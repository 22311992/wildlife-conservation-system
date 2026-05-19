// animals.js - FULL SUPABASE VERSION

let currentView = 'grid';
let currentFilter = 'all';

async function fetchAnimals() {

    const { data, error } = await supabaseClient
        .from('animals')
        .select(`
            animal_id,
            common_name,
            scientific_name,
            estimated_population,
            habitat_description,
            image_emoji,
            conservation_statuses (
                threat_level,
                status_name
            )
        `)
        .order('animal_id', { ascending: true });

    if (error) {
        console.error('SUPABASE FETCH ERROR:', error);
        return [];
    }

    return data.map(a => ({
        id: a.animal_id,
        name: a.common_name,
        scientific_name: a.scientific_name,
        population: a.estimated_population || 0,
        habitat: a.habitat_description || '',
        image: a.image_emoji || '🦁',
        threat_level:
            a.conservation_statuses?.threat_level || 'Unknown',
        conservation_status:
            a.conservation_statuses?.status_name || 'Unknown'
    }));
}

function getCurrentUser() {

    const stored =
        localStorage.getItem('wildlife_conservation_user');

    if (stored) {
        return JSON.parse(stored);
    }

    return null;
}

function logout() {

    localStorage.removeItem(
        'wildlife_conservation_user'
    );

    window.location.href = 'index.html';
}

function formatDate() {

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Date()
        .toLocaleDateString('en-US', options);
}

function updateDateTime() {

    const dateElement =
        document.getElementById('currentDate');

    if (dateElement) {
        dateElement.textContent = formatDate();
    }
}

function getThreatColor(level) {

    const colors = {
        'Critical': '#e74c3c',
        'High': '#e67e22',
        'Medium': '#f39c12',
        'Low': '#27ae60',
        'Endangered': '#e67e22'
    };

    return colors[level] || '#7f8c8d';
}

function getAnimalImageByName(animalName) {

    const name = animalName.toLowerCase();

    if (name.includes('elephant')) return '🐘';
    if (name.includes('tiger')) return '🐯';
    if (name.includes('gorilla')) return '🦍';
    if (name.includes('panda')) return '🐼';
    if (name.includes('turtle')) return '🐢';
    if (name.includes('rhino')) return '🦏';
    if (name.includes('orangutan')) return '🦧';
    if (name.includes('leopard')) return '🐆';
    if (name.includes('lion')) return '🦁';
    if (name.includes('giraffe')) return '🦒';
    if (name.includes('zebra')) return '🦓';
    if (name.includes('cheetah')) return '🐆';
    if (name.includes('hippopotamus')) return '🦛';
    if (name.includes('polar bear')) return '🐻‍❄️';
    if (name.includes('koala')) return '🐨';
    if (name.includes('kangaroo')) return '🦘';
    if (name.includes('penguin')) return '🐧';
    if (name.includes('flamingo')) return '🦩';

    return '🦁';
}

function getAnimalImage(animal) {

    if (animal.image) {
        return animal.image;
    }

    return getAnimalImageByName(animal.name);
}

async function renderAnimals() {

    console.log('Loading animals from Supabase...');

    let animals = await fetchAnimals();

    console.log('Loaded animals:', animals);

    const user = getCurrentUser();

    const searchTerm =
        document.getElementById('searchInput')
        ?.value.toLowerCase() || '';

    if (searchTerm) {

        animals = animals.filter(a =>
            a.name.toLowerCase().includes(searchTerm) ||
            a.habitat.toLowerCase().includes(searchTerm)
        );
    }

    if (currentFilter !== 'all') {

        animals = animals.filter(
            a => a.threat_level === currentFilter
        );
    }

    const container =
        document.getElementById('animalsContainer');

    if (!container) return;

    if (animals.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paw"></i>
                <p>No animals found</p>
            </div>
        `;

        return;
    }

    const isResearcher =
        user?.role === 'Researcher';

    const isAdmin =
        user?.role === 'Administrator';

    const canEdit =
        isResearcher || isAdmin;

    const canDelete =
        isAdmin;

    if (currentView === 'grid') {

        container.className =
            'animals-grid-view';

        container.innerHTML = animals.map(animal => `

            <div class="animal-card">

                <div class="animal-card-emoji">
                    ${getAnimalImage(animal)}
                </div>

                <div class="animal-card-content">

                    <h3>${animal.name}</h3>

                    <p class="scientific">
                        <em>${animal.scientific_name}</em>
                    </p>

                    <div class="animal-stats">

                        <span class="stat-badge">
                            <i class="fas fa-chart-line"></i>
                            ${animal.population.toLocaleString()}
                        </span>

                        <span
                            class="threat-badge"
                            style="background:${getThreatColor(animal.threat_level)}"
                        >
                            ${animal.threat_level}
                        </span>

                    </div>

                    <div class="animal-habitat">
                        <i class="fas fa-tree"></i>
                        ${animal.habitat}
                    </div>

                </div>

                ${(canEdit || canDelete) ? `

                <div class="animal-card-actions">

                    ${canEdit ? `
                    <button
                        class="icon-btn edit"
                        onclick="editAnimal(${animal.id})"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                    ` : ''}

                    ${canDelete ? `
                    <button
                        class="icon-btn delete"
                        onclick="deleteAnimalHandler(${animal.id})"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}

                </div>

                ` : ''}

            </div>

        `).join('');

    } else {

        container.className =
            'animals-list-view';

        container.innerHTML = animals.map(animal => `

            <div class="animal-list-item">

                <div class="list-emoji">
                    ${getAnimalImage(animal)}
                </div>

                <div class="list-info">

                    <div class="list-name">

                        <strong>${animal.name}</strong>

                        <span class="list-scientific">
                            ${animal.scientific_name}
                        </span>

                    </div>

                    <div class="list-details">

                        <span>
                            <i class="fas fa-chart-line"></i>
                            ${animal.population.toLocaleString()}
                        </span>

                        <span>
                            <i class="fas fa-tree"></i>
                            ${animal.habitat}
                        </span>

                        <span
                            class="threat-badge-small"
                            style="background:${getThreatColor(animal.threat_level)}"
                        >
                            ${animal.threat_level}
                        </span>

                    </div>

                </div>

            </div>

        `).join('');
    }
}

function closeModal() {

    document.getElementById('animalModal').style.display =
        'none';

    document.getElementById('animalForm').reset();

    document.getElementById('animalId').value = '';
}

async function deleteAnimalHandler(id) {

    const user = getCurrentUser();

    if (user?.role !== 'Administrator') {

        alert(
            'Only Administrators can delete animals.'
        );

        return;
    }

    const confirmed = confirm(
        'Are you sure you want to delete this animal?'
    );

    if (!confirmed) return;

    try {

        // DELETE RELATED SIGHTINGS
        const { error: sightingsError } =
            await supabaseClient
            .from('sightings')
            .delete()
            .eq('animal_id', id);

        if (sightingsError) {

            console.error(
                'SIGHTINGS DELETE ERROR:',
                sightingsError
            );
        }

        // DELETE RELATED THREATS
        const { error: threatsError } =
            await supabaseClient
            .from('animal_threats')
            .delete()
            .eq('animal_id', id);

        if (threatsError) {

            console.error(
                'THREATS DELETE ERROR:',
                threatsError
            );
        }

        // DELETE RELATED LOCATION LINKS
        const { error: locationsError } =
            await supabaseClient
            .from('location_species')
            .delete()
            .eq('animal_id', id);

        if (locationsError) {

            console.error(
                'LOCATION DELETE ERROR:',
                locationsError
            );
        }

        // DELETE RELATED PROGRAM LINKS
        const { error: programsError } =
            await supabaseClient
            .from('program_animals')
            .delete()
            .eq('animal_id', id);

        if (programsError) {

            console.error(
                'PROGRAM DELETE ERROR:',
                programsError
            );
        }

        // FINALLY DELETE ANIMAL
        const { error } =
            await supabaseClient
            .from('animals')
            .delete()
            .eq('animal_id', id);

        if (error) {

            console.error(
                'ANIMAL DELETE ERROR:',
                error
            );

            alert(
                'Failed to delete animal'
            );

            return;
        }

        alert(
            '✅ Animal deleted successfully'
        );

        await renderAnimals();

    } catch (err) {

        console.error(
            'DELETE SYSTEM ERROR:',
            err
        );

        alert(
            'Unexpected delete error'
        );
    }
}

function initAnimalsPage() {

    const user = getCurrentUser();

    if (!user) {

        window.location.href = 'index.html';

        return;
    }

    document.getElementById('sidebarUserName')
        .textContent = user.name;

    document.getElementById('sidebarUserRole')
        .textContent = user.role;

    const userAvatar =
        document.getElementById('userAvatar');

    if (user.role === 'Administrator') {
        userAvatar.innerHTML = '👑';
    }
    else if (user.role === 'Researcher') {
        userAvatar.innerHTML = '🔬';
    }
    else if (user.role === 'Field Ranger') {
        userAvatar.innerHTML = '🛡️';
    }
    else {
        userAvatar.innerHTML = '👤';
    }

    const addBtn =
        document.getElementById('addAnimalBtn');

    if (addBtn) {

        if (
            user.role === 'Administrator' ||
            user.role === 'Researcher'
        ) {
            addBtn.style.display = 'flex';
        }
        else {
            addBtn.style.display = 'none';
        }
    }

    updateDateTime();

    renderAnimals();

    const searchInput =
        document.getElementById('searchInput');

    if (searchInput) {

        searchInput.addEventListener(
            'input',
            renderAnimals
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('animalForm');

    if (!form) {
        console.error('animalForm not found');
        return;
    }

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        console.log('FORM SUBMITTED');

        try {

            const commonName =
                document.getElementById('animalName').value;

            const scientificName =
                document.getElementById('scientificName').value;

            const population =
                parseInt(document.getElementById('population').value);

            const habitat =
                document.getElementById('habitat').value;

            const threatLevel =
                document.getElementById('threatLevel').value;

            const imageEmoji =
                getAnimalImageByName(commonName);

            let statusId = 5;

            if (threatLevel === 'Critical') statusId = 1;
            else if (threatLevel === 'Endangered') statusId = 2;
            else if (threatLevel === 'High') statusId = 3;
            else if (threatLevel === 'Medium') statusId = 4;

            const { data, error } = await supabaseClient
                .from('animals')
                .insert([
                    {
                        common_name: commonName,
                        scientific_name: scientificName,
                        class_id: 1,
                        status_id: statusId,
                        estimated_population: population,
                        habitat_description: habitat,
                        diet_type: 'Carnivore',
                        image_emoji: imageEmoji,
                        created_by: 1
                    }
                ]);

            if (error) {

                console.error('SUPABASE INSERT ERROR:', error);

                alert(error.message);

                return;
            }

            console.log('INSERT SUCCESS:', data);

            alert('✅ Animal saved successfully!');

            closeModal();

            await renderAnimals();

        } catch (err) {

            console.error('FORM ERROR:', err);

            alert('Unexpected error occurred');
        }
    });
});

const addBtn = document.getElementById('addAnimalBtn');

if (addBtn) {

    addBtn.addEventListener(
        'click',
        function() {

            const user = getCurrentUser();

            if (
                user?.role !== 'Administrator' &&
                user?.role !== 'Researcher'
            ) {

                alert(
                    'You do not have permission.'
                );

                return;
            }

            document.getElementById('modalTitle')
                .textContent = 'Add New Species';

            document.getElementById('animalForm')
                .reset();

            document.getElementById('animalId')
                .value = '';

            document.getElementById('animalModal')
                .style.display = 'flex';
        }
    );
}

document.querySelectorAll('.filter-btn')
.forEach(function(btn) {

    btn.addEventListener(
        'click',
        function() {

            document.querySelectorAll('.filter-btn')
            .forEach(function(b) {
                b.classList.remove('active');
            });

            this.classList.add('active');

            currentFilter =
                this.dataset.filter;

            renderAnimals();
        }
    );
});

document.querySelectorAll('.view-btn')
.forEach(function(btn) {

    btn.addEventListener(
        'click',
        function() {

            document.querySelectorAll('.view-btn')
            .forEach(function(b) {
                b.classList.remove('active');
            });

            this.classList.add('active');

            currentView =
                this.dataset.view;

            renderAnimals();
        }
    );
});

document.addEventListener(
    'click',
    function(e) {

        if (
            e.target.classList &&
            e.target.classList.contains('modal')
        ) {

            e.target.style.display = 'none';
        }
    }
);

setInterval(updateDateTime, 60000);

initAnimalsPage();