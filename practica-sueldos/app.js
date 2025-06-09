const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const puerto = 3000;

const sequelize = require('./conexion'); 
const sueldos = require('./models/sueldos');

app.use(express.json());

sequelize.sync().then(() => {
    app.listen(puerto, () => {
        console.log('✅ Servicio iniciado en el puerto ' + puerto);
    });
}).catch(error => {
    console.error('❌ Error al conectar con la base de datos:', error);
});

app.post('/sueldos/calcular', async (req, res) => {
    const { tipo, dias } = req.body;

    const data = await sueldos.findOne({
        where: { tipo }
    });

    if (!data) {
        return res.status(404).json({ error: 'Tipo no encontrado' });
    }

    let { sueldoDiario, bonoMensual } = data;

    if (dias < 25) {
        bonoMensual = 0;
    }

    let total = sueldoDiario * dias + bonoMensual;

    res.json({
        tipo, dias, sueldoDiario, bonoMensual, total
    });
});