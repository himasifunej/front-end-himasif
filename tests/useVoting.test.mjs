// node --experimental-strip-types --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseWib, formatWib, normalizeVoteSetting } from "../composables/useVoting.ts";

const S = (o) => ({ result: { is_published: 1, start_at: "2026-12-12T08:00:00", end_at: "2026-12-12T19:30:00", ...o } });

test("parseWib membaca isian CMS sebagai WIB", () => {
  assert.equal(parseWib("2026-12-12T19:30:00").toISOString(), "2026-12-12T12:30:00.000Z");
  assert.equal(parseWib("2026-12-12 19:30:00").toISOString(), "2026-12-12T12:30:00.000Z");
  assert.equal(parseWib("2026-11-10T00:45:39.000000Z").toISOString(), "2026-11-10T00:45:39.000Z");
  assert.equal(parseWib(null), null);
  assert.equal(parseWib("bukan tanggal"), null);
});

test("formatWib", () => {
  assert.equal(formatWib(parseWib("2026-12-12T19:30:00")), "Sabtu, 12 Desember 2026 pukul 19.30 WIB");
});

test("fase dari jam", () => {
  const at = (s) => new Date(parseWib(s));
  assert.equal(normalizeVoteSetting(S(), at("2026-12-12T07:59:59")).phase, "upcoming");
  assert.equal(normalizeVoteSetting(S(), at("2026-12-12T08:00:00")).phase, "open");
  assert.equal(normalizeVoteSetting(S(), at("2026-12-12T19:30:00")).phase, "closed");
  assert.equal(normalizeVoteSetting(S({ is_published: "0" }), at("2026-12-12T10:00:00")).phase, "unpublished");
});

test("diumumkan hanya bila ada pemenang", () => {
  const w = { id: 1, name: "A" };
  assert.equal(normalizeVoteSetting(S({ winner: w }), new Date("2027-01-01")).phase, "announced");
  assert.equal(normalizeVoteSetting(S({ status: "announced" }), new Date("2027-01-01")).phase, "closed");
  assert.equal(normalizeVoteSetting(S({ status: "open" }), new Date("2027-01-01")).phase, "open");
});
