// mockData.js - Complete Fake Database with New Users & Guest Mode

let currentUser = null;

const users = [
    // Admins
    { 
        id: 1, 
        name: "Adam", 
        email: "adam@wildlife.com", 
        password: "adam123", 
        role: "Administrator",
        avatar: "👑"
    },
    { 
        id: 2, 
        name: "Omar", 
        email: "omar@wildlife.com", 
        password: "omar123", 
        role: "Administrator",
        avatar: "👑"
    },
    // Researchers
    { 
        id: 3, 
        name: "Majdouline", 
        email: "majdouline@wildlife.com", 
        password: "majdouline123", 
        role: "Researcher",
        avatar: "🔬"
    },
    { 
        id: 4, 
        name: "Hanae", 
        email: "hanae@wildlife.com", 
        password: "hanae123", 
        role: "Researcher",
        avatar: "🔬"
    },
    // Rangers
    { 
        id: 5, 
        name: "Bachair", 
        email: "bachair@wildlife.com", 
        password: "bachair123", 
        role: "Field Ranger",
        avatar: "🛡️"
    },
    { 
        id: 6, 
        name: "Farid", 
        email: "farid@wildlife.com", 
        password: "farid123", 
        role: "Field Ranger",
        avatar: "🛡️"
    }
];

// Guest user (read-only access)
const guestUser = {
    id: 0,
    name: "Guest",
    email: "guest@wildlife.com",
    role: "Guest",
    avatar: "👤"
};

let animals = [
    { 
        id: 1, 
        name: "African Elephant", 
        scientific_name: "Loxodonta africana", 
        population: 415000, 
        habitat: "Savanna and forests of Africa", 
        threat_level: "Endangered", 
        image: "🐘", 
        conservation_status: "Vulnerable" 
    },
    { 
        id: 2, 
        name: "Bengal Tiger", 
        scientific_name: "Panthera tigris tigris", 
        population: 2500, 
        habitat: "Indian subcontinent", 
        threat_level: "Critical", 
        image: "🐯", 
        conservation_status: "Endangered" 
    },
    { 
        id: 3, 
        name: "Mountain Gorilla", 
        scientific_name: "Gorilla beringei beringei", 
        population: 1063, 
        habitat: "Virunga Mountains", 
        threat_level: "Critical", 
        image: "🦍", 
        conservation_status: "Critically Endangered" 
    },
    { 
        id: 4, 
        name: "Giant Panda", 
        scientific_name: "Ailuropoda melanoleuca", 
        population: 1864, 
        habitat: "Bamboo forests of China", 
        threat_level: "Medium", 
        image: "🐼", 
        conservation_status: "Vulnerable" 
    },
    { 
        id: 5, 
        name: "Sea Turtle", 
        scientific_name: "Chelonioidea", 
        population: 200000, 
        habitat: "Tropical oceans", 
        threat_level: "High", 
        image: "🐢", 
        conservation_status: "Endangered" 
    },
    { 
        id: 6, 
        name: "Black Rhino", 
        scientific_name: "Diceros bicornis", 
        population: 5630, 
        habitat: "Savannas of Africa", 
        threat_level: "Critical", 
        image: "🦏", 
        conservation_status: "Critically Endangered" 
    },
    { 
        id: 7, 
        name: "Orangutan", 
        scientific_name: "Pongo pygmaeus", 
        population: 104700, 
        habitat: "Rainforests of Borneo", 
        threat_level: "High", 
        image: "🦧", 
        conservation_status: "Endangered" 
    },
    { 
        id: 8, 
        name: "Snow Leopard", 
        scientific_name: "Panthera uncia", 
        population: 6500, 
        habitat: "Mountain ranges of Central Asia", 
        threat_level: "High", 
        image: "🐆", 
        conservation_status: "Vulnerable" 
    },
    { 
        id: 9, 
        name: "Barbary Macaque", 
        scientific_name: "Macaca sylvanus", 
        population: 8000, 
        habitat: "Atlas Mountains, Morocco", 
        threat_level: "Endangered", 
        image: "🐒", 
        conservation_status: "Endangered" 
    },
    { 
        id: 10, 
        name: "Northern Bald Ibis", 
        scientific_name: "Geronticus eremita", 
        population: 500, 
        habitat: "Morocco and Middle East", 
        threat_level: "Critical", 
        image: "🦩", 
        conservation_status: "Critically Endangered" 
    }
];

let sightings = [
    { 
        id: 1, 
        animal_id: 1, 
        animal_name: "African Elephant", 
        location: "Amboseli National Park, Kenya", 
        date: "2025-03-15", 
        count: 45, 
        observer: "Adam", 
        notes: "Healthy herd with many calves" 
    },
    { 
        id: 2, 
        animal_id: 2, 
        animal_name: "Bengal Tiger", 
        location: "Ranthambore National Park, India", 
        date: "2025-03-10", 
        count: 3, 
        observer: "Bachair", 
        notes: "Mother with two cubs" 
    },
    { 
        id: 3, 
        animal_id: 3, 
        animal_name: "Mountain Gorilla", 
        location: "Volcanoes National Park, Rwanda", 
        date: "2025-03-05", 
        count: 12, 
        observer: "Omar", 
        notes: "Family group including silverback" 
    },
    { 
        id: 4, 
        animal_id: 1, 
        animal_name: "African Elephant", 
        location: "Masai Mara, Kenya", 
        date: "2025-03-18", 
        count: 28, 
        observer: "Majdouline", 
        notes: "Crossing the river" 
    },
    { 
        id: 5, 
        animal_id: 4, 
        animal_name: "Giant Panda", 
        location: "Sichuan Province, China", 
        date: "2025-03-12", 
        count: 2, 
        observer: "Hanae", 
        notes: "Feeding on bamboo" 
    },
    { 
        id: 6, 
        animal_id: 6, 
        animal_name: "Black Rhino", 
        location: "Etosha National Park, Namibia", 
        date: "2025-03-08", 
        count: 5, 
        observer: "Farid", 
        notes: "Mother and calf spotted" 
    },
    { 
        id: 7, 
        animal_id: 9, 
        animal_name: "Barbary Macaque", 
        location: "Toubkal National Park, Morocco", 
        date: "2025-03-20", 
        count: 15, 
        observer: "Adam", 
        notes: "Group feeding on cedar trees" 
    },
    { 
        id: 8, 
        animal_id: 10, 
        animal_name: "Northern Bald Ibis", 
        location: "Souss-Massa National Park, Morocco", 
        date: "2025-03-17", 
        count: 8, 
        observer: "Majdouline", 
        notes: "Nesting season observed" 
    }
];

let locations = [
    { 
        id: 1, 
        name: "Toubkal National Park", 
        country: "Morocco", 
        coordinates: "31.5000° N, 7.5000° W", 
        area_km2: 380, 
        primary_species: "Barbary Macaque" 
    },
    { 
        id: 2, 
        name: "Souss-Massa National Park", 
        country: "Morocco", 
        coordinates: "30.1000° N, 9.6000° W", 
        area_km2: 338, 
        primary_species: "Northern Bald Ibis" 
    },
    { 
        id: 3, 
        name: "Amboseli National Park", 
        country: "Kenya", 
        coordinates: "-2.6389° S, 37.2533° E", 
        area_km2: 392, 
        primary_species: "African Elephant" 
    },
    { 
        id: 4, 
        name: "Masai Mara National Reserve", 
        country: "Kenya", 
        coordinates: "-1.4931° S, 35.1432° E", 
        area_km2: 1510, 
        primary_species: "African Elephant" 
    },
    { 
        id: 5, 
        name: "Ranthambore National Park", 
        country: "India", 
        coordinates: "26.0173° N, 76.5026° E", 
        area_km2: 392, 
        primary_species: "Bengal Tiger" 
    },
    { 
        id: 6, 
        name: "Volcanoes National Park", 
        country: "Rwanda", 
        coordinates: "1.4675° S, 29.4925° E", 
        area_km2: 160, 
        primary_species: "Mountain Gorilla" 
    },
    { 
        id: 7, 
        name: "Sichuan Giant Panda Sanctuary", 
        country: "China", 
        coordinates: "30.5728° N, 103.0143° E", 
        area_km2: 9245, 
        primary_species: "Giant Panda" 
    },
    { 
        id: 8, 
        name: "Serengeti National Park", 
        country: "Tanzania", 
        coordinates: "2.3333° S, 34.8333° E", 
        area_km2: 14750, 
        primary_species: "African Elephant" 
    },
    { 
        id: 9, 
        name: "Kruger National Park", 
        country: "South Africa", 
        coordinates: "24.0111° S, 31.4853° E", 
        area_km2: 19485, 
        primary_species: "Black Rhino" 
    }
];

function getCurrentUser() {
    const stored = localStorage.getItem('wildlife_conservation_user');
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }
    return currentUser;
}

function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('wildlife_conservation_user', JSON.stringify(user));
}

function clearCurrentUser() {
    currentUser = null;
    localStorage.removeItem('wildlife_conservation_user');
}

function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            loginTime: new Date().toISOString()
        };
        setCurrentUser(sessionUser);
        return { success: true, user: sessionUser };
    }
    return { success: false, error: "Invalid email or password. Please try again." };
}

function guestLogin() {
    const sessionUser = {
        id: 0,
        name: "Guest",
        email: "guest@wildlife.com",
        role: "Guest",
        avatar: "👤",
        loginTime: new Date().toISOString()
    };
    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
}

function logout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

function getAnimals() {
    return [...animals];
}

function getAnimalById(id) {
    return animals.find(a => a.id === parseInt(id));
}

function addAnimal(animalData) {
    const newId = animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1;
    const newAnimal = {
        id: newId,
        name: animalData.name,
        scientific_name: animalData.scientific_name,
        population: parseInt(animalData.population),
        habitat: animalData.habitat,
        threat_level: animalData.threat_level || "Medium",
        image: animalData.image || "🦁",
        conservation_status: animalData.conservation_status || "Vulnerable"
    };
    animals.push(newAnimal);
    return newAnimal;
}

function updateAnimal(id, updatedData) {
    const index = animals.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
        animals[index] = { ...animals[index], ...updatedData };
        return animals[index];
    }
    return null;
}

function deleteAnimal(id) {
    const index = animals.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
        animals.splice(index, 1);
        return true;
    }
    return false;
}

function getSightings() {
    return [...sightings];
}

function getSightingById(id) {
    return sightings.find(s => s.id === parseInt(id));
}

function getSightingsByAnimal(animalId) {
    return sightings.filter(s => s.animal_id === parseInt(animalId));
}

function addSighting(sightingData) {
    const newId = sightings.length > 0 ? Math.max(...sightings.map(s => s.id)) + 1 : 1;
    const newSighting = {
        id: newId,
        animal_id: parseInt(sightingData.animal_id),
        animal_name: sightingData.animal_name,
        location: sightingData.location,
        date: sightingData.date,
        count: parseInt(sightingData.count),
        observer: sightingData.observer || (getCurrentUser() ? getCurrentUser().name : "Unknown"),
        notes: sightingData.notes || ""
    };
    sightings.unshift(newSighting);
    return newSighting;
}

function updateSighting(id, updatedData) {
    const index = sightings.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
        sightings[index] = { ...sightings[index], ...updatedData };
        return sightings[index];
    }
    return null;
}

function deleteSighting(id) {
    const index = sightings.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
        sightings.splice(index, 1);
        return true;
    }
    return false;
}

function getLocations() {
    return [...locations];
}

function getLocationById(id) {
    return locations.find(l => l.id === parseInt(id));
}

function addLocation(locationData) {
    const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    const newLocation = {
        id: newId,
        name: locationData.name,
        country: locationData.country,
        coordinates: locationData.coordinates,
        area_km2: parseInt(locationData.area_km2),
        primary_species: locationData.primary_species
    };
    locations.push(newLocation);
    return newLocation;
}

function updateLocation(id, updatedData) {
    const index = locations.findIndex(l => l.id === parseInt(id));
    if (index !== -1) {
        locations[index] = { ...locations[index], ...updatedData };
        return locations[index];
    }
    return null;
}

function deleteLocation(id) {
    const index = locations.findIndex(l => l.id === parseInt(id));
    if (index !== -1) {
        locations.splice(index, 1);
        return true;
    }
    return false;
}

function getDashboardStats() {
    return {
        totalAnimals: animals.length,
        totalSightings: sightings.length,
        totalLocations: locations.length,
        criticalSpecies: animals.filter(a => a.threat_level === "Critical").length,
        recentSightings: sightings.slice(0, 5)
    };
}

function getTopSpecies(limit = 5) {
    return [...animals]
        .sort((a, b) => b.population - a.population)
        .slice(0, limit);
}

function getSightingsByDateRange(startDate, endDate) {
    return sightings.filter(s => s.date >= startDate && s.date <= endDate);
}