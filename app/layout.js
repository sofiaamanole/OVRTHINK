import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.ovrthink.ro"),
  title: "OVRTHINK",
  description:
    "OVRTHINK — brand de tricouri. Colecție de tricouri și hoodie-uri cu design propriu, print premium. Negru și alb.",
  openGraph: {
    title: "OVRTHINK",
    description: "Streetwear pentru cei care gândesc prea mult.",
    url: "https://www.ovrthink.ro",
    siteName: "OVRTHINK",
    type: "website",
    images: [
      { url: "/brand/og-image.png", width: 1200, height: 630, alt: "OVRTHINK" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OVRTHINK",
    description: "Streetwear pentru cei care gândesc prea mult.",
    images: ["/brand/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
