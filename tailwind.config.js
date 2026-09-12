// tailwind.config.js

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(59, 47, 36, 0.06), 0 8px 24px -12px rgba(59, 47, 36, 0.14)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        paper: {
          primary: "#B3552F",
          "primary-content": "#FBF3EA",
          secondary: "#6B7753",
          "secondary-content": "#F4F3EA",
          accent: "#C99A2E",
          "accent-content": "#33230A",
          neutral: "#3A2C20",
          "neutral-content": "#EFE7D9",
          "base-100": "#FBF8F2",
          "base-200": "#F3EEE3",
          "base-300": "#E5DBC9",
          "base-content": "#3B2F24",
          info: "#4A6E86",
          "info-content": "#EAF1F6",
          success: "#557A52",
          "success-content": "#EDF4EC",
          warning: "#C99A2E",
          "warning-content": "#33230A",
          error: "#B93A2E",
          "error-content": "#FBEFED",
          "--rounded-box": "0.9rem",
          "--rounded-btn": "0.55rem",
          "--rounded-badge": "0.4rem",
        },
      },
    ],
  },
};