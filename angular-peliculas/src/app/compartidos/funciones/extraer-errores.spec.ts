import { extraerErrores } from "./extraer-errores";

describe('extraer-errores', () => {
    it('debe devolver un array vacío si el objeto no tiene errores', () => {
        // Preparar
        const input = { error: { errors: {} } };

        // Probar
        const resultado = extraerErrores(input);

        // Verificar
        expect(resultado).toEqual([]);

    });

    it('debe extraer correctamente los mensajes de error de validación', () => {
        // Preparar
        const input = { error: { errors: {
            nombre: ['es obligatorio', 'primera letra debe ser mayuscula'],
            email: ['no es un email válido']
        } } };

        // Probar
        const resultado = extraerErrores(input);

        // Verificar
        expect(resultado).toEqual([
            'nombre: es obligatorio',
            'nombre: primera letra debe ser mayuscula',
            'email: no es un email válido'
        ]);

    });

    it('debe extraer correctamente el mensaje de error de Not Found()', () => {
        // Preparar
        const input = { error: { status: 404, title: 'Not Found' }};

        // Probar
        const resultado = extraerErrores(input);

        // Verificar
        expect(resultado).toEqual(['Status: 404', 'Title: Not Found']);

    });

    it('debe extraer correctamente el mensaje de error de custom Not Found()', () => {
        // Preparar
        const input = { error: { error: 'Id no encontrado' }};

        // Probar
        const resultado = extraerErrores(input);

        // Verificar
        expect(resultado).toEqual(['Id no encontrado']);

    });
});