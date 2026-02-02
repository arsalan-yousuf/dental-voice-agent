import { VapiVoiceDemo } from "@/components/VapiVoiceDemo";

const benefits = [
  { label: "24/7 available", icon: "🕐" },
  { label: "Takes no break", icon: "⚡" },
  { label: "Instant answers", icon: "💬" },
  { label: "Book in seconds", icon: "✓" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/bg-dental.jpg)" }}
        aria-hidden
      />
      {/* Light overlay for contrast (glassmorphism: let image show through) */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-lg px-6 py-12 text-center">
        {/* Hero */}
        <header className="space-y-4">
          <p className="text-base font-medium uppercase tracking-wider text-white drop-shadow sm:text-lg">
            Voice Assistant
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Happy Root Dental
          </h1>
          <p className="mx-auto max-w-md text-xl text-white/90 drop-shadow sm:text-2xl">
            Talk to our front desk anytime — book, reschedule, or get answers in seconds.
          </p>
        </header>

        {/* Benefit pills — glassmorphism */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {benefits.map(({ label, icon }) => (
            <span
              key={label}
              className="glass-pill inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2.5 text-base font-medium text-white backdrop-blur-xl sm:text-lg"
            >
              <span aria-hidden>{icon}</span>
              {label}
            </span>
          ))}
        </div>

        {/* CTA card — glassmorphism */}
        <div className="glass-card mt-12 rounded-2xl border border-white/25 bg-white/15 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Try it now
            </h2>
            <p className="mt-2 text-base text-white/80 sm:text-lg">
              One tap to talk. No hold music, no waiting.
            </p>
          </div>
          <div className="mt-8">
            <VapiVoiceDemo />
          </div>
        </div>

        {/* Trust line */}
        {/* <p className="mt-10 text-center text-sm text-white/70 sm:text-base">
          Secure & private. We’re here when you need us.
        </p> */}
      </div>
    </main>
  );
}
