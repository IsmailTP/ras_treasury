# Ra's Treasury API

An Egyptian-themed API exploitation challenge focused on Mass Assignment vulnerabilities and privilege escalation through insecure backend object handling.

---

## Challenge Information

* **Category:** Web Security / API Security
* **Difficulty:** Medium
* **Author:** Ismail TP

---

## Description

Ra's Treasury API is a Capture The Flag (CTF) challenge designed to teach players how insecure backend object mapping can lead to privilege escalation.

Players interact with a treasury system where offerings can be submitted to the Pharaoh’s vault. While the application appears secure from the frontend, hidden properties inside API responses reveal weaknesses in how user-controlled data is processed by the backend.

The challenge encourages players to inspect API traffic, analyze hidden fields, and exploit insecure update functionality to gain elevated access.

---

## Features

* Egyptian-themed API challenge
* Interactive treasure management system
* Hidden backend properties
* REST API interaction
* Privilege escalation workflow
* Real-world inspired Mass Assignment vulnerability
* Beginner-to-intermediate exploitation path

---

## Concepts Covered

* Mass Assignment vulnerabilities
* Privilege escalation
* Hidden API fields
* Insecure backend object mapping
* API request manipulation
* REST API analysis
* Broken access control

---

## Technologies Used

* Node.js / Express.js
* HTML/CSS/JavaScript
* REST API Architecture

---

## Skills Practiced

* API reconnaissance
* Network traffic analysis
* JSON request manipulation
* Backend logic analysis
* Privilege escalation testing
* Burp Suite / Postman workflow

---

## Setup Instructions

### Clone Repository

```bash id="p3o2di"
git clone https://github.com/IsmailTP/ras-treasury.git
cd ras-treasury
```

### Install Dependencies

```bash id="0m7r1q"
npm install
```

### Run the Challenge

```bash id="xh7f6w"
node app.js
```

---

## Screenshots

Add challenge screenshots here.

Suggested screenshots:

* Treasury interface
* API request/response
* Hidden JSON fields
* Modified request payload
* Admin shrine access

---

## Educational Purpose

This project was created for ethical cybersecurity education and hands-on security training purposes only.

Do not use these techniques against systems without proper authorization.
