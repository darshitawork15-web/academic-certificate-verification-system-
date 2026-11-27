# Decentralized Academic Certificate Verification — Frontend

React/Vite frontend prototype for the college major project.

## Included
- Certificate verification UI
- Admin / Issue Certificate UI
- Student certificate view
- Responsive design
- Backend connection placeholder

## Run
Inside the project folder:

npm install
npm run dev

## Backend connection
Open `src/App.jsx`.

At the top:
const API_BASE_URL = "http://localhost:5000/api";

The Verify button contains a comment showing where to replace the demo behavior with the team's real backend endpoint.

Example:
const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/verify`);
const data = await response.json();

Use the actual endpoint, method, and response fields supplied by the backend team.


## Complete project setup
1. Install Node.js (LTS) if it is not installed.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed in the terminal (usually http://localhost:5173).

The Verify button is currently a demo. Update the API URL and request/response handling in `src/App.jsx` to match your backend API. The frontend does not perform real blockchain verification by itself.
