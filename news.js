const POSTS = [
  {title:"الجزائر تُطلق مشروعاً عملاقاً للطاقة الشمسية في الجنوب",category:"اقتصاد",date:"2026-05-29",url:"#"},
  {title:"اتحاد كرة القدم يُعلن عن الموعد الرسمي لبطولة الدوري الجديدة",category:"رياضة",date:"2026-05-28",url:"#"},
  {title:"تقنية الذكاء الاصطناعي تدخل الفصول الدراسية في المدارس الجزائرية",category:"تكنولوجيا",date:"2026-05-27",url:"#"},
  {title:"وهران تستعد لاستضافة مهرجان ثقافي دولي الصيف القادم",category:"ثقافة",date:"2026-05-26",url:"#"},
  {title:"ارتفاع ملحوظ في صادرات التمور الجزائرية إلى الأسواق الأوروبية",category:"اقتصاد",date:"2026-05-25",url:"#"},
  {title:"إطلاق تطبيق جديد يُسهّل الوصول إلى الخدمات الحكومية الرقمية",category:"تكنولوجيا",date:"2026-05-24",url:"#"},
  {title:"الفريق الوطني يحقق فوزاً كبيراً في التصفيات الإفريقية",category:"رياضة",date:"2026-05-23",url:"#"},
  {title:"افتتاح مكتبة رقمية ضخمة تضم آلاف الكتب العربية مجاناً",category:"ثقافة",date:"2026-05-22",url:"#"},
  {title:"اكتشاف لقاح جديد يُعالج أحد أمراض الجهاز التنفسي",category:"صحة",date:"2026-05-21",url:"#"},
];

const grid = document.getElementById('newsGrid');
const filterBtns = document.getElementById('filterBtns');
const stateLoading = document.getElementById('stateLoading');
const stateError = document.getElementById('stateError');
const stateEmpty = document.getElementById('stateEmpty');
const errMsg = document.getElementById('errMsg');

function formatDate(d){
  if(!d) return '';
  const dt = new Date(d);
  return isNaN(dt)?d:dt.toLocaleDateString('ar-DZ',{year:'numeric',month:'long',day:'numeric'});
}

function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}

function showState(s){
  stateLoading.classList.add('hidden');
  stateError.classList.add('hidden');
  stateEmpty.classList.add('hidden');
  grid.style.display='none';
  if(s==='loading') stateLoading.classList.remove('hidden');
  else if(s==='error') stateError.classList.remove('hidden');
  else if(s==='empty') stateEmpty.classList.remove('hidden');
  else grid.style.display='grid';
}

function buildCard(post, i){
  const catClass = 's-'+( post.category||'default');
  return `<article class="card" style="animation-delay:${i*70}ms">
    <div class="strip ${catClass}"></div>
    <div class="card-body">
      <div class="card-meta">
        <span class="cat-badge">${esc(post.category||'عام')}</span>
        <span class="card-date">${esc(formatDate(post.date))}</span>
      </div>
      <h2 class="card-title">${esc(post.title||'بدون عنوان')}</h2>
    </div>
    <div class="card-foot">
      <a href="${post.url||'#'}" class="read-more" target="_blank" rel="noopener">اقرأ المزيد ←</a>
    </div>
  </article>`;
}

function renderPosts(posts){
  if(!posts||posts.length===0){showState('empty');return;}
  grid.innerHTML=posts.map((p,i)=>buildCard(p,i)).join('');
  showState('grid');
}

function buildFilters(all){
  const cats=[...new Set(all.map(p=>p.category).filter(Boolean))];
  filterBtns.querySelectorAll('[data-cat]:not([data-cat="all"])').forEach(b=>b.remove());
  cats.forEach(c=>{
    const b=document.createElement('button');
    b.className='fbtn';b.dataset.cat=c;b.textContent=c;
    filterBtns.appendChild(b);
  });
}

filterBtns.addEventListener('click',e=>{
  const b=e.target.closest('.fbtn');if(!b)return;
  filterBtns.querySelectorAll('.fbtn').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const cat=b.dataset.cat;
  const posts=POSTS.sort((a,b2)=>new Date(b2.date)-new Date(a.date));
  renderPosts(cat==='all'?posts:posts.filter(p=>p.category===cat));
});

async function loadNews(){
  showState('loading');
  await new Promise(r=>setTimeout(r,900));
  try{
    if(!Array.isArray(POSTS)||POSTS.length===0) throw new Error('البيانات فارغة');
    const sorted=[...POSTS].sort((a,b)=>new Date(b.date)-new Date(a.date));
    buildFilters(sorted);
    renderPosts(sorted);
  }catch(e){
    errMsg.textContent=e.message||'حدث خطأ غير متوقع.';
    showState('error');
  }
}

const now=new Date();
document.getElementById('hDate').textContent=now.toLocaleDateString('ar-DZ',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
document.getElementById('fYear').textContent=now.getFullYear();
loadNews();
