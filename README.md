# Analogue Uruguay

Create a single-page web app for an analog photography brand in Uruguay. Inspired by the clean, minimal, bold design of doughguy.co. Use warm neutral tones (cream, beige, dark charcoal text) and sharp typography.

Include the following sections:

1. Top Announcement Bar / Marquee: A moving text banner at the top with: '📸 Club de Fotografía Analógica — Rollos y Cámaras Desechables directo a tu puerta — Entregas en Montevideo'. 2. Hero Section: Clean landing space to upload my logo, a bold main slogan, and a quick CTA button ('Unirme al Club'). 3. Subscription Calculator (Slider Section): - Slider 1: '¿Cuántas cámaras desechables por mes?' (Range: 1 to 5). - Slider 2: 'Duración del plan' (Options: 3 meses, 6 meses, 12 meses). - Dynamic Price Display: Shows price per camera/month. Base price is $2.500 UYU / cámara (includes disposable camera + doorstep delivery + full lab developing & digitalizing). - Payment method toggle: 'Mercado Pago (Tarjeta/Cuotas)' vs 'Transferencia Bancaria (5% OFF EXTRA!)'. If Transferencia is selected, reduce the price to $2.375 UYU / cámara. - CTA Button: 'Confirmar Suscripción'. 4. Event / Wedding Calculator Section: - Title: 'Cámaras para Tu Evento o Casamiento'. - Slider: 'Cantidad de invitados' (Range: 20 to 200). Logic: Automatically calculates 1 camera per 10 guests. - Shows total cameras needed, total cost (including custom stickers + full developing/digitalizing service), and an inquiry form (Name, Date, Email, Notes) with a 'Solicitar Reserva' button. 5. Payment Info Modal: When clicking payment by Transfer, open a modal with bank details (BROU / Itaú) and instructions to upload receipt via WhatsApp.

Keep UI ultra simple, high-contrast, modern retro aesthetic, and fully responsive for mobile.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/13ec9b62-d0e7-4a08-921f-aae87a124ea2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
