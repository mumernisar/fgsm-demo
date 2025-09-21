import "./globals.css";

export const metadata = {
  title: "Adversarial Attacks with FGSM",
  description: "Demo application for FGSM attack visualization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="w-full border-b border-gray-200/70 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="text-sm font-semibold text-gray-900">
              {metadata.title}
            </div>
            <span className=" text-sm text-gray-600 hover:text-gray-900">
              Made with ❤️ by{" "}
            
            <a
              href="https://github.com/mumernisar"
              target="_blank"
              rel="noopener noreferrer"
              className=" cursor-pointer"
            >
               @mumernisar
            </a></span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
