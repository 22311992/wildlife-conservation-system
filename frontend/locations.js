// locations.js - Complete Locations Management with Role-Based Access

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

function getCountryFlag(country) {
    const flags = {
        'Morocco': '🇲🇦', 'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'South Africa': '🇿🇦',
        'India': '🇮🇳', 'Rwanda': '🇷🇼', 'Uganda': '🇺🇬', 'China': '🇨🇳',
        'Brazil': '🇧🇷', 'Indonesia': '🇮🇩', 'Australia': '🇦🇺', 'Namibia': '🇳🇦',
        'Botswana': '🇧🇼', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Ethiopia': '🇪🇹',
        'Egypt': '🇪🇬', 'Nepal': '🇳🇵', 'Thailand': '🇹🇭', 'Costa Rica': '🇨🇷',
        'Madagascar': '🇲🇬'
    };
    return flags[country] || '📍';
}

function loadAnimalDropdown() {
    const select = document.getElementById('locationPrimarySpecies');
    if (!select) return;
    
    if (typeof getAnimals === 'undefined') {
        select.innerHTML = '<option value="">Error: Database not loaded</option>';
        return;
    }
    
    const animals = getAnimals();
    
    if (animals.length === 0) {
        select.innerHTML = '<option value="">⚠️ No animals found! Please add animals first.</option>';
        return;
    }
    
    select.innerHTML = '<option value="">-- Select a primary species --</option>';
    for (let i = 0; i < animals.length; i++) {
        const animal = animals[i];
        const option = document.createElement('option');
        option.value = animal.name;
        option.textContent = (animal.image || '🐾') + ' ' + animal.name;
        select.appendChild(option);
    }
}

function renderLocations() {
    if (typeof getLocations === 'undefined') {
        document.getElementById('locationsContainer').innerHTML = '<div class="empty-state">Error: Database not loaded</div>';
        return;
    }
    
    let locations = getLocations();
    const user = getCurrentUser();
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    if (searchTerm) {
        locations = locations.filter(l => 
            l.name.toLowerCase().includes(searchTerm) || 
            l.country.toLowerCase().includes(searchTerm) ||
            (l.primary_species && l.primary_species.toLowerCase().includes(searchTerm))
        );
    }
    
    document.getElementById('totalLocationsCount').textContent = locations.length;
    
    const uniqueCountries = [...new Set(locations.map(l => l.country))];
    document.getElementById('totalCountriesCount').textContent = uniqueCountries.length;
    
    const totalArea = locations.reduce((sum, l) => sum + (l.area_km2 || 0), 0);
    document.getElementById('totalAreaCount').textContent = totalArea.toLocaleString();
    
    const container = document.getElementById('locationsContainer');
    
    if (locations.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-map-marker-alt"></i><p>No locations found</p></div>';
        return;
    }
    
    // ROLE PERMISSIONS:
    // Guest: NO add, NO edit, NO delete
    // Ranger: NO add, NO edit, NO delete
    // Researcher: NO add, NO edit, NO delete (view only for locations)
    // Administrator: CAN add, CAN edit, CAN delete
    
    const isAdmin = user?.role === 'Administrator';
    
    container.innerHTML = '<div class="locations-grid">';
    
    for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        container.innerHTML += `
            <div class="location-card" onclick="showLocationDetail(${loc.id})">
                <div class="location-card-header">
                    <div class="location-emoji">${getCountryFlag(loc.country)}</div>
                    <div class="location-title">
                        <h3>${loc.name}</h3>
                        <p class="location-country">${loc.country}</p>
                    </div>
                    ${isAdmin ? `
                        <div class="location-card-actions" onclick="event.stopPropagation()">
                            <button class="icon-btn edit" onclick="editLocation(${loc.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="icon-btn delete" onclick="deleteLocationHandler(${loc.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="location-card-body">
                    ${loc.coordinates ? `<div class="location-detail-item"><i class="fas fa-location-dot"></i> ${loc.coordinates}</div>` : ''}
                    <div class="location-detail-item"><i class="fas fa-ruler-combined"></i> ${loc.area_km2?.toLocaleString() || 'N/A'} km²</div>
                    ${loc.primary_species ? `<div class="location-detail-item"><i class="fas fa-paw"></i> ${loc.primary_species}</div>` : ''}
                </div>
                <div class="location-card-footer">
                    <span class="view-details">Click to view details <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>
        `;
    }
    
    container.innerHTML += '</div>';
}

function showLocationDetail(id) {
    const location = getLocationById(id);
    if (!location) return;
    
    const sightings = getSightings();
    const locationSightings = sightings.filter(s => 
        s.location && s.location.toLowerCase().includes(location.name.toLowerCase())
    );
    
    const detailContent = `
        <div class="detail-header">
            <div class="detail-emoji">${getCountryFlag(location.country)}</div>
            <div class="detail-title-info">
                <h2>${location.name}</h2>
                <p class="detail-scientific">${location.country}</p>
            </div>
        </div>
        
        <div class="detail-stats-grid">
            <div class="detail-stat">
                <div class="detail-stat-value">${location.area_km2?.toLocaleString() || 'N/A'}</div>
                <div class="detail-stat-label">Area (km²)</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-value">${locationSightings.length}</div>
                <div class="detail-stat-label">Sightings Recorded</div>
            </div>
            <div class="detail-stat">
                <div class="detail-stat-value">${location.primary_species || 'Multiple'}</div>
                <div class="detail-stat-label">Primary Species</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-location-dot"></i> Coordinates</h4>
            <p>${location.coordinates || 'Not specified'}</p>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-eye"></i> Recent Sightings (${locationSightings.length})</h4>
            ${locationSightings.length > 0 ? `
                <div class="sightings-list-detail">
                    ${locationSightings.slice(0, 5).map(s => `
                        <div class="sighting-detail-item">
                            <div class="sighting-date">${s.date}</div>
                            <div class="sighting-location">${s.animal_name} - ${s.count} animals</div>
                            <div class="sighting-count">Observed by ${s.observer}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="no-data">No sightings recorded at this location yet</p>'}
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-info-circle"></i> Conservation Importance</h4>
            <p>${location.name} is a critical conservation area in ${location.country}, protecting ${location.primary_species || 'various endangered species'} and their natural habitat.</p>
        </div>
    `;
    
    document.getElementById('detailTitle').textContent = location.name;
    document.getElementById('detailContent').innerHTML = detailContent;
    document.getElementById('detailModal').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function editLocation(id) {
    const user = getCurrentUser();
    
    // Only Admin can edit locations
    if (user?.role !== 'Administrator') {
        alert('You do not have permission to edit locations. Only Administrators can edit.');
        return;
    }
    
    const location = getLocationById(id);
    if (!location) return;
    
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Location';
    document.getElementById('locationId').value = location.id;
    document.getElementById('locationName').value = location.name;
    document.getElementById('locationCountry').value = location.country;
    document.getElementById('locationCoordinates').value = location.coordinates || '';
    document.getElementById('locationArea').value = location.area_km2;
    document.getElementById('locationPrimarySpecies').value = location.primary_species || '';
    
    document.getElementById('locationModal').style.display = 'flex';
}

function deleteLocationHandler(id) {
    const user = getCurrentUser();
    
    // Only Admin can delete locations
    if (user?.role !== 'Administrator') {
        alert('You do not have permission to delete locations. Only Administrators can delete.');
        return;
    }
    
    const location = getLocationById(id);
    if (confirm(`Are you sure you want to delete ${location?.name}? This action cannot be undone.`)) {
        deleteLocation(id);
        renderLocations();
        showToast(`${location?.name} has been deleted`, 'success');
    }
}

function closeLocationModal() {
    document.getElementById('locationModal').style.display = 'none';
    document.getElementById('locationForm').reset();
    document.getElementById('locationId').value = '';
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function initLocationsPage() {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
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
    
    // SHOW/HIDE ADD LOCATION BUTTON based on role
    // Only Admin can add locations
    const addBtn = document.getElementById('addLocationBtn');
    if (addBtn) {
        if (user.role === 'Administrator') {
            addBtn.style.display = 'flex';
        } else {
            addBtn.style.display = 'none';
        }
    }
    
    updateDateTime();
    loadAnimalDropdown();
    renderLocations();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderLocations();
        });
    }
}

document.getElementById('locationForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    
    // Only Admin can add/edit locations
    if (user?.role !== 'Administrator') {
        alert('You do not have permission to add or edit locations.');
        return;
    }
    
    const id = document.getElementById('locationId').value;
    const locationData = {
        name: document.getElementById('locationName').value,
        country: document.getElementById('locationCountry').value,
        coordinates: document.getElementById('locationCoordinates').value,
        area_km2: parseInt(document.getElementById('locationArea').value),
        primary_species: document.getElementById('locationPrimarySpecies').value
    };
    
    if (id) {
        updateLocation(id, locationData);
        showToast('Location updated successfully!', 'success');
    } else {
        addLocation(locationData);
        showToast('New location added successfully!', 'success');
    }
    
    closeLocationModal();
    renderLocations();
});

document.getElementById('addLocationBtn')?.addEventListener('click', function() {
    const user = getCurrentUser();
    
    if (user?.role !== 'Administrator') {
        alert('You do not have permission to add locations.');
        return;
    }
    
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Location';
    document.getElementById('locationForm').reset();
    document.getElementById('locationId').value = '';
    loadAnimalDropdown();
    document.getElementById('locationModal').style.display = 'flex';
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

setInterval(updateDateTime, 60000);
initLocationsPage();