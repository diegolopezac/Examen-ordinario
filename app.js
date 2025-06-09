const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());

const precios = {
    "A": 300,
    "B": 490,
    "C": 670,
    "D": 899
};

const diasValidos = ["viernes", "sabado", "domingo"];

app.get("/api/calcular-precio", (req, res) => {
    const { seccion, cantidad, dia } = req.query;

    if (!dia || !diasValidos.includes(dia.toLowerCase()) ||
        !seccion || !precios[seccion.toUpperCase()] ||
        isNaN(cantidad) || cantidad < 1) {
        
        return res.status(400).json({ error: "Parámetros inválidos" });
    }

    let cantidadNum = parseInt(cantidad);

    let precioUnitario = precios[seccion.toUpperCase()];
    
    if (dia.toLowerCase() === "domingo") {
        precioUnitario *= 0.84;
    }

    let total = precioUnitario * cantidadNum;
    
    if (cantidadNum > 1) {
        total *= 0.95;
    }

    res.json({
        dia,
        seccion: seccion.toUpperCase(),
        cantidad: cantidadNum,
        precio_total: total.toFixed(2)
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});