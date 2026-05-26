const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Перевір, чи твій пароль такий самий
    database: 'dormitory'
});

db.connect((err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
        return;
    }
    console.log('Успішно підключено до бази dormitory!');
});

const GENDER_WING_ERROR = 'Помилка: Неможливо поселити студента у крило протилежної статі!';

function normalizeWing(wingType) {
    if (!wingType || wingType.trim() === 'Не вказано') return 'unknown';
    const w = wingType.trim().toLowerCase();
    if (w.startsWith('чолов')) return 'male';
    if (w.startsWith('жін') || w.startsWith('жин')) return 'female';
    return 'unknown';
}

function normalizeGender(gender) {
    if (!gender || gender.trim() === 'Не вказано') return 'unknown';
    const g = gender.trim().toLowerCase();
    if (g.startsWith('чолов')) return 'male';
    if (g.startsWith('жін') || g.startsWith('жин')) return 'female';
    return 'unknown';
}

function isGenderWingConflict(wingType, gender) {
    const wing = normalizeWing(wingType);
    const gen = normalizeGender(gender);
    if (wing === 'unknown' || gen === 'unknown') return false;
    return (wing === 'male' && gen === 'female') || (wing === 'female' && gen === 'male');
}

function validateRoomGender(roomId, gender, callback) {
    db.query('SELECT wing_type FROM Rooms WHERE room_id = ?', [roomId], (err, results) => {
        if (err) return callback(err);
        if (!results.length) return callback(null, { notFound: true });
        if (isGenderWingConflict(results[0].wing_type, gender)) {
            return callback(null, { conflict: true });
        }
        callback(null, { ok: true });
    });
}

function resolveRoomId(roomNumber, callback) {
    const num = String(roomNumber || '').trim();
    if (!num) return callback(null, { notFound: true });
    db.query('SELECT room_id FROM Rooms WHERE room_number = ?', [num], (err, results) => {
        if (err) return callback(err);
        if (!results.length) return callback(null, { notFound: true });
        callback(null, { roomId: results[0].room_id });
    });
}

// Синхронізація wing_type після поселення (логіка з DBeaver: кімната + вся квартира)
function syncApartmentWingType(roomId, gender, callback) {
    if (!gender || gender === 'Не вказано') return callback();
    db.query('SELECT apartment_number FROM Rooms WHERE room_id = ?', [roomId], (err, rows) => {
        if (err) return callback(err);
        const apt = rows[0]?.apartment_number;
        db.query('UPDATE Rooms SET wing_type = ? WHERE room_id = ?', [gender, roomId], (err2) => {
            if (err2) return callback(err2);
            if (!apt) return callback();
            db.query(
                'UPDATE Rooms SET wing_type = ? WHERE apartment_number = ?',
                [gender, apt],
                callback
            );
        });
    });
}

// 1. GET: Всі студенти (лише активні)
app.get('/students', (req, res) => {
    const sql = `
        SELECT s.*, r.room_number
        FROM Students s
        LEFT JOIN Rooms r ON s.room_id = r.room_id
        WHERE s.room_id IS NOT NULL`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// GET: Архів виселених студентів
app.get('/students/archived', (req, res) => {
    const sql = `
        SELECT s.student_id, s.first_name, s.last_name, s.phone, s.email, s.gender,
               CONCAT('Виселений: ', COALESCE(DATE_FORMAT(MAX(h.move_out_date), '%d.%m.%Y'), 'невідомо'), ' (на 3 роки)') AS previous_room_number
        FROM students s
        LEFT JOIN report_accommodation_history h ON s.student_id = h.student_id
        WHERE s.is_active = FALSE
        GROUP BY s.student_id, s.first_name, s.last_name, s.phone, s.email, s.gender`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// DELETE: Фізичне видалення студента
app.delete('/students/force/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Students WHERE student_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Помилка видалення", details: err.message });
        res.json({ message: 'Студента видалено назавжди.' });
    });
});

// 1.5 GET: Всі пільги
app.get('/benefits', (req, res) => {
    db.query('SELECT * FROM Benefits', (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// GET: Вільні кімнати 
app.get('/rooms/free', (req, res) => {
    db.query('SELECT * FROM Rooms WHERE current_occupancy < capacity', (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// GET: Вільні кімнати за статтю
app.get('/rooms/available/:gender', (req, res) => {
    const gender = req.params.gender;
    const wing = gender === 'Жіноча' ? 'Жіноча' : 'Чоловіча';
    const sql = `
        SELECT * FROM Rooms 
        WHERE current_occupancy < capacity 
        AND (wing_type = ? OR wing_type = 'Не вказано')`;
    db.query(sql, [wing], (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// GET: Всі кімнати (для налаштувань)
app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM Rooms', (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// POST: Створити нову кімнату
app.post('/rooms', (req, res) => {
    const { room_number, floor, capacity, apartment_number, wing_type } = req.body;
    const sql = 'INSERT INTO Rooms (room_number, floor, capacity, apartment_number, wing_type) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [room_number, floor || 1, capacity, apartment_number, wing_type || 'Не вказано'], (err, result) => {
        if (err) return res.status(400).json({ error: "Не вдалося створити кімнату", details: err.message });
        res.json({ message: 'Кімнату успішно створено!', id: result.insertId });
    });
});

// PUT: Оновити кімнату
app.put('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const { room_number, floor, capacity, apartment_number, wing_type } = req.body;
    
    // Перевірка на конфлікт статі перед оновленням
    const wing = normalizeWing(wing_type);
    if (wing !== 'unknown') {
        db.query('SELECT gender FROM Students WHERE room_id = ?', [id], (err, students) => {
            if (err) return res.status(500).json({ error: "Помилка перевірки статі", details: err.message });
            
            const hasConflict = students.some(s => {
                const gen = normalizeGender(s.gender);
                return (wing === 'male' && gen === 'female') || (wing === 'female' && gen === 'male');
            });
            
            if (hasConflict) {
                return res.status(400).json({ error: "Помилка: У кімнаті проживають студенти іншої статі! Зміна крила неможлива." });
            }
            
            updateRoom();
        });
    } else {
        updateRoom();
    }

    function updateRoom() {
        const sql = 'UPDATE Rooms SET room_number = ?, floor = ?, capacity = ?, apartment_number = ?, wing_type = ? WHERE room_id = ?';
        db.query(sql, [room_number, floor, capacity, apartment_number, wing_type, id], (err, result) => {
            if (err) return res.status(400).json({ error: "Не вдалося оновити кімнату", details: err.message });
            res.json({ message: 'Дані кімнати оновлено!' });
        });
    }
});

// GET: Мешканці конкретної кімнати
app.get('/rooms/:id/students', (req, res) => {
    const { id } = req.params;
    db.query(
        'SELECT student_id, first_name, last_name, phone FROM Students WHERE room_id = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
            res.json(results);
        }
    );
});

// 3. POST: Поселити студента (тут тепер спрацює твій новий тригер!)
app.post('/students', (req, res) => {
    const { first_name, last_name, phone, email, room_number, benefit_id, gender } = req.body;
    const studentGender = gender || 'Не вказано';

    // 1. Базова валідація
    if (!first_name || !last_name) {
        return res.status(400).json({ error: "first_name та last_name обов'язкові" });
    }

    // 2. Перевіряємо кімнату та гендер (залишаємо як є)
    resolveRoomId(room_number, (err, room) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        if (room.notFound) return res.status(400).json({ error: "Кімнату не знайдено" });

        const room_id = room.roomId;
        validateRoomGender(room_id, studentGender, (err2, validation) => {
            if (err2) return res.status(500).json({ error: "Помилка сервера", details: err2.message });
            if (validation.conflict) return res.status(400).json({ error: GENDER_WING_ERROR });

            // 3. Починаємо транзакцію
            db.beginTransaction((err) => {
                if (err) return res.status(500).json({ error: "Не вдалося почати транзакцію", details: err.message });

                // 4. INSERT 1: Студент
                const sql1 = 'INSERT INTO Students (first_name, last_name, phone, email, room_id, benefit_id, gender, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)';
                db.query(sql1, [first_name, last_name, phone, email, room_id, benefit_id, studentGender], (err3, result) => {
                    if (err3) {
                        return db.rollback(() => {
                            res.status(400).json({ error: "Не вдалося поселити студента", details: err3.message });
                        });
                    }

                    const student_id = result.insertId;

                    // 5. INSERT 2: Історія проживання
                    const sql2 = 'INSERT INTO report_accommodation_history (student_id, room_id, move_in_date) VALUES (?, ?, CURDATE())';
                    db.query(sql2, [student_id, room_id], (err4) => {
                        if (err4) {
                            return db.rollback(() => {
                                res.status(400).json({ error: "Не вдалося записати історію проживання", details: err4.message });
                            });
                        }

                        // 6. Commit - успіх обох запитів
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: "Не вдалося завершити транзакцію", details: err.message });
                                });
                            }

                            // 7. Синхронізуємо крило (після commit)
                            syncApartmentWingType(room_id, studentGender, (syncErr) => {
                                if (syncErr) {
                                    console.error("Попередження: крило не синхронізовано", syncErr.message);
                                    return res.json({ 
                                        message: 'Студента додано та поселено, але крило квартири не синхронізовано', 
                                        id: student_id,
                                        warning: syncErr.message 
                                    });
                                }
                                res.json({ 
                                    message: 'Студента успішно поселено! Дані записані в історію.', 
                                    id: student_id 
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// 4. GET: Список виданого інвентарю (наша нова таблиця M:N)
app.get('/inventory/assignments', (req, res) => {
    const sql = `
        SELECT s.last_name, i.item_name, si.issue_date 
        FROM Student_Inventory si
        JOIN Students s ON si.student_id = s.student_id
        JOIN Inventory i ON si.item_id = i.item_id`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// GET: Список боржників (з нашого представлення)
app.get('/debtors', (req, res) => {
    db.query('SELECT v.*, r.apartment_number FROM v_debtors v LEFT JOIN Rooms r ON v.room_number = r.room_number', (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        res.json(results);
    });
});

// Оновити дані студента (редагування)
app.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone, email, room_number, benefit_id, gender } = req.body;
    const studentGender = gender || 'Не вказано';

    resolveRoomId(room_number, (err, room) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        if (room.notFound) return res.status(400).json({ error: "Кімнату не знайдено" });

        const room_id = room.roomId;
        validateRoomGender(room_id, studentGender, (err2, validation) => {
            if (err2) return res.status(500).json({ error: "Помилка сервера", details: err2.message });
            if (validation.conflict) return res.status(400).json({ error: GENDER_WING_ERROR });

            const sql = 'UPDATE Students SET first_name = ?, last_name = ?, phone = ?, email = ?, room_id = ?, benefit_id = ?, gender = ? WHERE student_id = ?';
            db.query(sql, [first_name, last_name, phone, email, room_id, benefit_id, studentGender, id], (err3, result) => {
                if (err3) return res.status(400).json({ error: "Не вдалося оновити", details: err3.message });
                syncApartmentWingType(room_id, studentGender, (syncErr) => {
                    if (syncErr) return res.status(500).json({ error: "Дані оновлено, але не синхронізовано крило квартири", details: syncErr.message });
                    res.json({ message: 'Дані студента успішно оновлено!' });
                });
            });
        });
    });
});

// Оновити борг (сума та статус оплати)
app.put('/finances/:id', (req, res) => {
    const finance_id = req.params.id;
    let { amount, is_paid } = req.body;

    db.query('SELECT student_id, amount, is_paid FROM finances WHERE finance_id = ?', [finance_id], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({error: 'Борг не знайдено'});
        
        const student_id = rows[0].student_id;
        const old_amount = parseFloat(rows[0].amount);
        let new_amount = amount !== undefined ? parseFloat(amount) : old_amount;

        // Якщо з фронтенду прийшов статус "оплачено" (is_paid є true/1) або сума стала <= 0
        let final_is_paid = is_paid === true || is_paid === 1 || is_paid === 'true' || new_amount <= 0;
        if (final_is_paid) {
            new_amount = 0; // Якщо оплачено, то залишок боргу занурюється
        }

        const amount_paid = old_amount - new_amount; // Скільки реально внесли грошей

        db.beginTransaction(err => {
            if (err) return res.status(500).json({error: 'Помилка транзакції'});

            db.query('UPDATE finances SET amount = ?, is_paid = ? WHERE finance_id = ?', [new_amount, final_is_paid, finance_id], (err) => {
                if (err) return db.rollback(() => res.status(500).json({error: 'Не вдалося оновити борг'}));

                // Якщо відбулася реальна оплата (сума зменшилась) — фіксуємо в історію платежів
                if (amount_paid > 0) {
                    db.query('INSERT INTO report_payments (finance_id, student_id, amount_paid) VALUES (?, ?, ?)', [finance_id, student_id, amount_paid], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({error: 'Помилка запису платежу'}));
                        db.commit(() => res.json({message: 'Оплату успішно зараховано!'}));
                    });
                } else {
                    db.commit(() => res.json({message: 'Борг просто скориговано!'}));
                }
            });
        });
    });
});

// 4. POST: Нарахувати борг студенту
app.post('/finances', (req, res) => {
    const { student_id, charge_type, amount } = req.body;
    
    if (!student_id || !charge_type || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Усі поля обов\'язкові, а сума має бути більшою за 0' });
    }

    const query = 'INSERT INTO finances (student_id, charge_type, amount, is_paid, date_issued) VALUES (?, ?, ?, FALSE, CURDATE())';
    db.query(query, [student_id, charge_type, amount], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Помилка створення нарахування', details: err.message });
        }
        res.json({ message: 'Нове нарахування успішно створено!', finance_id: result.insertId });
    });
});

// 5. DELETE: Виселити студента (мяке видалення)
app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    
    // 1. Основний запит: архівуємо студента
    db.query(
        'UPDATE Students SET room_id = NULL, is_active = FALSE WHERE student_id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Помилка виселення", details: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Студента не знайдено" });
            
            // Відправляємо відповідь клієнту одразу
            res.json({ message: 'Студента переведено в архів.' });
            
            // 2. Асинхронно оновлюємо дату виселення в історії (без переривання)
            db.query(
                'UPDATE report_accommodation_history SET move_out_date = CURDATE() WHERE student_id = ? AND move_out_date IS NULL',
                [id],
                (err) => {
                    if (err) console.error("Помилка оновлення історії проживання:", err.message);
                }
            );
        }
    );
});

// POST: Поновити студента з архіву
app.post('/students/restore', (req, res) => {
    const { student_id, room_id } = req.body;
    if (!student_id || !room_id) return res.status(400).json({error: 'ID студента та кімната обов\'язкові'});

    db.query('SELECT gender FROM Students WHERE student_id = ?', [student_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка сервера", details: err.message });
        if (!results.length) return res.status(400).json({ error: "Студента не знайдено" });
        const studentGender = results[0].gender;

        validateRoomGender(room_id, studentGender, (err2, validation) => {
            if (err2) return res.status(500).json({ error: "Помилка сервера", details: err2.message });
            if (validation.conflict) return res.status(400).json({ error: GENDER_WING_ERROR });

            db.beginTransaction(err => {
                if (err) return res.status(500).json({error: 'Помилка транзакції'});

                // 1. Знімаємо статус архіву і призначаємо нову кімнату
                db.query('UPDATE students SET room_id = ?, is_active = TRUE WHERE student_id = ?', [room_id, student_id], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({error: 'Не вдалося оновити статус студента'}));

                    // 2. Створюємо новий запис в історії поселень
                    db.query('INSERT INTO report_accommodation_history (student_id, room_id, move_in_date) VALUES (?, ?, CURDATE())', [student_id, room_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({error: 'Не вдалося записати історію'}));

                        db.commit(() => {
                            syncApartmentWingType(room_id, studentGender, () => {
                                res.json({message: 'Студента успішно поновлено і заселено!'});
                            });
                        });
                    });
                });
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює! Порт: ${PORT}. Тестуй в Apidog.`);
});