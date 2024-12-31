export function parseBoolean(value: string | null): boolean {
    return value === 'true';
  }
  
export function parseNumber(value: string | null): number | null {
    return value !== null ? Number(value) : null;
  }
  