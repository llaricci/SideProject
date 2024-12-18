import localFont from "next/font/local";
import "./globals.css";

import AllProjects from "./components/Header";

import { ApolloWrapper } from "./ApolloWrapper";
import { AuthProvider } from "@/app/NextAuth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SideProject",
  description: "An app to help you manage your projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div id="__next">
          <ApolloWrapper>
            <AuthProvider>
              <AllProjects />
              {children}/
            </AuthProvider>
          </ApolloWrapper>
        </div>
      </body>
    </html>
  );
}
