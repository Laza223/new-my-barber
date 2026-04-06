/**
 * Términos y Condiciones — My Barber.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — My Barber',
  robots: 'noindex, nofollow',
};

export default function TermsPage() {
  return (
    <div className="from-background via-background to-primary/5 min-h-screen bg-gradient-to-br">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight"
          >
            <span className="text-primary">My</span>{' '}
            <span className="text-foreground">Barber</span>
          </Link>
        </div>

        <article className="prose prose-zinc dark:prose-invert prose-headings:font-display max-w-none">
          <h1>Términos y Condiciones de Uso</h1>
          <p className="text-muted-foreground text-sm">
            Última actualización: Marzo 2026
          </p>

          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al registrarte y utilizar la plataforma My Barber (&quot;el
            Servicio&quot;), aceptás estos Términos y Condiciones
            (&quot;Términos&quot;) en su totalidad. Si no estás de acuerdo, no
            debés utilizar el Servicio.
          </p>
          <p>
            My Barber es una plataforma de gestión financiera y operativa
            diseñada para barberías, ofrecida como servicio de software (SaaS).
          </p>

          <h2>2. Descripción del Servicio</h2>
          <p>My Barber permite a los usuarios:</p>
          <ul>
            <li>Registrar ventas y gestionar la facturación de su barbería.</li>
            <li>Administrar profesionales, servicios y comisiones.</li>
            <li>Acceder a reportes, estadísticas e insights de negocio.</li>
            <li>Gestionar suscripciones y planes de pago.</li>
          </ul>
          <p>
            El Servicio se ofrece &quot;tal cual&quot; y está sujeto a
            disponibilidad. Nos reservamos el derecho de modificar, suspender o
            discontinuar cualquier funcionalidad con previo aviso.
          </p>

          <h2>3. Registro y Cuenta</h2>
          <ul>
            <li>
              Debés proporcionar información verídica y actualizada al
              registrarte.
            </li>
            <li>
              Sos responsable de mantener la confidencialidad de tus
              credenciales de acceso.
            </li>
            <li>Cada cuenta está destinada a un solo usuario o negocio.</li>
            <li>Debés tener al menos 18 años para crear una cuenta.</li>
          </ul>

          <h2>4. Planes y Pagos</h2>
          <p>
            My Barber ofrece diferentes planes de suscripción (Free, Individual,
            Business). Los precios están expresados en pesos argentinos (ARS) e
            incluyen IVA cuando corresponda.
          </p>
          <ul>
            <li>
              <strong>Período de prueba:</strong> Al registrarte, accedés a un
              período de prueba gratuito de 14 días con todas las funciones
              habilitadas.
            </li>
            <li>
              <strong>Facturación:</strong> Los pagos se procesan a través de
              MercadoPago. Al suscribirte a un plan pago, autorizás el cobro
              mensual según el plan seleccionado.
            </li>
            <li>
              <strong>Cancelación:</strong> Podés cancelar tu suscripción en
              cualquier momento desde la sección de Ajustes. El acceso al plan
              pago se mantiene hasta el final del período facturado.
            </li>
            <li>
              <strong>Reembolsos:</strong> No se realizan reembolsos por
              períodos parciales. Si cancelás a mitad de mes, mantenés el acceso
              hasta el final del período pagado.
            </li>
          </ul>

          <h2>5. Uso Aceptable</h2>
          <p>Te comprometés a:</p>
          <ul>
            <li>
              Utilizar el Servicio únicamente para fines legales y legítimos
              relacionados con la gestión de tu barbería.
            </li>
            <li>No intentar acceder a datos de otros usuarios o barberías.</li>
            <li>
              No reproducir, distribuir o explotar comercialmente el Servicio.
            </li>
            <li>
              No utilizar herramientas automatizadas para acceder al Servicio
              sin autorización.
            </li>
          </ul>

          <h2>6. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de My Barber (código, diseño, marca, textos) es
            propiedad de My Barber y está protegido por las leyes de propiedad
            intelectual de la República Argentina y tratados internacionales.
          </p>
          <p>
            Los datos que cargues en la plataforma (ventas, clientes, servicios)
            son de tu propiedad. My Barber no reclama derechos sobre tus datos.
          </p>

          <h2>7. Limitación de Responsabilidad</h2>
          <p>
            My Barber no es un sistema contable ni reemplaza la asesoría
            profesional contable, legal o impositiva. Los reportes y datos
            proporcionados son orientativos para la gestión interna de tu
            negocio.
          </p>
          <p>
            En la máxima medida permitida por la ley, My Barber no será
            responsable por:
          </p>
          <ul>
            <li>Pérdida de datos por causas ajenas a nuestro control.</li>
            <li>Interrupciones temporales del Servicio.</li>
            <li>
              Decisiones comerciales tomadas en base a los datos de la
              plataforma.
            </li>
            <li>Buenos pagos por el uso indebido de tus credenciales.</li>
          </ul>

          <h2>8. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos. En caso de
            cambios sustanciales, te notificaremos por email con al menos 15
            días de anticipación. El uso continuado del Servicio después de la
            notificación constituye aceptación de los nuevos Términos.
          </p>

          <h2>9. Cuenta y Baja</h2>
          <p>
            Podés solicitar la eliminación de tu cuenta y todos tus datos en
            cualquier momento desde la sección de Ajustes o contactando a{' '}
            <a href="mailto:soporte@mybarber.com.ar">soporte@mybarber.com.ar</a>
            . La eliminación será procesada dentro de los 30 días hábiles.
          </p>

          <h2>10. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos Términos se rigen por las leyes de la República Argentina.
            Ante cualquier controversia, las partes se someten a la jurisdicción
            de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
          </p>

          <h2>11. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, podés escribirnos a:{' '}
            <a href="mailto:soporte@mybarber.com.ar">soporte@mybarber.com.ar</a>
          </p>

          <hr />

          <p className="text-muted-foreground text-sm">
            <Link href="/register" className="text-primary hover:underline">
              ← Volver al registro
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
