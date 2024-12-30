export interface ActorDTO {
    id: number;
    nombre: string;
    fechaNacimiento: Date;
    foto?: string;
}

export interface ActorCreactionDTO {
    nombre: string;
    fechaNacimiento: Date;
    foto?: File;
}