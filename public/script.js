let currentEditId = null;
let currentRoomEditId = null;
let currentFinanceId = null;
let studentsCache = [];
let roomsCache = [];
let roomsChartInstance = null;
let debtsChartInstance = null;

// Ініціалізація пільг
async function fetchBenefits() {
    try {
        const res = await fetch('/benefits');
        if (!res.ok) throw new Error('Помилка завантаження пільг');
        const data = await res.json();
        const select = document.getElementById('benefitId');
        select.innerHTML = '<option value="">Оберіть пільгу...</option>' + 
            data.map(b => `<option value="${b.benefit_id}">${b.category_name}</option>`).join('');
    } catch (err) {
        console.error('fetchBenefits error:', err);
        document.getElementById('benefitId').innerHTML = '<option value="">Помилка завантаження</option>';
    }
}

// Ініціалізація вибору кімнат
async function fetchAvailableRooms(gender) {
    const select = document.getElementById('roomId');
    select.innerHTML = '<option value="">Завантаження...</option>';
    const res = await fetch('/rooms/available/' + encodeURIComponent(gender));
    const data = await res.json();
    
    if (data.length === 0) {
        select.innerHTML = '<option value="">Немає вільних кімнат</option>';
        return;
    }
    select.innerHTML = '<option value="">Оберіть кімнату...</option>' + 
        data.map(r => `<option value="${r.room_number}">Кімн. ${r.room_number} (Кв. ${r.apartment_number || '-'}) - Вільних місць: ${r.capacity - r.current_occupancy}</option>`).join('');
}

document.getElementById('gender').addEventListener('change', (e) => {
    fetchAvailableRooms(e.target.value);
});

// Викликаємо при старті
fetchBenefits();
fetchAvailableRooms(document.getElementById('gender').value);
updateDashboard(); // Ініціалізація дашборду

function openTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    
    if(tabId === 'students') fetchStudents();
    if(tabId === 'rooms') fetchRooms();
    if(tabId === 'debtors') fetchDebtors();
    if(tabId === 'archived') fetchArchivedStudents();
    if(tabId === 'analytics') renderCharts();
    if(tabId === 'settings') fetchSettingsRooms();
}

async function fetchArchivedStudents() {
    const res = await fetch('/students/archived');
    const data = await res.json();
    const tbody = document.getElementById('archived-table-body');
    tbody.innerHTML = '';
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Архів порожній.</td></tr>';
        return;
    }
    data.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.student_id}</td>
                <td><b>${s.last_name}</b></td>
                <td>${s.first_name}</td>
                <td>${s.phone || '—'}</td>
                <td>${s.email || '—'}</td>
                <td>${s.gender || '—'}</td>
                <td>${s.previous_room_number || '—'}</td>
                <td>
                    <button onclick="openRestoreModal(${s.student_id}, '${s.first_name} ${s.last_name}')" class="btn-edit" style="background-color: #f39c12; color: white; margin-right: 5px; border:none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">🔄 Поновити</button>
                    <button class="btn btn-delete" style="padding: 5px 10px;" onclick="forceDeleteStudent(${s.student_id})">Видалити назавжди</button>
                </td>
            </tr>
        `;
    });
}

async function forceDeleteStudent(id) {
    if(!confirm('Ви впевнені? Це видалить студента назавжди.')) return;
    const res = await fetch('/students/force/' + id, { method: 'DELETE' });
    if (res.ok) {
        alert('Студента видалено.');
        fetchArchivedStudents();
    } else {
        alert('Помилка видалення.');
    }
}

async function fetchSettingsRooms() {
    const res = await fetch('/rooms');
    const data = await res.json();
    roomsCache = data;
    const tbody = document.getElementById('settings-rooms-table-body');
    tbody.innerHTML = '';
    data.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.room_id}</td>
                <td><b>${r.room_number}</b></td>
                <td>${r.capacity}</td>
                <td>${r.current_occupancy}</td>
                <td>${r.apartment_number || '—'}</td>
                <td>${r.wing_type || 'Не вказано'}</td>
                <td>
                    <button class="btn btn-add" style="background-color: #f39c12; margin-bottom: 0; padding: 5px 10px;" onclick="editRoom(${r.room_id})">Ред.</button>
                </td>
            </tr>
        `;
    });
}

function editRoom(id) {
    prepareEditRoomById(id);
}

function openRoomModal() {
    document.getElementById('roomModal').style.display = 'flex';
}

function closeRoomModal() {
    document.getElementById('roomModal').style.display = 'none';
    document.getElementById('roomForm').reset();
    currentRoomEditId = null;
    document.getElementById('roomModalTitle').innerText = 'Додавання кімнати';
}

function prepareEditRoomById(id) {
    const room = roomsCache.find(r => r.room_id === id);
    if (!room) return;
    currentRoomEditId = id;
    document.getElementById('roomNum').value = room.room_number;
    document.getElementById('roomFloor').value = room.floor;
    document.getElementById('roomCapacity').value = room.capacity;
    document.getElementById('roomApt').value = room.apartment_number || '';
    document.getElementById('roomWing').value = room.wing_type || 'Не вказано';
    document.getElementById('roomModalTitle').innerText = 'Редагування кімнати';
    openRoomModal();
}

async function submitRoom(event) {
    event.preventDefault();
    const roomData = {
        room_number: document.getElementById('roomNum').value,
        floor: document.getElementById('roomFloor').value,
        capacity: document.getElementById('roomCapacity').value,
        apartment_number: document.getElementById('roomApt').value,
        wing_type: document.getElementById('roomWing').value
    };

    const isEdit = !!currentRoomEditId;
    const url = isEdit ? '/rooms/' + currentRoomEditId : '/rooms';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
    });

    const result = await res.json();
    if (res.ok) {
        alert(result.message);
        closeRoomModal();
        fetchSettingsRooms();
    } else {
        alert('Помилка: ' + result.error + '\n' + (result.details || ''));
    }
}

async function fetchStudents() {
    const res = await fetch('/students');
    const data = await res.json();
    studentsCache = data;
    renderStudents(data);
}

function renderStudents(data) {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';
    data.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.student_id}</td>
                <td><b>${s.last_name}</b></td>
                <td>${s.first_name}</td>
                <td>${s.gender || 'Не вказано'}</td>
                <td>${s.phone || ''}</td>
                <td>${s.email || '—'}</td>
                <td>${s.benefit_id || '—'}</td>
                <td>${s.room_number || '—'}</td>
                <td>
                    <button onclick="openNewDebtModal(${s.student_id}, '${s.first_name} ${s.last_name}')" style="background-color: #9b59b6; color: white; margin-right: 5px; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">💳 Борг</button>
                    <button class="btn btn-add" style="background-color: #f39c12; margin-bottom: 0; padding: 5px 10px;" onclick="prepareEditById(${s.student_id})">Ред.</button>
                    <button class="btn btn-delete" style="padding: 5px 10px;" onclick="deleteStudent(${s.student_id})">Виселити</button>
                </td>
            </tr>
        `;
    });
}

function settleInRoom(roomNumber) {
    openModal();
    document.getElementById('roomId').value = roomNumber;
}

function filterStudents() {
    const query = document.getElementById('searchStudent').value.toLowerCase();
    const filtered = studentsCache.filter(s => 
        (s.last_name || '').toLowerCase().includes(query) ||
        (s.first_name || '').toLowerCase().includes(query) ||
        (s.phone || '').toLowerCase().includes(query) ||
        (s.email || '').toLowerCase().includes(query) ||
        (String(s.room_number) || '').toLowerCase().includes(query)
    );
    renderStudents(filtered);
}

async function fetchRooms() {
    const res = await fetch('/rooms');
    const data = await res.json();
    const tbody = document.getElementById('rooms-table-body');
    tbody.innerHTML = '';
    data.forEach(r => {
        let trafficLightClass = 'occupancy-partial'; // за замовчуванням жовтий
        if (r.current_occupancy === 0) trafficLightClass = 'occupancy-empty'; // зелений
        if (r.current_occupancy >= r.capacity) trafficLightClass = 'occupancy-full'; // червоний

        const residentsBtn = r.current_occupancy > 0
            ? `<button type="button" class="btn" style="background-color:#3498db; color:white; font-weight:bold; text-transform:uppercase;" onclick="showRoomResidents(${r.room_id}, '${String(r.room_number).replace(/'/g, "\\'")}')">👁️ ХТО ЖИВЕ</button>`
            : '';
        const settleBtn = `<button type="button" class="btn" style="background-color:#2ecc71; color:white; font-weight:bold; text-transform:uppercase;" onclick="settleInRoom('${r.room_number}')">➕ ЗАСЕЛИТИ</button>`;
        
        tbody.innerHTML += `
            <tr>
                <td>${r.floor}</td>
                <td>${r.wing_type || 'Не вказано'}</td>
                <td>${r.apartment_number || '—'}</td>
                <td><b>${r.room_number}</b></td>
                <td>${r.capacity}</td>
                <td>${r.capacity - r.current_occupancy}</td>
                <td class="${trafficLightClass}">${r.current_occupancy}</td>
                <td class="action-col">${residentsBtn} ${settleBtn}</td>
            </tr>
        `;
    });
}

async function fetchDebtors() {
    const res = await fetch('/debtors');
    const data = await res.json();
    const tbody = document.getElementById('debtors-table-body');
    tbody.innerHTML = '';
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:green;">Боржників немає!</td></tr>';
        return;
    }
    data.forEach(d => {
        const editDebtBtn = d.finance_id
            ? `<button class="btn btn-add" style="background-color: #f39c12; margin-bottom: 0; padding: 5px 10px;" onclick="openEditDebtModal(${d.finance_id}, ${d.amount}, '${String(d.charge_type).replace(/'/g, "\\'")}')">Ред. Борг</button>`
            : '';
        tbody.innerHTML += `
            <tr>
                <td>${d.student_id}</td>
                <td><b>${d.last_name}</b></td>
                <td>${d.first_name}</td>
                <td>${d.room_number}</td>
                <td>${d.apartment_number || '—'}</td>
                <td><a href="tel:${d.phone}" style="color: #3498db; text-decoration: none;">${d.phone}</a></td>
                <td>${d.charge_type}</td>
                <td style="color: red; font-weight: bold;">${d.amount}</td>
                <td>${d.is_paid ? '✅ Оплачено' : '❌ Не оплачено'}</td>
                <td>
                    ${editDebtBtn}
                    <button class="btn" style="background-color: #3498db; padding: 5px 10px;" onclick="goToStudent(${d.student_id})">🔍 Знайти</button>
                </td>
            </tr>
        `;
    });
}

async function deleteStudent(id) {
    if(!confirm('Ви впевнені, що хочете виселити цього студента?')) return;
    await fetch('/students/' + id, { method: 'DELETE' });
    fetchStudents(); 
}

function goToStudent(id) {
    closeResidentsModal();
    closeEditDebtModal();
    const studentBtn = document.querySelectorAll('.tab-btn')[0]; 
    openTab('students', studentBtn);

    // Невелика затримка, щоб таблиця встигла завантажитись
    setTimeout(() => {
        const rows = document.querySelectorAll('#students-table-body tr');
        rows.forEach(row => {
            if (String(row.cells[0].innerText) === String(id)) {
                row.classList.add('highlighted-row'); // Підсвічуємо жовтим
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                row.classList.remove('highlighted-row');
            }
        });
    }, 300);
}

async function prepareEditById(id) {
    let student = studentsCache.find(s => s.student_id === id);
    if (!student) {
        const res = await fetch('/students');
        studentsCache = await res.json();
        student = studentsCache.find(s => s.student_id === id);
    }
    if (!student) {
        alert('Не вдалося знайти дані студента. Оновіть список.');
        return;
    }
    currentEditId = student.student_id;
    document.getElementById('lastName').value = student.last_name;
    document.getElementById('firstName').value = student.first_name;
    const genderSelect = document.getElementById('gender');
    if (student.gender === 'Жіноча' || student.gender === 'Чоловіча') {
        genderSelect.value = student.gender;
    } else {
        genderSelect.value = 'Чоловіча';
    }
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('benefitId').value = student.benefit_id;
    
    // Лікуємо баг зникаючої кімнати при редагуванні
    if (student.room_id && student.room_number) {
        const roomSelect = document.getElementById('roomId');
        const optionExists = Array.from(roomSelect.options).some(opt => String(opt.value) === String(student.room_number));
        
        // Якщо кімната не в списку вільних (заповнена), додаємо вручну
        if (!optionExists) {
            const newOption = document.createElement('option');
            newOption.value = student.room_number; // Використовуємо room_number
            newOption.text = `${student.room_number} (Поточна)`;
            roomSelect.appendChild(newOption);
        }
        
        roomSelect.value = student.room_number; // Використовуємо room_number
    }
    
    document.querySelector('#addModal h3').innerText = 'Редагування студента';
    openModal();
}

async function showRoomResidents(roomId, roomNumber) {
    document.querySelector('#residentsModal h3').innerText = `Мешканці кімнати ${roomNumber}`;
    const list = document.getElementById('residents-list');
    list.innerHTML = '<li>Завантаження...</li>';
    document.getElementById('residentsModal').style.display = 'flex';
    const res = await fetch('/rooms/' + roomId + '/students');
    const data = await res.json();
    if (!res.ok) {
        list.innerHTML = '<li style="color:red;">Помилка завантаження</li>';
        return;
    }
    if (data.length === 0) {
        list.innerHTML = '<li>У кімнаті нікого немає</li>';
        return;
    }
    list.innerHTML = data.map(s =>
        `<li>
            <span><b>${s.last_name}</b> ${s.first_name} — ${s.phone || 'без телефону'}</span>
            <button type="button" class="btn" style="background-color:#3498db;padding:4px 10px;font-size:12px;" onclick="goToStudent(${s.student_id})">🔍 Профіль</button>
        </li>`
    ).join('');
}

function closeResidentsModal() {
    document.getElementById('residentsModal').style.display = 'none';
}

function openEditDebtModal(financeId, amount, chargeType) {
    currentFinanceId = financeId;
    document.getElementById('debtAmount').value = amount;
    document.getElementById('debtIsPaid').value = '0';
    document.getElementById('debtChargeType').innerText = 'Тип: ' + chargeType;
    document.getElementById('editDebtModal').style.display = 'flex';
}

function closeEditDebtModal() {
    document.getElementById('editDebtModal').style.display = 'none';
    currentFinanceId = null;
    document.getElementById('editDebtForm').reset();
}

async function submitDebt(event) {
    event.preventDefault();
    const res = await fetch('/finances/' + currentFinanceId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: document.getElementById('debtAmount').value,
            is_paid: document.getElementById('debtIsPaid').value
        })
    });
    const result = await res.json();
    if (res.ok) {
        alert(result.message || 'Борг оновлено!');
        closeEditDebtModal();
        fetchDebtors();
    } else {
        alert('Помилка: ' + result.error + '\n' + (result.details || ''));
    }
}

async function updateDashboard() {
    const dashboard = document.getElementById('dashboard');
    try {
        const [studentsRes, roomsRes, debtorsRes] = await Promise.all([
            fetch('/students'),
            fetch('/rooms'),
            fetch('/debtors')
        ]);
        
        const students = await studentsRes.json();
        const rooms = await roomsRes.json();
        const debtors = await debtorsRes.json();
        
        const totalStudents = students.length;
        const totalFreePlaces = rooms.reduce((sum, r) => sum + (r.capacity - r.current_occupancy), 0);
        const totalDebtorsCount = debtors.length;
        const totalDebtAmount = debtors.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        
        dashboard.innerHTML = `
            <div class="dashboard-card"><strong>Активні студенти:</strong><br>${totalStudents}</div>
            <div class="dashboard-card"><strong>Вільні місця:</strong><br>${totalFreePlaces}</div>
            <div class="dashboard-card"><strong>Боржники:</strong><br>${totalDebtorsCount}</div>
            <div class="dashboard-card"><strong>Загальний борг:</strong><br>${totalDebtAmount.toFixed(2)} грн</div>
        `;
    } catch (err) {
        console.error('Помилка оновлення дашборду:', err);
    }
}
// --- ЛОГІКА ТЕМИ ---
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeToggle');
    body.classList.toggle('dark-theme');
    
    // Оновлюємо кольори графіків для заміни теми
    Chart.defaults.color = body.classList.contains('dark-theme') ? '#f4f4f4' : '#333';
    if (roomsChartInstance) roomsChartInstance.update();
    if (debtsChartInstance) debtsChartInstance.update();
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        btn.innerText = '☀️ Світла тема';
    } else {
        localStorage.setItem('theme', 'light');
        btn.innerText = '🌙 Темна тема';
    }
}

// При завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const btn = document.getElementById('themeToggle');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (btn) btn.innerText = '☀️ Світла тема';
    }
});

// --- ЛОГІКА МОДАЛЬНОГО ВІКНА ---
function openModal() {
    document.getElementById('addModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addForm').reset();
    currentEditId = null;
    document.querySelector('#addModal h3').innerText = 'Заселення нового студента';
}

async function submitStudent(event) {
    event.preventDefault(); // Зупиняє стандартне перезавантаження сторінки
    
    // Збираємо дані з форми
    const newStudent = {
        last_name: document.getElementById('lastName').value,
        first_name: document.getElementById('firstName').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        room_number: document.getElementById('roomId').value,
        benefit_id: document.getElementById('benefitId').value
    };

    const isEdit = !!currentEditId;
    let res;
    if (currentEditId) {
        // Якщо є ID — оновлюємо існуючого
        res = await fetch('/students/' + currentEditId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
    } else {
        // Якщо ID немає — створюємо нового
        res = await fetch('/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });
    }

    const result = await res.json();
    
    if(res.ok) {
        alert(isEdit ? 'Дані студента успішно оновлено!' : 'Студента успішно заселено!');
        closeModal();
        fetchStudents();
        updateDashboard(); // Оновлення дашборду
        if (document.getElementById('debtors').classList.contains('active')) fetchDebtors();
        if (document.getElementById('rooms').classList.contains('active')) fetchRooms();
    } else {
        alert('Помилка: ' + result.error + '\n' + (result.details || ''));
    }
}

fetchStudents();

function openNewDebtModal(id, name) {
    document.getElementById('newDebtStudentId').value = id;
    document.getElementById('newDebtStudentName').innerText = name;
    document.getElementById('newDebtChargeType').value = '';
    document.getElementById('newDebtAmount').value = '';
    document.getElementById('newDebtModal').style.display = 'flex';
}

function closeNewDebtModal() {
    document.getElementById('newDebtModal').style.display = 'none';
}

// Функція експорту таблиці в CSV
function exportTableToCSV(filename) {
    const tabContents = document.querySelectorAll('.tab-content');
    let activeTable = null;

    // Надійно шукаємо видиму таблицю
    tabContents.forEach(tab => {
        if (window.getComputedStyle(tab).display !== 'none') {
            const table = tab.querySelector('table');
            if (table) activeTable = table;
        }
    });

    if (!activeTable) {
        alert('Немає видимої таблиці для експорту!');
        return;
    }

    let csv = [];
    csv.push('\uFEFF'); // BOM маркер для ідеальної кирилиці в Excel
    
    const rows = activeTable.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll('td, th');
        
        // Відрізаємо останній стовпець "Дії" (length - 1)
        for (let j = 0; j < cols.length - 1; j++) {
            let data = cols[j].innerText.replace(/"/g, '""');
            // Фікс для телефонів: якщо починається з +, обгорни у формулу Excel
            if (data.startsWith('+')) {
                row.push('="' + data + '"');
            } else {
                row.push('"' + data + '"');
            }
        }
        csv.push(row.join(';'));
    }

    const csvFile = new Blob([csv.join('\n')], {type: 'text/csv;charset=utf-8;'});
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Функція рендеру графіків аналітики
async function renderCharts() {
    try {
        // Налаштування кольорів для темної теми
        Chart.defaults.color = document.body.classList.contains('dark-theme') ? '#f4f4f4' : '#333';
        
        // ===== ГРАФІК 1: Розподіл кімнат (вільні vs зайняті) =====
        const roomsRes = await fetch('/rooms');
        const rooms = await roomsRes.json();
        
        let totalCapacity = 0;
        let totalOccupancy = 0;
        
        rooms.forEach(r => {
            totalCapacity += r.capacity;
            totalOccupancy += r.current_occupancy;
        });
        
        const totalFree = totalCapacity - totalOccupancy;
        
        // Вирахуємо відсотки
        const freePercent = ((totalFree / totalCapacity) * 100).toFixed(1);
        const occPercent = ((totalOccupancy / totalCapacity) * 100).toFixed(1);
        
        // Знищуємо старий графік
        if (roomsChartInstance) {
            roomsChartInstance.destroy();
        }
        
        const roomsCtx = document.getElementById('roomsChart');
        if (roomsCtx) {
            roomsChartInstance = new Chart(roomsCtx, {
                type: 'doughnut',
                data: {
                    labels: [`Вільні місця (${freePercent}%)`, `Зайняті місця (${occPercent}%)`],
                    datasets: [{
                        data: [totalFree, totalOccupancy],
                        backgroundColor: ['#2ecc71', '#e74c3c'],
                        borderColor: ['#27ae60', '#c0392b'],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Розподіл місць у гуртожитку'
                        }
                    }
                }
            });
        }
        
        // ===== ГРАФІК 2: Боржники (стовпчаста діаграма) =====
        const debtorsRes = await fetch('/debtors');
        const debtors = await debtorsRes.json();
        
        // Знищуємо старий графік
        if (debtsChartInstance) {
            debtsChartInstance.destroy();
        }
        
        const debtsCtx = document.getElementById('debtsChart');
        if (debtsCtx) {
            if (debtors.length === 0) {
                debtsCtx.parentElement.innerHTML = '<p style="text-align: center; color: green; padding: 50px;">Боржників немає! 🎉</p>';
            } else {
                // Встановлюємо динамічну ширину контейнера
                document.getElementById('debtsChartContainer').style.width = Math.max(400, debtors.length * 50) + 'px';
                
                debtsChartInstance = new Chart(debtsCtx, {
                    type: 'bar',
                    data: {
                        labels: debtors.map(d => `${d.last_name} ${d.first_name}`),
                        datasets: [{
                            label: 'Сума боргу (грн)',
                            data: debtors.map(d => d.amount),
                            backgroundColor: '#e74c3c',
                            borderColor: '#c0392b',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'Боржники гуртожитку'
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                
                // Встановлюємо висоту canvas для кращої видимості
                debtsCtx.parentElement.style.height = '300px';
            }
        }
    } catch (err) {
        console.error('Помилка при рендері графіків:', err);
        alert('Помилка завантаження графіків');
    }
}

async function submitNewDebt() {
    const student_id = document.getElementById('newDebtStudentId').value;
    const charge_type = document.getElementById('newDebtChargeType').value;
    const amount = document.getElementById('newDebtAmount').value;

    if (!charge_type || !amount || amount <= 0) {
        alert('Будь ласка, заповніть усі поля коректно, сума має бути більшою за 0.');
        return;
    }

    try {
        const res = await fetch('/finances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, charge_type, amount: parseFloat(amount) })
        });
        const result = await res.json();
        if (res.ok) {
            alert('Борг успішно нараховано!');
            closeNewDebtModal();
            updateDashboard(); // Оновлення дашборду
            if (typeof fetchDebtors === 'function') fetchDebtors();
        } else {
            alert('Помилка: ' + result.error);
        }
    } catch (err) {
        console.error('Помилка при нарахуванні боргу:', err);
        alert('Не вдалося зв\'язатися із сервером.');
    }
}

async function openRestoreModal(id, name) {
    document.getElementById('restoreStudentId').value = id;
    document.getElementById('restoreStudentName').innerText = name;
    const select = document.getElementById('restoreRoomId');
    select.innerHTML = '<option value="">Завантаження кімнат...</option>';
    document.getElementById('restoreModal').style.display = 'flex';

    try {
        const res = await fetch('/rooms');
        if (!res.ok) throw new Error('Помилка сервера');
        const rooms = await res.json();
        const availableRooms = rooms.filter(r => (r.capacity - r.current_occupancy) > 0);

        select.innerHTML = '<option value="">Оберіть кімнату...</option>' + 
            availableRooms.map(r => `<option value="${r.room_id}">${r.room_number} (Вільних місць: ${r.capacity - r.current_occupancy})</option>`).join('');
    } catch (err) {
        console.error(err);
        select.innerHTML = '<option value="">Помилка завантаження</option>';
    }
}

function closeRestoreModal() {
    document.getElementById('restoreModal').style.display = 'none';
}

async function submitRestore() {
    const student_id = document.getElementById('restoreStudentId').value;
    const room_id = document.getElementById('restoreRoomId').value;
    if (!room_id) return alert('Оберіть кімнату!');
    
    try {
        const res = await fetch('/students/restore', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id, room_id })
        });
        
        if (res.ok) {
            alert('Студента успішно поновлено!');
            closeRestoreModal();
            updateDashboard(); // Оновлення дашборду
            if (typeof fetchArchivedStudents === 'function') fetchArchivedStudents();
            if (typeof fetchStudents === 'function') fetchStudents();
        } else {
            const data = await res.json(); 
            alert('Помилка: ' + data.error);
        }
    } catch (err) { 
        console.error(err);
        alert('Помилка з\'єднання.'); 
    }
}
