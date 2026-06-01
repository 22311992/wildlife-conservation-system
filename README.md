# 🌿 Wildlife Conservation Management System

<div align="center">

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### 🦁 Wildlife Conservation Management System
### Database Management Systems & Programming II - Final Project

Protecting Wildlife Through Intelligent Data Management

</div>

---

# 📖 Overview

The Wildlife Conservation Management System is a cloud-based database application developed using **PostgreSQL** and **Supabase**.

The system enables wildlife organizations, researchers, and conservation teams to efficiently manage:

- 🦁 Animal records
- 🌍 Protected locations
- 📍 Wildlife sightings
- 🌿 Conservation programs
- ⚠️ Threat monitoring
- 👥 User roles and permissions
- 📊 Reporting and analytics

The project demonstrates advanced database concepts combined with a modern frontend interface and cloud database integration.

---

# 🚀 Features

### 🐾 Wildlife Management
- Create, update, view, and delete animal records
- Track scientific and common species names
- Monitor conservation status
- Store habitat and population information

### 📍 Sighting Tracking
- Record wildlife sightings
- Verify observations
- Track observers and locations
- Generate wildlife activity reports

### 🌿 Conservation Programs
- Manage conservation projects
- Link species to programs
- Monitor program progress

### 🔐 Authentication & Security
- Role-Based Access Control (RBAC)
- Admin, Ranger, Researcher permissions
- Supabase Authentication
- Row Level Security (RLS)

### 📊 Advanced Database Features
- Views
- Triggers
- Stored Procedures
- Functions
- Transactions
- Indexes
- Audit Logging
- Full-Text Search

---

# 🏗️ System Architecture

```text
Frontend (HTML/CSS/JavaScript)
            │
            ▼
     Supabase JS SDK
            │
            ▼
      Supabase Cloud
            │
            ▼
      PostgreSQL Database
```

---

# 🗄️ Database Design

### Core Entities

| Entity | Description |
|----------|------------|
| Users | System users |
| Roles | Access permissions |
| Animals | Wildlife species |
| Sightings | Animal observations |
| Locations | Protected areas |
| Countries | Geographic regions |
| Threat Types | Wildlife threats |
| Conservation Programs | Protection initiatives |
| Conservation Statuses | IUCN categories |
| Taxonomic Classes | Animal classifications |
| Audit Log | Activity tracking |

### Associative Tables

- animal_threats
- location_species
- program_animals

### Total Tables

✅ 14 Relational Tables

---

# 📚 Technologies Used

| Technology | Purpose |
|------------|----------|
| PostgreSQL | Database |
| Supabase | Cloud Backend |
| JavaScript | Frontend Logic |
| HTML5 | User Interface |
| CSS3 | Styling |
| GitHub | Version Control |
| Draw.io | ERD Design |
| VS Code | Development Environment |

---

# ⚙️ Advanced SQL Implementation

### 👁️ Views

- `v_sighting_dashboard`
- `v_animal_threat_profile`

### ⚡ Triggers

- Population escalation trigger
- Audit logging trigger

### 🧠 Functions

- `sp_log_sighting()`
- `fn_coords()`
- `fn_country_report()`

### 🔒 Procedures

- `DeleteAnimalSecure()`

### 🔍 Indexes

- Animal indexes
- Sighting indexes
- Full-text search indexes
- Audit log indexes

---

# 🔗 Supabase Integration

The application communicates directly with Supabase using the JavaScript SDK.

### Database Connection

```javascript
const supabaseClient =
supabase.createClient(url, key);
```

### Fetch Data

```javascript
supabaseClient
.from('animals')
.select('*');
```

### Insert Data

```javascript
supabaseClient
.from('animals')
.insert([...]);
```

### Delete Data

```javascript
supabaseClient
.from('animals')
.delete()
.eq('animal_id', id);
```

---

# 🖥️ Application Modules

### 🔐 Authentication
- User Login
- Session Management
- Role Verification

### 🦁 Animal Management
- Add Species
- Edit Species
- Delete Species
- Search Species

### 📍 Sighting Management
- Record Sightings
- Verification Workflow
- Reporting

### 🌿 Conservation Programs
- Program Tracking
- Species Assignment

---

# 📈 Project Achievements

- ✅ Fully normalized database (3NF)
- ✅ 14 relational tables
- ✅ Role-based security
- ✅ Cloud deployment using Supabase
- ✅ Full CRUD implementation
- ✅ Advanced PostgreSQL features
- ✅ Real-time synchronization
- ✅ Audit logging system

---

# 👨‍💻 Team Members

| Student | ID | Contribution |
|----------|---------|-------------|
| Hana Shaimi | 22312235 | Backend, Database Connection, ERD, Queries Testing |
| Majdoline Elbennadi | 22310812 | ERD, DDL, DML, SQL Queries |
| Omar Rodi | 22311992 | Frontend Development |
| Adam Elboudali Zahid | 22316739 | SQL Queries, Procedures, Functions |
| Bachair Lahouiri | 22308827 | Functions, SQL Queries |

---

# 📷 Screenshots

### Login System
- Supabase Authentication
- Role-Based Access

### Dashboard
- Real-Time Statistics
- Conservation Monitoring

### Animal Management
- CRUD Operations
- Database Synchronization

### Sighting Records
- Observation Tracking
- Verification Workflow

---

# 🎓 Academic Information

**Course:** CMPE344 - Database Management Systems and Programming II

**University:** Cyprus International University

**Year:** 2025-2026

---

# 📄 License

This project was developed for academic and educational purposes.

---

<div align="center">

### 🌿 Protecting Wildlife Through Intelligent Data Management

Made with ❤️ using PostgreSQL & Supabase

</div>
