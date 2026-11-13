const express = require('express')
const router = express.Router();
const db = require('./db')
const path = require('path')


router.get("/", (req, res) => {
    db.all("select * from siswa", (err, rows) => {
        const header = `
            <div class="p-4">
            <link rel="stylesheet" href="/css/output.css">
            <h1>Data Siswa</h1>
            <div class="flex">
            <a class="bg-amber-400 p-2 my-2" href="/siswa/tambah">Tambah siswa</a>
            </div>
            <table class="w-full border"> 
                <tr>
                    <td class="border p-2">ID</td>
                    <td class="border p-2">NISN</td>
                    <td class="border p-2">Nama</td>
                    <td class="border p-2">Jenis Kelamin</td>
                    <td class="border p-2">Tempat, Tanggal Lahir</td>
                    <td class="border p-2">Agama</td>
                    <td class="border p-2">Alamat</td>
                    <td class="border p-2">Aksi</td>
                </td>`;

        let tableBody = [];


        rows.forEach((row) => {
            tableBody.push(`
                    <tr>
                        <td class="border p-2">${row.id}</td>
                        <td class="border p-2">${row.nisn}</td>
                        <td class="border p-2">${row.nama}</td>
                        <td class="border p-2">${row.jeniskelamin}</td>
                        <td class="border p-2">${row.tempatlahir}, ${row.tanggallahir}</td>
                        <td class="border p-2">${row.agama}</td>
                        <td class="border p-2">${row.alamat}</td>
                        <td class="flex gap-0.5 border p-2">
                            <form action="/siswa/delete/${row.id}" methode="delete">
                                <button class="bg-red-400 p-2 my-2" type="submit">Delete</button>
                            </form>
                          <a class="bg-yellow-400 p-2 my-2" href="/siswa/edit/${row.id}">Edit</a>
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


router.get("/tambah", (req, res) => {
    const file = path.resolve() + "/public/tambahsiswa.html";
    console.log(file);
    return res.sendFile(file)
})


router.get("/edit/:id", (req, res) => {

    db.get(`select * from siswa where id=${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ message: err.message })
        } else {

            const html = `
              <link rel="stylesheet" href="/css/output.css">
             <div class="h-screen flex flex-col justify-center items-center">
        <div class="w-[30%]">
            <h1 class="mb-2">Tambah Data Siswa</h1>
            <form class="rounded-xl bg-gray-300 p-5 flex flex-col" action="/siswa/update/${result.id}" method="POST">

                <label style="width: 100px">NISN:</label>
                <input class="border-2 border-amber-100 mb-2" value="${result.nisn}" name="nisn" required>

                <label style="width: 100px">Nama Siswa:</label>
                <input class="border-2 border-amber-100 mb-2" value="${result.nama}" name="nama" required>

                <label style="width: 100px">Jenis Kelamin:</label>
                <input class="border-2 border-amber-100 mb-2" value="${result.jeniskelamin}" name="jeniskelamin" required>

                <label style="width: 100px">Tempat Lakir:</label>
                <input class="border-2 border-amber-100 mb-2" value="${result.tempatlahir}" name="tempatlahir" required>

                <label style="width: 100px">Tanggal Lakir:</label>
                <input class="border-2 border-amber-100 mb-2" value="${result.tanggallahir}" name="tanggallahir" type="date" required>

                <label style="width: 100px">Agama</label>
                <select class="border-2 border-amber-100 mb-2" value="${result.tanggallahir}" name="agama" required>
                    <option value="kristen">Kristen</option>
                    <option value="islam">Islam</option>
                    <option value="katolik">Katolik</option>
                </select>

                <label style="width: 100px">Alamat</label>
                <textarea class="border-2 border-amber-100 mb-2"  name="alamat" required>${result.alamat}</textarea>

                <button class="p-2 m-2 bg-green-400" type="submit">Simpan</button>
            </form>
        </div>
    </div>
            `;
            return res.send(html)
        }
    })
})


router.get("/delete/:id", (req, res) => {
    db.run(
        `delete from  siswa where id =${req.params.id}
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/siswa')
        }
    })
})


router.post("/simpan", (req, res) => {
    const { nisn, nama, jeniskelamin, tempatlahir, tanggallahir, agama, alamat } = req.body;
    db.run(
        `insert into siswa (nisn, nama, jeniskelamin, tempatlahir, tanggallahir, agama, alamat)
        values('${nisn}', '${nama}', '${jeniskelamin}', '${tempatlahir}', '${tanggallahir}', '${agama}', '${alamat}')
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/siswa')
        }
    })

})

router.post("/update/:id", (req, res) => {
    const { nisn, nama, jeniskelamin, tempatlahir, tanggallahir, agama, alamat } = req.body;
    db.run(
        `update siswa set nisn='${nisn}',nama= '${nama}', jeniskelamin= '${jeniskelamin}', tempatlahir='${tempatlahir}', 
        tanggallahir='${tanggallahir}', alamat='${alamat}' where  id= ${req.params.id}
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/siswa')
        }
    })

})




module.exports = router;
