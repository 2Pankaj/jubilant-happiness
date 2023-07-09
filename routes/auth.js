const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the user 
    const user = await getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

async function getUserByUsername(username) {
  

  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];
  const result = await pool.query(query, values);

  return result.rows[0];
}

module.exports = router;
