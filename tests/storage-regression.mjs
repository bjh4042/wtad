import { buildSync } from 'esbuild';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const load = path => {
  const result = buildSync({ entryPoints: [resolve(root, path)], absWorkingDir: root, bundle: true, platform: 'node', format: 'cjs', write: false, packages: 'external', loader: { '.png': 'dataurl', '.webp': 'dataurl', '.svg': 'dataurl' }, logLevel: 'silent' });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports);
  return mod.exports;
};
const { normalizeProgressData, LEGACY_QUEST_IDS, saveProgress, loadProgress, clearProgress, LS_KEY } = load('src/hooks/useProgressStorage.ts');
const { QUESTS } = load('src/data/quests.ts');
const withStorage = run => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const map = new Map();
  const storage = {
    getItem: key => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: key => map.delete(key),
    get length() { return map.size; },
    key: index => [...map.keys()][index] ?? null,
  };
  Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
  try { run(map); }
  finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow); else delete globalThis.window;
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage); else delete globalThis.localStorage;
  }
};

test('storage: 104-item legacy ordering retains inserted Bluetooth confirmation', () => {
  assert.equal(LEGACY_QUEST_IDS.length, 104);
  assert.equal(LEGACY_QUEST_IDS[39], 75);
  assert.equal(LEGACY_QUEST_IDS[40], 39);
  assert.equal(LEGACY_QUEST_IDS[75], 74);
  assert.equal(LEGACY_QUEST_IDS[103], 103);
});
test('storage: legacy completion index 39 maps to stable ID 75', () => {
  const state = normalizeProgressData({ completedQuests: [39] });
  assert.deepEqual(state.completedQuests, [QUESTS.findIndex(quest => quest.id === 75)]);
});
test('storage: stable ID 39 is distinct from legacy index 39', () => {
  const state = normalizeProgressData({ completedQuestIds: [39] });
  assert.deepEqual(state.completedQuests, [QUESTS.findIndex(quest => quest.id === 39)]);
});
test('storage: malformed top-level values restore usable defaults', () => {
  for (const value of [null, [], 12, 'x']) {
    const state = normalizeProgressData(value);
    assert.equal(state.questIdx, 0);
    assert.equal(state.exp, 0);
    assert.equal(state.homePages[0].length, 40);
  }
});
test('storage: unknown, duplicate, fractional and string completed IDs are excluded', () => {
  const state = normalizeProgressData({ completedQuestIds: [0, 0, -1, 999999, '1', 1.5] });
  assert.deepEqual(state.completedQuests, [0]);
  assert.equal(state.exp, QUESTS[0].exp);
});
test('storage: EXP is reconstructed from completed lessons', () => {
  const state = normalizeProgressData({ completedQuestIds: [0, 1], exp: 999999 });
  assert.equal(state.exp, QUESTS[0].exp + QUESTS[1].exp);
});
test('storage: skipped current lesson clamps to the first unfinished lesson', () => {
  const state = normalizeProgressData({ completedQuestIds: [0], currentQuestId: 95 });
  assert.equal(state.questIdx, 1);
});
test('storage: completed lesson remains available for review', () => {
  const state = normalizeProgressData({ completedQuestIds: [0, 1], currentQuestId: 0 });
  assert.equal(state.questIdx, 0);
});
test('storage: premature completion summary is removed', () => {
  const summary = QUESTS.find(quest => quest.targetId === null);
  const state = normalizeProgressData({ completedQuestIds: [summary.id], currentQuestId: summary.id });
  assert.equal(state.completedQuests.length, 0);
  assert.equal(state.questIdx, 0);
});
test('storage: genuine all-complete summary survives restoration', () => {
  const state = normalizeProgressData({ completedQuestIds: QUESTS.map(quest => quest.id), currentQuestId: QUESTS.at(-1).id });
  assert.equal(state.completedQuests.length, QUESTS.length);
  assert.equal(state.questIdx, QUESTS.length - 1);
});
test('storage: malformed nested home and widget structures are bounded', () => {
  const state = normalizeProgressData({
    homePages: [null, {}, ['Settings', 42, 'unknown']],
    widgetPages: [null, {}, ['clock', 'unknown', 'clock']],
    widgetSizes: { clock: 'huge', weather: 'sm' },
    installedApps: ['math', 42, 'unknown', 'math'],
  });
  assert.ok(state.homePages.every(page => page.length === 40));
  assert.deepEqual(state.homePages[2].slice(0, 3), ['Settings', null, null]);
  assert.deepEqual(state.widgetPages[2], ['clock']);
  assert.deepEqual(state.installedApps, ['math']);
  assert.equal(state.widgetSizes.clock, undefined);
  assert.equal(state.widgetSizes.weather, 'sm');
});
test('storage: unsafe CSS and out-of-range visual settings normalize', () => {
  const state = normalizeProgressData({ wallpaper: 'url(https://example.invalid/tracker.png)', themeColor: 'url(x)', fontScale: 999, darkMode: 'false' });
  assert.ok(!state.wallpaper.includes('url'));
  assert.equal(state.themeColor, '#3b82f6');
  assert.equal(state.fontScale, 1.5);
  assert.equal(state.darkMode, false);
});
test('storage: save/read round trip uses stable IDs and correct EXP', () => withStorage(map => {
  const state = normalizeProgressData({ completedQuestIds: [0, 1], currentQuestId: 2 });
  assert.equal(saveProgress(state), null);
  const raw = JSON.parse(map.get(LS_KEY));
  assert.equal(raw.formatVersion, 3);
  assert.equal(raw.questIdx, undefined);
  assert.deepEqual(raw.completedQuestIds, [0, 1]);
  assert.equal(loadProgress().exp, state.exp);
}));
test('storage: corrupt JSON does not crash restoration', () => withStorage(map => {
  map.set(LS_KEY, '{broken');
  assert.equal(loadProgress().questIdx, 0);
}));
test('storage: reset removes app records and preserves unrelated storage', () => withStorage(map => {
  map.set(LS_KEY, '{}');
  map.set('android-explorer-files-v1', '{}');
  map.set('other-school-app', 'safe');
  assert.equal(clearProgress(), null);
  assert.equal(map.get('other-school-app'), 'safe');
  assert.ok(!map.has('android-explorer-files-v1'));
  assert.ok(!map.has(LS_KEY));
}));
test('storage: blocked local storage returns explicit errors', () => withStorage(() => {
  globalThis.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    get length() { throw new Error('blocked'); },
  };
  assert.equal(loadProgress().questIdx, 0);
  assert.ok(saveProgress(normalizeProgressData({})));
  assert.ok(clearProgress());
}));
