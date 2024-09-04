import { Schema, model } from 'mongoose';

const cuentaSchema = new Schema({
  numeroCuenta: { 
    type: Number, 
    unique: true, 
    required: true 
  },
  documentoCliente: { 
    type: String, 
    required: true 
  },
  fechaApertura: { 
    type: Date, 
    default: Date.now // Si no se proporciona una fecha usa la actual
  },
  saldo: { 
    type: Number, 
    default: 0, 
    required: true
  },
  claveAcceso: { 
    type: String, 
    required: true 
  },
});

cuentaSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastCuenta = await this.constructor.findOne().sort({ numeroCuenta: -1 });//lo qeu hace es buscar la cuenta con el nmero mas alto
    this.numeroCuenta = lastCuenta ? lastCuenta.numeroCuenta + 1 : 1;//lo que hace es que si ya hay una cuenta pues suma 1 y si no pues empiea en uno
  }
  next();//aqui guardaa!!!
});

export default model('Cuenta', cuentaSchema, 'cuenta');
