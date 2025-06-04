const express = require("express");
const router = express.Router();
const client = require("../../../../db");


router.get('/payroll/lock', async (req, res) => {
    const { week_number, year } = req.query;

    try {
        // Buscar el registro
        const result = await client.query(
            'SELECT is_locked FROM employee_payroll_status WHERE week_number = $1 AND year = $2',
            [week_number, year]
        );

        if (result.rows.length > 0) {
            // Si existe, devolver el estado de bloqueo
            res.status(200).json({ is_locked: result.rows[0].is_locked });
        } else {
            // Si no existe, crear un registro con is_locked = false
            await client.query(
                'INSERT INTO employee_payroll_status (week_number, year, is_locked) VALUES ($1, $2, $3)',
                [week_number, year, false]
            );
            res.status(200).json({ is_locked: false });
        }
    } catch (error) {
        console.error('Error al consultar o crear el estado de bloqueo:', error);
        res.status(500).json({ error: 'Error al consultar o crear el estado de bloqueo.' });
    }
});


router.post('/payroll/lock', async (req, res) => {
    const { week_number, year, is_locked } = req.body;

    try {
        await client.query(
            `INSERT INTO employee_payroll_status (week_number, year, is_locked)
             VALUES ($1, $2, $3)
             ON CONFLICT (week_number, year)
             DO UPDATE SET is_locked = $3`,
            [week_number, year, is_locked]
        );

        res.status(200).send({ message: 'Estado de bloqueo actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar el estado de bloqueo:', error);
        res.status(500).send({ error: 'Error al actualizar el estado de bloqueo.' });
    }
});

module.exports = router;