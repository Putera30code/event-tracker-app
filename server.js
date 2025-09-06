// server.js (KOD LENGKAP & BETUL)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Pangkalan data kini kosong pada mulanya dan akan diisi oleh petugas
let staffData = {};

// Endpoint untuk menerima SEMUA data (Profil + Lokasi GPS)
app.post('/update-data', (req, res) => {
    const { id, name, department, telefon, tugas, lat, lon } = req.body;

    // Gunakan ID yang diberi oleh petugas sebagai kunci unik
    if (!id) {
        return res.status(400).json({ message: 'ID Petugas diperlukan!' });
    }

    // Cipta atau kemaskini data petugas
    staffData[id.toUpperCase()] = {
        name: name,
        department: department,
        telefon: telefon,
        tugas: tugas,
        lat: lat || (staffData[id.toUpperCase()] ? staffData[id.toUpperCase()].lat : 0), // Kekalkan lokasi lama jika tiada yg baru
        lon: lon || (staffData[id.toUpperCase()] ? staffData[id.toUpperCase()].lon : 0),
        lastUpdate: new Date().toLocaleTimeString('ms-MY')
    };

    console.log(`Data untuk ID ${id.toUpperCase()} telah dikemaskini.`);
    res.json({ message: 'Maklumat anda telah berjaya dikemaskini!' });
});

// Endpoint untuk Admin mendapatkan semua lokasi
app.get('/get-locations', (req, res) => {
    const locationsForMap = {};
    for (const id in staffData) {
        const staff = staffData[id];
        // Hanya hantar data ke peta jika ada nama dan lokasi
        if (staff.name && staff.lat !== 0) {
             locationsForMap[staff.name] = { // Guna nama sebagai kunci untuk paparan
                lat: staff.lat,
                lon: staff.lon,
                jawatan: staff.department,
                lastUpdate: staff.lastUpdate,
                tugas: staff.tugas,
                telefon: staff.telefon
            };
        }
    }
    res.json(locationsForMap);
});

app.listen(PORT, () => {
    console.log(`Server sedang berjalan di http://localhost:${PORT}`);
});