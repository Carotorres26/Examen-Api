import bcrypt from 'bcryptjs'; // Para encriptar 
import Cuenta from '../models/cuenta.js'; 

export async function getCuenta(req, res) {
    try {
        const cuentas = await Cuenta.find(); // Buscar todas las cuentas en la base de datos
        res.json(cuentas); // Enviar las cuentas como respuesta en formato JSON
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las cuentas' }); // Manejo de errores
    }
}

export async function postCuenta(req, res) {
    const body = req.body;

    // Validacion de que la constraseña de acceso tenga exactamente 4 dígitos
    if (!body.claveAcceso || body.claveAcceso.length !== 4) {
        return res.status(400).json({ message: 'La clave de acceso debe tener exactamente 4 dígitos' });
    }
    try {
        // Encriptar
        const salt = await bcrypt.genSalt(10);
        const claveEncriptada = await bcrypt.hash(body.claveAcceso, salt);

        // Crear una nueva cuenta con los datos del cuerpo
        const cuenta = new Cuenta({
            ...body,
            claveAcceso: claveEncriptada
        });

        await cuenta.save();
        res.status(201).json({ message: 'Cuenta creada exitosamente' });
    } catch (error) {
        res.json({ message: error });
    }
}

export async function consignar(req, res) {
    const { _id, monto } = req.body; // obtiene id y monto desde body
    try {
        const cuenta = await Cuenta.findById(_id); 
        if (!cuenta) {
            return res.status(404).json({ message: 'Cuenta no encontrada' }); 
        }
        cuenta.saldo += monto; // Actualizar el saldo sumando el monto consignado
        await cuenta.save(); 

        res.json({ message: 'Consignación realizada exitosamente', nuevoSaldo: cuenta.saldo }); 
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar la consignación' }); 
    }
}

export async function retirar(req, res) {
    const { _id, monto } = req.body; // obtiene id y monto a retirar desde body
    try {
        const cuenta = await Cuenta.findById(_id); 
        if (!cuenta) {
            return res.status(404).json({ message: 'Cuenta no encontrada' }); 
        }
        if (cuenta.saldo < monto) {
            return res.status(400).json({ message: 'Saldo insuficiente' }); //mirar si hay monto suficiente
        }

        cuenta.saldo -= monto; // Actualiza saldo quitandole el monto que se retiro
        await cuenta.save(); 

        res.json({ message: 'Retiro realizado exitosamente', nuevoSaldo: cuenta.saldo }); 
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el retiro' }); 
    }
}

export async function deleteCuenta(req, res) {
    const _id = req.params.id; 
    try {
        const cuenta = await Cuenta.findByIdAndDelete(_id); 
        if (!cuenta) {
            return res.status(404).json({ message: 'Cuenta no encontrada' }); 
        }
        res.json({ message: 'Cuenta eliminada exitosamente' }); 
    } catch (error) {
        res.status(500).json({ message: 'Problemas al eliminar la cuenta' }); 
    }
}
