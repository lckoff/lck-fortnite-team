// Respecte les utilisateurs "réduction des mouvements"
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Fade-in/out au scroll */
const fadeEls = document.querySelectorAll('.fade-up');
if (!REDUCED && 'IntersectionObserver' in window){
const io = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting){
e.target.classList.add('visible');
e.target.classList.remove('fade-out');
} else {
e.target.classList.add('fade-out');
}
});
}, { threshold: 0.3 });
fadeEls.forEach(el => io.observe(el));
} else {
fadeEls.forEach(el => el.classList.add('visible'));
}

/* Effet 3D souris (tilt) — léger et performant */
(function(){
if (REDUCED) return;
const cards = Array.from(document.querySelectorAll('.tilt'));
const MAX = 6;
let raf = null;

function onMove(e){
if (raf) return;
raf = requestAnimationFrame(() => {
cards.forEach(card => {
const r = card.getBoundingClientRect();
const x = e.clientX - r.left, y = e.clientY - r.top;
if (x < 0 || y < 0 || x > r.width || y > r.height){
card.style.transform = 'rotateX(0deg) rotateY(0deg)';
return;
}
const rx = ((y - r.height/2) / (r.height/2)) * -MAX;
const ry = ((x - r.width/2) / (r.width/2)) * MAX;
card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
});
raf = null;
});
}
window.addEventListener('mousemove', onMove, { passive:true });
cards.forEach(c => c.addEventListener('mouseleave', () => {
c.style.transform = 'rotateX(0deg) rotateY(0deg)';
}));
})();

/* Burger menu */
const burger = document.querySelector('.burger');
const nav = document.querySelector('.main-nav');
if (burger && nav){
burger.addEventListener('click', () => {
const open = nav.classList.toggle('open');
burger.setAttribute('aria-expanded', String(open));
});
}

/* Back to top */
const toTop = document.querySelector('.back-to-top');
function onScroll(){
if (window.scrollY > 400){
toTop.style.display = 'flex';
} else {
toTop.style.display = 'none';
}
}
window.addEventListener('scroll', onScroll, { passive:true });
toTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

/* Ripple sur .btn et .navlink */
function addRipple(e){
const target = e.currentTarget;
const rect = target.getBoundingClientRect();
const ripple = document.createElement('span');
const size = Math.max(rect.width, rect.height);
const x = e.clientX - rect.left - size/2;
const y = e.clientY - rect.top - size/2;

ripple.className = 'ripple';
ripple.style.width = ripple.style.height = `${size}px`;
ripple.style.left = `${x}px`;
ripple.style.top = `${y}px`;

target.appendChild(ripple);
ripple.addEventListener('animationend', () => ripple.remove());
}
document.querySelectorAll('.btn, .navlink').forEach(el => {
const cs = getComputedStyle(el);
if (cs.position === 'static') el.style.position = 'relative';
el.style.overflow = 'hidden';
el.addEventListener('click', addRipple);
});