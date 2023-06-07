const express = require('express'); 
const fs = require('fs');
const path = require('path');  

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let usersData = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

// összes user lekérdezése
app.get('/users', (req,res) => {
    res.status(200).json(usersData);
});

// új user létrehozása
app.post('/users', (req, res) => {
    const {userName, email, birthDate, status} = req.body || req.query;

// új user objektum létrehozása
const newUser = {id:Date.now(), userName, email, birthDate, status};
usersData.push(newUser);
saveUsersData();

res.status(200).json({message:'Felhasználó sikeresen hozzáadva :)'});
});

// user törlése :id path variable - útvonal változó
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    // user törlése felhasználói név alapján
    const initialLength = usersData.length;
    usersData = usersData.filter(user => user.id !== Number(userId));

    if (usersData.length !== initialLength) {
        saveUsersData(); 
        res.status(200).json({message: 'A felhasználó törlése sikeres'});
    } else {
        res.status(404).json({message: 'Nem található felhasználó a megadott felhasználói névvel'});
    }
} )

// Felhasználó szerkesztése
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { userName, email, birthDate, status } = req.body || req.query;
    
    // Megkeressük a usert a felhasználói név alapján
    const user = usersData.find(user => user.id === Number(userId));
    
    if (user) {
        user.userName = userName;
        user.email = email;
        user.birthDate = birthDate;
        user.status = status;
        saveUsersData(); 
        res.status(200).json({ message: 'Felhasználó adatai sikeresen frissítve.' });
    } else {
        res.status(404).json({ message: 'Nem található felhasználó az adott felhasználói névvel.' });
    }
});

// JSON file mentése:
function saveUsersData() {
    fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));
}

// index.html beállítása kezdőoldalként:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// szerver indítása
app.listen(3000, () => {
    console.log('Fut a szerver ezen a címen: http://localhost:3000');
});