const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const port = 3000;

const db = require('./src/db')
const siswaRouter = require('./src/siswa')
const peminjamanRouter = require('./src/peminjaman')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/siswa', siswaRouter)
app.use('/peminjaman', peminjamanRouter)



app.get("/buku", (req, res) => {
    db.all("select * from buku", (err, rows) => {
        const header = `
            <div class="p-4">
            <link rel="stylesheet" href="/css/output.css">
            <h1>Data Siswa</h1>
            <div class="flex">
            <a class="bg-amber-400 p-2 my-2" href="/buku/tambah">Tambah Buku</a>
            </div>
            <table class="w-full border"> 
                <tr>
                    <td class="border p-2">ID</td>
                    <td class="border p-2">Judul</td>
                    <td class="border p-2">Penulis</td>
                    <td class="border p-2">Kategori</td>
                    <td class="border p-2">Tahun Terbit</td>
                    <td class="border p-2">ISBN</td>
                    <td class="border p-2">Aksi</td>
                </td>`;

        let tableBody = [];


        rows.forEach((row) => {
            tableBody.push(`
                    <tr>
                        <td class="border p-2">${row.id}</td>
                        <td class="border p-2">${row.judulbuku}</td>
                        <td class="border p-2">${row.penulis}</td>
                        <td class="border p-2">${row.kategori}</td>
                        <td class="border p-2">${row.tahunterbit}</td>
                        <td class="border p-2">${row.isbn}</td>
                        <td class="flex gap-0.5 border p-2">
                            <form action="/buku/delete/${row.id}" methode="delete">
                                <button class="bg-red-400 p-2 my-2" type="submit">Delete</button>
                            </form>
                          <a class="bg-yellow-400 p-2 my-2" href="/buku/edit/${row.id}">Edit</a>
                        </td>
                    </tr>
                `);
        })


        const endTable = `
            </table>
            </div>
        `;

        return res.send(header + tableBody.join() + endTable)

    })


})


app.get("/buku/tambah", (req, res) => {
    const file = __dirname + "/public/tambahbuku.html";
    console.log(file);
    return res.sendFile(file)
})


app.get("/buku/edit/:id", (req, res) => {

    db.get(`select * from buku where id=${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ message: err.message })
        } else {

            const html = `
              <link rel="stylesheet" href="/css/output.css">
             <div class="h-screen flex flex-col justify-center items-center">
                <div class="w-[30%]">
                    <h1 class="mb-2">Edit  Siswa</h1>
                    <form class="rounded-xl bg-gray-300 p-5 flex flex-col" action="/buku/update/${result.id}" method="POST">
        
                        <label style="width: 100px">Id:</label>
                        <input disabled class="border-2 border-amber-100 mb-2" value="${result.id}" name="id" required>
        
                        <label style="width: 100px">Judul Buku:</label>
                        <input  class="border-2 border-amber-100 mb-2" value="${result.judulbuku}" name="judulbuku" required>
        
                        <label style="width: 100px">Penulis:</label>
                        <input class="border-2 border-amber-100 mb-2" value="${result.penulis}" name="penulis" required>
        
                        <label style="width: 100px">Tahun Terbit</label>
                        <input class="border-2 border-amber-100 mb-2" type="number" value="${result.tahunterbit}" name="tahunterbit" required>
        
        
                        <label style="width: 100px">Kategori</label>
                        <select class="border-2 border-amber-100 mb-2" value="${result.kategori}" name="kategori" required>
                            <option value="pelajaran">Pelajaran</option>
                            <option value="novel">Novel</option>
                            <option value="majalah">Majalah</option>
                        </select>
        
                        <label style="width: 100px">ISBN</label>
                        <input class="border-2 border-amber-100 mb-2" value="${result.isbn}" name="isbn" required>
        
                        <button class="p-2 m-2 bg-green-400" type="submit">Simpan</button>
                    </form>
                </div>
            </div>
            `;
            return res.send(html)
        }
    })
})


app.get("/buku/delete/:id", (req, res) => {
    db.run(
        `delete from  buku where id =${req.params.id}
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/buku')
        }
    })
})


app.post("/buku/simpan", (req, res) => {
    const { judulbuku, penulis, tahunterbit, kategori, isbn } = req.body;
    db.run(
        `insert into buku (judulbuku, penulis, tahunterbit, kategori, isbn)
        values('${judulbuku}', '${penulis}', ${tahunterbit}, '${kategori}', '${isbn}')
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/buku')
        }
    })

})

app.post("/buku/update/:id", (req, res) => {
    const { id, judulbuku, penulis, tahunterbit, kategori, isbn } = req.body;
    db.run(
        `update buku set judulbuku='${judulbuku}',penulis= '${penulis}', tahunterbit= ${tahunterbit}, kategori= '${kategori}', isbn='${isbn}' where  id= ${req.params.id}
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/buku')
        }
    })

})


const buku = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
