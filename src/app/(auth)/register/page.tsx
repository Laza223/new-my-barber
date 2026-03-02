/**
 * Página de registro.
 * Se implementa con el formulario en la fase de auth.
 */
export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Creá tu cuenta</h2>
        <p className="text-sm text-muted-foreground">
          Registrate gratis y empezá a gestionar tu barbería.
        </p>
      </div>
      {/* RegisterForm component — se implementa en fase de auth */}
      <p className="text-sm text-muted-foreground">
        Formulario de registro — próxima fase
      </p>
    </div>
  );
}
