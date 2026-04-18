// animals.js - Complete Animals Management with Role-Based Access

let currentView = 'grid';
let currentFilter = 'all';

function getCurrentUser() {
    const stored = localStorage.getItem('wildlife_conservation_user');
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

function logout() {
    localStorage.removeItem('wildlife_conservation_user');
    window.location.href = 'index.html';
}

function formatDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

function updateDateTime() {
    const dateElement = document.getElementById('currentDate');
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
    if (name.includes('peacock')) return '🦚';
    return '🦁';
}

function getAnimalImage(animal) {
    if (animal.image && animal.image !== '🦁') {
        return animal.image;
    }
    return getAnimalImageByName(animal.name);
}

function isAnimalNameExists(name, excludeId = null) {
    if (typeof getAnimals === 'undefined') return false;
    
    const animals = getAnimals();
    const nameLower = name.toLowerCase().trim();
    
    return animals.some(animal => {
        if (excludeId && animal.id === parseInt(excludeId)) {
            return false;
        }
        return animal.name.toLowerCase() === nameLower;
    });
}

function renderAnimals() {
    console.log('renderAnimals called');
    
    if (typeof getAnimals === 'undefined') {
        document.getElementById('animalsContainer').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error: Database not loaded</p></div>';
        return;
    }
    
    let animals = getAnimals();
    console.log('Found', animals.length, 'animals');
    
    const user = getCurrentUser();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    if (searchTerm) {
        animals = animals.filter(a => a.name.toLowerCase().includes(searchTerm) || a.habitat.toLowerCase().includes(searchTerm));
    }
    
    if (currentFilter !== 'all') {
        animals = animals.filter(a => a.threat_level === currentFilter);
    }
    
    const container = document.getElementById('animalsContainer');
    
    if (animals.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-paw"></i><p>No animals found</p></div>';
        return;
    }
    
    // ROLE PERMISSIONS:
    // Guest: NO edit, NO delete
    // Ranger: NO edit, NO delete
    // Researcher: CAN edit, NO delete
    // Administrator: CAN edit, CAN delete
    
    const isGuest = user?.role === 'Guest';
    const isRanger = user?.role === 'Field Ranger';
    const isResearcher = user?.role === 'Researcher';
    const isAdmin = user?.role === 'Administrator';
    
    const canEdit = isResearcher || isAdmin;
    const canDelete = isAdmin;
    
    if (currentView === 'grid') {
        container.className = 'animals-grid-view';
        container.innerHTML = animals.map(animal => {
            const animalImage = getAnimalImage(animal);
            return `
            <div class="animal-card">
                <div class="animal-card-emoji">${animalImage}</div>
                <div class="animal-card-content" onclick="showAnimalDetail(${animal.id})">
                    <h3>${animal.name}</h3>
                    <p class="scientific"><em>${animal.scientific_name}</em></p>
                    <div class="animal-stats">
                        <span class="stat-badge">
                            <i class="fas fa-charging-station"></i> ${animal.population.toLocaleString()}
                        </span>
                        <span class="threat-badge" style="background: ${getThreatColor(animal.threat_level)}">
                            ${animal.threat_level}
                        </span>
                    </div>
                    <div class="animal-habitat">
                        <i class="fas fa-tree"></i> ${animal.habitat.substring(0, 50)}${animal.habitat.length > 50 ? '...' : ''}
                    </div>
                </div>
                ${(canEdit || canDelete) ? `
                <div class="animal-card-actions">
                    ${canEdit ? `<button class="icon-btn edit" onclick="event.stopPropagation(); editAnimal(${animal.id})"><i class="fas fa-edit"></i></button>` : ''}
                    ${canDelete ? `<button class="icon-btn delete" onclick="event.stopPropagation(); deleteAnimalHandler(${animal.id})"><i class="fas fa-trash"></i></button>` : ''}
                </div>
                ` : ''}
            </div>
        `}).join('');
    } else {
        container.className = 'animals-list-view';
        container.innerHTML = animals.map(animal => {
            const animalImage = getAnimalImage(animal);
            return `
            <div class="animal-list-item">
                <div class="list-emoji">${animalImage}</div>
                <div class="list-info" onclick="showAnimalDetail(${animal.id})">
                    <div class="list-name">
                        <strong>${animal.name}</strong>
                        <span class="list-scientific">${animal.scientific_name}</span>
                    </div>
                    <div class="list-details">
                        <span><i class="fas fa-charging-station"></i> ${animal.population.toLocaleString()}</span>
                        <span><i class="fas fa-tree"></i> ${animal.habitat.substring(0, 40)}${animal.habitat.length > 40 ? '...' : ''}</span>
                        <span class="threat-badge-small" style="background: ${getThreatColor(animal.threat_level)}">${animal.threat_level}</span>
                    </div>
                </div>
                ${(canEdit || canDelete) ? `
                <div class="list-actions">
                    ${canEdit ? `<button class="icon-btn edit" onclick="event.stopPropagation(); editAnimal(${animal.id})"><i class="fas fa-edit"></i></button>` : ''}
                    ${canDelete ? `<button class="icon-btn delete" onclick="event.stopPropagation(); deleteAnimalHandler(${animal.id})"><i class="fas fa-trash"></i></button>` : ''}
                </div>
                ` : ''}
            </div>
        `}).join('');
    }
}

function showAnimalDetail(animalId) {
    if (typeof getAnimalById === 'undefined') {
        alert('Error: Database function not available');
        return;
    }
    
    const animal = getAnimalById(animalId);
    if (!animal) return;
    
    let sightings = [];
    if (typeof getSightingsByAnimal !== 'undefined') {
        sightings = getSightingsByAnimal(animalId);
    }
    
    const animalImage = getAnimalImage(animal);
    
    const detailContent = `
        <div class="detail-header">
            <div class="detail-emoji">${animalImage}</div>
            <div class="detail-title-info">
                <h2>${animal.name}</h2>
                <p class="detail-scientific"><em>${animal.scientific_name}</em></p>
            </div>
        </div>
        
        <div class="detail-stats-grid">
            <div class="detail-stat">
                <div class="detail-stat-value">${animal.population.toLocaleString()}</div>
                <div class="detail-stat-label">Population</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-value" style="color: ${getThreatColor(animal.threat_level)}">${animal.threat_level}</div>
                <div class="detail-stat-label">Threat Level</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-value">${animal.conservation_status}</div>
                <div class="detail-stat-label">Status</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-tree"></i> Habitat</h4>
            <p>${animal.habitat}</p>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-eye"></i> Recent Sightings (${sightings.length})</h4>
            ${sightings.length > 0 ? sightings.slice(0, 5).map(s => `
                <div class="sighting-detail-item">
                    <div class="sighting-date">${s.date}</div>
                    <div class="sighting-location">${s.location}</div>
                    <div class="sighting-count">${s.count} animals</div>
                </div>
            `).join('') : '<p class="no-data">No sightings recorded yet</p>'}
        </div>
    `;
    
    document.getElementById('detailTitle').textContent = `${animal.name} - Details`;
    document.getElementById('detailContent').innerHTML = detailContent;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function editAnimal(id) {
    const user = getCurrentUser();
    
    // Only Researcher and Admin can edit
    if (user?.role !== 'Administrator' && user?.role !== 'Researcher') {
        alert('You do not have permission to edit animals. Only Researchers and Admins can edit.');
        return;
    }
    
    if (typeof getAnimalById === 'undefined') {
        alert('Error: Database function not available');
        return;
    }
    
    const animal = getAnimalById(id);
    if (!animal) {
        alert('Animal not found');
        return;
    }
    
    document.getElementById('modalTitle').textContent = 'Edit Species';
    document.getElementById('animalId').value = animal.id;
    
    const nameSelect = document.getElementById('animalName');
    if (nameSelect) {
        nameSelect.value = animal.name;
    }
    
    document.getElementById('scientificName').value = animal.scientific_name;
    document.getElementById('population').value = animal.population;
    document.getElementById('habitat').value = animal.habitat;
    document.getElementById('threatLevel').value = animal.threat_level;
    document.getElementById('conservationStatus').value = animal.conservation_status;
    
    document.getElementById('animalModal').style.display = 'flex';
}

function deleteAnimalHandler(id) {
    const user = getCurrentUser();
    
    // Only Admin can delete
    if (user?.role !== 'Administrator') {
        alert('You do not have permission to delete animals. Only Administrators can delete.');
        return;
    }
    
    if (typeof getAnimalById === 'undefined' || typeof deleteAnimal === 'undefined') {
        alert('Error: Database functions not available');
        return;
    }
    
    const animal = getAnimalById(id);
    if (confirm(`Are you sure you want to delete ${animal?.name}? This action cannot be undone.`)) {
        deleteAnimal(id);
        renderAnimals();
        alert(`${animal?.name} has been deleted`);
    }
}

function closeModal() {
    document.getElementById('animalModal').style.display = 'none';
    document.getElementById('animalForm').reset();
    document.getElementById('animalId').value = '';
    const nameSelect = document.getElementById('animalName');
    if (nameSelect) {
        nameSelect.value = '';
    }
}

function updateDropdownWithExistingAnimals() {
    const nameSelect = document.getElementById('animalName');
    if (!nameSelect) return;
    
    if (typeof getAnimals === 'undefined') return;
    
    const existingAnimals = getAnimals();
    const existingNames = existingAnimals.map(a => a.name);
    
    for (let i = 0; i < nameSelect.options.length; i++) {
        const option = nameSelect.options[i];
        const optionValue = option.value;
        if (optionValue && existingNames.includes(optionValue)) {
            option.style.display = 'none';
            option.disabled = true;
        } else {
            option.style.display = '';
            option.disabled = false;
        }
    }
}

function initAnimalsPage() {
    console.log('Initializing Animals Page...');
    
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    console.log('User logged in:', user.name, 'Role:', user.role);
    
    document.getElementById('sidebarUserName').textContent = user.name;
    document.getElementById('sidebarUserRole').textContent = user.role;
    
    const userAvatar = document.getElementById('userAvatar');
    if (user.role === 'Administrator') {
        userAvatar.innerHTML = '👑';
    } else if (user.role === 'Researcher') {
        userAvatar.innerHTML = '🔬';
    } else if (user.role === 'Field Ranger') {
        userAvatar.innerHTML = '🛡️';
    } else {
        userAvatar.innerHTML = '👤';
    }
    
    // SHOW/HIDE ADD BUTTON based on role
    // Only Admin and Researcher can add new animals
    const addBtn = document.getElementById('addAnimalBtn');
    if (addBtn) {
        if (user.role === 'Administrator' || user.role === 'Researcher') {
            addBtn.style.display = 'flex';
            console.log('Add button visible for', user.role);
        } else {
            addBtn.style.display = 'none';
            console.log('Add button hidden for', user.role);
        }
    }
    
    updateDateTime();
    renderAnimals();
    updateDropdownWithExistingAnimals();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderAnimals();
        });
    }
}

const form = document.getElementById('animalForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const user = getCurrentUser();
        
        // Only Admin and Researcher can add/edit
        if (user?.role !== 'Administrator' && user?.role !== 'Researcher') {
            alert('You do not have permission to add or edit animals.');
            return;
        }
        
        if (typeof addAnimal === 'undefined' || typeof updateAnimal === 'undefined') {
            alert('Error: Database functions not available');
            return;
        }
        
        const id = document.getElementById('animalId').value;
        const animalName = document.getElementById('animalName').value;
        
        if (!animalName) {
            alert('Please select an animal from the list');
            return;
        }
        
        if (!id && isAnimalNameExists(animalName)) {
            alert(`❌ "${animalName}" already exists in the database!`);
            return;
        }
        
        const imageEmoji = getAnimalImageByName(animalName);
        
        const animalData = {
            name: animalName,
            scientific_name: document.getElementById('scientificName').value.trim(),
            population: parseInt(document.getElementById('population').value),
            habitat: document.getElementById('habitat').value.trim(),
            threat_level: document.getElementById('threatLevel').value,
            conservation_status: document.getElementById('conservationStatus').value,
            image: imageEmoji
        };
        
        if (id) {
            updateAnimal(id, animalData);
            alert(`✅ ${animalName} updated successfully!`);
        } else {
            addAnimal(animalData);
            alert(`✅ ${animalName} added successfully!`);
        }
        
        closeModal();
        renderAnimals();
        updateDropdownWithExistingAnimals();
    });
}

const addBtn = document.getElementById('addAnimalBtn');
if (addBtn) {
    addBtn.addEventListener('click', function() {
        const user = getCurrentUser();
        
        if (user?.role !== 'Administrator' && user?.role !== 'Researcher') {
            alert('You do not have permission to add animals.');
            return;
        }
        
        document.getElementById('modalTitle').textContent = 'Add New Species';
        document.getElementById('animalForm').reset();
        document.getElementById('animalId').value = '';
        const nameSelect = document.getElementById('animalName');
        if (nameSelect) {
            nameSelect.value = '';
        }
        document.getElementById('animalModal').style.display = 'flex';
        updateDropdownWithExistingAnimals();
    });
}

document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderAnimals();
    });
});

document.querySelectorAll('.view-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.view-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        this.classList.add('active');
        currentView = this.dataset.view;
        renderAnimals();
    });
});

document.addEventListener('click', function(e) {
    if (e.target.classList && e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

setInterval(updateDateTime, 60000);
initAnimalsPage();