/*
 * Preload media perkenalan calon setelah surat suara tampil (bukan saat halaman dibuka).
 * Urutan: foto resmi semua calon → lalu per calon: video → frame burst; SATU PER SATU, prioritas rendah,
 * supaya ±200 HP di NAT kampus tidak menarik semuanya bersamaan.
 *
 * Video memakai <link rel="prefetch">: storage BE (v2.himasif.id) tidak mengirim header CORS, jadi fetch()
 * ke blob tidak bisa; prefetch cukup mengisi cache HTTP (Cache-Control: max-age 7 hari di storage).
 * Bila belum selesai saat kartu diketuk, video tetap diputar sambil streaming.
 */
export function useIntroPreload() {
  const started = ref(false);
  const links = [];
  let aborted = false;

  function img(url) {
    return new Promise((resolve) => {
      if (!url) return resolve();
      const i = new Image();
      i.decoding = "async";
      try { i.fetchPriority = "low"; } catch (e) {}
      i.onload = i.onerror = () => resolve();
      i.src = url;
    });
  }

  function prefetch(url) {
    return new Promise((resolve) => {
      if (!url) return resolve();
      const l = document.createElement("link");
      l.rel = "prefetch";
      l.href = url;
      l.onload = l.onerror = () => resolve();
      document.head.appendChild(l);
      links.push(l);
      setTimeout(resolve, 20000); // jangan menunggu selamanya di jaringan lambat / browser tanpa prefetch
    });
  }

  async function run(candidates, intro, photoOf) {
    if (started.value || !import.meta.client) return;
    started.value = true;
    const list = candidates || [];
    for (const c of list) {
      if (aborted) return;
      await img(photoOf(c));
    }
    if (intro?.mode !== "full") return;
    // per calon sesuai urutan surat suara: video dulu (dibutuhkan saat diketuk), lalu frame burst
    // (baru dibutuhkan 6 dtk kemudian). Pemilih biasanya mengetuk calon 1 lebih dulu.
    for (const c of list) {
      if (aborted) return;
      await prefetch(c.intro?.video_url);
      for (const f of c.intro?.frames || []) {
        if (aborted) return;
        await img(f);
      }
    }
  }

  onBeforeUnmount(() => {
    aborted = true;
    for (const l of links) l.remove();
  });

  return { run, started };
}
