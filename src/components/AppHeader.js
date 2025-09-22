"use client";

import { useState } from "react";
import WelcomeModal from "@/components/WelcomeModal";

export default function AppHeader() {
  const [openWelcomeTick, setOpenWelcomeTick] = useState(0);

  return (
    <>
      <header className="w-full border-b border-gray-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpenWelcomeTick((x) => x + 1)}
            className="text-sm font-semibold text-gray-900 hover:text-gray-600"
            aria-label="Open app introduction"
          >
            Adversarial Attacks with FGSM
          </button>
          <span className=" text-sm text-gray-600 hover:text-gray-900">
            Made with ❤ by{" "}
            <a
              href="https://github.com/mumernisar"
              target="_blank"
              rel="noopener noreferrer"
              className=" cursor-pointer"
            >
              @mumernisar
            </a>
          </span>
        </div>
      </header>
      <WelcomeModal triggerOpen={openWelcomeTick > 0} />
    </>
  );
}
