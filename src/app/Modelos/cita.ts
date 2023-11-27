
export interface Cita {
    id?: string;
    entrevistadoPor: 'A' | 'B';
    clienteData: {
        nombreCliente: string;
        dniCliente: string;
        telefonoCliente: string;
        emailCliente: string;
    }
    idCliente: string;
    diaCita: string;
    horaCita: string;
    visto?: boolean;
}
