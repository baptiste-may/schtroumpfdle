import {Metadata} from "next";
import "semantic-ui-css/semantic.css";
import "./globals.css";
import {ReactNode} from "react";
import {TITLE, DESCRIPTION, ICON, URL, AUTHOR} from "./metadata.ts";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    authors: {
        name: AUTHOR
    },
    icons: {
        icon: ICON,
        apple: ICON
    },
    openGraph: {
        type: "website",
        title: TITLE,
        description: DESCRIPTION,
        images: ICON,
        url: URL,
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="fr">
        <body className="tw-bg-cyan-200" suppressHydrationWarning>
        {children}
        </body>
        </html>
    );
}
