import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Adversarial Attacks with FGSM",
  description: "Demo application for FGSM attack visualization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
