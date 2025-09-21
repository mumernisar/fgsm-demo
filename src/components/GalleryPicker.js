"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getGalleryItems } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export default function GalleryPicker({ open, onOpenChange, onChoose }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const PER_PAGE = 20; // lower per-page batch size
  const TOTAL_LIMIT = 100; // cap overall loaded items
  const sentinelRef = useRef(null);
  const scrollRef = useRef(null);

  const categories = useMemo(
    () => [
      "nature",
      "animals",
      "cats",
      "dogs",
      "cars",
      "technology",
      "food",
      "city",
      "sports",
      "space",
    ],
    []
  );

  useEffect(() => {
    if (!open) return;
    // Reset when opening
    setItems([]);
    setPage(1);
    setError("");
    setHasMore(true);
    setSearch("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await getGalleryItems({
          page,
          perPage: PER_PAGE,
          query,
          orientation: "square",
        });
        if (!cancelled) {
          const incoming = Array.isArray(data.items) ? data.items : [];
          setItems((prev) => {
            const next = [...prev, ...incoming];
            const capped = next.slice(0, TOTAL_LIMIT);
            const reachedLimit = capped.length >= TOTAL_LIMIT;
            setHasMore(!reachedLimit && incoming.length >= PER_PAGE);
            return capped;
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to fetch gallery");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open, page, query]);

  // When query changes (via search or category), reset list and page
  const onSubmitSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = search.trim();
      setItems([]);
      setPage(1);
      setHasMore(true);
      setQuery(q);
    },
    [search]
  );

  const onSelectCategory = useCallback((q) => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setSearch(q);
    setQuery(q);
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: scrollRef.current, rootMargin: "300px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [open, loading, hasMore]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="wide"
        className="bg-white/95 backdrop-blur p-4 sm:p-6 rounded-2xl border shadow-2xl"
      >
        <DialogTitle className="text-base font-semibold mb-3">
          Choose from gallery
        </DialogTitle>

        <div className="flex h-[80vh] flex-col">
          <form
            onSubmit={onSubmitSearch}
            className="mb-3 flex items-center gap-2"
          >
            <input
              name="q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search (e.g. cats, cars, nature)"
              className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-50"
            >
              Search
            </button>
          </form>

          {/* Quick categories */}
          <div className="mb-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => onSelectCategory(c)}
                className={cn(
                  "px-3 py-1 rounded-full border text-xs hover:bg-gray-50",
                  query === c && "bg-gray-100"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

          {/* Scrollable container for masonry grid */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-1">
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-3 [column-fill:_balance]">
              {items.map((it) => (
                <div key={it.id} className="mb-3 break-inside-avoid">
                  <button
                    onClick={() => {
                      onChoose?.(it);
                      onOpenChange?.(false);
                    }}
                    className={cn(
                      "rounded-lg border hover:border-gray-300 transition overflow-hidden bg-white w-full text-left"
                    )}
                    aria-label={`Choose ${it.alt ?? "image"}`}
                  >
                    <Card>
                      <div className="aspect-square bg-gray-100">
                        <Image
                          src={it.src}
                          alt={it.alt || ""}
                          width={640}
                          height={640}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </Card>
                  </button>
                </div>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div
              ref={sentinelRef}
              className="mt-4 h-10 flex items-center justify-center text-sm text-gray-500"
            >
              {loading
                ? "Loading…"
                : hasMore
                ? "Scroll to load more"
                : "No more results"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
