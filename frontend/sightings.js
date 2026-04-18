// sightings.js - Complete Sightings Management with Role-Based Access

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

function getAnimalImage(animalName) {
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
    if (name.includes('macaque')) return '🐒';
    if (name.includes('ibis')) return '🦩';
    return '🦁';
}

function loadAnimalDropdown() {
    const select = document.getElementById('animalSelect');
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
    
    select.innerHTML = '<option value="">-- Select an animal --</option>';
    for (let i = 0; i < animals.length; i++) {
        const animal = animals[i];
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = getAnimalImage(animal.name) + ' ' + animal.name;
        select.appendChild(option);
    }
}

function renderSightings() {
    if (typeof getSightings === 'undefined') {
        document.getElementById('sightingsContainer').innerHTML = '<div class="empty-state">Error: Database not loaded</div>';
        return;
    }
    
    const sightings = getSightings();
    const animals = getAnimals();
    const user = getCurrentUser();
    
    document.getElementById('totalAnimalsCount').textContent = animals.length;
    document.getElementById('totalSightingsCount').textContent = sightings.length;
    
    const container = document.getElementById('sightingsContainer');
    
    if (sightings.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-eye-slash"></i><p>No sightings recorded yet</p></div>';
        return;
    }
    
    // ROLE PERMISSIONS:
    // Guest: NO add, NO edit, NO delete
    // Ranger: NO add, NO edit, NO delete
    // Researcher: CAN add, CAN edit, NO delete
    // Administrator: CAN add, CAN edit, CAN delete
    
    const isGuest = user?.role === 'Guest';
    const isRanger = user?.role === 'Field Ranger';
    const isResearcher = user?.role === 'Researcher';
    const isAdmin = user?.role === 'Administrator';
    
    const canDelete = isAdmin;
    
    let html = '<div class="sightings-table-wrapper"><table class="sightings-table"><thead><tr>';
    html += '<th>Animal</th><th>Location</th><th>Date</th><th>Count</th><th>Observer</th>';
    if (canDelete) {
        html += '<th>Actions</th>';
    }
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i < sightings.length; i++) {
        const s = sightings[i];
        html += '<tr>';
        html += `<td data-label="Animal"><span style="font-size:20px;margin-right:8px;">${getAnimalImage(s.animal_name)}</span> ${s.animal_name}</td>`;
        html += `<td data-label="Location">${s.location}</td>`;
        html += `<td data-label="Date">${s.date}</td>`;
        html += `<td data-label="Count">${s.count}</td>`;
        html += `<td data-label="Observer">${s.observer}</td>`;
        if (canDelete) {
            html += `<td data-label="Actions" class="action-cell">
                        <button class="icon-btn delete" onclick="deleteSightingHandler(${s.id})" title="Delete Sighting">
                            <i class="fas fa-trash"></i>
                        </button>
                      </td>`;
        }
        html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function deleteSightingHandler(id) {
    const user = getCurrentUser();
    
    // Only Admin can delete sightings
    if (user?.role !== 'Administrator') {
        alert('You do not have permission to delete sightings. Only Administrators can delete.');
        return;
    }
    
    const sighting = getSightingById(id);
    if (confirm(`Delete this sighting of ${sighting?.animal_name}? This action cannot be undone.`)) {
        deleteSighting(id);
        renderSightings();
        showToast('Sighting deleted successfully!', 'success');
    }
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function closeSightingModal() {
    document.getElementById('sightingModal').style.display = 'none';
    document.getElementById('sightingForm').reset();
    document.getElementById('sightingDate').value = new Date().toISOString().split('T')[0];
}

function initSightingsPage() {
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
    
    // SHOW/HIDE ADD SIGHTING BUTTON based on role
    // Only Admin and Researcher can add sightings
    const addBtn = document.getElementById('addSightingBtn');
    if (addBtn) {
        if (user.role === 'Administrator' || user.role === 'Researcher') {
            addBtn.style.display = 'flex';
        } else {
            addBtn.style.display = 'none';
        }
    }
    
    updateDateTime();
    
    setTimeout(function() {
        loadAnimalDropdown();
        renderSightings();
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sightingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = getCurrentUser();
            
            // Only Admin and Researcher can add sightings
            if (user?.role !== 'Administrator' && user?.role !== 'Researcher') {
                alert('You do not have permission to add sightings.');
                return;
            }
            
            const animalId = document.getElementById('animalSelect').value;
            
            if (!animalId) {
                alert('Please select an animal');
                return;
            }
            
            const animal = getAnimalById(parseInt(animalId));
            if (!animal) {
                alert('Selected animal not found');
                return;
            }
            
            const sightingData = {
                animal_id: parseInt(animalId),
                animal_name: animal.name,
                location: document.getElementById('sightingLocation').value,
                date: document.getElementById('sightingDate').value,
                count: parseInt(document.getElementById('sightingCount').value),
                observer: user.name,
                notes: document.getElementById('sightingNotes').value
            };
            
            addSighting(sightingData);
            showToast(`✅ Sighting recorded for ${animal.name}!`, 'success');
            
            closeSightingModal();
            renderSightings();
            loadAnimalDropdown();
        });
    }
    
    const addBtn = document.getElementById('addSightingBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const user = getCurrentUser();
            
            if (user?.role !== 'Administrator' && user?.role !== 'Researcher') {
                alert('You do not have permission to add sightings.');
                return;
            }
            
            const animals = getAnimals();
            if (animals.length === 0) {
                alert('⚠️ Please add animals first before recording sightings!\n\nGo to Animals page to add species.');
                return;
            }
            
            document.getElementById('sightingForm').reset();
            document.getElementById('sightingDate').value = new Date().toISOString().split('T')[0];
            loadAnimalDropdown();
            document.getElementById('sightingModal').style.display = 'flex';
        });
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.classList && e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    setInterval(updateDateTime, 60000);
    initSightingsPage();
});