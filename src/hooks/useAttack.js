import { postAttack } from "@/lib/api";

// Build a File from a URL or data URL by fetching once; also return data URL for preview.
async function fileAndDataUrl(input) {
  const res = await fetch(input);
  const blob = await res.blob();
  const type = blob.type || "image/png";
  const name = `input.${
    type.includes("jpeg") ? "jpg" : type.includes("png") ? "png" : "img"
  }`;
  let file;
  try {
    file = new File([blob], name, { type });
  } catch {
    file = blob;
    file.name = name;
  }
  const b64 = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
  return { file, dataUrl: b64 };
}

export async function runAttack({ imageUrlOrB64, epsilon }) {
  const { file, dataUrl } = await fileAndDataUrl(imageUrlOrB64);
  const resp = await postAttack({ file, epsilon });
  const clean = normalizeServerTopk(resp.clean_topk);
  const adv = normalizeServerTopk(resp.adversarial_topk);
  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    epsilon,
    origB64: dataUrl,
    advB64: resp.adversarial_image_base64_png,
    clean,
    adv,
    success: !!resp.attack_success,
  };
}

function normalizeServerTopk(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => ({ label: x.label, score: x.prob }));
}
