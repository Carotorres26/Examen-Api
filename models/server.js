import express from 'express';
import dbConnection from '../database/config.js';
import 'dotenv/config';
import CuentaRoutes from '../routes/CuentaRoutes.js';


class Server {
    constructor() {
        this.app = express();
        this.listen();
        this.dbConnection();
        this.pathCuenta = '/api/Cuenta';
        this.route();
    }

    async dbConnection() {
        await dbConnection();
    }

    route() {
        this.app.use(express.json()); // Asegúrate de usar express.json()
        this.app.use(this.pathCuenta, CuentaRoutes);
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
}

export default Server;
