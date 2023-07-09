const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { pool } = require('../index'); 

router.get('/', async (req, res) => {
  try {
    // Get all users 
    const users = await getAllUsers();

    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user 
    const newUser = await createUser(username, hashedPassword);

    res.send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user 
    const updatedUser = await updateUser(id, username, hashedPassword);

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the user 
    await deleteUser(id);

    res.send('User deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

async function getAllUsers() {
  
  const query = 'SELECT * FROM users';
  const result = await pool.query(query);

  return result.rows;
}

async function createUser(username, password) {
  

  const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
  const values = [username, password];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function updateUser(id, username, password) {
  

  const query = 'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *';
  const values = [username, password, id];
  const result = await pool.query(query, values);

  return result.rows[0];
}

async function deleteUser(id) {
  

  const query = 'DELETE FROM users WHERE id = $1';
  const values = [id];
  await pool.query(query, values);
}

module.exports = router;
