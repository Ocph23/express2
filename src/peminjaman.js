const express = require('express')
const router = express.Router();
const db = require('./db')
const path = require('path')


router.get("/", (req, res) => {
    db.all(`
        select p.id as peminjamanid, p.tanggalpinjam, p.siswaid, p.bukuid,p.status, s.nama, b.judulbuku from peminjaman as p  
        left join siswa as s on p.siswaid = s.id 
        left join buku as b on p.bukuid = b.id `
        , (err, rows) => {
            const header = `
            <div class="p-4">
            <link rel="stylesheet" href="/css/output.css">
            <h1>Data peminjaman</h1>
            <div class="flex">
            <a class="bg-amber-400 p-2 my-2" href="/peminjaman/tambah">Tambah peminjaman</a>
            </div>
            <table class="w-full border"> 
                <tr>
                    <td class="border p-2">Id</td>
                    <td class="border p-2">Tanggal Pinjam</td>
                    <td class="border p-2">Nama Peminjam</td>
                    <td class="border p-2">Buku</td>
                    <td class="border p-2">Status</td>
                    <td class="border p-2">Aksi</td>
                </td>`;

            let tableBody = [];


            rows.forEach((row) => {
                tableBody.push(`
                    <tr>
                        <td class="border p-2">${row.peminjamanid}</td>
                        <td class="border p-2">${row.tanggalpinjam}</td>
                        <td class="border p-2">${row.nama}</td>
                        <td class="border p-2">${row.judulbuku}</td>
                        <td class="border p-2">${row.status}</td>
                        <td class="flex gap-0.5 border p-2">
                            <form action="/peminjaman/delete/${row.peminjamanid}" methode="delete">
                                <button class="bg-red-400 p-2 my-2" type="submit">Delete</button>
                            </form>
                          <a class="bg-yellow-400 p-2 my-2" href="/peminjaman/edit/${row.peminjamanid}">Edit</a>
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

    db.all(`select * from siswa`, (err, dataSiswa) => {
        if (!err) {
            db.all(`select * from buku`, (err, dataBuku) => {
                if (!err) {
                    let file = `
     <link rel="stylesheet" href="/css/output.css">
    <div class="h-screen flex flex-col justify-center items-center">
        <div class="w-[30%]">
            <h1 class="mb-2">Tambah Data Peminjaman</h1>
            <form class="rounded-xl bg-gray-300 p-5 flex flex-col" action="/peminjaman/simpan" method="POST">

                <label style="width: 100px">Tanggal Pinjam:</label>
                <input class="border-2 border-amber-100 mb-2" name="tanggalpinjam" type="datetime-local" required>

                <label style="width: 100px">Siswa</label>
                <select class="border-2 border-amber-100 mb-2" name="siswaid" required>`;
                    dataSiswa.forEach((siswa) => {
                        file += `<option value="${siswa.id}">${siswa.nama}</option>`
                    })
                    file += `</select>
                <label style="width: 100px">Buku</label>
                <select class="border-2 border-amber-100 mb-2" name="bukuid" required>`
                    dataBuku.forEach((item) => {
                        file += `<option value="${item.id}">${item.judulbuku}</option>`
                    })
                    file += ` </select>

                <button class="p-2 m-2 bg-green-400" type="submit">Simpan</button>
            </form>
        </div>
    </div>
    `;
                    return res.send(file)
                }
            })
        }
    })




})


router.get("/edit/:id", (req, res) => {

    db.get(`select * from peminjaman where id=${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ message: err.message })
        } else {

            const html = `
              <link rel="stylesheet" href="/css/output.css">
             <div class="h-screen flex flex-col justify-center items-center">
        <div class="w-[30%]">
            <h1 class="mb-2">Tambah Data peminjaman</h1>
            <form class="rounded-xl bg-gray-300 p-5 flex flex-col" action="/peminjaman/update/${result.id}" method="POST">

                <label style="width: 100px">NISN:</label>
                <input class="border-2 border-amber-100 mb-2" value="${result.nisn}" name="nisn" required>

                <label style="width: 100px">Nama peminjaman:</label>
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
        `delete from  peminjaman where id =${req.params.id}
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/peminjaman')
        }
    })
})


router.post("/simpan", (req, res) => {
    const { tanggalpinjam, siswaid, bukuid, status } = req.body;
    console.log(req.body);
    db.run(
        `insert into peminjaman (tanggalpinjam, siswaid, bukuid, status)
        values('${tanggalpinjam}', '${siswaid}', '${bukuid}', 'baru')
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/peminjaman')
        }
    })

})

router.post("/update/:id", (req, res) => {
    const { nisn, nama, jeniskelamin, tempatlahir, tanggallahir, agama, alamat } = req.body;
    db.run(
        `update peminjaman set nisn='${nisn}',nama= '${nama}', jeniskelamin= '${jeniskelamin}', tempatlahir='${tempatlahir}', 
        tanggallahir='${tanggallahir}', alamat='${alamat}' where  id= ${req.params.id}
        `, (err) => {
        if (err) {
            console.log(err.message)
        } else {
            return res.redirect('/peminjaman')
        }
    })

})




module.exports = router;
