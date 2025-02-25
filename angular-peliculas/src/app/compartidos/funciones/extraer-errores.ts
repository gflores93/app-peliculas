export function extraerErrores(obj: any): string[] {
    const err = obj?.error?.errors;
    let mensajesDeError: string[] = [];

    if (err) {
        // Handle validation errors
        for (let llave in err) {
            let campo = llave;
            // Creates a new array of elements with string format of "campo : mensaje"
            const mensajesConCampos = err[llave].map((mensaje: string) => `${campo}: ${mensaje}`);
            mensajesDeError = mensajesDeError.concat(mensajesConCampos);
        }
    }
    else if (obj?.error?.error) { 
        // Handle custom error message from NotFound() 
        mensajesDeError.push(obj.error.error);
    }
    else {
        // Handle default error structure for NotFound() and other cases 
        if (obj?.error?.status) { mensajesDeError.push(`Status: ${obj.error.status}`); } 
        if (obj?.error?.title) { mensajesDeError.push(`Title: ${obj.error.title}`); }
    }

    return mensajesDeError;
}

export function extraerErroresIdentity(obj: any): string[] {
    let mensajesDeError: string[] = [];

    for (let i = 0; i < obj.error.length; i++) {
        const elemento = obj.error[i];
        mensajesDeError.push(elemento.description);
    }

    return mensajesDeError;
    
}