const express = require('express');
const client = require('./db');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});


// API para registrar una persona
app.post('/api/registro', async (req, res) => {
    const { nombre, apellido1, apellido2, dni } = req.body;
    if (!nombre || !apellido1 || !apellido2 || !dni) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios: nombre, apellido1, apellido2, dni.'
        });
    }

    const query = 'INSERT INTO Persona (nombre, apellido1, apellido2, dni) VALUES ($1, $2, $3, $4)';

    try {
        await client.query(query, [nombre, apellido1, apellido2, dni]);
        res.status(201).json({
            message: 'Persona registrada exitosamente',
            data: { nombre, apellido1, apellido2, dni }
        });
    } catch (error) {
        console.error('Error al registrar persona:', error.message);
        res.status(500).json({
            message: 'Error al crear la persona',
            error: error.message
        });
    }
});
 //obtener todas las peronas
 app.get('/api/personas', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Persona');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las personas', error: error.message });
    }
});
//actializar persona
app.get('/api/persona/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('SELECT * FROM Persona WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Persona no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la persona', error: error.message });
    }
});

//eliminar persona
app.delete('/api/persona/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await client.query('DELETE FROM Persona WHERE id = $1', [id]);
        res.status(200).json({ message: 'Persona eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la persona', error: error.message });
    }
});

//crear coche
app.post('/api/coche', async (req, res) => {
    const { matricula, marca, modelo, caballos, persona_id } = req.body;
    const query = 'INSERT INTO Coche (matricula, marca, modelo, caballos, persona_id) VALUES ($1, $2, $3, $4, $5)';

    try {
        await client.query(query, [matricula, marca, modelo, caballos, persona_id]);
        res.status(201).json({ message: 'Coche registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el coche', error: error.message });
    }
});
//obtener todos los carros
app.get('/api/coches', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Coche');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los coches', error: error.message });
    }
});

//actualizar todos carro
app.put('/api/coche/:matricula', async (req, res) => {
    const { matricula } = req.params;
    const { marca, modelo, caballos, persona_id } = req.body;
    const query = 'UPDATE Coche SET marca = $1, modelo = $2, caballos = $3, persona_id = $4 WHERE matricula = $5';

    try {
        await client.query(query, [marca, modelo, caballos, persona_id, matricula]);
        res.status(200).json({ message: 'Coche actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el coche', error: error.message });
    }
});
//eliminar carro
app.delete('/api/coche/:matricula', async (req, res) => {
    const { matricula } = req.params;
    try {
        await client.query('DELETE FROM Coche WHERE matricula = $1', [matricula]);
        res.status(200).json({ message: 'Coche eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el coche', error: error.message });
    }
});


