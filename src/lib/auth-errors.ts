const ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "Email o contraseña incorrectos",
  "Email not confirmed": "Por favor confirma tu email antes de iniciar sesión",
  "User already registered": "Ya existe una cuenta con este email",
  "Email rate limit exceeded": "Demasiados intentos. Espera unos minutos.",
  "signup_disabled": "El registro está temporalmente deshabilitado",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
  "Unable to validate email address": "El formato del email no es válido",
  "Network request failed": "Sin conexión. Comprueba tu Internet e inténtalo de nuevo.",
  "Failed to fetch": "Sin conexión. Comprueba tu Internet e inténtalo de nuevo.",
};

export function translateAuthError(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    for (const key in ERROR_MAP) {
      if (err.message.includes(key)) return ERROR_MAP[key];
    }
    return err.message || fallback;
  }
  return fallback;
}
