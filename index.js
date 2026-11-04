const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const buku = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/tambahBuku',(req,res)=>{
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
            <td>${s.id}</td>
            <td>${s.nama}</td>
            <td>${s.umur}</td>
            <td>${s.pekerjaan}</td>
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
