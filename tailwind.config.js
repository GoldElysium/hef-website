const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

function withOpacity(variableName) {
    return `rgb(var(${variableName}) / <alpha-value>)`;
}

const themeColors = {
    background: withOpacity("--color-background"),
    primary: withOpacity("--color-primary"),
    "primary-foreground": withOpacity("--color-primary-foreground"),
    secondary: withOpacity("--color-secondary"),
    "secondary-foreground": withOpacity("--color-secondary-foreground"),
    accent: withOpacity("--color-accent"),
    text: withOpacity("--color-text"),
    header: withOpacity("--color-header"),
    "header-foreground": withOpacity("--color-header-foreground"),
    heading: withOpacity("--color-heading"),
    link: withOpacity("--color-link"),

    "background-dark": withOpacity("--color-background-dark"),
    "primary-dark": withOpacity("--color-primary-dark"),
    "primary-foreground-dark": withOpacity("--color-primary-foreground-dark"),
    "secondary-dark": withOpacity("--color-secondary-dark"),
    "secondary-foreground-dark": withOpacity(
        "--color-secondary-foreground-dark"
    ),
    "accent-dark": withOpacity("--color-accent-dark"),
    "text-dark": withOpacity("--color-text-dark"),
    "header-dark": withOpacity("--color-header-dark"),
    "header-foreground-dark": withOpacity("--color-header-foreground-dark"),
    "heading-dark": withOpacity("--color-heading-dark"),
    "link-dark": withOpacity("--color-link-dark"),

    "holoen-red": withOpacity("--color-holoen-red"),
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-nunito)", ...defaultTheme.fontFamily.sans],
                // irys: ["Jura", ...defaultTheme.fontFamily.sans],
            },
            maxWidth: {
                "1/12": "8.333333%",
                "2/12": "16.666667%",
                "3/12": "25%",
                "4/12": "33.333333%",
                "5/12": "41.666667%",
                "6/12": "50%",
                "7/12": "58.333333%",
                "8/12": "66.666667%",
                "9/12": "75%",
                "10/12": "83.333333%",
                "11/12": "91.666667%",
            },
            gridTemplateColumns: {
                submissionGrid: "100px auto",
            },
            textColor: {
                skin: themeColors,
            },
            backgroundColor: {
                skin: themeColors,
            },
            fill: {
                skin: themeColors,
            },
            borderColor: {
                skin: themeColors,
            },
            stroke: {
                skin: themeColors,
            },
            zIndex: {
                "-1": "-1",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                irysLight: {
                    primary: "rgb(140, 18, 54)", //dark purple
                    "primary-content": "rgb(255, 255, 255)", //white
                    secondary: "rgb(235, 188, 202)", // light pinkish
                    "secondary-content": "rgb(0, 0, 0)", //white
                    accent: "rgb(102, 0, 30)", // dark purple
                    neutral: "rgb(47, 47, 47)", //grey
                    "base-100": "rgb(242, 228, 232)", //light pinkish
                    "base-200": "rgb(140, 18, 54)",
                    "base-300": "rgb(38, 2, 12)",
                    info: "rgb(235, 188, 202)", // light pink
                    success: "rgb(140, 18, 54)", // dark purple
                    warning: "rgb(166, 21, 64)", // not as dark puurple
                    error: "rgb(255, 191, 210)", // light pink
                },
                irysDark: {
                    primary: "rgb(140, 18, 54)",
                    "primary-content": "rgb(238, 238, 238)",
                    secondary: "rgb(140, 56, 81)",
                    "secondary-content": "rgb(238, 238, 238)",
                    accent: "rgb(245, 196, 199)",
                    neutral: "rgb(238, 238, 238)",
                    "base-100": "rgb(38, 2, 12)",
                    "base-200": "rgb(140, 18, 54)",
                    "base-300": "rgb(47, 47, 47)",
                    info: "rgb(140, 56, 81)",
                    success: "rgb(140, 18, 54)",
                    warning: "rgb(166, 21, 64)",
                    error: "rgb(255, 191, 210)",
                },
            },
            "light",
            "dark",
            "cupcake",
            "valentine",
            "aqua",
        ],
    },
};
