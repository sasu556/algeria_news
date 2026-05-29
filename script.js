/* نبض الجزائر — script.js */
 
const newsGrid     = document.getElementById('newsGrid');
const loadingState = document.getElementById('loadingState');
const errorState   = document.getElementById('errorState');
const emptyState   = document.getElementById('emptyState');
const errorMessage = document.getElementById('errorMessage');
const filterButtons= document.getElementById('filterButtons');
const headerDate   = document.getElementById('headerDate');
const footerYear   = document.getElementById('footerYear');
 
/* ── Helpers ── */
function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString('ar-DZ', { year:'numeric', month:'long', day:'numeric' });
}
 
function esc(s) {
  const div = document.createElement('div');
  div.textContent = s || '';
  return div.innerHTML;
}
 
/* ── State display ── */
function showState(s) {
  [loadingState, errorState, emptyState].forEach(el => {
    if (el) el.style.display = 'none';
  });
  if (newsGrid) newsGrid.style.display = 'none';
 
  if      (s === 'loading' && loadingState) loadingState.style.display = 'flex';
  else if (s === 'error'   && errorState)   errorState.style.display   = 'flex';
  else if (s === 'empty'   && emptyState)   emptyState.style.display   = 'flex';
  else if (s === 'grid'    && newsGrid)      newsGrid.style.display     = 'grid';
}
 
/* ── Card builder ── */
function buildCard(post, i) {
  const cat = post.category || 'عام';
  return `
    <article class="news-card" style="animation-delay:${i * 80}ms">
      <div class="card-strip cat-${esc(cat)}"></div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-category">${esc(cat)}</span>
          <span class="card-date">${esc(formatDate(post.date))}</span>
        </div>
        <h2 class="card-title">${esc(post.title || 'بدون عنوان')}</h2>
      </div>
      <div class="card-footer">
        <a href="${post.url || '#'}" class="read-more" target="_blank" rel="noopener noreferrer">
          اقرأ المزيد <span class="arrow">←</span>
        </a>
      </div>
    </article>`;
}
 
/* ── Render ── */
function renderPosts(posts) {
  if (!posts || posts.length === 0) { showState('empty'); return; }
  newsGrid.innerHTML = posts.map((p, i) => buildCard(p, i)).join('');
  showState('grid');
}
 
/* ── Filters ── */
function buildFilters(allPosts) {
  const cats = [...new Set(allPosts.map(p => p.category).filter(Boolean))];
  filterButtons.querySelectorAll('[data-cat]:not([data-cat="all"])').forEach(b => b.remove());
 
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className   = 'filter-btn';
    btn.dataset.cat = cat;
    btn.textContent = cat;
    filterButtons.appendChild(btn);
  });
 
  filterButtons.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterButtons.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const sel = btn.dataset.cat;
    renderPosts(sel === 'all' ? allPosts : allPosts.filter(p => p.category === sel));
  });
}
 
/* ── Main fetch ── */
async function loadNews() {
  showState('loading');
  try {
    const res = await fetch('./posts.json');          // مسار صريح
 
    if (!res.ok) {
      throw new Error(`خطأ ${res.status}: تعذّر تحميل posts.json`);
    }
 
    const posts = await res.json();
 
    if (!Array.isArray(posts)) throw new Error('posts.json لا يحتوي على مصفوفة صحيحة');
    if (posts.length === 0)    { showState('empty'); return; }
 
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    buildFilters(posts);
    renderPosts(posts);
 
  } catch (err) {
    console.error('loadNews error:', err);
    if (errorMessage) errorMessage.textContent = err.message || 'حدث خطأ غير متوقع.';
    showState('error');
  }
}
 
/* ── Init ── */
(function init() {
  const now = new Date();
  if (headerDate) headerDate.textContent = now.toLocaleDateString('ar-DZ', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  if (footerYear) footerYear.textContent = now.getFullYear();
  loadNews();
})();
 
