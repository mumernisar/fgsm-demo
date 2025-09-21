"use client";

import { useRef, useState } from "react";
import GalleryPicker from "@/components/GalleryPicker";
import ImagePreview from "@/components/ImagePreview";
import EpsilonSlider from "@/components/EpsilonSlider";
import HistoryAccordion from "@/components/HistoryAccordion";
import RunButton from "@/components/RunButton";
import { useRunsStore } from "@/hooks/useRunStore";
import { runAttack } from "@/hooks/useAttack";
import { Button } from "@/components/ui/button";
import { DEFAULT_IMAGE } from "@/lib/constants";
import { downloadB64 } from "@/lib/utils";

export default function Home() {
  const [selected, setSelected] = useState(DEFAULT_IMAGE);
  const [epsilon, setEpsilon] = useState(0.1);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef(null);
  const { runs, addRun, setRuns } = useRunsStore();

  async function onRun() {
    if (!selected) return;
    try {
      setLoading(true);
      const runItem = await runAttack({ imageUrlOrB64: selected.src, epsilon });
      addRun(runItem);
    } catch (err) {
      console.error(err);
      alert(err.message || "Attack failed");
    } finally {
      setLoading(false);
    }
  }

  async function onUploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataURL(file);
    setSelected({
      id: `local-${crypto.randomUUID()}`,
      src: dataUrl,
      alt: file.name,
    });
  }

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
      <section className="space-y-4 md:col-span-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">Input</h2>
          <p className="text-xs text-gray-500">
            Upload or pick a image. Adjust epsilon to craft the perturbation.
          </p>
        </div>

        <div className="flex items-left gap-3">
          <div className="flex-1">
            <div className="w-[70%] mx-auto">
              <ImagePreview
                src={selected?.src}
                alt={selected?.alt}
                aspect="square"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUploadFile}
            />
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="rounded-full px-5"
            >
              Upload image
            </Button>
            <p>
              OR
              <Button
                onClick={() => setPickerOpen(true)}
                className="rounded-full px-5"
              >
                Select from gallery
              </Button>
            </p>
          </div>
          <div className="flex w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] -mx-4 sm:-mx-6 justify-center">
            <EpsilonSlider
              value={epsilon}
              onChange={setEpsilon}
              color="amber"
            />
          </div>
          <div className="flex justify-center pt-3">
            <RunButton
              onClick={onRun}
              loading={loading}
              disabled={!selected}
              className="rounded-full px-8 py-6.5 w-59 bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 active:scale-[0.95]"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 md:col-span-3">
        <h2>Output</h2>
        <HistoryAccordion
          runs={runs}
          onDownload={(r) =>
            downloadB64(r.advB64, `adv_${Math.round(r.epsilon * 100)}.png`)
          }
          onRerun={(r) => setEpsilon(r.epsilon)}
          onClear={() => setRuns([])}
        />
      </section>

      <GalleryPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onChoose={(it) => setSelected(it)}
      />
    </main>
  );
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
