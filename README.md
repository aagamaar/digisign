
# 🔐 DigiSign - Digital Signature Verification System

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> A full-stack web application for securely signing and verifying documents using RSA digital signatures.

## 📹 Demo Video

Watch the full demo of DigiSign in action:

[![DigiSign Demo - Digital Signature Verification System](C:\Users\AAGAMA AR\OneDrive\Desktop\tc_prj_1\Screenshot 2026-06-30 012939.png)](https://youtu.be/Ib3VkGDofJI)

*Click the image above to watch the demo video.*

## Features

- 📄 **Upload & Sign Documents** - Generate digital signatures for any file
- 🔍 **Verify Authenticity** - Check if a document has been tampered with
- 💾 **Download Signatures** - Save signatures as `.txt` files
- 📋 **Copy to Clipboard** - Easy signature sharing
- 📜 **Signature History** - Track all signed documents
- 🔐 **RSA Encryption** - Industry-standard cryptographic security
- 🗄️ **Persistent Storage** - MySQL database for document records


## Quick Start

### Prerequisites

- Java 17+ ([Download](https://adoptium.net/temurin/releases/))
- Node.js 16+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/installer/))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/aagamaar/digisign.git
cd digisign
```

### 2️⃣ Configure Database

```sql
CREATE DATABASE digisign_db;
```

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/digisign_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

### 3️⃣ Start the Backend

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

Backend runs at: **http://localhost:8080**

### 4️⃣ Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## How to Use

### Sign a Document
1. Click "Choose File" and select a document
2. Click "Sign File"
3. Your digital signature is generated and displayed
4. Download as `.txt` or copy to clipboard

### Verify a Document
1. Click "Choose File" and select the document
2. Paste the signature string
3. Click "Verify File"
4. See if document is authentic or tampered

---

## Project Structure

```
digisign/
├── frontend/          # React frontend
│   ├── src/
│   │   └── App.js     # Main React component
│   └── package.json
├── src/               # Spring Boot backend
│   └── main/
│       ├── java/
│       │   └── com/example/digisign/
│       │       ├── controllers/
│       │       ├── crypto/
│       │       ├── entities/
│       │       └── repositories/
│       └── resources/
│           └── application.properties
├── pom.xml            # Maven config
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18.x |
| Backend | Spring Boot 4.1.0 |
| Database | MySQL 8.0 |
| Encryption | RSA-2048 + SHA-256 |

---

## Deployment

### Backend (Railway / Render)
Set environment variables:
```
SPRING_DATASOURCE_URL=your_mysql_url
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

---

## Authors

| Name | GitHub |
|------|--------|
| Aagama AR | [@aagamaar](https://github.com/aagamaar) |
| Sherin Rajan Reumah | [@SRReumah](https://github.com/SRReumah) |
| Parvathy Anil | [@Achu067](https://github.com/Achu067) |
| Archana Sunil | [@Arch0308](https://github.com/Arch0308) |

---

## License

MIT License

---

**Built with ❤️ using React & Spring Boot**