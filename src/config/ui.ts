export const fontStack =
  'var(--font-archivo), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const ACCENT = "#0080ff";

export const ui = {
  fontFamily: 'var(--font-archivo), ui-sans-serif, system-ui, sans-serif',
  fontStack,

  accentColor: ACCENT,
  gradientText: "text-[#0080ff]",
  gradientBg: "bg-[#0080ff]",
  gradientBorder: "border-[#0080ff]",

  colors: {
    primary: ACCENT,
    primaryDark: "#003fb3",
    text: "#0a0a0a",
    muted: "#6b7280",
    border: "#e5e7eb",
    surface: "#ffffff",
    surfaceHover: "#f8fafc",
  },

  sizes: {
    heroTitle: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
    heroSubtitle: "text-base sm:text-lg md:text-xl",
    sectionTitle: "text-3xl sm:text-4xl md:text-5xl",
    sectionText: "text-base sm:text-base md:text-lg",
    cardTitle: "text-lg sm:text-xl md:text-2xl",
    cardText: "text-sm sm:text-base",
    navbarLogo: "text-xl sm:text-xl md:text-2xl",
    navbarLink: "text-sm sm:text-sm md:text-base",
    pageTitle: "text-2xl sm:text-4xl md:text-5xl",
    pageHeadlines: "text-xl sm:text-2xl md:text-3xl",
    pageText: "text-base sm:text-base md:text-lg",
    buttonText: "text-sm sm:text-base font-semibold",
  },

  layout: {
    cardPad: "px-8 py-8",
    radius: "rounded-2xl",
    sectionRadius: "rounded-3xl",
    container: "max-w-6xl mx-auto px-6 md:px-10 lg:px-16",
  },
};
