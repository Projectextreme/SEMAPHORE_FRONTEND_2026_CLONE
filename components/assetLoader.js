"use client";

// Centralized asset loading for the Aquasaga ocean scene.
//
// Why this exists: THREE.LoadingManager reports progress as itemsLoaded/itemsTotal,
// which counts FILES, not bytes. With five critical assets that produced a counter
// that jumped 20% -> 40% -> 60%, and treated a 75KB model as equal work to a 541KB
// texture. This module tracks real transferred bytes instead, so the percentage the
// user sees corresponds to actual download progress.
//
// It also gives us one place to do application-level caching (Cache API), so a repeat
// visit reuses stored bytes instead of re-downloading megabytes of models/textures.

const CACHE_NAME = "aquasaga-assets-v1";

// Bump when an asset's CONTENTS change, so stale cached bytes are dropped.
// (Static-export filenames under /public are not content-hashed by Next.)
export const ASSET_VERSION = "v1";

/**
 * Assets required before the first frame can be rendered correctly.
 * `bytes` is only a seed estimate for the progress total; the real
 * Content-Length replaces it as soon as response headers arrive.
 */
export const CRITICAL_ASSETS = [
  { key: "waterNormals", url: "/textures/waternormals.jpg", kind: "texture", bytes: 249000 },
  { key: "dolphin", url: "/assets/models/dolphin_anim.glb", kind: "buffer", bytes: 146000 },
  { key: "fishSchool", url: "/assets/models/source/school%20of%20fish.glb", kind: "buffer", bytes: 34565856 },
];

/** Heavy, non-first-frame assets streamed in after the scene is already interactive. */
export const SECONDARY_ASSETS = [
  { key: "hdri", url: "/hdri/spiaggia_di_mondello_4k.exr", kind: "buffer", bytes: 19488681 },
];

async function openCache() {
  try {
    if (typeof caches === "undefined") return null;
    return await caches.open(CACHE_NAME);
  } catch {
    return null; // private mode / unsupported — fall through to plain fetch
  }
}

/**
 * Fetch one asset, reporting bytes as they stream in.
 * Resolves to a Blob. Uses the Cache API so repeat visits skip the network.
 */
async function fetchAsset(asset, onBytes, signal) {
  const cacheKey = asset.url + "?" + ASSET_VERSION;
  const cache = await openCache();

  // --- Repeat visit: serve straight from the cache ---
  if (cache) {
    try {
      const hit = await cache.match(cacheKey);
      if (hit) {
        const blob = await hit.blob();
        onBytes(blob.size, blob.size, true);
        return blob;
      }
    } catch {
      /* fall through to network */
    }
  }

  const res = await fetch(asset.url, { signal });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${asset.url}`);

  const declared = Number(res.headers.get("content-length")) || 0;

  // Stream so we can count real bytes. If the body isn't readable
  // (some proxies), fall back to a single blob read.
  if (!res.body || !res.body.getReader) {
    const blob = await res.blob();
    onBytes(blob.size, blob.size, false);
    if (cache) { try { await cache.put(cacheKey, new Response(blob)); } catch {} }
    return blob;
  }

  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onBytes(received, declared || 0, false);
  }

  const blob = new Blob(chunks);
  onBytes(blob.size, blob.size, false);
  if (cache) { try { await cache.put(cacheKey, new Response(blob)); } catch {} }
  return blob;
}

/**
 * Load a list of assets in parallel with true byte-level aggregate progress.
 *
 * onProgress(percent, info) fires as bytes arrive. `percent` is capped just under
 * 100 until every asset has actually resolved, so the bar can never sit at 100%
 * while work remains.
 */
export async function loadAssets(assets, onProgress, signal) {
  const state = assets.map((a) => ({
    asset: a,
    loaded: 0,
    total: a.bytes || 0, // seed; replaced by Content-Length
    done: false,
    fromCache: false,
  }));

  const report = () => {
    let loaded = 0;
    let total = 0;
    for (const s of state) {
      loaded += s.loaded;
      total += Math.max(s.total, s.loaded);
    }
    const allDone = state.every((s) => s.done);
    const raw = total > 0 ? (loaded / total) * 100 : 0;
    // Hold just below 100 until everything has genuinely resolved.
    const pct = allDone ? 100 : Math.min(raw, 99);
    onProgress(pct, {
      loadedBytes: loaded,
      totalBytes: total,
      doneCount: state.filter((s) => s.done).length,
      totalCount: state.length,
    });
  };

  report();

  const results = {};
  const failures = [];

  await Promise.all(
    state.map(async (s) => {
      try {
        const blob = await fetchAsset(
          s.asset,
          (loaded, total, fromCache) => {
            s.loaded = loaded;
            if (total) s.total = Math.max(total, loaded);
            s.fromCache = fromCache;
            report();
          },
          signal
        );
        results[s.asset.key] = blob;
      } catch (err) {
        failures.push({ asset: s.asset, error: err });
        // Treat a failed asset as "settled" so the bar cannot hang forever.
        s.total = s.loaded;
      } finally {
        s.done = true;
        report();
      }
    })
  );

  return { results, failures };
}

/** Decode an image blob into a THREE texture without a second network request. */
export async function blobToTexture(THREE, blob, { srgb = true, anisotropy = 1 } = {}) {
  let texture;

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob);
    texture = new THREE.Texture(bitmap);
  } else {
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });
      texture = new THREE.Texture(img);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  if (srgb && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

/** Clear cached asset bytes (useful when ASSET_VERSION changes). */
export async function clearAssetCache() {
  try {
    if (typeof caches !== "undefined") await caches.delete(CACHE_NAME);
  } catch {
    /* ignore */
  }
}
