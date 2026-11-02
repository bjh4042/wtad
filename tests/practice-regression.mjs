import { buildSync } from 'esbuild';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const load = path => {
  const result = buildSync({ entryPoints: [resolve(root, path)], absWorkingDir: root, bundle: true, platform: 'node', format: 'cjs', write: false, packages: 'external', loader: { '.png': 'dataurl', '.webp': 'dataurl', '.svg': 'dataurl' }, logLevel: 'silent' });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(require, mod, mod.exports);
  return mod.exports;
};
const { resolvePracticeAddress, default: InternetApp } = load('src/components/apps/InternetApp.tsx');
const { ActionTarget } = load('src/components/apps/shared.tsx');
const { QUESTS } = load('src/data/quests.ts');
const { getQuestFrontier, canVisitQuest } = load('src/hooks/useQuestEngine.ts');

// Outcome checks that catch previously observed false progression and dead controls.
test('curriculum IDs remain unique and only the final summary has no outcome target', () => {
  assert.equal(new Set(QUESTS.map(q => q.id)).size, QUESTS.length);
  assert.ok(QUESTS.length > 104);
  assert.equal(QUESTS.at(-1).targetId, null);
  assert.ok(QUESTS.slice(0, -1).every(q => typeof q.targetId === 'string' && q.targetId.length > 0));
  assert.ok(QUESTS.every(q => Number.isFinite(q.exp) && q.exp >= 0));
});
test('reviewing a completed mission cannot unlock an arbitrary future mission', () => {
  assert.equal(getQuestFrontier([0, 1, 2]), 3);
  assert.equal(canVisitQuest(0, [0, 1, 2]), true);
  assert.equal(canVisitQuest(3, [0, 1, 2]), true);
  assert.equal(canVisitQuest(QUESTS.length - 1, [0, 1, 2]), false);
  assert.equal(canVisitQuest(3.5, [0, 1, 2]), false);
  assert.equal(canVisitQuest(-1, [0]), false);
});
test('a hole in imported progress remains unfinished', () => {
  assert.equal(getQuestFrontier([0, 2, 3, 8]), 1);
  assert.equal(canVisitQuest(4, [0, 2, 3, 8]), false);
});
test('browser distinguishes a URL from Korean search terms', () => {
  assert.equal(resolvePracticeAddress(' naver.com ').view, 'naver');
  assert.equal(resolvePracticeAddress('https://www.naver.com/news').view, 'naver');
  const korean = resolvePracticeAddress('바다 동물');
  assert.equal(korean.view, 'results');
  assert.equal(new URL(korean.url).searchParams.get('q'), '바다 동물');
  assert.equal(resolvePracticeAddress('google.com').view, 'google');
});
test('deceptive hosts do not satisfy the real naver address practice', () => {
  assert.equal(resolvePracticeAddress('naver.com.example').view, 'site');
  assert.equal(resolvePracticeAddress('https://naver.com@evil.example').view, 'site');
  assert.equal(resolvePracticeAddress('https://notnaver.com').view, 'site');
});
test('blank and executable address input is rejected', () => {
  for (const value of ['', '  ', 'javascript:alert(1)', 'data:text/html,hello', 'file:///secret']) assert.equal(resolvePracticeAddress(value), null);
});
const click = (result, options = {}) => {
  const calls = [];
  const element = ActionTarget({ id: 'practice', currentTargetId: 'practice', advanceQuest: id => calls.push(id), onClick: () => { calls.push('action'); return result; } });
  const currentTarget = {};
  const event = { currentTarget, defaultPrevented: !!options.prevented,
    target: { closest: selector => selector === '[data-action-target]' ? options.nested ? {} : currentTarget : options.disabled ? {} : null } };
  element.props.onClick(event);
  return calls;
};
test('failed input validation does not complete an ActionTarget', () => {
  assert.deepEqual(click(false), ['action']);
  assert.deepEqual(click(undefined), ['action', 'practice']);
  assert.deepEqual(click(undefined, { prevented: true }), ['action']);
});
test('nested targets and disabled controls cannot double-run an operation', () => {
  assert.deepEqual(click(undefined, { nested: true }), []);
  assert.deepEqual(click(undefined, { disabled: true }), []);
});
test('address practice provides a real input and navigation accessibility labels', () => {
  const noop = () => {};
  const tab = { id: 1, title: '새 탭', url: '', view: 'newtab', history: [{ title: '새 탭', url: '', view: 'newtab' }], historyIndex: 0 };
  const markup = renderToStaticMarkup(React.createElement(InternetApp, {
    currentTargetId: 'internet-url-go', advanceQuest: noop, internetTabs: [tab], setInternetTabs: noop,
    internetActiveTabId: 1, setInternetActiveTabId: noop, internetUrlPanelOpen: true, setInternetUrlPanelOpen: noop,
    internetTabSwitcherOpen: false, setInternetTabSwitcherOpen: noop, internetBookmarks: [], setInternetBookmarks: noop,
    internetMenuOpen: false, setInternetMenuOpen: noop, internetKbInput: '', setInternetKbInput: noop,
    internetKbShift: false, setInternetKbShift: noop,
  }));
  assert.match(markup, /<input[^>]*aria-label="검색어 또는 웹 주소"/);
  assert.match(markup, /aria-label="앞으로 가기"/);
  assert.match(markup, /aria-label="인터넷 홈"/);
  assert.doesNotMatch(markup, /<iframe/);
});

const { normalizeProgressData, LEGACY_QUEST_IDS } = load('src/hooks/useProgressStorage.ts');
const { default: NavigationBar } = load('src/components/device/NavigationBar.tsx');
test('recent-apps button emits the exact outcome required by the curriculum', () => {
  const expected = QUESTS.find(q => q.id === 122).targetId;
  const outcomes = [];
  let opened = false;
  const element = NavigationBar({ currentTargetId: expected, advanceQuest: id => outcomes.push(id), setRecentAppsOpen: value => { opened = value; }, onHome() {} });
  const recent = React.Children.toArray(element.props.children).find(child => child.props?.['aria-label'] === '최근 앱');
  assert.ok(recent, 'Recent apps must be reachable as a labelled control.');
  recent.props.onClick();
  assert.equal(opened, true);
  assert.ok(outcomes.includes(expected), `Expected ${expected}, received ${outcomes.join(', ')}.`);
});
test('old completion does not award newly added lessons or a false finish', () => {
  const old = normalizeProgressData({ completedQuestIds: LEGACY_QUEST_IDS, currentQuestId: 103, exp: 999999 });
  assert.ok(!old.completedQuests.includes(QUESTS.findIndex(q => q.id === 103)));
  assert.ok(QUESTS[old.questIdx].targetId !== null);
  assert.equal(old.exp, old.completedQuests.reduce((total, index) => total + QUESTS[index].exp, 0));
});
test('legacy index 39 maps to Bluetooth confirmation, not the task whose ID is 39', () => {
  const restored = normalizeProgressData({ completedQuests: [39], questIdx: 39 });
  assert.deepEqual(restored.completedQuests.map(i => QUESTS[i].id), [75]);
});
test('malformed progress is bounded and cannot inject arbitrary wallpaper requests', () => {
  for (const raw of [null, [], 'bad', 123]) assert.equal(normalizeProgressData(raw).questIdx, 0);
  const restored = normalizeProgressData({ fontScale: 100, exp: Infinity, homePages: [null, ['UnknownApp', 'Camera']], widgetPages: [null], themeColor: 'url(https://example.invalid)', wallpaper: 'url(https://example.invalid)', completedQuestIds: [0, 0, -7, '1', null] });
  assert.equal(restored.fontScale, 1.5);
  assert.equal(restored.homePages[1][0], null);
  assert.equal(restored.homePages[1][1], 'Camera');
  assert.equal(restored.completedQuests.length, 1);
  assert.ok(!restored.wallpaper.includes('url('));
  assert.equal(restored.themeColor, '#3b82f6');
});
