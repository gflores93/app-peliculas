export function extraerErrores(obj: any): string[] {
    const err = obj.error.errors;

    let mensajesDeError: string[] = [];

    for (let llave in err) {
        let campo = llave;
        // creates a new array of elements with string format of "campo : mensaje"
        const mensajesConCampos = err[llave].map((mensaje: string) => `${campo}: ${mensaje}`);
        mensajesDeError = mensajesDeError.concat(mensajesConCampos);
    }

    return mensajesDeError;
}