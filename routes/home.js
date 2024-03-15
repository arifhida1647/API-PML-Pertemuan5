const express = require('express');
const admin = require('firebase-admin');
const app = express();
const router = express.Router();

// Inisialisasi Firebase Admin SDK dengan menggunakan file kredensial
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://arif-9e465-default-rtdb.firebaseio.com' // URL database Firebase Anda
});

// Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/login', (req, res) => {
    const { username, password } = req.query; // Mendapatkan username dan password dari query parameters
    if (!username || !password) {
        return res.status(400).send('Username dan password diperlukan');
    }
    
    const ref = admin.database().ref(); // Referensi utama (root)
    ref.once('value', (snapshot) => {
        const users = snapshot.val(); // Mendapatkan semua data pengguna
        const userData = users && users[username]; // Mendapatkan data pengguna berdasarkan username
        if (userData) {
            const storedPassword = userData.password;
            if (password === storedPassword) {
                res.status(200).send('Berhasil login');
            } else {
                res.status(404).send('Password salah');
            }
        } else {
            res.status(404).send('Pengguna tidak ditemukan');
        }
    }).catch((error) => {
        res.status(500).send('Gagal mengambil data dari Firebase');
    });
});

router.get('/task', (req, res) => {
    const { usernameParams } = req.query; // Mendapatkan username dari query parameters
    if (!usernameParams) {
        return res.status(400).send('Login terlebih dahulu');
    }
    const ref = admin.database().ref(usernameParams); // Mendapatkan referensi spesifik berdasarkan username
    ref.once('value', (snapshot) => {
        const userData = snapshot.val(); // Mendapatkan data pengguna berdasarkan username
        if (userData && userData.task) {
            const tasks = userData.task; // Mendapatkan task dari data pengguna
            res.status(200).json(tasks); // Mengirimkan task sebagai respons JSON
        } else {
            res.status(404).send('Tidak ada task untuk pengguna ini');
        }
    }).catch((error) => {
        res.status(500).send('Gagal mengambil data dari Firebase');
    });
});




module.exports = router;
