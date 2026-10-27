import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbfAJFizefkyNlFtdEr3Law2hGrN3GNlg",
  authDomain: "frisorando-dev-f40fd.firebaseapp.com",
  projectId: "frisorando-dev-f40fd",
  storageBucket: "frisorando-dev-f40fd.firebasestorage.app",
  messagingSenderId: "398947266719",
  appId: "1:398947266719:web:99108e06dc7669e97832aa",
  measurementId: "G-V0E0GSK7P4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.togglePasswordVisibility = function(fieldId, btn) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
    } else {
        input.type = "password";
        btn.textContent = "👁️";
    }
}

window.handleLogin = function() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const errDiv = document.getElementById('login-error');

    const validUser = (user === 'Ritter2407' || user === 'kevin.ritter1606@googlemail.com');
    const validPass = (pass === '24072011V.k');

    if (validUser && validPass) {
        sessionStorage.setItem('frisorando_admin_logged', 'true');
        sessionStorage.setItem('frisorando_admin_user', user);
        document.getElementById('login-overlay').style.display = 'none';
        if (typeof window.loadAdminDataFromFirebase === 'function') {
            window.loadAdminDataFromFirebase();
        }
    } else {
        errDiv.innerText = "Falscher Benutzername oder falsches Passwort!";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const loggedIn = sessionStorage.getItem('frisorando_admin_logged');
    if (loggedIn === 'true') {
        document.getElementById('login-overlay').style.display = 'none';
    }
    renderChart('1m');
    initAdvancedDragAndDrop();
    if (typeof window.loadAdminDataFromFirebase === 'function') {
        window.loadAdminDataFromFirebase();
    }
});

window.logoutAdmin = function() {
    sessionStorage.removeItem('frisorando_admin_logged');
    sessionStorage.removeItem('frisorando_admin_user');
    location.reload();
}

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
if(loginBtn) loginBtn.addEventListener('click', window.handleLogin);
if(logoutBtn) logoutBtn.addEventListener('click', window.logoutAdmin);

// Drag & Drop Steuerung
function initAdvancedDragAndDrop() {
    const container = document.getElementById('sortable-dashboard-container');
    if (!container) return;

    let cards = container.querySelectorAll('.draggable-card');

    cards.forEach(card => {
        const handle = card.querySelector('.drag-handle');
        if (!handle) return;

        let isDragging = false;
        let startY = 0;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            card.classList.add('dragging');
            startY = e.clientY;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;
            if (Math.abs(deltaY) > 30) {
                const siblings = Array.from(container.querySelectorAll('.draggable-card'));
                const currentIndex = siblings.indexOf(card);
                if (deltaY > 0 && currentIndex < siblings.length - 1) {
                    container.insertBefore(siblings[currentIndex + 1], card);
                    startY = e.clientY;
                } else if (deltaY < 0 && currentIndex > 0) {
                    container.insertBefore(card, siblings[currentIndex - 1]);
                    startY = e.clientY;
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                card.classList.remove('dragging');
            }
        });

        handle.addEventListener('touchstart', (e) => {
            isDragging = true;
            card.classList.add('dragging');
            startY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - startY;
            if (Math.abs(deltaY) > 25) {
                const siblings = Array.from(container.querySelectorAll('.draggable-card'));
                const currentIndex = siblings.indexOf(card);
                if (deltaY > 0 && currentIndex < siblings.length - 1) {
                    container.insertBefore(siblings[currentIndex + 1], card);
                    startY = e.touches[0].clientY;
                } else if (deltaY < 0 && currentIndex > 0) {
                    container.insertBefore(card, siblings[currentIndex - 1]);
                    startY = e.touches[0].clientY;
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                card.classList.remove('dragging');
            }
        });
    });
}

// Chart Logik
const chartDataSets = {
    '1m': [
        { label: 'W1', val: '€450', height: '40%' },
        { label: 'W2', val: '€680', height: '65%' },
        { label: 'W3', val: '€590', height: '55%' },
        { label: 'W4', val: '€890', height: '85%' }
    ],
    '6m': [
        { label: 'Mai', val: '€2.1k', height: '45%' },
        { label: 'Juni', val: '€2.8k', height: '60%' },
        { label: 'Juli', val: '€3.4k', height: '75%' },
        { label: 'Aug', val: '€3.1k', height: '70%' },
        { label: 'Sep', val: '€4.2k', height: '90%' },
        { label: 'Okt', val: '€4.8k', height: '100%' }
    ],
    '12m': [
        { label: 'Q1', val: '€6.5k', height: '40%' },
        { label: 'Q2', val: '€9.2k', height: '65%' },
        { label: 'Q3', val: '€11.4k', height: '80%' },
        { label: 'Q4', val: '€14.8k', height: '100%' }
    ]
};

window.renderChart = function(range) {
    const container = document.getElementById('chart-container-bars');
    if (!container) return;
    container.innerHTML = "";
    const data = chartDataSets[range] || chartDataSets['1m'];

    data.forEach(item => {
        const col = document.createElement('div');
        col.className = 'bar-col';
        col.innerHTML = `
            <div class="bar-val">${item.val}</div>
            <div class="bar" style="height: ${item.height};" title="${item.label}: ${item.val}"></div>
            <div class="bar-label">${item.label}</div>
        `;
        container.appendChild(col);
    });
}

window.switchChartRange = function(range, btnElement) {
    document.querySelectorAll('.chart-tab-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    renderChart(range);
}

// Firebase Daten laden
window.loadAdminDataFromFirebase = async function() {
    const fullTable = document.getElementById('full-partners-table');
    const inboxList = document.getElementById('inbox-messages-container');
    const allUsersTable = document.getElementById('all-users-table');
    
    const kpiActive = document.getElementById('kpi-active');
    const kpiPending = document.getElementById('kpi-pending');
    const kpiMessages = document.getElementById('kpi-messages');
    const kpiRevenue = document.getElementById('kpi-revenue');

    try {
        if(allUsersTable) allUsersTable.innerHTML = "";
        let totalUsersCount = 0;
        const currentLoggedUser = sessionStorage.getItem('frisorando_admin_user') || 'Ritter2407';
        const currentEmail = currentLoggedUser.includes('@') ? currentLoggedUser : 'kevin.ritter1606@googlemail.com';

        totalUsersCount++;
        const myAccountRow = document.createElement('tr');
        myAccountRow.innerHTML = `
            <td><strong>${currentLoggedUser}</strong><br><span style="font-size: 9px; color: var(--text-muted);">Admin</span></td>
            <td>${currentEmail}</td>
            <td><span class="badge badge-role">Super-Admin (Du)</span></td>
            <td><span class="badge badge-active">Aktiv</span></td>
            <td>
                <button class="btn-edit" onclick="window.openEditModal('my_account', 'self', '${currentLoggedUser}', '${currentEmail}', 'active')">Bearbeiten</button>
                <button class="btn-disabled" title="Geschützt">Geschützt</button>
            </td>
        `;
        allUsersTable.appendChild(myAccountRow);

        const querySnapshot = await getDocs(collection(db, "partners"));
        if(fullTable) fullTable.innerHTML = "";
        let activeCount = 0;
        let pendingCount = 0;

        querySnapshot.forEach((documentSnap) => {
            const p = documentSnap.data();
            const docId = documentSnap.id;
            const isPending = p.status === 'pending';

            if (isPending) pendingCount++;
            else activeCount++;

            if (fullTable) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${p.name || p.salonName || ''}</strong><br><span style="font-size: 9px; color: var(--text-muted);">${p.firstname || ''} ${p.lastname || ''}</span></td>
                    <td>${p.location || 'k.A.'}<br><span style="font-size: 9px; color: var(--text-muted);">${p.type || 'salon'}</span></td>
                    <td><strong>${p.masterNumber || 'k.A.'}</strong></td>
                    <td><span class="badge ${isPending ? 'badge-pending' : 'badge-active'}">${isPending ? '⏳ Wartet' : 'Aktiv'}</span></td>
                    <td>${isPending ? `<button class="btn-action" onclick="window.approvePartner('${docId}')">Freigeben</button>` : '<span style="font-size: 10px; color: var(--success);">Aktiv</span>'}</td>
                `;
                fullTable.appendChild(row);
            }

            totalUsersCount++;
            if (allUsersTable) {
                const uRow = document.createElement('tr');
                const safeName = p.name || p.salonName || p.firstname || 'Partner';
                const safeEmail = p.email || '';
                const safeStatus = p.status || 'active';
                
                uRow.innerHTML = `
                    <td><strong>${safeName}</strong><br><span style="font-size: 9px; color: var(--text-muted);">${p.firstname || ''} ${p.lastname || ''}</span></td>
                    <td>${safeEmail || 'Keine E-Mail'}</td>
                    <td><span class="badge badge-role">Partner</span></td>
                    <td><span class="badge badge-active">${safeStatus}</span></td>
                    <td>
                        ${safeEmail ? `<a href="mailto:${safeEmail}" class="btn-mail">E-Mail</a>` : ''}
                        <button class="btn-edit" onclick="window.openEditModal('partners', '${docId}', '${safeName}', '${safeEmail}', '${safeStatus}')">Bearbeiten</button>
                        <button class="btn-danger" onclick="window.deleteUserFromSystem('partners', '${docId}')">Löschen</button>
                    </td>
                `;
                allUsersTable.appendChild(uRow);
            }
        });

        if(fullTable && fullTable.innerHTML === "") fullTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Keine Partner.</td></tr>`;

        if(kpiActive) kpiActive.innerText = activeCount;
        if(kpiPending) kpiPending.innerText = pendingCount;
        if(kpiRevenue) kpiRevenue.innerText = '€ ' + (activeCount * 450 + 4820);

        try {
            const adminSnap = await getDocs(collection(db, "admin_users"));
            adminSnap.forEach((aDoc) => {
                const a = aDoc.data();
                const aId = aDoc.id;
                totalUsersCount++;
                if(allUsersTable) {
                    const uRow = document.createElement('tr');
                    const aName = `${a.firstname || ''} ${a.lastname || ''}`.trim() || 'Admin';
                    const aEmail = a.email || '';
                    uRow.innerHTML = `
                        <td><strong>${aName}</strong></td>
                        <td>${aEmail || 'Keine E-Mail'}</td>
                        <td><span class="badge badge-role">Admin</span></td>
                        <td><span class="badge badge-active">Aktiv</span></td>
                        <td>
                            ${aEmail ? `<a href="mailto:${aEmail}" class="btn-mail">E-Mail</a>` : ''}
                            <button class="btn-edit" onclick="window.openEditModal('admin_users', '${aId}', '${aName}', '${aEmail}', 'active')">Bearbeiten</button>
                            <button class="btn-danger" onclick="window.deleteUserFromSystem('admin_users', '${aId}')">Löschen</button>
                        </td>
                    `;
                    allUsersTable.appendChild(uRow);
                }
            });
        } catch(e) {}

        try {
            const custSnap = await getDocs(collection(db, "customers"));
            custSnap.forEach((cDoc) => {
                const c = cDoc.data();
                const cId = cDoc.id;
                totalUsersCount++;
                if(allUsersTable) {
                    const uRow = document.createElement('tr');
                    const cName = `${c.firstname || ''} ${c.lastname || ''}`.trim() || 'Kunde';
                    const cEmail = c.email || '';
                    uRow.innerHTML = `
                        <td><strong>${cName}</strong></td>
                        <td>${cEmail || 'Keine E-Mail'}</td>
                        <td><span class="badge badge-role">Kunde</span></td>
                        <td><span class="badge badge-active">Aktiv</span></td>
                        <td>
                            ${cEmail ? `<a href="mailto:${cEmail}" class="btn-mail">E-Mail</a>` : ''}
                            <button class="btn-edit" onclick="window.openEditModal('customers', '${cId}', '${cName}', '${cEmail}', 'active')">Bearbeiten</button>
                            <button class="btn-danger" onclick="window.deleteUserFromSystem('customers', '${cId}')">Löschen</button>
                        </td>
                    `;
                    allUsersTable.appendChild(uRow);
                }
            });
        } catch(e) {}

        const msgSnapshot = await getDocs(collection(db, "support_messages"));
        if(inboxList) inboxList.innerHTML = "";
        let msgCount = 0;

        if (!msgSnapshot.empty) {
            msgSnapshot.forEach((msgDoc) => {
                const m = msgDoc.data();
                msgCount++;
                if(inboxList) {
                    const msgBox = document.createElement('div');
                    msgBox.style.cssText = "background: #f8fafc; border: 1px solid var(--border-color); border-radius: 5px; padding: 8px 10px; margin-bottom: 6px; font-size: 11px; display: flex; align-items: flex-start; gap: 8px;";
                    msgBox.innerHTML = `
                        <div style="font-size: 15px;">📩</div>
                        <div style="flex: 1;">
                            <strong>Salon: ${m.salonName || 'Unbekannt'}</strong>
                            <p style="margin: 2px 0 0 0;">${m.messageText || ''}</p>
                        </div>
                    `;
                    inboxList.appendChild(msgBox);
                }
            });
        } else {
            if(inboxList) inboxList.innerHTML = `<p style="color: var(--text-muted); font-size: 11px;">Keine Nachrichten im Postkasten.</p>`;
        }
        if(kpiMessages) kpiMessages.innerText = msgCount;

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

window.approvePartner = async function(id) {
    try {
        await updateDoc(doc(db, "partners", id), { status: 'active' });
        alert('Partner erfolgreich freigeschaltet!');
        window.loadAdminDataFromFirebase();
    } catch (error) {
        alert('Fehler beim Freigeben.');
    }
}

window.deleteUserFromSystem = async function(collectionName, docId) {
    if (confirm("Möchtest du diesen Benutzer wirklich unwiderruflich aus dem System löschen?")) {
        try {
            await deleteDoc(doc(db, collectionName, docId));
            alert('Benutzer erfolgreich gelöscht!');
            window.loadAdminDataFromFirebase();
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            alert('Fehler beim Löschen: ' + error.message);
        }
    }
}

window.openEditModal = function(colName, docId, name, email, status) {
    document.getElementById('edit-col-name').value = colName;
    document.getElementById('edit-doc-id').value = docId;
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-status').value = status;
    
    const statusGroup = document.getElementById('edit-status-group');
    if (colName === 'my_account') {
        statusGroup.style.display = 'none';
        document.getElementById('edit-label-name').innerText = "Benutzername";
    } else {
        statusGroup.style.display = 'block';
        document.getElementById('edit-label-name').innerText = "Vorname / Name / Salon";
    }

    document.getElementById('edit-modal').style.display = 'flex';
}

window.saveEditedUser = async function(e) {
    e.preventDefault();
    const colName = document.getElementById('edit-col-name').value;
    const docId = document.getElementById('edit-doc-id').value;
    const newName = document.getElementById('edit-name').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();
    const newStatus = document.getElementById('edit-status').value;

    try {
        if (colName === 'my_account') {
            sessionStorage.setItem('frisorando_admin_user', newName);
            alert('Dein Admin-Account wurde erfolgreich aktualisiert!');
        } else {
            const docRef = doc(db, colName, docId);
            let updateData = { email: newEmail, status: newStatus };
            if (colName === 'partners') {
                updateData.name = newName;
                updateData.salonName = newName;
            } else {
                updateData.firstname = newName;
            }
            await updateDoc(docRef, updateData);
            alert('Benutzerdaten erfolgreich aktualisiert!');
        }

        document.getElementById('edit-modal').style.display = 'none';
        window.loadAdminDataFromFirebase();
    } catch (error) {
        console.error("Fehler beim Aktualisieren:", error);
        alert('Fehler beim Speichern: ' + error.message);
    }
}

window.filterUserTable = function() {
    const input = document.getElementById('user-search-input');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('all-users-table');
    const trs = table.getElementsByTagName('tr');

    for (let i = 0; i < trs.length; i++) {
        const tds = trs[i].getElementsByTagName('td');
        if (tds.length > 0) {
            const nameText = tds[0].textContent || tds[0].innerText;
            const emailText = tds[1].textContent || tds[1].innerText;
            if (nameText.toLowerCase().indexOf(filter) > -1 || emailText.toLowerCase().indexOf(filter) > -1) {
                trs[i].style.display = "";
            } else {
                trs[i].style.display = "none";
            }
        }
    }
}

const userForm = document.getElementById('universal-user-form');
if(userForm) {
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const roleType = document.getElementById('user-role-type').value;
        const firstname = document.getElementById('user-firstname').value.trim();
        const lastname = document.getElementById('user-lastname').value.trim();
        const email = document.getElementById('user-email').value.trim() || 'Keine E-Mail';
        const password = document.getElementById('user-password').value;

        function isPasswordSecure(password) {
            return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
        }

        if (!isPasswordSecure(password)) {
            alert('Das Passwort entspricht nicht den Sicherheitsrichtlinien!\n\nMindestvoraussetzungen:\n- Mindestens 8 Zeichen\n- Mindestens 1 Groß- und 1 Kleinbuchstabe\n- Mindestens 1 Zahl\n- Mindestens 1 Sonderzeichen');
            return;
        }

        try {
            if (roleType === 'admin') {
                await addDoc(collection(db, "admin_users"), { firstname, lastname, email, role: 'Super-Admin', createdAt: new Date().toISOString() });
            } else if (roleType === 'partner') {
                const salonName = document.getElementById('user-salonname').value.trim() || 'Salon ohne Namen';
                const location = document.getElementById('user-location').value.trim() || 'Rheinfelden';
                const type = document.getElementById('user-service-type').value;
                await addDoc(collection(db, "partners"), { name: salonName, salonName, firstname, lastname, email, location, type, status: 'active', createdAt: new Date().toISOString() });
            } else if (roleType === 'customer') {
                await addDoc(collection(db, "customers"), { firstname, lastname, email, createdAt: new Date().toISOString() });
            }

            alert('Benutzer erfolgreich in Firestore gespeichert!');
            userForm.reset();
            window.toggleUserFields();
            window.loadAdminDataFromFirebase();
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            alert('Fehler beim Speichern in Firestore: ' + error.message);
        }
    });
}

window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    sidebar.classList.toggle('mobile-open');
    backdrop.classList.toggle('active');
}

window.toggleUserFields = function() {
    const role = document.getElementById('user-role-type').value;
    const partnerFields = document.getElementById('partner-extra-fields');
    const salonGroup = document.getElementById('group-salonname');

    if (role === 'partner') {
        partnerFields.style.display = 'block';
        salonGroup.style.display = 'block';
    } else {
        partnerFields.style.display = 'none';
        salonGroup.style.display = 'none';
    }
}

window.switchTab = function(tabId, element) {
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.toggle('active', sec.id === 'section-' + tabId));
    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const titles = {
        'dashboard': 'Dashboard & Live-Kennzahlen',
        'partners': 'Partner & Verifizierung',
        'inbox': 'Postkasten & Support-Anfragen',
        'users': 'Universelle Benutzerverwaltung',
        'settings': 'Plattform-Einstellungen'
    };
    document.getElementById('page-title').innerText = titles[tabId];

    if (window.innerWidth < 768) window.toggleSidebar();
}

window.switchSettingsTab = function(tabName, btnElement) {
    document.querySelectorAll('.settings-tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.subnav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('stab-' + tabName).classList.add('active');
    btnElement.classList.add('active');
}

