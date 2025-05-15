const BASE = 'http://localhost:8080/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

// Views
const eventViews = document.getElementById('events-view');
const loginView = document.getElementById('login-view');
const requestsView = document.getElementById('requests-view');

// Buttons & Forms
const viewReqBtn = document.getElementById('view-requests-btn');
const backBtn = document.getElementById('back-to-events');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

// Tables
const eventsTbody = document.querySelector('#events-table tbody');
const requestsTbody = document.querySelector('#requests-table tbody');

// Debug helper
function debugLog(tag, data) {
    console.group(tag);
    console.log(data);
    console.groupEnd();
}

// Load events on page load
document.addEventListener('DOMContentLoaded', () => loadEvents());

viewReqBtn.addEventListener('click', () => {
    eventViews.classList.add('hidden');
    loginView.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
    requestsView.classList.add('hidden');
    eventViews.classList.remove('hidden');
});

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        loginError.textContent = '';
        loginView.classList.add('hidden');
        requestsView.classList.remove('hidden');
        await loadRequests();
    } else {
        loginError.textContent = 'Invalid credentials';
    }
});

async function loadEvents(page = 0, size = 20) {
    try {
        const res  = await fetch(`${BASE}/events?page=${page}&size=${size}`);
        const data = await res.json();
        debugLog('EVENTS RESPONSE', data);

        const list = Array.isArray(data.content) ? data.content : [];
        eventsTbody.innerHTML = '';

        if (list.length === 0) {
            eventsTbody.innerHTML = `<tr><td colspan="5">No events found</td></tr>`;
            return;
        }

        list.forEach(evt => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${evt.eventId}</td>
                <td>${evt.title}</td>
                <td>${new Date(evt.startTime).toLocaleString()}</td>
                <td>${new Date(evt.endTime).toLocaleString()}</td>
                <td>${evt.venue ?? '-'}</td>
            `;
            eventsTbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading events:', err);
        eventsTbody.innerHTML = `<tr><td colspan="5">Error loading events</td></tr>`;
    }
}

async function loadRequests(page = 0, size = 20) {
    try {
        const res  = await fetch(`${BASE}/events/requests?page=${page}&size=${size}`);
        const data = await res.json();
        debugLog('REQUESTS RESPONSE', data);

        const list = Array.isArray(data.content) ? data.content : [];
        requestsTbody.innerHTML = '';

        if (list.length === 0) {
            requestsTbody.innerHTML = `<tr><td colspan="6">No requests found</td></tr>`;
            return;
        }

        list.forEach(req => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${req.requestId}</td>
                <td>${req.eventId}</td>
                <td>${req.requesterName}</td>
                <td>${req.requesterEmail}</td>
                <td>${req.quantity}</td>
                <td>${req.status ?? '-'}</td>
            `;
            requestsTbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading requests:', err);
        requestsTbody.innerHTML = `<tr><td colspan="6">Error loading requests</td></tr>`;
    }
}