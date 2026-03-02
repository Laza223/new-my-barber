/**
 * Página de login.
 * Se implementa con el formulario en la fase de auth.
 */
export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Iniciá sesión</h2>
        <p className="text-sm text-muted-foreground">
          Ingresá tu email y contraseña para acceder.
        </p>
      </div>
      {/* LoginForm component — se implementa en fase de auth */}
      <p className="text-sm text-muted-foreground">
        Formulario de login — próxima fase
      </p>
    </div>
  );
}
