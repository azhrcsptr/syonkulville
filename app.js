/* ==========================================================================
   app.js — logika website. Isi/konten ada di config.js, bukan di sini.
   ========================================================================== */
const C = CONFIG;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const fmtHM = ts => { const d = new Date(ts); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const fmtDate = d => `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const longDate = s => { const d = new Date(s); return isNaN(d) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const T0 = Date.now();

const GR = ['linear-gradient(135deg,#ffd1dc,#ff8fb1)','linear-gradient(135deg,#bde0fe,#6fa8ff)','linear-gradient(135deg,#e0c3fc,#a78bfa)','linear-gradient(135deg,#c1f0d6,#4cc9a0)','linear-gradient(135deg,#ffd6a5,#ff9770)','linear-gradient(135deg,#fbc2eb,#a6c1ee)'];
const EM = ['🌸','🌙','🍓','🌊','🎧','✨'];
const gradFor = s => { let h = 0; for(const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return GR[h % GR.length]; };
function avatarHTML(a){
  const name = a.username || a.name || '?';
  const ini = esc((name.replace(/[^a-z0-9]/gi, '').charAt(0) || '?').toUpperCase());
  return `<div class="av" data-i="${ini}" style="background:${gradFor(name)}">${a.avatar ? `<img src="${esc(a.avatar)}" alt="">` : ini}</div>`;
}

const phone = $('#phone');
let current = null, locked = true;
document.title = C.siteName;
$('#brand').textContent = C.siteName;
$('#igLogo').textContent = C.igName || 'wishgram';

/* wallpaper (kalau gambar gagal dimuat, otomatis jatuh ke gradien) */
{
  const url = u => `url("${String(u).replace(/"/g, '%22')}") center/cover no-repeat, var(--wall)`;
  const wl = C.wallpaperLock || C.wallpaperHome, wh = C.wallpaperHome || C.wallpaperLock;
  if(wl) phone.style.setProperty('--wall-lock', url(wl));
  if(wh) phone.style.setProperty('--wall-home', url(wh));
}
$('#hiText').textContent = 'Halo, ' + C.me.username + ' ✨';

/* gambar yang gagal dimuat -> ganti placeholder */
document.addEventListener('error', e => {
  const t = e.target; if(!t || t.tagName !== 'IMG') return;
  const av = t.closest('.av'); if(av){ av.textContent = av.dataset.i || '?'; return; }
  const tile = t.closest('.tile'); if(tile){ tile.style.background = GR[(+tile.dataset.i || 0) % GR.length]; tile.textContent = '🖼️'; return; }
  const pic = t.closest('.pic'); if(pic){ t.remove(); pic.style.background = GR[0]; pic.insertAdjacentText('afterbegin', '🖼️'); }
}, true);

let toastT;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800);
}

function fit(){
  if(innerWidth <= 500){ phone.style.setProperty('--s', 1); return; }
  phone.style.setProperty('--s', Math.min(1, (innerHeight - 40) / 868));
}
addEventListener('resize', fit); fit();

function tick(){
  const d = new Date();
  const hm = `${d.getHours()}:${pad(d.getMinutes())}`;
  $('#sbTime').textContent = hm; $('#lkTime').textContent = hm; $('#hiTime').textContent = hm;
  $('#lkDate').textContent = fmtDate(d); $('#hiDate').textContent = fmtDate(d);
}
tick(); setInterval(tick, 1000);

function setBar(mode){
  const dark = mode === 'dark';
  phone.style.setProperty('--bar', dark ? '#111' : '#fff');
  $('#indicator').style.background = dark ? '#111' : '#fff';
}

/* ====== lock screen ====== */
const lock = $('#lock');
function unlock(){
  if(!locked) return;
  locked = false; lock.classList.add('gone'); lock.style.transform = '';
  startIncoming();
}
function relock(){
  if(current) closeApp();
  $('#banner').classList.remove('show');
  locked = true; lock.classList.remove('gone'); lock.style.transform = '';
}

/* passcode */
const PASS = String(C.passcode || '');
let entry = '', passThen = null;
const passEl = $('#pass'), pdots = $('#pdots');
$('#keys').innerHTML = ['1','2','3','4','5','6','7','8','9','','0','act'].map(k =>
  k === '' ? '<button class="sp" tabindex="-1"></button>'
  : `<button data-k="${k}" class="${k === 'act' ? 'act' : ''}">${k === 'act' ? 'Batal' : k}</button>`).join('');
function drawDots(){
  pdots.innerHTML = Array.from({ length: PASS.length }, (_, i) => `<i class="${i < entry.length ? 'f' : ''}"></i>`).join('');
  $('#keys .act').textContent = entry ? 'Hapus' : 'Batal';
}
function showPass(){ entry = ''; $('#passErr').textContent = ''; drawDots(); passEl.classList.add('show'); }
function hidePass(){ passEl.classList.remove('show'); entry = ''; passThen = null; }
function requestUnlock(then){
  if(!locked) return;
  if(!PASS){ unlock(); if(then) then(); return; }
  lock.style.transform = ''; passThen = then || null; showPass();
}
function pressKey(k){
  if(!passEl.classList.contains('show')) return;
  if(k === 'act'){ if(entry) entry = entry.slice(0, -1); else hidePass(); drawDots(); return; }
  if(entry.length >= PASS.length) return;
  entry += k; drawDots();
  if(entry.length < PASS.length) return;
  if(entry === PASS){
    const then = passThen;
    setTimeout(() => { passEl.classList.remove('show'); entry = ''; passThen = null; unlock(); if(then) then(); }, 150);
  } else {
    pdots.classList.add('shake'); $('#passErr').textContent = 'Kode salah, coba lagi';
    setTimeout(() => { pdots.classList.remove('shake'); entry = ''; drawDots(); }, 450);
  }
}
$('#keys').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if(b) pressKey(b.dataset.k); });
addEventListener('keydown', e => {
  if(!passEl.classList.contains('show')) return;
  if(/^[0-9]$/.test(e.key)) pressKey(e.key);
  else if(e.key === 'Backspace' && entry) pressKey('act');
  else if(e.key === 'Escape') hidePass();
});

let startY = null, dy = 0, tapId = null;
lock.addEventListener('pointerdown', e => {
  if(e.target.closest('.qbtn')) return;
  const n = e.target.closest('.lk-notif'); tapId = n ? n.dataset.id : null;
  startY = e.clientY; dy = 0; lock.classList.add('drag'); lock.setPointerCapture(e.pointerId);
});
lock.addEventListener('pointermove', e => {
  if(startY === null) return;
  dy = Math.min(0, (e.clientY - startY) / (parseFloat(phone.style.getPropertyValue('--s')) || 1));
  lock.style.transform = `translateY(${dy}px)`;
});
function endDrag(){
  if(startY === null) return;
  lock.classList.remove('drag');
  const tap = Math.abs(dy) < 6;
  if(tap || dy < -110){
    const id = tap ? tapId : null;
    requestUnlock(id ? () => gotoChat(id) : null);
  } else lock.style.transform = '';
  startY = null; tapId = null;
}
lock.addEventListener('pointerup', endDrag);
lock.addEventListener('pointercancel', endDrag);
$('#torch').addEventListener('click', e => {
  e.stopPropagation();
  const on = lock.classList.toggle('torch');
  e.currentTarget.classList.toggle('on', on);
});
$('#cam').addEventListener('click', e => { e.stopPropagation(); toast('Kamera belum tersedia'); });
$('#island').addEventListener('click', () => { if(!locked) relock(); });

/* ====== home ====== */
const APPS = [
  { id:'ig',    name:C.igName || 'wishgram', bg:'linear-gradient(45deg,#ffb347,#ff3f8e,#9b4dff)', html:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="#fff"/></svg>' },
  { id:'msg',   name:'Pesan',    bg:'linear-gradient(#5be26f,#1db954)', badge:true, html:'<svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4.5 21l4-2.2c1.1.3 2.3.4 3.5.4 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/></svg>' },
  { id:'notes', name:'Catatan',  bg:'linear-gradient(#fff6c2,#ffd54a)', html:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a37a00" stroke-width="2" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h9"/></svg>' },
  { id:'photos', name:'Foto',    bg:'linear-gradient(135deg,#ffe29f,#ff719a)', html:'🌸' },
  { id:'music', name:'Musik',    bg:'linear-gradient(#ff6a88,#ff2d55)', html:'🎵' },
  { id:'x3',    name:'Pengaturan', bg:'linear-gradient(#b8bcc4,#7d828c)', html:'⚙️' }
];
const DOCK = [
  { id:'phone', name:'Telepon', bg:'linear-gradient(#5be26f,#1db954)', html:'📞' },
  { id:'x5',    name:'Web',     bg:'linear-gradient(#5ac8fa,#0a84ff)', html:'🧭' },
  { id:'x6',    name:'Kamera',  bg:'linear-gradient(#cfd3da,#8e939c)', html:'📷' },
  { id:'maps',  name:'Peta',    bg:'linear-gradient(#a8e6a1,#4cb8ff)', html:'🗺️' }
];
const icoHTML = a => `<button class="ico" data-app="${a.id}"><i style="background:${a.bg}">${a.html}${a.badge ? '<em class="badge" id="msgBadge" hidden></em>' : ''}</i><span>${esc(a.name)}</span></button>`;
$('#grid').innerHTML = APPS.map(icoHTML).join('');
$('#dock').innerHTML = DOCK.map(icoHTML).join('');

const REAL = {ig:'#app-ig', msg:'#app-msg', notes:'#app-notes', photos:'#app-photos', music:'#app-music', phone:'#app-phone', maps:'#app-maps'};
function openApp(id, el){
  if(locked) return;
  if(!REAL[id]){ toast('App ini belum tersedia'); return; }
  const app = $(REAL[id]);
  const pr = phone.getBoundingClientRect();
  const r = (el || phone).getBoundingClientRect();
  const s = pr.width / phone.offsetWidth;
  app.style.transformOrigin = `${(r.left + r.width / 2 - pr.left) / s}px ${(r.top + r.height / 2 - pr.top) / s}px`;
  app.classList.add('open'); current = id; setBar(app.dataset.bar);
  if(id === 'msg') renderConvs();
  if(id === 'notes') renderNotes();
  if(id === 'phone') renderCalls();
  if(id === 'maps') initMap();
}
function closeApp(){
  if(!current) return;
  if($('#viewer').classList.contains('show')) closeViewer();
  if($('#player').classList.contains('show')) closePlayer();
  if($('#sv').classList.contains('show')) closeStory();
  $(REAL[current]).classList.remove('open'); current = null; setBar('light');
}
document.addEventListener('click', e => {
  const b = e.target.closest('.ico'); if(b) openApp(b.dataset.app, b.querySelector('i'));
});
$('#indicator').addEventListener('click', () => {
  if(!current) return;
  if(current === 'msg' && $('#app-msg').classList.contains('in-thread')){ closeThread(); return; }
  if(current === 'notes' && $('#app-notes').classList.contains('editing')){ closeNote(); return; }
  if(current === 'photos' && $('#viewer').classList.contains('show')){ closeViewer(); return; }
  if(current === 'music' && $('#player').classList.contains('show')){ closePlayer(); return; }
  if(current === 'ig' && $('#sv').classList.contains('show')){ closeStory(); return; }
  closeApp();
});

/* ====== INSTAGRAM ====== */
const me = C.me, accounts = C.accounts || [];
const findAcc = u => u === me.username ? me : accounts.find(a => a.username === u);
const posts = (C.posts && C.posts.length) ? C.posts : accounts.map(a => ({ user: a.username, img: '', caption: '', likes: 0 }));
const seen = {}, liked = {};
let igTab = 'home';
const ICON = {
  heart:'<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  cmt:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.1A8.4 8.4 0 1 1 21 11.5z"/></svg>',
  send:'<svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>'
};
function storyHTML(a, label){
  const has = a.stories && a.stories.length;
  return `<div class="story" data-u="${esc(a.username)}"><div class="ring ${has && !seen[a.username] ? '' : 'none'}">${avatarHTML(a)}</div><span class="sl">${esc(label || a.username)}</span></div>`;
}
function renderIG(){
  document.querySelectorAll('#igTabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === igTab));
  $('#igScroll').innerHTML = igTab === 'profile' ? profileHTML() : feedHTML();
}
function feedHTML(){
  const stories = storyHTML(me, 'Cerita kamu') + accounts.map(a => storyHTML(a)).join('');
  const list = posts.map((p, i) => {
    const u = findAcc(p.user) || { username: p.user };
    const on = !!liked[i];
    const pic = p.img ? `<img src="${esc(p.img)}" alt="">` : EM[i % EM.length];
    return `<div class="post" data-i="${i}">
      <div class="ph">${avatarHTML(u)}${esc(u.username)}</div>
      <div class="pic" style="background:${p.img ? '#eee' : GR[i % GR.length]}">${pic}<div class="pop">❤️</div></div>
      <div class="bar"><button class="lk ${on ? 'liked' : ''}" aria-label="Suka">${ICON.heart}</button><button class="cm" aria-label="Komentar">${ICON.cmt}</button><button class="sd" aria-label="Kirim">${ICON.send}</button></div>
      <div class="likes">${(p.likes || 0) + (on ? 1 : 0)} suka</div>
      ${p.caption ? `<div class="cap"><b>${esc(u.username)}</b>${esc(p.caption)}</div>` : '<div style="height:14px"></div>'}
    </div>`;
  }).join('');
  return `<div class="stories">${stories}</div>${list}`;
}
function profileHTML(){
  const mine = (C.posts || []).filter(p => p.user === me.username);
  const tiles = mine.length
    ? mine.map((p, i) => `<div class="tile" data-i="${i}"><img loading="lazy" src="${esc(p.img)}" alt=""></div>`).join('')
    : Array.from({ length: 9 }, (_, i) => `<div class="tile empty" style="background:${GR[i % GR.length]}">${EM[i % EM.length]}</div>`).join('');
  return `<div class="prof">
    <div class="prof-top">${avatarHTML(me)}<div class="stats"><div><b>${mine.length}</b><span>postingan</span></div><div><b>${esc(me.followers || '0')}</b><span>pengikut</span></div><div><b>${esc(me.following || '0')}</b><span>mengikuti</span></div></div></div>
    <div class="prof-name">${esc(me.username)}</div>
    <div class="prof-bio">${esc(me.bio || '')}</div>
    <div class="prof-btns"><button>Edit profil</button><button>Bagikan profil</button></div>
    <div class="pgrid">${tiles}</div></div>`;
}
function setLike(i, on, node){
  if(on) liked[i] = true; else delete liked[i];
  node.querySelector('.lk').classList.toggle('liked', on);
  node.querySelector('.likes').textContent = ((posts[i].likes || 0) + (on ? 1 : 0)) + ' suka';
}
$('#igScroll').addEventListener('click', e => {
  const st = e.target.closest('.story'); if(st){ openStory(st.dataset.u); return; }
  const post = e.target.closest('.post'); if(!post) return;
  const i = +post.dataset.i;
  if(e.target.closest('.lk')){ setLike(i, !liked[i], post); return; }
  if(e.target.closest('.cm')){ toast('Komentar belum tersedia'); return; }
  if(e.target.closest('.sd')){ toast('Link disalin 🔗'); return; }
});
$('#igScroll').addEventListener('dblclick', e => {
  const pic = e.target.closest('.pic'); if(!pic) return;
  const post = pic.closest('.post'); setLike(+post.dataset.i, true, post);
  const pop = pic.querySelector('.pop');
  pop.classList.remove('go'); void pop.offsetWidth; pop.classList.add('go');
});
$('#igTabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.tab === 'home' || b.dataset.tab === 'profile'){ igTab = b.dataset.tab; renderIG(); }
  else toast('Belum tersedia');
});

/* story viewer */
let svUser = null, svItems = [], svI = 0, svT = null;
function openStory(u){
  const a = findAcc(u); const items = (a && a.stories) || [];
  if(!items.length){ toast('Belum ada story'); return; }
  svUser = u; svItems = items; svI = 0;
  $('#sv').classList.add('show'); setBar('light'); drawStory();
}
function drawStory(){
  clearTimeout(svT);
  $('#svBars').innerHTML = svItems.map((_, i) => `<i class="${i < svI ? 'done' : i === svI ? 'cur' : ''}"><b></b></i>`).join('');
  $('#svStage').innerHTML = `<img src="${esc(svItems[svI])}" alt="">`;
  $('#svName').textContent = svUser;
  $('#svAv').innerHTML = avatarHTML(findAcc(svUser) || { username: svUser });
  svT = setTimeout(nextStory, 5000);
}
function nextStory(){ if(svI < svItems.length - 1){ svI++; drawStory(); } else closeStory(); }
function prevStory(){ if(svI > 0) svI--; drawStory(); }
function closeStory(){
  clearTimeout(svT); $('#sv').classList.remove('show'); setBar('dark');
  if(svUser) seen[svUser] = true;
  svUser = null; renderIG();
}
$('#svR').addEventListener('click', nextStory);
$('#svL').addEventListener('click', prevStory);
$('#svClose').addEventListener('click', closeStory);
renderIG();

/* ====== PESAN ====== */
const chats = C.chats || [];
chats.forEach(c => {
  const src = c.messages || [], n = src.length;
  c.msgs = src.map((m, i) => ({ me: !!m.me, t: m.text, ts: T0 - (m.ago != null ? m.ago * 60000 : (n - i) * 180000) }));
  c.ri = 0;
});
const chatById = id => chats.find(c => c.id === id);
const unread = {};
let openConv = null, started = false;
const mApp = $('#app-msg');

function updateBadge(){
  const n = Object.values(unread).reduce((a, b) => a + b, 0);
  const b = $('#msgBadge'); b.textContent = n; b.hidden = !n;
}
function renderConvs(){
  const withMsgs = chats.filter(c => c.msgs.length).sort((a, b) => b.msgs[b.msgs.length - 1].ts - a.msgs[a.msgs.length - 1].ts);
  const empty = chats.filter(c => !c.msgs.length);
  $('#convList').innerHTML = withMsgs.concat(empty).map(c => {
    const last = c.msgs[c.msgs.length - 1];
    return `<div class="conv" data-k="${esc(c.id)}">${unread[c.id] ? '<i class="dot"></i>' : ''}${avatarHTML(c)}
      <div class="txt"><div class="row"><b>${esc(c.name)}</b><span>${last ? fmtHM(last.ts) : ''}</span></div>
      <div class="last ${last ? '' : 'none'}">${last ? (last.me ? 'Kamu: ' : '') + esc(last.t) : 'Belum ada pesan'}</div></div></div>`;
  }).join('');
}
const bubble = m => `<div class="b ${m.me ? 'me' : 'them'}">${esc(m.t)}</div>`;
function scrollBottom(){ const b = $('#bubbles'); b.scrollTop = b.scrollHeight; }
function addBubble(m){
  const box = $('#bubbles'); const em = box.querySelector('.t-empty'); if(em) em.remove();
  box.insertAdjacentHTML('beforeend', bubble(m)); scrollBottom();
}
function openThread(id){
  const c = chatById(id); if(!c) return;
  openConv = id; unread[id] = 0; updateBadge(); markLockRead(id);
  $('#thAv').innerHTML = avatarHTML(c); $('#thName').textContent = c.name;
  $('#bubbles').innerHTML = c.msgs.length ? c.msgs.map(bubble).join('') : '<div class="t-empty">iMessage</div>';
  mApp.classList.add('in-thread');
  $('#mThread').style.transform = 'none'; $('#mList').style.transform = 'translateX(-30%)';
  setTimeout(scrollBottom, 30);
}
function closeThread(){
  mApp.classList.remove('in-thread'); openConv = null;
  $('#mThread').style.transform = 'translateX(100%)'; $('#mList').style.transform = '';
  renderConvs();
}
$('#convList').addEventListener('click', e => { const r = e.target.closest('.conv'); if(r) openThread(r.dataset.k); });
$('#mBack').addEventListener('click', closeThread);
$('#composer').addEventListener('submit', e => {
  e.preventDefault();
  const inp = $('#msgInput'), text = inp.value.trim(); if(!text || !openConv) return;
  const id = openConv, c = chatById(id); inp.value = '';
  const m = { me: true, t: text, ts: Date.now() }; c.msgs.push(m); addBubble(m);
  if(!c.replies || !c.replies.length) return;
  const reply = c.replies[c.ri++ % c.replies.length];
  setTimeout(() => {
    if(openConv !== id) { deliver(c, reply); return; }
    $('#bubbles').insertAdjacentHTML('beforeend', '<div class="b them typing" id="typing"><i></i><i></i><i></i></div>'); scrollBottom();
    setTimeout(() => {
      const t = $('#typing'); if(t) t.remove();
      const rm = { me: false, t: reply, ts: Date.now() }; c.msgs.push(rm);
      if(openConv === id) addBubble(rm); else deliver(c, null, rm);
    }, 1100 + Math.random() * 900);
  }, 500);
});

/* notifikasi di lockscreen (pesannya ikut masuk ke chat + badge) */
const lockNotifs = [];
(C.lockNotifications || []).forEach(n => {
  const c = chatById(n.from); if(!c) return;
  const ts = T0 - (n.ago || 0) * 60000;
  c.msgs.push({ me: false, t: n.text, ts }); c.msgs.sort((a, b) => a.ts - b.ts);
  unread[c.id] = (unread[c.id] || 0) + 1;
  lockNotifs.push({ id: c.id, text: n.text, ago: n.ago || 0, read: false });
});
updateBadge();
const agoText = m => m < 1 ? 'sekarang' : m < 60 ? m + ' mnt lalu' : Math.floor(m / 60) + ' jam lalu';
function renderLockNotifs(){
  $('#lkNotifs').innerHTML = lockNotifs.filter(n => !n.read).map(n => {
    const c = chatById(n.id);
    return `<div class="lk-notif" data-id="${esc(n.id)}">${avatarHTML(c)}<div class="tx"><b>${esc(c.name)}<em>${agoText(n.ago)}</em></b><span>${esc(n.text)}</span></div></div>`;
  }).join('');
}
function markLockRead(id){ lockNotifs.forEach(n => { if(n.id === id) n.read = true; }); renderLockNotifs(); }
renderLockNotifs();

/* pesan masuk otomatis + notifikasi */
let bnT;
function showBanner(c, text){
  $('#bnAv').innerHTML = avatarHTML(c); $('#bnName').textContent = c.name; $('#bnText').textContent = text;
  const b = $('#banner'); b.dataset.id = c.id; b.classList.add('show');
  clearTimeout(bnT); bnT = setTimeout(() => b.classList.remove('show'), 4500);
}
function deliver(c, text, ready){
  const m = ready || { me: false, t: text, ts: Date.now() };
  if(!ready) c.msgs.push(m);
  if(current === 'msg' && openConv === c.id){ addBubble(m); return; }
  unread[c.id] = (unread[c.id] || 0) + 1; updateBadge();
  showBanner(c, m.t);
  if(current === 'msg') renderConvs();
}
function startIncoming(){
  if(started) return; started = true;
  (C.incoming || []).forEach(x => {
    const c = chatById(x.from); if(!c) return;
    setTimeout(() => deliver(c, x.text), Math.max(0, (x.after || 0)) * 1000);
  });
}
function gotoChat(id){
  if(locked){ requestUnlock(() => gotoChat(id)); return; }
  if(current && current !== 'msg') closeApp();
  if(current !== 'msg') openApp('msg', document.querySelector('.ico[data-app="msg"] i'));
  openThread(id);
}
$('#banner').addEventListener('click', e => {
  const b = e.currentTarget; b.classList.remove('show'); gotoChat(b.dataset.id);
});

/* ====== CATATAN ====== */
let notes = (C.notes || []).map((n, i) => ({ id: 'c' + i, ts: T0 - (n.ago != null ? n.ago * 60000 : (i + 1) * 3600000), text: n.text || '' }));
let editing = null;
const nApp = $('#app-notes');
const noteTitle = t => (t.split('\n')[0].trim() || 'Catatan baru');
const notePrev = t => (t.split('\n').slice(1).join(' ').trim() || 'Tidak ada teks tambahan');
function renderNotes(){
  const sorted = [...notes].sort((a, b) => b.ts - a.ts);
  $('#nCards').innerHTML = sorted.length
    ? sorted.map(n => `<div class="n-card" data-id="${n.id}"><b>${esc(noteTitle(n.text))}</b><span>${fmtDate(new Date(n.ts)).split(',')[1].trim()}  ${esc(notePrev(n.text))}</span></div>`).join('')
    : '<div class="n-empty">Belum ada catatan.<br>Ketuk ＋ untuk bikin yang baru.</div>';
}
function openNote(id){
  editing = notes.find(n => String(n.id) === String(id)); if(!editing) return;
  $('#nText').value = editing.text; $('#nDate').textContent = fmtDate(new Date(editing.ts)) + ' ' + fmtHM(editing.ts);
  nApp.classList.add('editing');
  $('#nEdit').style.transform = 'none'; $('#nList').style.transform = 'translateX(-30%)';
  if(!editing.text) setTimeout(() => $('#nText').focus(), 320);
}
function closeNote(){
  $('#nText').blur();
  if(editing && !editing.text.trim()) notes = notes.filter(n => n.id !== editing.id);
  editing = null; nApp.classList.remove('editing');
  $('#nEdit').style.transform = 'translateX(100%)'; $('#nList').style.transform = '';
  renderNotes();
}
$('#nAdd').addEventListener('click', () => {
  const n = { id: 'u' + Date.now(), ts: Date.now(), text: '' }; notes.push(n); openNote(n.id);
});
$('#nCards').addEventListener('click', e => { const c = e.target.closest('.n-card'); if(c) openNote(c.dataset.id); });
$('#nBack').addEventListener('click', closeNote);
$('#nDel').addEventListener('click', () => { if(!editing) return; editing.text = ''; closeNote(); toast('Catatan dihapus'); });
$('#nText').addEventListener('input', e => { if(editing){ editing.text = e.target.value; editing.ts = Date.now(); } });

/* ====== FOTO ====== */
const photos = C.photos || [];
const pgrid = $('#pgrid'), viewer = $('#viewer');
let vi = -1;
function renderPhotos(){
  if(!photos.length){
    $('#phSub').textContent = 'Belum ada foto';
    pgrid.innerHTML = Array.from({ length: 12 }, (_, i) => `<div class="tile empty" data-i="-1" style="background:${GR[i % GR.length]}">${EM[i % EM.length]}</div>`).join('');
    return;
  }
  $('#phSub').textContent = photos.length + ' foto';
  pgrid.innerHTML = photos.map((p, i) => `<div class="tile" data-i="${i}"><img loading="lazy" src="${esc(p.src)}" alt="${esc(p.caption || '')}"></div>`).join('');
}
pgrid.addEventListener('click', e => {
  const t = e.target.closest('.tile'); if(!t) return;
  if(+t.dataset.i < 0){ toast('Isi fotomu di config.js'); return; }
  showPhoto(+t.dataset.i);
});
function showPhoto(i){
  if(!photos.length) return;
  vi = (i + photos.length) % photos.length;
  const p = photos[vi];
  $('#vStage').innerHTML = `<img src="${esc(p.src)}" alt="">`;
  $('#vCap').textContent = p.caption || '';
  $('#vDate').textContent = p.date ? longDate(p.date) : '';
  $('#vCount').textContent = `${vi + 1} / ${photos.length}`;
  if(!viewer.classList.contains('show')){ viewer.classList.add('show'); setBar('light'); }
}
function closeViewer(){ viewer.classList.remove('show'); setBar('dark'); }
$('#vClose').addEventListener('click', closeViewer);
$('#vPrev').addEventListener('click', () => showPhoto(vi - 1));
$('#vNext').addEventListener('click', () => showPhoto(vi + 1));
let vx = null;
viewer.addEventListener('pointerdown', e => { if(!e.target.closest('button')) vx = e.clientX; });
viewer.addEventListener('pointerup', e => {
  if(vx === null) return;
  const dx = e.clientX - vx; vx = null;
  if(Math.abs(dx) > 50) showPhoto(vi + (dx < 0 ? 1 : -1));
});
addEventListener('keydown', e => {
  if(!viewer.classList.contains('show')) return;
  if(e.key === 'ArrowRight') showPhoto(vi + 1);
  else if(e.key === 'ArrowLeft') showPhoto(vi - 1);
  else if(e.key === 'Escape') closeViewer();
});
renderPhotos();

/* ====== MUSIK ====== */
const tracks = C.tracks || [];
const audio = new Audio(); audio.preload = 'metadata';
let ti = -1, repeat = false, shuffle = false;
const fmtT = s => { if(!isFinite(s)) return '0:00'; s = Math.floor(s); return Math.floor(s / 60) + ':' + pad(s % 60); };
const wrap = i => ((i % tracks.length) + tracks.length) % tracks.length;
function setCover(el, t, i){
  el.style.background = GR[i % GR.length]; el.textContent = '🎵';
  if(t && t.cover){
    const im = new Image(); im.alt = '';
    im.onload = () => { el.textContent = ''; el.appendChild(im); };
    im.src = t.cover;
  }
}
function renderTracks(){
  const list = $('#trkList');
  if(!tracks.length){
    $('#muSub').textContent = plURL ? 'Playlist' : 'Belum ada lagu';
    list.innerHTML = plURL ? '' : '<div class="empty-note">🎵<br>Belum ada lagu.<br>Taruh file mp3 di folder <b>music/</b>,<br>lalu daftarin di <b>config.js</b>.</div>';
    return;
  }
  $('#muSub').textContent = tracks.length + ' lagu';
  list.innerHTML = tracks.map((t, i) => `<div class="trk ${i === ti ? 'playing' : ''}" data-i="${i}"><div class="cv"></div><div class="tx"><b>${esc(t.title || 'Tanpa judul')}</b><span>${esc(t.artist || '')}</span></div></div>`).join('');
  list.querySelectorAll('.trk').forEach((row, i) => setCover(row.querySelector('.cv'), tracks[i], i));
}
function playTrack(i){
  if(!tracks.length) return;
  ti = wrap(i); const t = tracks[ti];
  audio.src = t.src; audio.play().catch(() => {});
  $('#miniT').textContent = $('#plT').textContent = t.title || 'Tanpa judul';
  $('#miniA').textContent = $('#plA').textContent = t.artist || '';
  setCover($('#miniCv'), t, ti); setCover($('#plCover'), t, ti);
  $('#seek').value = 0; $('#tCur').textContent = '0:00'; $('#tDur').textContent = '0:00';
  $('#mini').classList.add('show');
  renderTracks();
  if('mediaSession' in navigator){
    try{ navigator.mediaSession.metadata = new MediaMetadata({ title: t.title || '', artist: t.artist || '' }); }catch(e){}
  }
}
const nextIdx = () => shuffle && tracks.length > 1 ? Math.floor(Math.random() * tracks.length) : ti + 1;
function toggle(){
  if(ti < 0){ playTrack(0); return; }
  if(audio.paused) audio.play().catch(() => {}); else audio.pause();
}
function playIcon(){ const g = audio.paused ? '▶' : '⏸'; $('#play').textContent = g; $('#miniPlay').textContent = g; }
audio.addEventListener('play', playIcon);
audio.addEventListener('pause', playIcon);
audio.addEventListener('loadedmetadata', () => { $('#tDur').textContent = fmtT(audio.duration); });
audio.addEventListener('timeupdate', () => {
  if(isFinite(audio.duration)) $('#seek').value = audio.currentTime / audio.duration * 100;
  $('#tCur').textContent = fmtT(audio.currentTime);
});
audio.addEventListener('ended', () => {
  if(repeat){ audio.currentTime = 0; audio.play().catch(() => {}); } else playTrack(nextIdx());
});
audio.addEventListener('error', () => { if(ti >= 0) toast('File lagu nggak ketemu'); });
$('#play').addEventListener('click', toggle);
$('#miniPlay').addEventListener('click', e => { e.stopPropagation(); toggle(); });
$('#next').addEventListener('click', () => playTrack(nextIdx()));
$('#miniNext').addEventListener('click', e => { e.stopPropagation(); playTrack(nextIdx()); });
$('#prev').addEventListener('click', () => { if(audio.currentTime > 3) audio.currentTime = 0; else playTrack(ti - 1); });
$('#rep').addEventListener('click', e => { repeat = !repeat; e.currentTarget.classList.toggle('on', repeat); });
$('#shuf').addEventListener('click', e => { shuffle = !shuffle; e.currentTarget.classList.toggle('on', shuffle); });
$('#seek').addEventListener('input', e => { if(isFinite(audio.duration)) audio.currentTime = e.target.value / 100 * audio.duration; });
$('#trkList').addEventListener('click', e => {
  const r = e.target.closest('.trk'); if(!r) return;
  const i = +r.dataset.i;
  if(i === ti) openPlayer(); else playTrack(i);
});
function openPlayer(){ $('#player').classList.add('show'); }
function closePlayer(){ $('#player').classList.remove('show'); }
$('#mini').addEventListener('click', openPlayer);
$('#plClose').addEventListener('click', closePlayer);
if('mediaSession' in navigator){
  try{
    navigator.mediaSession.setActionHandler('play', toggle);
    navigator.mediaSession.setActionHandler('pause', toggle);
    navigator.mediaSession.setActionHandler('previoustrack', () => $('#prev').click());
    navigator.mediaSession.setActionHandler('nexttrack', () => $('#next').click());
  }catch(e){}
}

/* playlist Spotify / Apple Music (embed) */
function embedURL(u){
  if(!u) return '';
  try{
    const x = new URL(u);
    if(x.hostname.endsWith('spotify.com')){
      if(x.pathname.startsWith('/embed')) return x.href;
      return 'https://open.spotify.com/embed' + x.pathname.replace(/^\/intl-[a-z-]+/i, '') + '?utm_source=generator';
    }
    if(x.hostname === 'music.apple.com') return 'https://embed.music.apple.com' + x.pathname;
    if(x.hostname === 'embed.music.apple.com') return x.href;
  }catch(e){}
  return '';
}
const plURL = embedURL(C.playlist);
function setMuTab(t){
  document.querySelectorAll('#muSeg button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  $('#trkList').hidden = t === 'pl'; $('#plWrap').hidden = t !== 'pl';
  if(t === 'pl' && !$('#plWrap').firstChild){
    $('#plWrap').innerHTML = `<iframe src="${esc(plURL)}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Playlist"></iframe>`;
  }
}
if(plURL){
  if(tracks.length) $('#muSeg').hidden = false;
  $('#muSeg').addEventListener('click', e => { const b = e.target.closest('button'); if(b) setMuTab(b.dataset.t); });
  if(!tracks.length) setMuTab('pl');
}
renderTracks();

/* ====== TELEPON (log panggilan) ====== */
function rng(seed){
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function genCalls(){
  const r = rng(20261020), out = [];
  chats.forEach(c => {
    const n = c.id === C.mainContact ? 14 : 3;
    for(let i = 0; i < n; i++){
      const x = r(), type = x < .45 ? 'in' : x < .85 ? 'out' : 'missed';
      out.push({ who: c.id, type, ago: Math.floor(20 + r() * r() * 60 * 24 * 14), duration: type === 'missed' ? '' : `${1 + Math.floor(r() * 40)}:${pad(Math.floor(r() * 60))}` });
    }
  });
  return out.sort((a, b) => a.ago - b.ago);
}
const callsData = (C.calls && C.calls.length) ? C.calls : genCalls();
let callFilter = 'all';
function callTime(ago){
  const ts = T0 - ago * 60000, d = new Date(ts);
  if(ago < 1440) return fmtHM(ts);
  if(ago < 2880) return 'Kemarin';
  if(ago < 10080) return DAYS[d.getDay()];
  return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
}
function renderCalls(){
  const list = callsData.filter(c => callFilter === 'all' || c.type === 'missed');
  $('#callList').innerHTML = list.length ? list.map(c => {
    const ch = chatById(c.who), name = ch ? ch.name : c.who;
    const label = c.type === 'in' ? 'Masuk' : c.type === 'out' ? 'Keluar' : 'Tak terjawab';
    const icon = c.type === 'out' ? '↗' : '↙';
    return `<div class="crow ${c.type === 'missed' ? 'missed' : ''}" data-w="${esc(name)}"><span class="ci">${icon}</span><div class="tx"><div><b>${esc(name)}</b><span>${label}${c.duration ? ' · ' + esc(c.duration) : ''}</span></div><em class="when">${callTime(c.ago)}</em></div></div>`;
  }).join('') : '<div class="empty-note">Tidak ada panggilan.</div>';
}
$('#callSeg').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  callFilter = b.dataset.f;
  document.querySelectorAll('#callSeg button').forEach(x => x.classList.toggle('on', x === b));
  renderCalls();
});
$('#callList').addEventListener('click', e => { const r = e.target.closest('.crow'); if(r) toast('Memanggil ' + r.dataset.w + '…'); });

/* ====== PETA (Seoul) ====== */
const places = C.places || [];
let mapReady = false;
function setMap(i){
  const p = places[i]; if(!p) return;
  const d = p.span || 0.03, dl = d * 1.5;
  $('#mapFrame').src = `https://www.openstreetmap.org/export/embed.html?bbox=${p.lon - d},${p.lat - dl},${p.lon + d},${p.lat + dl}&layer=mapnik&marker=${p.lat},${p.lon}`;
  $('#mapQ').textContent = p.name;
  document.querySelectorAll('.place').forEach(el => el.classList.toggle('on', +el.dataset.i === i));
}
function initMap(){
  if(mapReady) return; mapReady = true;
  $('#plist').innerHTML = places.map((p, i) => `<div class="place" data-i="${i}"><i>📍</i><div><b>${esc(p.name)}</b><span>${esc(p.note || '')}</span></div></div>`).join('');
  setMap(0);
}
$('#plist').addEventListener('click', e => { const el = e.target.closest('.place'); if(el) setMap(+el.dataset.i); });
$('#grab').addEventListener('click', () => $('#sheet').classList.toggle('min'));
