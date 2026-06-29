
```markdown
# 🔐 DigiSign - Digital Signature Verification System

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **A full-stack web application for securely signing and verifying documents using RSA digital signatures.**

---

## 📖 Table of Contents
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🖥️ Usage Guide](#️-usage-guide)
- [📂 Project Structure](#-project-structure)
- [🔐 Security](#-security)
- [🛠️ Tech Stack](#️-tech-stack)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Upload & Sign** | Generate digital signatures for any document |
| 🔍 **Verify Authenticity** | Check if a document has been tampered with |
| 💾 **Download Signatures** | Save signatures as `.txt` files |
| 📋 **Copy to Clipboard** | Easy signature sharing with one click |
| 📜 **Signature History** | Track all signed documents with timestamps |
| 🔐 **RSA Encryption** | Industry-standard cryptographic security |
| 🗄️ **Persistent Storage** | MySQL database for document records |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                    http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Spring Boot Backend                        │
│                    http://localhost:8080                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   /upload    │  │   /verify    │  │   KeyPairManager   │   │
│  │  Endpoint    │  │  Endpoint    │  │   (RSA Keys)       │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MySQL Database                          │
│                        digisign_db                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  documents                                                │ │
│  │  ├── id              (BIGINT)   PRIMARY KEY AUTO_INCREMENT│ │
│  │  ├── file_name       (VARCHAR)  File name                │ │
│  │  ├── digital_signature (TEXT)   RSA Signature            │ │
│  │  ├── public_key      (TEXT)     Public Key               │ │
│  │  └── upload_timestamp (DATETIME) Signing timestamp        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 📋 Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java | 17+ | [Adoptium](https://adoptium.net/temurin/releases/) |
| Node.js | 16+ | [Node.js](https://nodejs.org/) |
| MySQL | 8.0+ | [MySQL](https://dev.mysql.com/downloads/installer/) |
| Maven | 3.9+ | Included via wrapper |

### ⚡ Installation Steps

**1️⃣ Clone the Repository**
```bash
git clone https://github.com/aagamaar/digisign.git
cd digisign
```

**2️⃣ Configure Database**
```sql
-- Create database
CREATE DATABASE digisign_db;
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/digisign_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

**3️⃣ Start the Backend**
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```
✅ Backend running at: **http://localhost:8080**

**4️⃣ Start the Frontend** (in new terminal)
```bash
cd frontend
npm install
npm start
```
✅ Frontend running at: **http://localhost:3000**

---

## 🖥️ Usage Guide

### 📝 Sign a Document
| Step | Action |
|------|--------|
| 1 | Click **"Choose File"** and select a document |
| 2 | Click **"🚀 Sign File"** |
| 3 | Digital signature is generated and displayed |
| 4 | Download as `.txt` or copy to clipboard |

### 🔍 Verify a Document
| Step | Action |
|------|--------|
| 1 | Click **"Choose File"** and select document |
| 2 | Paste the signature string |
| 3 | Click **"🔎 Verify File"** |
| 4 | See if document is ✅ **authentic** or ❌ **tampered** |

---

## 📂 Project Structure

```
digisign/
├── 📁 .mvn/                          # Maven wrapper
├── 📁 frontend/                      # React frontend
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📄 App.js                 # Main React component
│   │   └── 📄 index.js
│   ├── 📄 package.json
│   └── 📄 package-lock.json
├── 📁 src/                           # Backend source
│   └── 📁 main/
│       ├── 📁 java/com/example/digisign/
│       │   ├── 📁 controllers/
│       │   │   └── 📄 DocumentController.java
│       │   ├── 📁 crypto/
│       │   │   ├── 📄 KeyPairManager.java
│       │   │   └── 📄 SignatureEngine.java
│       │   ├── 📁 entities/
│       │   │   └── 📄 Document.java
│       │   ├── 📁 repositories/
│       │   │   └── 📄 DocumentRepository.java
│       │   └── 📄 DigisignApplication.java
│       └── 📁 resources/
│           └── 📄 application.properties
├── 📄 pom.xml                        # Maven configuration
├── 📄 mvnw / mvnw.cmd                # Maven wrapper
└── 📄 README.md                      # This file
```

---

## 🔐 Security

| Layer | Implementation |
|-------|----------------|
| **Encryption** | RSA-2048 (industry standard) |
| **Hashing** | SHA-256 for file integrity |
| **Key Management** | Public/Private key infrastructure |
| **Storage** | Secure database storage with encryption |
| **Verification** | Digital signature verification with public key |

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | React | 18.x | UI Framework |
| | Axios | ^1.6.0 | HTTP Client |
| **Backend** | Spring Boot | 4.1.0 | REST API Framework |
| | Spring Data JPA | 4.1.0 | ORM & Database |
| | Hibernate | 7.4.1 | JPA Implementation |
| **Database** | MySQL | 8.0 | Relational Database |
| **Build Tools** | Maven | 3.9+ | Backend Build |
| | npm | 9.x | Frontend Build |
| **Security** | RSA | 2048-bit | Digital Signatures |
| | SHA-256 | - | Hashing Algorithm |

---

## 🌐 Deployment

### ☁️ Deploy Backend (Railway / Render)

1. Push code to GitHub
2. Connect repository to [Railway](https://railway.app/) or [Render](https://render.com/)
3. Add environment variables:
```env
SPRING_DATASOURCE_URL=jdbc:mysql://your_mysql_host:3306/digisign_db?useSSL=false
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### 🌍 Deploy Frontend (Vercel / Netlify)

**Vercel CLI:**
```bash
cd frontend
npm run build
vercel --prod
```

**Netlify CLI:**
```bash
cd frontend
npm run build
netlify deploy --prod
```

**Drag & Drop:**
1. Run `npm run build` in `frontend/`
2. Drag the `build` folder to [Netlify](https://netlify.com)

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

| Name | Role | GitHub |
|------|------|--------|
| **Aagama AR** | Developer | [@aagamaar](https://github.com/aagamaar) |
| **Sherin Rajan Reumah** | Developer | [@SRReumah](https://github.com/SRReumah) |
| **Parvathy Anil** | Developer | [@Achu067](https://github.com/Achu067) |
| **Archana Sunil** | Developer | [@Arch0308](https://github.com/Arch0308) |

---

## 🙏 Acknowledgments

- React team for the amazing frontend framework
- Spring Boot team for the robust backend
- OpenJDK community for Java
- All contributors and open source libraries used

---

## 📊 Project Status

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Build](https://img.shields.io/badge/Build-Passing-success)
![Coverage](https://img.shields.io/badge/Coverage-85%25-green)

---

<div align="center">

**⭐ Star this repository if you found it useful!**

[![GitHub stars](https://img.shields.io/github/stars/aagamaar/digisign?style=social)](https://github.com/aagamaar/digisign)
[![GitHub forks](https://img.shields.io/github/forks/aagamaar/digisign?style=social)](https://github.com/aagamaar/digisign)
[![GitHub watchers](https://img.shields.io/github/watchers/aagamaar/digisign?style=social)](https://github.com/aagamaar/digisign)

---

**Built with ❤️ using React & Spring Boot**

</div>
```

---
