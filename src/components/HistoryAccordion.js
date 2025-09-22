"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

export default function HistoryAccordion({ runs = [], onClear }) {
  const [preview, setPreview] = useState(null);
  const [openValue, setOpenValue] = useState(runs[0]?.id);
  useEffect(() => {
    if (runs.length) setOpenValue(runs[0].id);
  }, [runs]);
  if (!runs.length) {
    return (
      <div className="text-sm text-gray-500">
        No runs yet — submit your first attack.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onClear}
          disabled={!runs.length}
        >
          Clear
        </Button>
      </div>
      <Accordion
        type="single"
        collapsible
        value={openValue}
        onValueChange={setOpenValue}
      >
        {runs.map((r) => (
          <AccordionItem
            value={r.id}
            key={r.id}
            className="bg-white rounded-xl border border-gray-200/70 mb-3 shadow-sm"
          >
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Thumb src={r.origB64} alt="original" />
                  <span className="mx-1 text-gray-400">→</span>
                  <Thumb
                    src={r.advB64}
                    alt="adversarial"
                    isBase64
                    mime={`image/${r.advFmt || "png"}`}
                  />
                </div>
                <div className="text-sm text-gray-700">
                  ε {Math.round(r.epsilon * 100)}%
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(r.timestamp).toLocaleString()}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2 sm:p-3">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <div className="rounded-lg border border-gray-200/60 bg-white p-2 shadow-sm">
                      <div className="mx-auto w-full max-w-[15rem] sm:max-w-[18rem] md:max-w-[18rem] lg:max-w-[22rem] xl:max-w-[24rem]">
                        <div className="aspect-square bg-gray-50 rounded-md overflow-hidden">
                          <button
                            onClick={() =>
                              setPreview(
                                `data:image/${r.advFmt || "png"};base64,${
                                  r.advB64
                                }`
                              )
                            }
                            className="group relative w-full h-full cursor-pointer"
                            aria-label="Open adversarial image preview"
                          >
                            <Image
                              src={`data:image/${r.advFmt || "png"};base64,${
                                r.advB64
                              }`}
                              alt="Adversarial result"
                              width={800}
                              height={800}
                              className="w-full h-full object-contain transition duration-200 group-hover:blur-[2px]"
                            />
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <div className="bg-black/50 text-white rounded-full p-2">
                                <Maximize2 className="w-5 h-5" />
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Clean (top-5)
                        </h4>
                        <PredictionsTable preds={r.clean} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Adversarial (top-5)
                        </h4>
                        <PredictionsTable preds={r.adv} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

        <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
          <DialogContent className="max-w-6xl w-[95vw] p-4 sm:p-6 bg-white">
            <DialogTitle className="sr-only">Adversarial preview</DialogTitle>
            <div className="relative w-full h-[70dvh]">
              {preview && (
                <Image
                  src={preview}
                  alt="Adversarial preview"
                  width={1600}
                  height={1200}
                  className="w-full h-full object-contain"
                  sizes="100vw"
                  priority
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Accordion>
    </div>
  );
}

// function Thumb({ src, alt = "", isBase64 = false }) {
function Thumb({ src, alt = "", isBase64 = false, mime = "image/png" }) {
  if (!src)
    return (
      <div
        className="w-12 h-9 bg-gray-100 rounded border border-gray-200/70"
        aria-hidden
      />
    );
  // const url = isBase64 ? `data:image/png;base64,${src}` : src;
  const url = isBase64 ? `data:${mime};base64,${src}` : src;

  return (
    <div className="w-12 h-9 bg-gray-100 rounded border border-gray-200/70 overflow-hidden">
      <Image
        src={url}
        alt={alt}
        width={96}
        height={72}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function PredictionsTable({ preds = [] }) {
  if (!preds.length)
    return <div className="text-xs text-gray-500">No data</div>;
  return (
    <table className="w-full text-sm rounded-md overflow-hidden">
      <tbody>
        {preds.map((p, i) => (
          <tr
            key={i}
            className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
          >
            <td className="py-1.5 pr-2 w-10 text-gray-500">{i + 1}.</td>
            <td className="py-1.5">{p.label}</td>
            <td className="py-1.5 text-right text-gray-600">
              {Math.round((p.score ?? 0) * 100)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
