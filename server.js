const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const { Pool } = require('pg');
const PORT = 8080;

app.use(cors());

// Middleware to parse JSON request body
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'garam',
  // password: 'your_password',
  port: 5432, // Default PostgreSQL port
});

// expressJS routing
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // run query, chek username & password
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT count(*) as jum FROM users WHERE username=$1 AND password=$2', [username, password]);
    client.release(); // Release the client back to the pool

    // Check if any rows were returned
    if (result.rows.length > 0) {
      const jum = result.rows[0].jum; // Fetch the value of the 'jum' column
      // Here you can use the value of 'jum' for further processing
      res.json({  jum });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.post('/cek_nm_kelompok', async (req, res) => {
  console.log("masuk nama kelompok");

  const { namaKelompok } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT count(*) as jum FROM kelompok_petambak WHERE nm_kelompok=$1', [namaKelompok]);
    client.release(); // Release the client back to the pool

    if (result.rows.length > 0) {
      const jum = result.rows[0].jum; 
      res.json({  jum });

    } else {
      res.status(401).json({ success: false });
    }

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});

app.post('/add_nm_kelompok', async (req, res) => {
  const { kecamatan, desa, namaKelompok } = req.body;
  
  try {
    const client = await pool.connect();

    const result = await client.query("INSERT INTO kelompok_petambak (kab, kecamatan, desa, nm_kelompok) VALUES ('pidie', '"+kecamatan+"', '"+desa+"', '"+namaKelompok+"')");
    client.release(); // Release the client back to the pool
    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Something wrong' });
  }
  
});

app.post('/get_slot_kelompok', async (req, res) => {
  
  const {klpk}  = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT count(*) as jum FROM petambak WHERE nm_kelompok=$1', [klpk]);
    client.release(); // Release the client back to the pool

    res.status(200).json( result.rows[0].jum );
    // res.status(200).json( {query: "SELECT count(*) as jum FROM petambak WHERE nm_kelompok='"+kelompok+"'"} );

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.get('/get_nm_kelompok', async (req, res) => {
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT nm_kelompok FROM kelompok_petambak ORDER BY nm_kelompok ASC');
    client.release(); // Release the client back to the pool

    res.status(200).json(result.rows);
    // res.status(200).json({res:"ok"});


  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

// SAVE PETANI
app.post('/save_petani', async (req, res) => {
  const { kecamatan, desa, kelompok, namaPetambak, kusuka, luasLahan, tahunBantuan, fileUrl, ket } = req.body;
  
  try {
    const client = await pool.connect();

    // Define the parameterized query
    const text = 'INSERT INTO petambak (kab, kecamatan, desa, nm_kelompok, nm_petambak, stat_kusuka, luas_lahan, tahun_bantuan, file_kusuka, ket) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';

    // Create an array of escaped values
    const values = ['pidie', kecamatan, desa, kelompok, namaPetambak, kusuka, luasLahan, tahunBantuan, fileUrl, ket];

    // Execute the prepared query with escaped values
    const result = await client.query(text, values);


    // const result = await client.query("INSERT INTO petambak (kab, kecamatan, desa, nm_kelompok, nm_petambak, stat_kusuka, luas_lahan, tahun_bantuan, file_kusuka, ket) VALUES ('pidie', '"+kecamatan+"', '"+desa+"', '"+kelompok+"', '"+namaPetambak+"', '"+kusuka+"', '"+luasLahan+"', '"+tahunBantuan+"', '"+fileUrl+"', '"+ket+"')");
    client.release(); // Release the client back to the pool
    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "something wrong" });
  }
});



// SAVE REKAP
app.post('/save_rekap', async (req, res) => {
  const { kecamatan, desa, luasLahan, jumKelompok, jumPetambak, jumNonPetambak } = req.body;
  
  try {
    const client = await pool.connect();

    const result = await client.query("INSERT INTO rekap_petambak (kab, kecamatan, desa, luas_lahan, jum_kelompok, jum_petambak, jum_non_petambak) VALUES ('pidie', '"+kecamatan+"', '"+desa+"', '"+luasLahan+"', '"+jumKelompok+"', '"+jumPetambak+"', '"+jumNonPetambak+"')");
    client.release(); // Release the client back to the pool
    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: "something wrong" });
  }
});



// DATATABLE
app.get('/get_petambak_datatable', async (req, res) => {
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT *  FROM petambak ORDER BY nm_kelompok ASC');
    client.release(); // Release the client back to the pool

    res.status(200).json(result.rows);
    // res.status(200).json({stat:"okasdasd"});


  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});


// REKAP DATATABLE
app.get('/get_rekap_datatable', async (req, res) => {
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT *  FROM rekap_petambak ORDER BY kecamatan ASC');
    client.release(); // Release the client back to the pool

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

// GET EDIT REKAP
app.get('/get_edit_rekap_datatable/:id', async (req, res) => {
  
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT *  FROM rekap_petambak WHERE id='+id);
    client.release(); // Release the client back to the pool

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

// UPDATE REKAP DATATABLE
app.post('/update_rekap_datatable', async (req, res) => {
  
  const { rowID, kecamatan, desa, luasLahan, jumKelompok, jumPetambak, jumNonPetambak } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query("UPDATE rekap_petambak SET kecamatan='"+kecamatan+"', desa='"+desa+"', luas_lahan='"+luasLahan+"', jum_kelompok='"+jumKelompok+"', jum_petambak='"+jumPetambak+"', jum_non_petambak='"+jumNonPetambak+"'  WHERE id="+rowID);
    client.release(); // Release the client back to the pool

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});

// DELETE REKAP DATATABLE
app.post('/del_rekap_datatable', async (req, res) => {
  
  const { id } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE  FROM rekap_petambak WHERE id='+id);
    client.release(); // Release the client back to the pool

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }

});



app.get('/get_data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    client.release(); // Release the client back to the pool
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/api/home", (req, res) => {
  res.json({ message: "test hello world! 123"});
//   res.json({ message: "Like this video!", people: ["Arpan", "Jack", "Barry"] });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
