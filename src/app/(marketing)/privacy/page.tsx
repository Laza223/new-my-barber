/**
 * Política de Privacidad — My Barber.
 */
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad — My Barber',
  robots: 'noindex, nofollow',
};

export default function PrivacyPage() {
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
          <h1>Política de Privacidad</h1>
          <p className="text-muted-foreground text-sm">
            Última actualización: Marzo 2026
          </p>

          <p>
            En My Barber nos tomamos la privacidad en serio. Esta Política
            explica qué datos recopilamos, cómo los usamos y cuáles son tus
            derechos. Al utilizar nuestro servicio, aceptás las prácticas
            descritas en esta Política de Privacidad.
          </p>

          <h2>1. Datos que Recopilamos</h2>

          <h3>1.1 Datos de la cuenta</h3>
          <p>Al registrarte, recopilamos:</p>
          <ul>
            <li>
              <strong>Nombre completo</strong> — para personalizar tu
              experiencia.
            </li>
            <li>
              <strong>Dirección de email</strong> — para autenticación y
              comunicaciones transaccionales.
            </li>
            <li>
              <strong>Contraseña</strong> — almacenada de forma encriptada
              (hash). Nunca tenemos acceso a tu contraseña en texto plano.
            </li>
          </ul>

          <h3>1.2 Datos de la barbería</h3>
          <p>Para el funcionamiento del servicio, recopilamos:</p>
          <ul>
            <li>Nombre de la barbería, dirección y teléfono.</li>
            <li>Servicios ofrecidos (nombre, precio, duración).</li>
            <li>Profesionales (nombre, tasa de comisión).</li>
            <li>
              Registros de ventas (monto, método de pago, fecha, profesional,
              servicio).
            </li>
            <li>Promociones y descuentos configurados.</li>
          </ul>

          <h3>1.3 Datos de pago</h3>
          <p>
            Los pagos de suscripción se procesan a través de{' '}
            <strong>MercadoPago</strong>. My Barber <strong>no</strong> almacena
            datos de tarjetas de crédito ni información financiera sensible.
            MercadoPago procesa los pagos conforme a sus propios términos y
            estándares de seguridad (PCI-DSS).
          </p>

          <h3>1.4 Datos de uso</h3>
          <p>
            Recopilamos datos anónimos de uso para mejorar el servicio, como
            páginas visitadas, acciones realizadas, y datos de rendimiento. Para
            esto utilizamos herramientas de análisis (Vercel Analytics, Sentry).
          </p>

          <h2>2. Cómo Usamos tus Datos</h2>
          <p>Utilizamos tus datos exclusivamente para:</p>
          <ul>
            <li>
              <strong>Operar el servicio:</strong> mostrar tu dashboard,
              registrar ventas, generar reportes.
            </li>
            <li>
              <strong>Comunicaciones transaccionales:</strong> emails de
              verificación, alertas de vencimiento de trial, confirmaciones de
              pago.
            </li>
            <li>
              <strong>Soporte técnico:</strong> resolver incidencias y
              consultas.
            </li>
            <li>
              <strong>Mejora del producto:</strong> estadísticas anónimas y
              agregadas para entender cómo se usa la plataforma.
            </li>
          </ul>
          <p>
            <strong>No vendemos</strong> tus datos a terceros.{' '}
            <strong>No usamos</strong> tus datos para publicidad.
            <strong> No compartimos</strong> información de tu barbería con
            otros usuarios.
          </p>

          <h2>3. Almacenamiento y Seguridad</h2>
          <ul>
            <li>
              Los datos se almacenan en servidores seguros proporcionados por{' '}
              <strong>Neon</strong> (PostgreSQL) y <strong>Vercel</strong>.
            </li>
            <li>
              Las contraseñas se almacenan con hash criptográfico (bcrypt).
            </li>
            <li>
              Las sesiones utilizan cookies httpOnly y secure en producción.
            </li>
            <li>La comunicación se realiza mediante HTTPS (TLS 1.3).</li>
            <li>
              Implementamos headers de seguridad estándar (X-Frame-Options, CSP,
              etc.).
            </li>
          </ul>

          <h2>4. Compartir Datos con Terceros</h2>
          <p>Solo compartimos datos con:</p>
          <ul>
            <li>
              <strong>MercadoPago:</strong> email del usuario para procesar
              pagos de suscripción.
            </li>
            <li>
              <strong>Resend:</strong> email del usuario para envío de emails
              transaccionales.
            </li>
            <li>
              <strong>Sentry:</strong> datos técnicos anónimos para monitoreo de
              errores.
            </li>
            <li>
              <strong>Vercel:</strong> hosting y analytics anónimos.
            </li>
          </ul>
          <p>
            Estos proveedores procesan datos únicamente según nuestras
            instrucciones y conforme a sus respectivas políticas de privacidad.
          </p>

          <h2>5. Tus Derechos</h2>
          <p>
            Conforme a la Ley N° 25.326 de Protección de Datos Personales de la
            República Argentina, tenés derecho a:
          </p>
          <ul>
            <li>
              <strong>Acceder</strong> a tus datos personales almacenados.
            </li>
            <li>
              <strong>Rectificar</strong> datos inexactos o incompletos.
            </li>
            <li>
              <strong>Eliminar</strong> tu cuenta y todos los datos asociados.
            </li>
            <li>
              <strong>Oponerte</strong> al tratamiento de tus datos en ciertos
              casos.
            </li>
          </ul>
          <p>
            Para ejercer estos derechos, contactanos a{' '}
            <a href="mailto:soporte@mybarber.com.ar">soporte@mybarber.com.ar</a>
            . Responderemos dentro de los 10 días hábiles.
          </p>

          <h2>6. Retención de Datos</h2>
          <ul>
            <li>Mantenemos tus datos mientras tu cuenta esté activa.</li>
            <li>
              Si eliminás tu cuenta, tus datos serán eliminados dentro de los 30
              días hábiles.
            </li>
            <li>
              Podemos conservar registros anonimizados con fines estadísticos.
            </li>
          </ul>

          <h2>7. Cookies</h2>
          <p>My Barber utiliza cookies estrictamente necesarias para:</p>
          <ul>
            <li>Mantener tu sesión activa (cookie de autenticación).</li>
            <li>Recordar tus preferencias de configuración.</li>
          </ul>
          <p>
            No utilizamos cookies de tracking publicitario ni cookies de
            terceros con fines comerciales.
          </p>

          <h2>8. Menores de Edad</h2>
          <p>
            My Barber no está dirigido a menores de 18 años. No recopilamos
            intencionalmente datos de menores. Si creés que un menor se registró
            en la plataforma, contactanos para que eliminemos su cuenta.
          </p>

          <h2>9. Cambios a esta Política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta Política de Privacidad.
            En caso de cambios sustanciales, te notificaremos por email con al
            menos 15 días de anticipación.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para consultas sobre privacidad y protección de datos, escribinos a:{' '}
            <a href="mailto:soporte@mybarber.com.ar">soporte@mybarber.com.ar</a>
          </p>
          <p>
            Autoridad de control: Agencia de Acceso a la Información Pública
            (AAIP) —{' '}
            <a
              href="https://www.argentina.gob.ar/aaip"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.argentina.gob.ar/aaip
            </a>
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
