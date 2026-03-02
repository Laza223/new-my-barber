/**
 * Wizard de onboarding — 5 pasos.
 * Se accede post-registro. Si ya completó → redirect a dashboard.
 */
export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Configurá tu barbería</h1>
          <p className="text-muted-foreground">
            En 5 pasos vas a tener todo listo para empezar.
          </p>
        </div>
        {/* OnboardingWizard component — se implementa en fase de onboarding */}
        <p className="text-center text-sm text-muted-foreground">
          Wizard de onboarding — próxima fase
        </p>
      </div>
    </div>
  );
}
