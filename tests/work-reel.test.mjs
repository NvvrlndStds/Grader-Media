import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/css/styles.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8');

const videos = [
  ['QF_BXrpLnRo', 'AWB Product Expo', 'Event highlight'],
  ['JmKjJGUviDU', 'KIDDO Conference 2026', 'Conference'],
  ['hdB-ziZscIU', 'Premier People Training Award', 'Training award'],
  ['gEcIoS02pAQ', 'PlayPro × Little Creatures', 'Brand film'],
  ['WsoJNZzvSqo', 'Bloom Beechboro', 'Centre promo'],
  ['kdBJt2nTGe8', 'NJ Construction Hector Office', 'Project film'],
  ['4-d--kxHDNg', 'PlayPro × Hartley Park', 'Brand film'],
];

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start !== -1 && end !== -1, startMarker);
  return source.slice(start, end);
}

const reel = sliceBetween(html, 'id="work-reel"', '<div class="work-grid">');
const gridStart = html.indexOf('      <div class="work-grid">');
const gridEnd = html.indexOf('      </div>\n    </div>\n  </section>', gridStart);
const grid = html.slice(gridStart, gridEnd + '      </div>'.length);

test('approved landscape videos lead Recent projects, in order', () => {
  let cursor = -1;
  for (const [id, title, category] of videos) {
    const at = reel.indexOf(id, cursor + 1);
    assert.ok(at > cursor, id);
    const window = reel.slice(at, at + 500);
    assert.ok(window.includes(title), title);
    assert.ok(window.includes(category), category);
    cursor = at;
  }
  assert.equal(reel.includes('I9wXO8VznQk'), false);
  assert.equal(html.includes('kWy4ITVA1yk'), false);
  assert.equal(html.includes('Bd3XuVUc1xc'), false);
  assert.equal(html.includes('XSqZo0-31tA'), false);
});

test('the reel does not embed videos up front', () => {
  assert.equal(html.includes('<iframe'), false);
  assert.equal(html.includes('youtube-nocookie.com/embed'), false);
  assert.match(js, /youtube-nocookie\.com\/embed/);
  assert.match(js, /stopPlayback/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(css, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.equal(/\.work-reel[^{]*\{[^}]*max-height/s.test(css), false);
});

test('existing recent-project cards stay byte-for-byte', () => {
  const hash = createHash('sha256').update(grid).digest('hex');
  assert.equal(hash, 'fd900c763b7b5af1758bd8aa606e6ba648b0f60668fd4e19066977a1e1436f0b');
  assert.match(html, /id="work"/);
  assert.match(html, /href="#work"/);
});

test('new copy does not add excluded names', () => {
  assert.equal(/toyota/i.test(html + css + js), false);
  assert.equal(reel.includes('The Grid'), false);
  assert.equal(/wedding/i.test(reel), false);
  assert.match(grid, /The Grid/);
});
