const BASE = 'http://localhost:8080/api';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

// Views
const eventViews = document.getElementById('events-view');
const loginView = document.getElementById('login-view');
const requestsView = document.getElementById('requests-view');
const adminPanelView = document.getElementById('admin-panel-view');

// Elements
const modal = document.getElementById('request-form-modal');
const closeFormBtn = document.getElementById('close-form');
const requestForm = document.getElementById('request-form');
const formError = document.getElementById('form-error');
const formSuccess = document.getElementById('form-success');

// Buttons & Forms
const eventForm = document.getElementById('event-form');
const backFromPanel =  document.getElementById('back-from-panel');
const adminPanelBtn = document.getElementById('admin-panel-btn');
const viewReqBtn = document.getElementById('view-requests-btn');
const backBtn = document.getElementById('back-to-events');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

// Grids and Tables
const eventsGrid = document.getElementById('events-grid');
const requestsTbody = document.querySelector('#requests-table tbody');

// Debug helper
function debugLog(tag, data) {
    console.group(tag);
    console.log(data);
    console.groupEnd();
}

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    loginView.style.display = 'none';
    loginForm.style.display = 'none';
    modal.classList.add('hidden');
});

viewReqBtn.addEventListener('click', () => {
    eventViews.classList.add('hidden');
    adminPanelView.style.display = 'none';
    loginView.dataset.target = 'requests';
    requestsView.classList.add('hidden');
    loginView.style.display = 'flex';
    loginForm.style.display = 'flex';
});

backBtn.addEventListener('click', () => {
    requestsView.classList.add('hidden');
    eventViews.classList.remove('hidden');
});

adminPanelBtn.addEventListener('click', () => {
    loginView.style.display = 'flex';
    loginForm.style.display = 'flex';
    loginView.dataset.target = 'panel';
    adminPanelView.style.display = 'none';
    eventViews.classList.add('hidden');
    requestsView.classList.add('hidden');
});

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        loginError.textContent = '';
        loginView.style.display = 'none';
        if (loginView.dataset.target === 'panel') {
            showAdminPanel();
        } else if (loginView.dataset.target === 'requests') {
            requestsView.classList.remove('hidden');
            await loadRequests();
        }
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
        eventsGrid.innerHTML = '';

        if (list.length === 0) {
            eventsGrid.innerHTML = `<p>No events found</p>`;
            return;
        }

        list.forEach(evt => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.dataset.eventId = evt.eventId;
            card.innerHTML = `
                <h2>${evt.title}</h2>
                <p><strong>Start:</strong> ${new Date(evt.startTime).toLocaleString()}</p>
                <p><strong>End:</strong> ${new Date(evt.endTime).toLocaleString()}</p>
                <p><strong>Venue:</strong> ${evt.venue ?? '-'}</p>
                <button class="btn request-btn">Оставить заявку</button>
            `;
            eventsGrid.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading events:', err);
        eventsGrid.innerHTML = `<p>Error loading events</p>`;
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

            // Создаём ячейки для всех полей через DOM API
            // 1) ID
            const tdId = document.createElement('td');
            tdId.textContent = req.requestId;
            tr.appendChild(tdId);

            // 2) Event ID
            const tdEvent = document.createElement('td');
            tdEvent.textContent = req.eventId;
            tr.appendChild(tdEvent);

            // 3) Name
            const tdName = document.createElement('td');
            tdName.textContent = req.requesterName;
            tr.appendChild(tdName);

            // 4) Email
            const tdEmail = document.createElement('td');
            tdEmail.textContent = req.requesterEmail;
            tr.appendChild(tdEmail);

            // 5) Quantity
            const tdQty = document.createElement('td');
            tdQty.textContent = req.quantity;
            tr.appendChild(tdQty);

            // 6) Status — здесь кнопка с нужным классом
            const tdStatus = document.createElement('td');
            const button   = document.createElement('button');
            button.textContent = req.status;

            if (req.status === 'PENDING') {
                button.classList.add('status-pending');
                button.disabled = false;
                button.addEventListener('click', async () => {
                    const confirmed = confirm(`Вы уверены, что хотите обработать заявку #${req.requestId}?`);
                    if (!confirmed) return;

                    try {
                        const updateUrl = `${BASE}/events/requests/${req.requestId}/update-status?status=PROCESSED`;
                        const response  = await fetch(updateUrl, { method: 'PUT' });
                        if (!response.ok) throw new Error('Ошибка при обновлении статуса');

                        alert('Статус обновлён');
                        await loadRequests(page, size);
                    } catch (err) {
                        alert(`Ошибка: ${err.message}`);
                    }
                });
            } else {
                button.classList.add('status-processed');
                button.disabled = true;
            }

            tdStatus.appendChild(button);
            tr.appendChild(tdStatus);

            // Добавляем готовую строку в таблицу
            requestsTbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error loading requests:', err);
        requestsTbody.innerHTML = `<tr><td colspan="6">Error loading requests</td></tr>`;
    }
}

let selectedEventId = null;

eventsGrid.addEventListener('click', e => {
    const btn = e.target.closest('.request-btn');
    if (!btn) {
        console.log('Request button not clicked');
        return;
    }

    const card = btn.closest('.event-card');
    if (!card) {
        console.log('Event card not found');
        return;
    }

    selectedEventId = card.dataset.eventId;
    console.log('Selected Event ID:', selectedEventId);
    modal.style.display = 'flex';
    console.log('Modal should be visible now');
});

closeFormBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    requestForm.reset();
    formError.textContent = '';
    formSuccess.textContent = '';
});

requestForm.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
        requesterName: requestForm.requesterName.value.trim(),
        requesterEmail: requestForm.requesterEmail.value.trim(),
        requesterPhone: requestForm.requesterPhone.value.trim(),
        quantity: parseInt(requestForm.quantity.value, 10),
        message: requestForm.message.value.trim()
    };

    try {
        const res = await fetch(`${BASE}/events/${selectedEventId}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Ошибка при отправке заявки');

        formSuccess.textContent = 'Заявка успешно отправлена!';
        formError.textContent = '';
        requestForm.reset();
    } catch (err) {
        formError.textContent = err.message;
        formSuccess.textContent = '';
    }
});

const homeBtn = document.getElementById('home-btn');

homeBtn.addEventListener('click', () => {
    loginView.classList.add('hidden');
    requestsView.classList.add('hidden');
    adminPanelView.classList.add('hidden');
    modal.classList.add('hidden');
    eventViews.classList.remove('hidden');
    loginView.style.display = 'none';
    adminPanelView.style.display = 'none';
});

function showAdminPanel() {
    adminPanelView.style.display = 'flex';
    loadAdminEvents().then(r => console.log());
}

backFromPanel.addEventListener('click', () => {
    adminPanelView.style.display = 'none';
    eventViews.classList.remove('hidden');
})

async function loadAdminEvents() {
    const res  = await fetch(`${BASE}/events`);
    const data = await res.json();
    const tbody = document.querySelector('#admin-events-table tbody');
    tbody.innerHTML = '';
    data.content.forEach(evt => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${evt.eventId}</td>
            <td>${evt.title}</td>
            <td>${new Date(evt.startTime).toLocaleString()}</td>
            <td>${new Date(evt.endTime).toLocaleString()}</td>
            <td>
              <button class="btn edit-btn" data-id="${evt.eventId}">Edit</button>
              <button class="btn delete-btn" data-id="${evt.eventId}">Delete</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

document.querySelector('#admin-events-table')
    .addEventListener('click', async e => {
        if (e.target.matches('.edit-btn')) {
            const id = e.target.dataset.id;
            const res = await fetch(`${BASE}/events/${id}`);
            const evt = await res.json();
            // заполняем форму
            eventId.value          = evt.eventId;
            eventTitle.value       = evt.title;
            eventDescription.value = evt.description;
            eventStart.value       = evt.startTime.slice(0,16);
            eventEnd.value         = evt.endTime.slice(0,16);
            eventVenue.value       = evt.venue;
        }
        if (e.target.matches('.delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm(`Удалить событие #${id}?`)) {
                await fetch(`${BASE}/events/${id}`, { method: 'DELETE' });
                await loadAdminEvents();
            }
        }
    });

// Submit формы — и для Create, и для Update
eventForm.addEventListener('submit', async e => {
    e.preventDefault();
    const payload = {
        title:       eventTitle.value,
        description: eventDescription.value,
        startTime:   eventStart.value,
        endTime:     eventEnd.value,
        venue:       eventVenue.value
    };
    const id = eventId.value;
    const url = id
        ? `${BASE}/events/${id}`
        : `${BASE}/events`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        alert('Ошибка сохранения');
        return;
    }
    // сброс формы и перезагрузка списка
    eventForm.reset();
    eventId.value = '';
    await loadAdminEvents();
});
