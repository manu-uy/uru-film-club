import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

const BASE_PRICE = 2650; // mensual, por cámara
const BIMESTRAL_PRICE = 1380; // por cámara / mes en plan bimestral
const DURATION_DISCOUNTS: Record<number, number> = { 3: 0, 6: 0.03, 12: 0.07 };
const TRANSFER_DISCOUNT = 0.05;

// Endpoint para recibir los pedidos (Formspree / Webhook a Google Sheets)
const FORM_ENDPOINT = "https://formspree.io/f/your-form-id";

const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-UY")} UYU`;


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Club de Fotografía Analógica — Cámaras en Montevideo" },
      {
        name: "description",
        content:
          "Recibí tu cámara desechable en tu puerta, entregá la usada y recibí tus fotos digitales en tu mail. Suscripciones en Montevideo, Uruguay.",
      },
      { property: "og:title", content: "Club de Fotografía Analógica — Montevideo" },
      {
        property: "og:description",
        content:
          "Recibí tu cámara, entregá la usada y recibí tus fotos digitales en tu mail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Marquee() {
  const items = [
    "📸 Club de Fotografía Analógica",
    "Recibí tu cámara",
    "Entregá la usada",
    "Recibí tus fotos digitales en tu mail",
  ];
  const row = items.map((t, i) => (
    <span key={i} className="mx-6 inline-flex items-center gap-6">
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">{t}</span>
      <span aria-hidden>✺</span>
    </span>
  ));
  return (
    <div className="fixed inset-x-0 top-0 z-50 overflow-hidden border-b-2 border-foreground bg-foreground py-2 text-primary-foreground">
      <div className="marquee-track flex w-max whitespace-nowrap">
        <div className="flex">{row}{row}{row}</div>
        <div className="flex" aria-hidden>{row}{row}{row}</div>
      </div>
    </div>
  );
}

function RetroButton({
  children,
  onClick,
  href,
  variant = "solid",
  className = "",
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "solid" | "outline" | "accent";
  className?: string;
  type?: "button" | "submit";
}) {
  const styles =
    variant === "solid"
      ? "bg-foreground text-primary-foreground hover:bg-accent"
      : variant === "accent"
        ? "bg-accent text-accent-foreground hover:bg-foreground"
        : "bg-transparent text-foreground hover:bg-foreground hover:text-primary-foreground";
  const cls = `inline-flex cursor-pointer items-center justify-center border-2 border-foreground px-8 py-4 font-display text-sm uppercase tracking-widest shadow-[4px_4px_0_0_var(--foreground)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--foreground)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${styles} ${className}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function Hero({ logo }: { logo: string | null }) {
  return (
    <section className="flex min-h-[92vh] flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <label
        htmlFor="logo-upload"
        className="group mb-10 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-foreground/40 transition-colors hover:border-foreground sm:h-40 sm:w-40"
        title="Subí tu logo"
      >
        {logo ? (
          <img src={logo} alt="Logo del club" className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
            Subí tu logo
          </span>
        )}
      </label>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
        Montevideo · Uruguay
      </p>
      <h1 className="font-display max-w-4xl text-5xl uppercase leading-[0.95] sm:text-7xl lg:text-8xl">
        Sacá fotos.
        <br />
        <span className="text-accent">Revelamos</span> nosotros.
      </h1>
      <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        Cámaras desechables en tu puerta, canje de la usada y fotos digitales en tu mail. Sin apps, sin filtros. Solo grano.
      </p>
      <div className="mt-10">
        <RetroButton href="#suscripcion" variant="accent">
          Unirme al Club
        </RetroButton>
      </div>
    </section>
  );
}

function TogglePill({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { label: string; value: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
  cols?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2 ${cols === 3 ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`border-2 border-foreground px-4 py-3 text-left text-sm font-semibold transition-colors ${
            value === o.value
              ? "bg-foreground text-primary-foreground"
              : "bg-card hover:bg-secondary"
          }`}
        >
          {o.label}
          {o.hint && (
            <span className={`block text-xs font-medium ${value === o.value ? "text-primary-foreground/70" : "text-accent"}`}>
              {o.hint}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  textarea = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full border-2 border-foreground bg-background px-4 py-3 font-console text-sm outline-none placeholder:text-muted-foreground focus:shadow-[3px_3px_0_0_var(--accent)]";
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-console text-xs uppercase tracking-widest">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function SubscriptionCalculator({ onTransferSelect }: { onTransferSelect: (waMessage: string) => void }) {
  const [freq, setFreq] = useState<"mensual" | "bimestral">("mensual");
  const [cams, setCams] = useState(2);
  const [months, setMonths] = useState(3);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const durDisc = DURATION_DISCOUNTS[months] ?? 0;
  const monthlyPerCam = freq === "bimestral" ? BIMESTRAL_PRICE : BASE_PRICE;
  const afterDuration = monthlyPerCam * (1 - durDisc);
  const monthlyTotal = afterDuration * cams;
  const planTotal = monthlyTotal * months;
  const transferTotal = planTotal * (1 - TRANSFER_DISCOUNT);
  const undiscountedTotal = monthlyPerCam * cams * months;
  const savings = undiscountedTotal - planTotal;

  const waMessage = `Hola! Quiero unirme al Club de Fotografía Analógica. Plan ${freq}: ${cams} cámara(s) por ${months} meses, total ${fmt(transferTotal)} por transferencia. Nombre: ${nombre || "-"}. Dirección: ${direccion || "-"}.`;

  const formValid = nombre.trim() !== "" && email.trim() !== "" && whatsapp.trim() !== "" && direccion.trim() !== "";

  async function submit(method: "mercado_pago" | "transferencia") {
    if (!formValid) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const payload = {
      nombre,
      email,
      whatsapp,
      direccion,
      notas,
      plan: {
        frecuencia: freq,
        camaras: cams,
        meses: months,
        precio_por_camara: Math.round(afterDuration),
        total_mensual: Math.round(monthlyTotal),
        total_plan: Math.round(method === "transferencia" ? transferTotal : planTotal),
      },
      metodo_pago: method,
      fecha: new Date().toISOString(),
    };
    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("sent");
    } catch {
      setStatus("sent");
    }
    if (method === "transferencia") onTransferSelect(waMessage);
  }

  return (
    <section id="suscripcion" className="border-t-2 border-foreground px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 font-console text-xs uppercase tracking-[0.3em] text-accent">Suscripción</p>
        <h2 className="font-display text-4xl uppercase leading-none sm:text-6xl">
          Armá tu plan
        </h2>

        <div className="mt-12 space-y-12">
          <div>
            <p className="mb-4 font-console text-xs uppercase tracking-widest">Frecuencia de entrega</p>
            <TogglePill
              value={freq}
              onChange={(v) => setFreq(v as "mensual" | "bimestral")}
              options={[
                { label: "Mensual", hint: `${fmt(BASE_PRICE)} por cámara/mes`, value: "mensual" },
                { label: "Bimestral", hint: `1 cámara cada 2 meses · ${fmt(BIMESTRAL_PRICE)}/mo`, value: "bimestral" },
              ]}
            />
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <label htmlFor="cams" className="font-console text-xs uppercase tracking-widest">
                Cantidad de cámaras por entrega
              </label>
              <span className="font-console text-4xl font-bold">{cams}</span>
            </div>
            <input
              id="cams"
              type="range"
              min={1}
              max={5}
              step={1}
              value={cams}
              onChange={(e) => setCams(Number(e.target.value))}
              className="retro-range w-full"
            />
            <div className="mt-2 flex justify-between font-console text-xs text-muted-foreground">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>

          <div>
            <p className="mb-4 font-console text-xs uppercase tracking-widest">Duración del plan</p>
            <TogglePill
              cols={3}
              value={String(months)}
              onChange={(v) => setMonths(Number(v))}
              options={[
                { label: "3 meses", hint: "0% OFF", value: "3" },
                { label: "6 meses", hint: "3% OFF", value: "6" },
                { label: "12 meses", hint: "7% OFF", value: "12" },
              ]}
            />
          </div>

          <div className="border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_0_var(--foreground)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-console text-xs uppercase tracking-widest text-muted-foreground">
                  Por mes ({cams} {cams === 1 ? "cámara" : "cámaras"})
                </p>
                <p className="font-console mt-1 text-5xl font-bold text-accent sm:text-6xl">
                  {fmt(monthlyTotal)}
                </p>
                <p className="mt-1 font-console text-xs text-muted-foreground">
                  {fmt(afterDuration)} por cámara
                  {durDisc > 0 && ` · ${Math.round(durDisc * 100)}% OFF por ${months} meses`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-console text-xs uppercase tracking-widest text-muted-foreground">
                  Total del plan ({months} meses)
                </p>
                <p className="font-console mt-1 text-2xl font-bold sm:text-3xl">{fmt(planTotal)}</p>
                {savings > 0.5 && (
                  <p className="mt-1 font-console text-xs text-accent">Ahorrás {fmt(savings)} 🎉</p>
                )}
              </div>
            </div>
            <p className="mt-4 border-t border-foreground/15 pt-4 text-xs text-muted-foreground">
              Incluye cámara desechable + entrega en tu puerta en Montevideo + canje de la cámara usada + revelado completo y digitalización a tu mail.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit("mercado_pago");
            }}
            className="space-y-6"
          >
            <div>
              <p className="font-console text-xs uppercase tracking-[0.3em] text-accent">Datos de entrega</p>
              <h3 className="font-display mt-2 text-2xl uppercase sm:text-3xl">¿Dónde te dejamos la cámara?</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="nombre" label="Nombre" value={nombre} onChange={setNombre} required placeholder="Tu nombre y apellido" />
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail} required placeholder="tumail@ejemplo.com" />
              <Field id="whatsapp" label="WhatsApp" type="tel" value={whatsapp} onChange={setWhatsapp} required placeholder="099 123 456" />
              <Field id="direccion" label="Dirección en Montevideo" value={direccion} onChange={setDireccion} required placeholder="Calle, número, apto, barrio" />
            </div>
            <Field id="notas" label="Notas" value={notas} onChange={setNotas} textarea placeholder="Horarios de entrega, referencias, etc." />

            {status === "error" && (
              <p className="border-2 border-destructive bg-background px-4 py-3 font-console text-xs text-destructive">
                Completá nombre, email, WhatsApp y dirección para continuar.
              </p>
            )}
            {status === "sent" && (
              <p className="border-2 border-foreground bg-secondary px-4 py-3 font-console text-xs">
                ¡Listo! Recibimos tus datos, te escribimos por WhatsApp para coordinar.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <RetroButton type="submit" variant="solid" className="w-full">
                Pagar con Mercado Pago
              </RetroButton>
              <RetroButton
                variant="accent"
                className="w-full"
                onClick={() => void submit("transferencia")}
              >
                Transferencia · 5% OFF!
              </RetroButton>
            </div>
            <p className="font-console text-xs text-muted-foreground">
              Pagando por transferencia: {fmt(transferTotal)} el plan completo ({months} meses).
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}


const STEPS = [
  {
    n: "01",
    title: "Entrega en tu puerta",
    text: "Recibí tu cámara mensual en tu domicilio, sin moverte de casa. Entregas en todo Montevideo.",
  },
  {
    n: "02",
    title: "Canje de cámara usada",
    text: "El cadete retira la cámara usada del mes anterior al entregarte la nueva, sin costo extra.",
  },
  {
    n: "03",
    title: "Fotos a tu mail",
    text: "En menos de 2 semanas tenés los archivos digitales listos, revelados y escaneados por el laboratorio.",
  },
  {
    n: "04",
    title: "Renovación con premio",
    text: "Al finalizar tu plan, renová tu suscripción y obtené $200 UYU de descuento en tu primera cámara.",
  },
];

const FAQS = [
  {
    q: "¿A qué zonas de Montevideo envían?",
    a: "Cubrimos todo Montevideo: Centro, Cordón, Pocitos, Punta Carretas, Buceo, Carrasco, Ciudad Vieja y el resto de los barrios. La entrega y el retiro de la cámara usada están incluidos en el plan.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos Mercado Pago (tarjeta, cuotas o dinero en cuenta) y transferencia bancaria. Pagando por transferencia tenés un 5% de descuento extra sobre tu plan.",
  },
  {
    q: "¿Cuánto tarda la digitalización?",
    a: "Menos de 2 semanas desde que retiramos tu cámara usada. Recibís todos los archivos digitales en alta resolución directamente en tu mail.",
  },
];

function HowItWorks() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="border-t-2 border-foreground bg-secondary px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">El sistema del club</p>
        <h2 className="font-display text-4xl uppercase leading-tight sm:text-6xl">
          ¿Cómo funciona el Club?
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0_0_var(--foreground)]">
              <p className="font-display text-sm text-accent">{s.n}</p>
              <p className="font-display mt-2 text-xl uppercase leading-tight">{s.title}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest">Preguntas frecuentes</p>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border-2 border-foreground bg-card">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-display text-sm uppercase tracking-wide sm:text-base">{f.q}</span>
                  <span className="font-display text-xl">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && (
                  <p className="border-t-2 border-foreground/10 px-5 pb-5 pt-4 text-sm text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  ariaLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto border-2 border-foreground bg-card p-6 shadow-[8px_8px_0_0_var(--foreground)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl uppercase leading-tight">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 border-2 border-foreground px-3 py-1 font-display text-sm transition-colors hover:bg-foreground hover:text-primary-foreground"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function PaymentModal({
  open,
  onClose,
  waMessage,
}: {
  open: boolean;
  onClose: () => void;
  waMessage: string;
}) {
  const waUrl = `https://wa.me/59899123456?text=${encodeURIComponent(waMessage)}`;
  return (
    <Modal open={open} onClose={onClose} title="Pago por transferencia" ariaLabel="Datos de transferencia bancaria">
      <p className="text-sm text-muted-foreground">
        Transferí el total de tu plan a cualquiera de estas cuentas:
      </p>
      <div className="mt-6 space-y-4">
        <div className="border-2 border-foreground bg-background p-4">
          <p className="font-display text-sm uppercase">BROU</p>
          <p className="mt-1 text-sm">Titular: Club Analógico UY</p>
          <p className="text-sm">Cuenta $: 001-123456-789</p>
        </div>
        <div className="border-2 border-foreground bg-background p-4">
          <p className="font-display text-sm uppercase">Itaú</p>
          <p className="mt-1 text-sm">Titular: Club Analógico UY</p>
          <p className="text-sm">Cuenta $: 987-654321-0</p>
        </div>
      </div>
      <div className="mt-6 border-2 border-dashed border-foreground/40 p-4 text-sm">
        <p className="font-semibold">Último paso 📲</p>
        <p className="mt-1 text-muted-foreground">
          Enviános el comprobante por WhatsApp y activamos tu suscripción en el día.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <RetroButton href={waUrl} variant="accent" className="w-full">
          Enviar por WhatsApp
        </RetroButton>
        <RetroButton variant="outline" className="w-full" onClick={onClose}>
          Cerrar
        </RetroButton>
      </div>
    </Modal>
  );
}

const LEGAL_CONTENT: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: "Términos y Condiciones",
    body: [
      "Al suscribirte al Club de Fotografía Analógica aceptás estos términos.",
      "La suscripción incluye la cantidad de cámaras seleccionadas por entrega, el retiro de la cámara usada del período anterior y el revelado con digitalización completa de cada rollo.",
      "Los pagos se procesan por Mercado Pago o transferencia bancaria. El plan se activa una vez acreditado el primer pago.",
      "Las cámaras no devueltas al momento del canje podrán generar un costo adicional equivalente al valor de reposición.",
      "Podés cancelar tu suscripción con 15 días de aviso antes de la próxima entrega. Los períodos ya abonados no son reembolsables.",
    ],
  },
  shipping: {
    title: "Políticas de Envío",
    body: [
      "Realizamos entregas y retiros sin costo en todo Montevideo, Uruguay.",
      "Las entregas se coordinan por WhatsApp dentro de un rango horario acordado. El cadete retira la cámara usada al momento de entregar la nueva.",
      "Si no estás en tu domicilio, podés reprogramar la entrega una vez sin costo. Reprogramaciones adicionales pueden tener un recargo.",
      "Por el momento no realizamos envíos fuera de Montevideo.",
    ],
  },
  subscription: {
    title: "Condiciones de Suscripción",
    body: [
      "Planes disponibles: mensual (1 entrega por mes) y bimestral (1 entrega cada 2 meses).",
      "Duraciones de 3, 6 y 12 meses, con descuentos del 3% y 7% en los planes de 6 y 12 meses respectivamente.",
      "El pago por transferencia bancaria otorga un 5% de descuento adicional.",
      "Al renovar tu plan completo, obtenés $200 UYU de descuento en la primera cámara del nuevo período.",
      "Las fotos digitales se entregan por mail en menos de 2 semanas desde el retiro de cada cámara.",
    ],
  },
};

function Footer({ onOpenLegal }: { onOpenLegal: (key: string) => void }) {
  const links = [
    { key: "terms", label: "Términos y Condiciones" },
    { key: "shipping", label: "Políticas de Envío" },
    { key: "subscription", label: "Condiciones de Suscripción" },
  ];
  return (
    <footer className="border-t-2 border-foreground bg-foreground px-6 py-10 text-primary-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-sm uppercase tracking-widest">Club de Fotografía Analógica</p>
          <p className="mt-1 text-xs opacity-70">Montevideo, Uruguay. All rights reserved.</p>
        </div>
        <nav className="flex flex-col items-center gap-2 sm:items-end" aria-label="Legal">
          {links.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => onOpenLegal(l.key)}
              className="cursor-pointer text-xs uppercase tracking-widest opacity-80 underline-offset-4 transition-opacity hover:underline hover:opacity-100"
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}

function Index() {
  const [logo, setLogo] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [waMessage, setWaMessage] = useState("");
  const [legal, setLegal] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Marquee />
      <input
        ref={fileRef}
        id="logo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && f.size < 5 * 1024 * 1024) setLogo(URL.createObjectURL(f));
        }}
      />
      <main>
        <Hero logo={logo} />
        <SubscriptionCalculator
          onTransferSelect={(msg) => {
            setWaMessage(msg);
            setModalOpen(true);
          }}
        />
        <HowItWorks />
      </main>
      <Footer onOpenLegal={setLegal} />
      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} waMessage={waMessage} />
      <Modal
        open={legal !== null}
        onClose={() => setLegal(null)}
        title={legal ? (LEGAL_CONTENT[legal]?.title ?? "") : ""}
        ariaLabel={legal ? (LEGAL_CONTENT[legal]?.title ?? "Información legal") : "Información legal"}
      >
        {legal && (
          <div className="space-y-3">
            {(LEGAL_CONTENT[legal]?.body ?? []).map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
