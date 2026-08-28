import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Magani officine",
    description: "Système de gestion de pharmacie",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}