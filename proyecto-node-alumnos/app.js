const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/alumnos', (req, res) => { 
    const { cuenta, nombre, promedio, grado, grupo } = req.body;

    if (!cuenta || !nombre || !grado || !grupo) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    if (typeof promedio !== 'number' || isNaN(promedio)) {
        return res.status(400).json({ error: 'Promedio debe ser un número' });
    }

    const alumno = { cuenta, nombre, promedio, grado, grupo };
    const filePath = path.join(__dirname, 'alumnos.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let alumnos = [];
        
        if (!err && data) {
            try {
                alumnos = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parseando JSON:', parseError);
                return res.status(500).json({ error: 'Error procesando datos existentes' });
            }
        }

        alumnos.push(alumno);

        fs.writeFile(filePath, JSON.stringify(alumnos, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error guardando:', writeErr);
                return res.status(500).json({ error: 'Error al guardar los datos' });
            }
            res.status(201).json({ 
                message: 'Alumno registrado correctamente',
                alumno: alumno
            });
        });
    });
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando. Usa POST /alumnos para registrar alumnos');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
    const filePath = path.join(__dirname, 'alumnos.json');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf8');
        console.log('Archivo alumnos.json creado');
    }
});