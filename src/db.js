const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'perpustakaan.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Gagal terhubung ke database SQLite:', err.message);
    } else {
        console.log('Terhubung ke database SQLite.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS buku (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      judulbuku TEXT,
      penulis TEXT ,
      tahunterbit INTIGER ,
      kategori TEXT ,
      isbn TEXT unique
    );



        `, (err) => {
        if (err) {
            console.log("Gagal Buat Table Buku", err.message);
        } else {
            console.log("Berhasil Buat Table Buku");
        }

    });

    db.run(`
        CREATE TABLE IF NOT EXISTS siswa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nisn TEXT,
        nama TEXT ,
        jeniskelamin TEXT,
        tempatlahir Text ,
        tanggallahir Date ,
        agama TEXT, 
        alamat TEXT 
        );

        `, (err) => {
        if (err) {
            console.log("Gagal Buat Table Buku", err.message);
        } else {
            console.log("Berhasil Buat Table Siswa");
        }

    });

    db.run(`
        CREATE TABLE IF NOT EXISTS peminjaman (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tanggalpinjam datetime,
        siswaid integer,
        bukuid integer,
        status TEXT
        );

        `, (err) => {
        if (err) {
            console.log("Gagal Buat Table Buku", err.message);
        } else {
            console.log("Berhasil Buat Table peminjaman");
        }

    });
})

module.exports = db;