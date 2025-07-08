const express = require('express');
const routes = express.Router();
const conn = require('../db/database');

routes.post('/fullVerify',async (req, res) => {
  const { fullName, contact, address ,  userId } = req.body;
  if (userId && fullName && contact && address) {
    const query = `INSERT INTO fullverify(fullname,	contact,	address,	user_id	) VALUES (?, ?, ?, ?)`;
    const values = [fullName, contact, address, userId];
    await conn(query, values, (error, results) => {
      if (error) {
        console.error("DB error:", error);
        return res.status(400).json({ mess: "Error inserting to database", error });
      }
      return res.status(200).json({ mess: "Successfully inserted data" });
    });
  } else {
    return res.status(400).json({ mess: "Please fill in all required fields." });
  }
});


routes.get('/getfull', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized—wala kang session.' });
  }
  try {
    const sql = 'SELECT * FROM fullverify WHERE user_id = ?';
    const [rows] = await conn(sql, [userId]);

    return res.json(rows);
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Server/db error' });
  }
});


module.exports = routes;
