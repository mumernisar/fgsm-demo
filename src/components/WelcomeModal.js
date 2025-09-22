"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SEEN_KEY = "seen_welcome_v1";

export default function WelcomeModal({ triggerOpen = false, onOpenChange }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(SEEN_KEY);
      if (!seen) setOpen(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (triggerOpen) setOpen(true);
  }, [triggerOpen]);

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }
    onOpenChange?.(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="2xl" className="bg-white p-6 sm:p-8">
        <DialogTitle className="text-lg font-semibold">
          A little about FGSM based Adversarial Attacks
        </DialogTitle>
        <div className="text-sm text-gray-700 space-y-4 mt-2">
          <p>
            The Fast Gradient Sign Method (FGSM) is a simple technique for
            generating adversarial examples in machine learning. Adversarial
            examples are inputs that have been intentionally and imperceptibly
            modified so that a model’s prediction changes (e.g., a picture of a
            dog may be classified as a cat). FGSM crafts these modifications by
            using the model’s loss gradient with respect to the input.
          </p>
          <p>
            Simply put, it nudges each pixel a tiny amount in the direction that
            will increase the loss the most; that step size is controlled by the
            value epsilon (ε). With small values for ε, the changes are hard for
            humans to notice, but they can be enough to flip the model’s
            prediction.
          </p>
          <p>This is a demo of the same..</p>
          <p>
            You can read more here:{" "}
            <a
              href="https://www.tensorflow.org/tutorials/generative/adversarial_fgsm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-700 hover:text-violet-800 underline underline-offset-4"
            >
              TensorFlow FGSM tutorial
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
