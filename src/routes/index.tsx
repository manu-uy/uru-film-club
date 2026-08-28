import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

const BASE_PRICE = 2500;
const TRANSFER_PRICE = 2375;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Club de Fotografía Analógica — Rollos y Cámaras en Montevideo" },
      {
        name: "description",
        content:
          "Suscripción mensual de cámaras desechables con revelado y digitalización incluidos. Entregas en Montevideo, Uruguay.",
      },
      { property: "og:title", content: "Club de Fotografía Analógica — Montevideo" },
      {
        property: "og:description",
        content:
          "Rollos y cámaras desechables directo a tu puerta. Revelado y digitalización incluidos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Archivo+Black&display=swap",
      },
    ],
  }),
  component: Index,
});

function Marquee() {
  const items = [
    "📸 Club de Fotografía Analógica",
    "Rollos y Cámaras Desechables directo a tu puerta",
    "Entregas en Montevideo",
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
        Cámaras desechables y rollos en tu puerta cada mes, con revelado y digitalización incluidos. Sin apps, sin filtros. Solo grano.
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
}: {
  options: { label: string; value: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
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

function SubscriptionCalculator({ onTransferSelect }: { onTransferSelect: () => void }) {
  const [cams, setCams] = useState(2);
  const [months, setMonths] = useState(3);
  const [payMethod, setPayMethod] = useState<"mp" | "transfer">("mp");

  const pricePerCam = payMethod === "transfer" ? TRANSFER_PRICE : BASE_PRICE;
  const total = cams * months * pricePerCam;
  const fmt = (n: number) => `$${n.toLocaleString("es-UY")} UYU`;

  return (
    <section id="suscripcion" className="border-t-2 border-foreground px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Suscripción mensual</p>
        <h2 className="font-display text-4xl uppercase leading-none sm:text-6xl">
          Armá tu plan
        </h2>

        <div className="mt-12 space-y-12">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <label htmlFor="cams" className="text-sm font-semibold uppercase tracking-widest">
                ¿Cuántas cámaras desechables por mes?
              </label>
              <span className="font-display text-4xl">{cams}</span>
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
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest">Duración del plan</p>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`border-2 border-foreground py-3 font-display text-sm uppercase transition-colors ${
                    months === m ? "bg-foreground text-primary-foreground" : "bg-card hover:bg-secondary"
                  }`}
                >
                  {m} meses
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest">Método de pago</p>
            <TogglePill
              value={payMethod}
              onChange={(v) => {
                setPayMethod(v as "mp" | "transfer");
                if (v === "transfer") onTransferSelect();
              }}
              options={[
                { label: "Mercado Pago", hint: "Tarjeta / Cuotas", value: "mp" },
                { label: "Transferencia Bancaria", hint: "5% OFF EXTRA!", value: "transfer" },
              ]}
            />
          </div>

          <div className="border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_0_var(--foreground)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Precio por cámara / mes
                </p>
                <p className="font-display mt-1 text-5xl text-accent sm:text-6xl">
                  {fmt(pricePerCam)}
                </p>
                {payMethod === "transfer" && (
                  <p className="mt-1 text-sm font-semibold text-accent">
                    Ahorrás {fmt((BASE_PRICE - TRANSFER_PRICE) * cams * months)} en total 🎉
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Total del plan ({cams}×{months})
                </p>
                <p className="font-display mt-1 text-2xl sm:text-3xl">{fmt(total)}</p>
              </div>
            </div>
            <p className="mt-4 border-t border-foreground/15 pt-4 text-xs text-muted-foreground">
              Incluye cámara desechable + entrega en tu puerta + revelado completo y digitalización del laboratorio.
            </p>
            <div className="mt-6">
              <RetroButton variant="solid" className="w-full sm:w-auto">
                Confirmar Suscripción
              </RetroButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCalculator() {
  const [guests, setGuests] = useState(80);
  const [form, setForm] = useState({ name: "", date: "", email: "", notes: "" });
  const [sent, setSent] = useState(false);

  const cameras = Math.max(1, Math.ceil(guests / 10));
  const total = cameras * BASE_PRICE;
  const fmt = (n: number) => `$${n.toLocaleString("es-UY")} UYU`;

  const valid =
    form.name.trim().length > 0 &&
    form.date.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  return (
    <section className="border-t-2 border-foreground bg-secondary px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Eventos</p>
        <h2 className="font-display text-4xl uppercase leading-tight sm:text-6xl">
          Cámaras para tu evento o casamiento
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Una cámara por cada 10 invitados, con stickers personalizados y revelado + digitalización incluidos.
        </p>

        <div className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <label htmlFor="guests" className="text-sm font-semibold uppercase tracking-widest">
              Cantidad de invitados
            </label>
            <span className="font-display text-4xl">{guests}</span>
          </div>
          <input
            id="guests"
            type="range"
            min={20}
            max={200}
            step={5}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="retro-range w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>20</span><span>200</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0_0_var(--foreground)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cámaras necesarias</p>
            <p className="font-display mt-1 text-5xl">{cameras}</p>
          </div>
          <div className="border-2 border-foreground bg-card p-6 shadow-[4px_4px_0_0_var(--foreground)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Costo total estimado</p>
            <p className="font-display mt-1 text-5xl text-accent">{fmt(total)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Incluye stickers personalizados + revelado y digitalización</p>
          </div>
        </div>

        {sent ? (
          <div className="mt-10 border-2 border-foreground bg-card p-8 text-center shadow-[6px_6px_0_0_var(--foreground)]">
            <p className="font-display text-2xl uppercase">¡Reserva enviada! 🎞️</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Te contactamos por email dentro de las próximas 24 horas para confirmar disponibilidad.
            </p>
          </div>
        ) : (
          <form
            className="mt-10 border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_0_var(--foreground)] sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) setSent(true);
            }}
          >
            <p className="font-display mb-6 text-lg uppercase">Solicitá tu reserva</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ev-name" className="mb-1 block text-xs font-semibold uppercase tracking-widest">Nombre</label>
                <input
                  id="ev-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="ev-date" className="mb-1 block text-xs font-semibold uppercase tracking-widest">Fecha del evento</label>
                <input
                  id="ev-date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ev-email" className="mb-1 block text-xs font-semibold uppercase tracking-widest">Email</label>
                <input
                  id="ev-email"
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="tu@email.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ev-notes" className="mb-1 block text-xs font-semibold uppercase tracking-widest">Notas</label>
                <textarea
                  id="ev-notes"
                  rows={3}
                  maxLength={1000}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full resize-none border-2 border-foreground bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tipo de evento, colores para los stickers, etc."
                />
              </div>
            </div>
            <div className="mt-6">
              <RetroButton type="submit" variant="accent" className="w-full sm:w-auto">
                Solicitar Reserva
              </RetroButton>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function PaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Datos de transferencia bancaria"
    >
      <div
        className="w-full max-w-md border-2 border-foreground bg-card p-6 shadow-[8px_8px_0_0_var(--foreground)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl uppercase leading-tight">Pago por transferencia</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 border-2 border-foreground px-3 py-1 font-display text-sm transition-colors hover:bg-foreground hover:text-primary-foreground"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
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
            Enviános el comprobante por WhatsApp al{" "}
            <a href="https://wa.me/59899123456" className="font-semibold text-accent underline" target="_blank" rel="noreferrer">
              099 123 456
            </a>{" "}
            y activamos tu suscripción en el día.
          </p>
        </div>
        <div className="mt-6">
          <RetroButton variant="solid" className="w-full" onClick={onClose}>
            Entendido
          </RetroButton>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground px-6 py-10 text-primary-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="font-display text-sm uppercase tracking-widest">Club de Fotografía Analógica</p>
        <p className="text-xs opacity-70">Montevideo, Uruguay — Hecho con grano, no con píxeles.</p>
      </div>
    </footer>
  );
}

function Index() {
  const [logo, setLogo] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
        <SubscriptionCalculator onTransferSelect={() => setModalOpen(true)} />
        <EventCalculator />
      </main>
      <Footer />
      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
