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

// Bump when an asset's CONTENTS change, so stale cached bytes are dropped.
// (Static-export filenames under /public are not content-hashed by Next.)
// v2: fish school replaced by the texture-stripped build; moon + hdri added.
export const ASSET_VERSION = "v2";

const CACHE_PREFIX = "aquasaga-assets-";
const CACHE_NAME = CACHE_PREFIX + ASSET_VERSION;

/**
 * Delete caches from previous ASSET_VERSIONs. Without this the old 31MB fish-school
 * blob would sit in every returning visitor's storage indefinitely, since bumping the
 * version only makes it unreachable, not gone.
 */
export async function pruneOldCaches() {
  try {
    if (typeof caches === "undefined" || !caches.keys) return;
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME)
        .map((n) => caches.delete(n))
    );
  } catch {
    /* storage unavailable — nothing to prune */
  }
}

/**
 * Assets required before the first frame can be rendered correctly.
 * `bytes` is only a seed estimate for the progress total; the real
 * Content-Length replaces it as soon as response headers arrive.
 */
export const CRITICAL_ASSETS = [
  { key: "waterNormals", url: "/textures/waternormals.jpg", kind: "texture", bytes: 248813 },
  // 1024px WebP re-encode of moon.jpg, which was a 2580x2452 / 2MB JPEG for a sphere
  // sitting 600 units back. The original is kept at /textures/moon.jpg.
  { key: "moon", url: "/textures/moon.webp", kind: "texture", bytes: 171622 },
  // The four fish-school materials. Scene.jsx used to pull these inside the GLTF parse
  // callback, so they were untracked by the bar and could land after the reveal,
  // showing untextured fish for a beat.
  { key: "fishTex0", url: "/assets/models/textures/gltf_embedded_0.webp", kind: "texture", bytes: 102816 },
  { key: "fishTex5", url: "/assets/models/textures/gltf_embedded_5.webp", kind: "texture", bytes: 40086 },
  { key: "fishTex9", url: "/assets/models/textures/gltf_embedded_9.webp", kind: "texture", bytes: 38936 },
  { key: "fishTex13", url: "/assets/models/textures/gltf_embedded_13.webp", kind: "texture", bytes: 62988 },
  { key: "dolphin", url: "/assets/models/dolphin_anim.glb", kind: "buffer", bytes: 146932 },
  // Texture-stripped build of "school of fish_opt.glb". The original embedded 18 PNGs
  // (22MB of the 31MB file) that Scene.jsx discarded anyway — it rebuilds every fish
  // material from the four external .webp files under /assets/models/textures. Same
  // Draco geometry and animation, byte for byte; just none of the dead weight.
  { key: "fishSchool", url: "/assets/models/fish_school_opt.glb", kind: "buffer", bytes: 1730992 },
  // The HDR is awaited before the curtain lifts, so it belongs in the tracked set.
  // Fetching it outside meant ~1.5MB of work the progress bar could not see, which is
  // why the bar used to sit at 100% while the screen stayed dark.
  { key: "hdri", url: "/hdri/spiaggia_di_mondello_1k.hdr", kind: "buffer", bytes: 1533242 },
  // Event Banner Textures: cached via preloader to avoid pop-in on scroll
  { key: "banner_event-1", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802488/coding.png", kind: "texture", bytes: 65000 },
  { key: "banner_event-2", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802485/webdesigning.png", kind: "texture", bytes: 45000 },
  { key: "banner_event-3", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802490/itquiz.png", kind: "texture", bytes: 75000 },
  { key: "banner_event-4", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802491/gaming.png", kind: "texture", bytes: 80000 },
  { key: "banner_event-5", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802515/techtalk.png", kind: "texture", bytes: 55000 },
  { key: "banner_event-6", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802513/surpriseevent.png", kind: "texture", bytes: 55000 },
  { key: "banner_event-7", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802487/itmanager.png", kind: "texture", bytes: 60000 },
  { key: "banner_event-8", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802510/startup.png", kind: "texture", bytes: 50000 },
  { key: "banner_event-9", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802490/fashion.png", kind: "texture", bytes: 85000 },
  { key: "banner_event-10", url: "https://res.cloudinary.com/zuxdlzob/image/upload/v1787802512/photography.png", kind: "texture", bytes: 70000 },
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

/**
 * Decode an image blob into a THREE texture without a second network request.
 *
 * `flipY` reproduces what TextureLoader gives you for a normal HTMLImageElement.
 * It is done by asking createImageBitmap for a pre-flipped bitmap and then leaving
 * texture.flipY false, rather than relying on UNPACK_FLIP_Y_WEBGL being honoured for
 * ImageBitmap sources — which varies by browser and would silently render a texture
 * upside down.
 */
export async function blobToTexture(THREE, blob, { srgb = true, anisotropy = 1, flipY = false } = {}) {
  let texture;

  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(
      blob,
      flipY ? { imageOrientation: "flipY" } : undefined
    );
    texture = new THREE.Texture(bitmap);
    // The bitmap already carries the flip; a second one would undo it.
    texture.flipY = false;
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
      // HTMLImageElement takes the conventional GL flip.
      texture.flipY = flipY;
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
