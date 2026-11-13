const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const db = new sqlite3.Database("perpustakaan.db")

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS buku (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judulbuku TEXT,
      penulis TEXT ,
      tahunterbit TEXT ,
      kategori TEXT ,
      isbn TEXT unique
    )
        `, (err) => {
        if (err) {
            console.log("Gagal Buat Table Buku", err.message);
        } else {
            console.log("Berhasil Buat Table Buku");
        }

    });
})

app.get("/buku", (req, res) => {
    db.all("select * from buku", (err, rows) => {
        const header = `
            <link rel="stylesheet" href="/css/output.css">
            
            <h1>Data Siswa</h1>
            <div>
            <a class="bg-amber-400 p-2 m-5" href="/buku/tambah">Tambah Buku</a>
            </div>
            <table class="w-full border"> 
                <tr>
                    <td class="border p-2">ID</td>
                    <td class="border p-2">Judul</td>
                    <td class="border p-2">Penulis</td>
                    <td class="border p-2">Kategori</td>
                    <td class="border p-2">Tahun Terbit</td>
                    <td class="border p-2">ISBN</td>
                </td>`;

        let tableBody = [];


        rows.forEach((row) => {
            tableBody.push(`
                    <tr>
                        <td>${row.id}</td>
                    </tr>
                `);
        })





        const endTable = `
            </table>
        `;

        return res.send(header + tableBody.join() + endTable)

    })


})






const buku = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/tambahBuku', (req, res) => {
    buku.push(req.body);
    res.redirect('/getDataBuku');
});

app.get('/getDataBuku', (req, res) => {
    let html = `
    <h1>Data Buku</h1>
    <table border="1">
        <tr>
            <th>IdBuku</th>
            <th>Nama</th>
            <th>Umur</th>
            <th>Pekerjaan</th>
        </tr>
`;
    buku.forEach(s => {
        html += `
        <tr>
            <td class="border p-2">${s.id}</td>
            <td class="border p-2">${s.nama}</td>
            <td class="border p-2">${s.umur}</td>
            <td class="border p-2">${s.pekerjaan}</td>
        </tr>
        `;
    });
    html += `
    </table>
    `;
    res.send(html);
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
