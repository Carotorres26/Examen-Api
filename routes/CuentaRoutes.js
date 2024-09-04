import express from 'express';
import { getCuenta, postCuenta, deleteCuenta, consignar, retirar } from '../controllers/CuentaController.js';

const router = express.Router(); 

router.get('/', getCuenta);
router.post('/', postCuenta);
router.delete('/:id', deleteCuenta);
router.post('/consignar', consignar);
router.post('/retirar', retirar);

export default router; // Exportar el enrutador
