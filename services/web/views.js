const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

const date = (d) => {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const CSS = `
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');
:root { --charcoal: #171e19; --dark-gray: #272727; --sage: #b7c6c2; --yellow: #ffe17c; --white: #ffffff; }
body { font-family: 'Satoshi', sans-serif; background-color: var(--white); color: var(--charcoal); overflow-x: hidden; }
.font-anton { font-family: 'Anton', sans-serif; }
.grid-bg { background-image: linear-gradient(to right, #b7c6c220 1px, transparent 1px), linear-gradient(to bottom, #b7c6c220 1px, transparent 1px); background-size: 40px 40px; }
.transition-custom { transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1); }
.highlight-bar { position: relative; z-index: 1; display: inline-block; }
.highlight-bar::after { content: ''; position: absolute; left: -5%; bottom: 10%; width: 110%; height: 35%; background-color: var(--yellow); z-index: -1; transform: rotate(-2deg); }
.step-number { transition: opacity 0.3s ease; opacity: 0.2; }
.step-container:hover .step-number { opacity: 1; }
html { background-color: var(--white); }
.brutal-border { border: 2px solid var(--charcoal); }
.brutal-shadow { box-shadow: 4px 4px 0px 0px var(--charcoal); }
.brutal-card:hover { transform: translate(-4px, -4px); box-shadow: 8px 8px 0px 0px var(--charcoal); }
`;

const GSAP_SCRIPTS = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  // Persistent Nav animation
  const nav = document.querySelector('nav');
  if (nav) {
    gsap.fromTo(nav, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' });
  }

  // Hero Section Animations
  const heroSec = document.querySelector('section[data-sd-id="14"]');
  if (heroSec) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .fromTo('div[data-sd-id="15"]', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform,opacity' })
      .fromTo('h1[data-sd-id="18"]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, clearProps: 'transform,opacity' }, '-=0.2')
      .fromTo('p[data-sd-id="20"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform,opacity' }, '-=0.3')
      .fromTo('#waitlist-hero-form', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform,opacity' }, '-=0.3');

    // Problem / Solution ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo('div[data-sd-id="25"]',
        { x: -40, opacity: 0 },
        { scrollTrigger: { trigger: 'section[data-sd-id="24"]', start: 'top 85%' }, x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
      gsap.fromTo('div[data-sd-id="40"]',
        { x: 40, opacity: 0 },
        { scrollTrigger: { trigger: 'section[data-sd-id="24"]', start: 'top 85%' }, x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' }
      );

      // Bento Grid Cards
      gsap.fromTo('#features .grid > div',
        { opacity: 0, y: 30 },
        { scrollTrigger: { trigger: '#features', start: 'top 80%' }, opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }
      );

      // Process Steps
      document.querySelectorAll('.step-container').forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, y: 30 },
          { scrollTrigger: { trigger: step, start: 'top 85%' }, opacity: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      });

      // Testimonials
      gsap.fromTo('section[data-sd-id="107"] .grid > div',
        { opacity: 0, y: 30 },
        { scrollTrigger: { trigger: 'section[data-sd-id="107"]', start: 'top 85%' }, opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
    }
  }

  // Content Library Grid Stagger
  const artGrid = document.getElementById('article-grid');
  if (artGrid) {
    gsap.fromTo(artGrid.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' }
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGSAP);
} else {
  initGSAP();
}
window.addEventListener('load', initGSAP);
</script>
`;

const layout = (title, body) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script><script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script><link href="https://fonts.googleapis.com/css2?family=Anton&amp;display=swap" rel="stylesheet">
    <title>${esc(title)} | Varsha.</title>
    <style>${CSS}</style></head><body>${body}${GSAP_SCRIPTS}</body></html>`;

exports.landing = () => layout('Varsha - Blog', `
<div class="min-h-screen grid-bg" data-sd-id="1">
  <!-- Navigation Header -->
  <nav class="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md z-50 border-b border-[#171e191a] px-8 flex items-center justify-between view-nav" data-sd-id="2">
    <div class="flex items-center gap-12" data-sd-id="3">
      <a id="nav-logo" href="#" class="font-anton text-3xl uppercase tracking-tight" data-sd-id="4">Varsha<span class="text-[#ffe17c]" data-sd-id="5">.</span></a>
      <div class="hidden md:flex gap-8 text-sm font-medium" data-sd-id="6">
        <a id="nav-link-2" href="#process" class="hover:text-black transition-colors" data-sd-id="8">DISTRIBUTE</a>
        <a id="nav-link-3" href="#features" class="hover:text-black transition-colors" data-sd-id="9">ANALYTICS</a>
        <a id="nav-link-library" href="/library" class="hover:text-black transition-colors" data-sd-id="nav-library">LIBRARY</a>
      </div>
    </div>
    <div class="flex items-center gap-6" data-sd-id="11">
      <a id="nav-cta" href="https://portfolio.varsha-p.workers.dev/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-[#171e19] text-white px-8 py-3 rounded-full font-bold text-xs tracking-widest hover:bg-black transition-custom" data-sd-id="13">CONTACT ME</a>
    </div>
  </nav>

  <!-- Hero Section -->
  <div class="view-content pt-20">
    <section class="relative pt-40 pb-32 flex flex-col items-center text-center px-4" data-sd-id="14">
      <div class="flex items-center gap-2 bg-white border border-[#171e191a] px-4 py-2 rounded-full mb-12" data-sd-id="15">
        <span class="w-2 h-2 rounded-full bg-[#ffe17c] animate-pulse" data-sd-id="16"></span>
        <span class="text-[10px] font-bold tracking-[0.2em] uppercase" data-sd-id="17">THE FUTURE OF DIGITAL PUBLISHING</span>
      </div>

      <h1 class="font-anton text-[clamp(4rem,10vw,9rem)] leading-[0.85] uppercase max-w-6xl mb-12" data-sd-id="18">
        STOP BLOGGING.<br>START <span class="highlight-bar" data-sd-id="19">DOMINATING.</span>
      </h1>

      <p class="text-lg text-[#171e19]/70 max-w-xl mb-12 font-medium" data-sd-id="20">
        Flux turns your thoughts into a high-performance content engine. Built for creators who demand speed, style, and total ownership.
      </p>

      <form id="waitlist-hero-form" onsubmit="handleWaitlist(event, 'hero-email')" class="flex flex-col md:flex-row gap-4 w-full max-w-2xl px-6" data-sd-id="21">
        <input id="hero-email" type="email" required placeholder="Enter your email address" class="flex-1 h-20 px-8 border border-[#171e1933] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#ffe17c] transition-custom bg-white" data-sd-id="22">
        <button type="submit" class="bg-[#ffe17c] text-[#171e19] font-anton text-2xl px-12 h-20 rounded-xl hover:shadow-[8px_8px_0px_0px_#171e19] transition-custom uppercase flex items-center justify-center whitespace-nowrap" data-sd-id="23">
          JOIN WAITLIST
        </button>
      </form>
    </section>

    <!-- Problem/Solution Section -->
    <section class="flex flex-col lg:flex-row" data-sd-id="24">
      <div class="w-full lg:w-1/2 bg-[#171e19] text-white p-20 flex flex-col justify-start min-h-[600px]" data-sd-id="25">
        <h2 class="font-anton text-6xl uppercase mb-16 text-[#b7c6c2]" data-sd-id="26">THE OLD WAY</h2>
        <div class="space-y-12" data-sd-id="27">
          <div class="flex gap-6" data-sd-id="28">
            <iconify-icon icon="lucide:x-circle" class="text-red-500 text-3xl shrink-0"></iconify-icon>
            <div data-sd-id="29">
              <h3 class="font-anton text-2xl uppercase mb-2" data-sd-id="30">CLUTTERED WORDPRESS</h3>
              <p class="text-[#b7c6c2] text-lg font-light leading-relaxed" data-sd-id="31">Slow plugins, security holes, and a UI from the late nineties that kills creativity.</p>
            </div>
          </div>
          <div class="flex gap-6" data-sd-id="32">
            <iconify-icon icon="lucide:x-circle" class="text-red-500 text-3xl shrink-0"></iconify-icon>
            <div data-sd-id="33">
              <h3 class="font-anton text-2xl uppercase mb-2" data-sd-id="34">RENTED AUDIENCES</h3>
              <p class="text-[#b7c6c2] text-lg font-light leading-relaxed" data-sd-id="35">Algorithms decide who sees your work. You're building someone else's kingdom.</p>
            </div>
          </div>
          <div class="flex gap-6" data-sd-id="36">
            <iconify-icon icon="lucide:x-circle" class="text-red-500 text-3xl shrink-0"></iconify-icon>
            <div data-sd-id="37">
              <h3 class="font-anton text-2xl uppercase mb-2" data-sd-id="38">ZERO BRAND SOUL</h3>
              <p class="text-[#b7c6c2] text-lg font-light leading-relaxed" data-sd-id="39">Generic templates that make your unique voice sound like everyone else.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/2 bg-[#272727] text-white p-20 border-l-[12px] border-[#ffe17c] flex flex-col justify-start min-h-[600px]" data-sd-id="40">
        <h2 class="font-anton text-6xl uppercase mb-16" data-sd-id="41">THE FLUX WAY</h2>
        <div class="space-y-12" data-sd-id="42">
          <div class="flex gap-6" data-sd-id="43">
            <iconify-icon icon="lucide:check-circle" class="text-[#ffe17c] text-3xl shrink-0"></iconify-icon>
            <div data-sd-id="44">
              <h3 class="font-anton text-2xl uppercase mb-2" data-sd-id="45">DISTRACTION-FREE FLOW</h3>
              <p class="text-white/80 text-lg font-light leading-relaxed" data-sd-id="46">A brutalist interface designed for one thing: getting your best work done fast.</p>
            </div>
          </div>
          <div class="flex gap-6" data-sd-id="47">
            <iconify-icon icon="lucide:check-circle" class="text-[#ffe17c] text-3xl shrink-0"></iconify-icon>
            <div data-sd-id="48">
              <h3 class="font-anton text-2xl uppercase mb-2" data-sd-id="49">TOTAL OWNERSHIP</h3>
              <p class="text-white/80 text-lg font-light leading-relaxed" data-sd-id="50">Own your data, own your subscribers, own your future. No algorithms here.</p>
            </div>
          </div>
          <div class="flex gap-6" data-sd-id="51">
            <iconify-icon icon="lucide:check-circle" class="text-[#ffe17c] text-3xl shrink-0"></iconify-icon>
            <div data-sd-id="52">
              <h3 class="font-anton text-2xl uppercase mb-2" data-sd-id="53">BOLD EDITORIAL FEEL</h3>
              <p class="text-white/80 text-lg font-light leading-relaxed" data-sd-id="54">Typography-first design that makes every word feel like a headline.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Features -->
    <section id="features" class="py-32 px-8 max-w-7xl mx-auto" data-sd-id="55">
      <h2 class="font-anton text-7xl text-center mb-24 uppercase" data-sd-id="56">EVERYTHING YOU NEED.<br>NOTHING YOU DON'T.</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]" data-sd-id="57">
        <div class="md:col-span-2 bg-[#f8f9fa] border border-[#171e191a] p-10 rounded-3xl transition-custom hover:shadow-xl flex flex-col" data-sd-id="58">
          <div class="mb-auto" data-sd-id="59">
            <h3 class="font-anton text-4xl uppercase mb-4" data-sd-id="60">FLUX WRITING ENGINE</h3>
            <p class="text-[#171e19]/60 max-w-sm" data-sd-id="61">Markdown-native editor that stays out of your way. Fast, fluid, and focused.</p>
          </div>
          <div class="mt-8 border border-[#171e191a] rounded-xl bg-white shadow-sm flex flex-col overflow-hidden" data-sd-id="62">
            <div class="bg-gray-50 p-2 border-b border-[#171e191a] flex gap-1" data-sd-id="63">
              <div class="w-2 h-2 rounded-full bg-red-400" data-sd-id="64"></div>
              <div class="w-2 h-2 rounded-full bg-yellow-400" data-sd-id="65"></div>
              <div class="w-2 h-2 rounded-full bg-green-400" data-sd-id="66"></div>
            </div>
            <div class="p-6 font-mono text-sm leading-relaxed text-gray-400" data-sd-id="67">
              # The Future of Writing<br><br>
              Writing on Flux feels like typing on air. <span class="text-[#171e19] bg-[#ffe17c]/30 underline" data-sd-id="68">Every stroke matters.</span><br><br>
              * No bloated menus.<br>
              * No lag.
            </div>
          </div>
        </div>
        <div class="bg-[#171e19] text-white p-10 rounded-3xl transition-custom hover:scale-[1.02] flex flex-col" data-sd-id="69">
          <h3 class="font-anton text-4xl uppercase mb-4" data-sd-id="70">ANALYTICS THAT ACTUALLY HELP</h3>
          <p class="text-white/50 mb-8" data-sd-id="71">Deep insights without the creepy tracking. Understand your growth.</p>
          <div class="mt-auto space-y-4" data-sd-id="72">
            <div class="h-2 bg-white/10 w-full rounded-full overflow-hidden" data-sd-id="73"><div class="h-full bg-[#ffe17c] w-[75%]" data-sd-id="74"></div></div>
            <div class="h-2 bg-white/10 w-full rounded-full overflow-hidden" data-sd-id="75"><div class="h-full bg-[#ffe17c] w-[45%]" data-sd-id="76"></div></div>
            <div class="h-2 bg-white/10 w-full rounded-full overflow-hidden" data-sd-id="77"><div class="h-full bg-[#ffe17c] w-[90%]" data-sd-id="78"></div></div>
          </div>
        </div>
        <div class="bg-white border border-[#171e191a] p-10 rounded-3xl transition-custom hover:shadow-xl flex flex-col justify-between" data-sd-id="79">
          <h3 class="font-anton text-4xl uppercase" data-sd-id="80">NEWSLETTER<br>READY</h3>
          <div class="flex -space-x-4" data-sd-id="81">
            <div class="w-12 h-12 rounded-full border-2 border-white bg-gray-200 grayscale" data-sd-id="82"></div>
            <div class="w-12 h-12 rounded-full border-2 border-white bg-gray-300 grayscale" data-sd-id="83"></div>
            <div class="w-12 h-12 rounded-full border-2 border-white bg-gray-400 grayscale" data-sd-id="84"></div>
            <div class="w-12 h-12 rounded-full border-2 border-white bg-[#ffe17c] flex items-center justify-center font-bold text-xs text-black" data-sd-id="85">+12k</div>
          </div>
        </div>
        <div class="md:col-span-2 bg-[#f8f9fa] border border-[#171e191a] p-10 rounded-3xl transition-custom hover:shadow-xl relative overflow-hidden" data-sd-id="86">
          <div class="relative z-10" data-sd-id="87">
            <h3 class="font-anton text-4xl uppercase mb-4" data-sd-id="88">GLOBAL DISTRIBUTION</h3>
            <p class="text-[#171e19]/60 max-w-sm" data-sd-id="89">One-click publishing to RSS, SEO optimized out of the box, and edge-cached everywhere.</p>
          </div>
          <div class="absolute -bottom-10 -right-10 opacity-20" data-sd-id="90">
            <iconify-icon icon="lucide:globe" class="text-[300px]"></iconify-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="process" class="bg-white py-32 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-20" data-sd-id="91">
      <div class="lg:w-1/3 lg:sticky lg:top-40 h-fit" data-sd-id="92">
        <h2 class="font-anton text-[7rem] leading-[0.85] uppercase" data-sd-id="93">THE<br>PROCESS</h2>
      </div>
      <div class="lg:w-2/3 space-y-32" data-sd-id="94">
        <div class="step-container group" data-sd-id="95">
          <div class="font-anton text-[9rem] leading-none text-[#ffe17c] step-number mb-4" data-sd-id="96">01</div>
          <h3 class="font-anton text-4xl uppercase mb-6" data-sd-id="97">CONNECT YOUR BRAIN</h3>
          <p class="text-xl text-[#171e19]/70 leading-relaxed max-w-xl" data-sd-id="98">
            Open the engine. No setup required. Start typing in our markdown-first workspace and watch your ideas take shape with real-time typography preview.
          </p>
        </div>
        <div class="step-container group" data-sd-id="99">
          <div class="font-anton text-[9rem] leading-none text-[#ffe17c] step-number mb-4" data-sd-id="100">02</div>
          <h3 class="font-anton text-4xl uppercase mb-6" data-sd-id="101">DEFINE YOUR STYLE</h3>
          <p class="text-xl text-[#171e19]/70 leading-relaxed max-w-xl" data-sd-id="102">
            Choose from our library of brutalist themes or build your own from scratch. We handle the CSS, you handle the soul of the content.
          </p>
        </div>
        <div class="step-container group" data-sd-id="103">
          <div class="font-anton text-[9rem] leading-none text-[#ffe17c] step-number mb-4" data-sd-id="104">03</div>
          <h3 class="font-anton text-4xl uppercase mb-6" data-sd-id="105">UNLEASH THE FLOW</h3>
          <p class="text-xl text-[#171e19]/70 leading-relaxed max-w-xl" data-sd-id="106">
            Hit publish and we distribute your work to our global network. Integrated newsletter capture starts building your empire from day one.
          </p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-32 px-8 bg-[#f8f9fa]" data-sd-id="107">
      <div class="max-w-7xl mx-auto" data-sd-id="108">
        <h2 class="font-anton text-6xl text-center uppercase mb-24" data-sd-id="109">TRUSTED BY THE BOLD</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-sd-id="110">
          <div class="bg-white border border-[#171e191a] p-10 rounded-3xl transition-custom" data-sd-id="111">
            <div class="flex gap-1 mb-8" data-sd-id="112">
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
            </div>
            <p class="text-lg font-medium leading-relaxed mb-12" data-sd-id="113">"Flux is the first blogging platform that actually feels like a professional design tool. It's fast, it's brutal, and I love it."</p>
            <div class="flex items-center gap-4" data-sd-id="114">
              <div class="w-12 h-12 bg-gray-200 rounded-full grayscale" data-sd-id="115"></div>
              <div data-sd-id="116">
                <p class="font-anton uppercase" data-sd-id="117">MARCUS VANE</p>
                <p class="text-xs tracking-widest text-[#171e19]/40 uppercase" data-sd-id="118">TECH LEAD @ NEXUS</p>
              </div>
            </div>
          </div>

          <div class="bg-[#171e19] text-white p-10 rounded-3xl translate-y-4 transition-custom" data-sd-id="119">
            <div class="flex gap-1 mb-8" data-sd-id="120">
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
            </div>
            <p class="text-lg font-medium leading-relaxed mb-12 text-white/90" data-sd-id="121">"I moved from Substack and never looked back. The branding control you get here is unmatched. My blog finally looks like ME."</p>
            <div class="flex items-center gap-4" data-sd-id="122">
              <div class="w-12 h-12 bg-gray-600 rounded-full grayscale" data-sd-id="123"></div>
              <div data-sd-id="124">
                <p class="font-anton uppercase text-[#ffe17c]" data-sd-id="125">SARA JENKINS</p>
                <p class="text-xs tracking-widest text-white/40 uppercase" data-sd-id="126">CULTURAL CRITIC</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-[#171e191a] p-10 rounded-3xl transition-custom" data-sd-id="127">
            <div class="flex gap-1 mb-8" data-sd-id="128">
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
              <iconify-icon icon="lucide:star" class="text-[#ffe17c] text-3xl fill-[#ffe17c]"></iconify-icon>
            </div>
            <p class="text-lg font-medium leading-relaxed mb-12" data-sd-id="129">"The writing experience is buttery smooth. No distractions, just me and my words. Best decision for my personal brand."</p>
            <div class="flex items-center gap-4" data-sd-id="130">
              <div class="w-12 h-12 bg-gray-200 rounded-full grayscale" data-sd-id="131"></div>
              <div data-sd-id="132">
                <p class="font-anton uppercase" data-sd-id="133">LUCAS THORNE</p>
                <p class="text-xs tracking-widest text-[#171e19]/40 uppercase" data-sd-id="134">FOUNDER @ SHIFT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="cta" class="relative bg-[#ffe17c] py-40 px-8 overflow-hidden" data-sd-id="135">
      <div class="absolute inset-0 opacity-10 pointer-events-none select-none" data-sd-id="136">
        <div class="font-anton text-[30rem] leading-none absolute -top-40 -left-20" data-sd-id="137">WRITE</div>
        <div class="font-anton text-[30rem] leading-none absolute -bottom-40 -right-20" data-sd-id="138">PUBLISH</div>
      </div>
      <div class="relative z-10 max-w-4xl mx-auto text-center" data-sd-id="139">
        <h2 class="font-anton text-[clamp(4rem,10vw,8rem)] leading-[0.85] uppercase mb-8" data-sd-id="140"> READY TO JOIN THE FLUX? </h2>
        <p class="text-2xl font-medium mb-16 text-[#171e19]/80" data-sd-id="141"> Secure your spot and start building your legacy today. </p>
        <form id="waitlist-cta-form" onsubmit="handleWaitlist(event, 'cta-email')" class="flex flex-col md:flex-row gap-4 w-full px-4" data-sd-id="142">
          <input id="cta-email" type="email" required placeholder="yourname@domain.com" class="flex-1 h-24 px-10 rounded-xl text-xl bg-white focus:outline-none" data-sd-id="143">
          <button type="submit" class="bg-[#171e19] text-white font-anton text-2xl px-16 h-24 rounded-xl hover:scale-105 transition-custom uppercase shadow-2xl" data-sd-id="144"> GET ACCESS NOW </button>
        </form>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#171e19] text-white py-20 px-8" data-sd-id="145">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12" data-sd-id="146">
        <div data-sd-id="147">
          <a id="footer-logo" href="#" class="font-anton text-4xl uppercase mb-8 block" data-sd-id="148">Varsha<span class="text-[#ffe17c]" data-sd-id="149">.</span></a>
          <p class="text-[#b7c6c2] max-w-xs" data-sd-id="150"> The premium platform for digital writers, creators, and modern thinkers. </p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-16" data-sd-id="151">
          <div data-sd-id="152">
            <h4 class="font-anton text-lg uppercase mb-6" data-sd-id="153">PLATFORM</h4>
            <ul class="space-y-4 text-sm text-[#b7c6c2]" data-sd-id="154">
              <li data-sd-id="155"><a id="foot-1" href="/blog" class="hover:text-white" data-sd-id="156">Features</a></li>
              <li data-sd-id="157"><a id="foot-2" href="/library" class="hover:text-white" data-sd-id="158">Themes</a></li>
              <li data-sd-id="159"><a id="foot-3" href="/blog" class="hover:text-white" data-sd-id="160">Showcase</a></li>
            </ul>
          </div>
          <div data-sd-id="161">
            <h4 class="font-anton text-lg uppercase mb-6" data-sd-id="162">RESOURCES</h4>
            <ul class="space-y-4 text-sm text-[#b7c6c2]" data-sd-id="163">
              <li data-sd-id="164"><a id="foot-4" href="/admin" class="hover:text-white" data-sd-id="165">Help Center</a></li>
              <li data-sd-id="166"><a id="foot-5" href="/api/articles" class="hover:text-white" data-sd-id="167">API Docs</a></li>
              <li data-sd-id="168"><a id="foot-6" href="/health" class="hover:text-white" data-sd-id="169">Status</a></li>
            </ul>
          </div>
          <div data-sd-id="170">
            <h4 class="font-anton text-lg uppercase mb-6" data-sd-id="171">LEGAL</h4>
            <ul class="space-y-4 text-sm text-[#b7c6c2]" data-sd-id="172">
              <li data-sd-id="173"><a id="foot-7" href="#" class="hover:text-white" data-sd-id="174">Privacy</a></li>
              <li data-sd-id="foot-account"><a id="foot-9" href="/settings" class="hover:text-white" data-sd-id="foot-account-link">Account</a></li>
              <li data-sd-id="175"><a id="foot-8" href="#" class="hover:text-white" data-sd-id="176">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6" data-sd-id="177">
        <p class="text-xs tracking-widest text-[#b7c6c2]" data-sd-id="178">© 2026 VARSHA PUBLISHING INC.</p>
        <div class="flex gap-6 text-xl text-[#b7c6c2]" data-sd-id="179">
          <a id="social-1" href="#" class="hover:text-[#ffe17c]" data-sd-id="180"><iconify-icon icon="mdi:twitter"></iconify-icon></a>
          <a id="social-2" href="#" class="hover:text-[#ffe17c]" data-sd-id="181"><iconify-icon icon="mdi:github"></iconify-icon></a>
          <a id="social-3" href="https://www.linkedin.com/in/varsha-p-a596312b3" class="hover:text-[#ffe17c]" data-sd-id="182"><iconify-icon icon="mdi:linkedin"></iconify-icon></a>
        </div>
      </div>
    </footer>
  </div>
</div>

<script>
async function handleWaitlist(e, inputId) {
  e.preventDefault();
  const emailInput = document.getElementById(inputId);
  if (!emailInput) return;
  const email = emailInput.value;
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (res.ok) {
    const data = await res.json();
    window.location.href = '/waitlist-confirm?email=' + encodeURIComponent(email) + '&pos=' + (data.position || 1420);
  } else {
    alert('Invalid email or submission error.');
  }
}
</script>
`);

exports.waitlistConfirm = (email = '', pos = 1420) => layout('Waitlist Confirmation', `
<div class="min-h-screen flex flex-col">
  <nav class="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md z-50 border-b border-[#171e191a] px-8 flex items-center justify-between">
    <div class="flex items-center gap-12">
      <a id="nav-logo" href="#" class="font-anton text-3xl uppercase tracking-tight">Varsha<span class="text-[#ffe17c]">.</span></a>
      <div class="hidden md:flex gap-8 text-sm font-medium">
        <a id="nav-link-2" href="#distribute" class="hover:text-black transition-colors">DISTRIBUTE</a>
        <a id="nav-link-3" href="#analytics" class="hover:text-black transition-colors">ANALYTICS</a>
        <a id="nav-link-library" href="/library" class="hover:text-black transition-colors">LIBRARY</a>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <a id="nav-cta" href="https://portfolio.varsha-p.workers.dev/" class="inline-flex items-center justify-center bg-[#171e19] text-white px-8 py-3 rounded-full font-bold text-xs tracking-widest hover:bg-black transition-custom">CONTACT ME</a>
    </div>
  </nav>

  <main class="flex-1 pt-20 grid-bg">
    <section class="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-20">
      <div class="max-w-4xl w-full bg-white border-[12px] border-[#171e19] p-12 md:p-20 relative overflow-hidden">
        <!-- Decorative Corner -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#ffe17c] transform translate-x-16 -translate-y-16 rotate-45"></div>
        
        <div class="relative z-10">
          <div class="w-24 h-24 bg-[#ffe17c] flex items-center justify-center rounded-2xl mb-12 shadow-[8px_8px_0px_0px_#171e19]">
            <iconify-icon icon="lucide:mail-check" class="text-4xl text-[#171e19]"></iconify-icon>
          </div>

          <h1 class="font-anton text-[clamp(3rem,8vw,6rem)] leading-[0.85] uppercase mb-8">
            YOU'RE IN THE <br><span class="bg-[#ffe17c] px-2">PIPELINE.</span>
          </h1>
          
          <p class="text-2xl font-medium text-[#171e19] mb-12 max-w-2xl leading-tight">
            Success! YOU'RE ON THE LIST. We've reserved your spot <span class="font-anton text-2xl bg-[#ffe17c] px-2 py-0.5 rounded">#${esc(pos)}</span>. The digital publishing revolution starts now.
          </p>

          <div class="bg-[#f8f9fa] border-l-4 border-[#ffe17c] p-8 mb-16">
            <h3 class="font-anton text-xl uppercase mb-4">NEXT STEP: VERIFICATION</h3>
            <p class="text-[#171e19]/70 mb-6">
              We've sent a magic link to your email. Click it to confirm your identity and secure your position on the leaderboard.
            </p>
            <div class="flex items-center gap-4 text-sm font-bold tracking-widest uppercase">
              <span class="text-[#171e19]/40">SENT TO:</span>
              <span class="text-[#171e19] bg-[#ffe17c]/20 px-2 py-1 rounded">${esc(email || 'USER@DOMAIN.COM')}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div class="space-y-4">
              <h4 class="font-anton text-lg uppercase">WHILE YOU WAIT</h4>
              <ul class="space-y-3 text-[#171e19]/70">
                <li class="flex items-center gap-2">
                  <iconify-icon icon="lucide:arrow-right" class="text-[#ffe17c]"></iconify-icon>
                  Browse the <a href="/library" class="underline font-bold text-[#171e19] hover:text-[#ffe17c] transition-colors">Content Library</a>
                </li>
                <li class="flex items-center gap-2">
                  <iconify-icon icon="lucide:arrow-right" class="text-[#ffe17c]"></iconify-icon>
                  Follow us on <a href="#" class="underline font-bold text-[#171e19] hover:text-[#ffe17c] transition-colors">X / Twitter</a>
                </li>
              </ul>
            </div>
            <div class="space-y-4">
              <h4 class="font-anton text-lg uppercase">PREPARE YOUR BRAND</h4>
              <ul class="space-y-3 text-[#171e19]/70">
                <li class="flex items-center gap-2">
                  <iconify-icon icon="lucide:arrow-right" class="text-[#ffe17c]"></iconify-icon>
                  Draft your first masterpiece
                </li>
                <li class="flex items-center gap-2">
                  <iconify-icon icon="lucide:arrow-right" class="text-[#ffe17c]"></iconify-icon>
                  Export your old Substack data
                </li>
              </ul>
            </div>
          </div>

          <div class="flex flex-wrap gap-4">
            <a id="cta-dashboard" href="#" class="bg-[#171e19] text-white font-anton text-xl px-10 py-5 rounded-xl hover:shadow-[6px_6px_0px_0px_#ffe17c] transition-custom uppercase">Back to Site</a>
            <a href="/library" class="bg-[#ffe17c] text-[#171e19] font-anton text-xl px-10 py-5 rounded-xl brutal-border brutal-shadow hover:translate-x-1 transition-custom uppercase">Content Library</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-[#171e19] text-white py-12 px-8">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <a id="footer-logo" href="/" class="font-anton text-2xl uppercase">Varsha<span class="text-[#ffe17c]">.</span></a>
      <p class="text-xs tracking-widest text-[#b7c6c2]">© 2026 VARSHA PUBLISHING INC.</p>
      <div class="flex gap-6 text-xl text-[#b7c6c2]">
        <a id="footer-social-1" href="#" class="hover:text-[#ffe17c]"><iconify-icon icon="mdi:twitter"></iconify-icon></a>
        <a id="footer-social-2" href="#" class="hover:text-[#ffe17c]"><iconify-icon icon="mdi:github"></iconify-icon></a>
      </div>
    </div>
  </footer>
</div>
`);

exports.library = (list, filter = 'all') => layout('Content Library', `
<div class="min-h-screen bg-white"> 
  <nav class="fixed top-0 w-full h-20 bg-white z-50 border-b border-[#171e191a] px-8 flex items-center justify-between"> 
    <div class="flex items-center gap-12"> 
      <a id="nav-logo" href="#" class="font-anton text-3xl uppercase tracking-tight">Varsha<span class="text-[#ffe17c]">.</span></a> 
      <div class="hidden md:flex gap-8 text-sm font-medium"> 
        <a id="nav-link-content" href="/library" class="text-black underline underline-offset-4 decoration-[#ffe17c] decoration-4 transition-colors font-bold">LIBRARY</a>  
      </div> 
    </div> 
    <div class="flex items-center gap-6"> 
      <a id="nav-cta" href="https://portfolio.varsha-p.workers.dev/" class="inline-flex items-center justify-center bg-[#171e19] text-white px-8 py-3 rounded-full font-bold text-xs tracking-widest hover:bg-black transition-custom">CONTACT ME</a> 
    </div> 
  </nav> 

  <main class="pt-32 pb-20 px-8 max-w-7xl mx-auto"> 
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8"> 
      <div> 
        <h1 class="font-anton text-7xl uppercase mb-4">CONTENT<br><span class="bg-[#ffe17c] px-2">LIBRARY</span></h1> 
        <p class="text-lg text-[#171e19]/60 max-w-md">Manage your published masterpieces and developing drafts in one brutal interface.</p> 
      </div> 
      <div class="flex items-center gap-4"> 
        <div class="relative"> 
          <input type="text" id="lib-search-input" onkeyup="filterArticles()" placeholder="Search articles..." class="brutal-border h-14 pl-12 pr-6 w-80 rounded-lg focus:outline-none focus:bg-[#f8f9fa] transition-colors"> 
          <iconify-icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40"></iconify-icon> 
        </div> 
        <a href="/library" class="brutal-border h-14 px-6 rounded-lg font-bold flex items-center gap-2 hover:bg-[#ffe17c] transition-colors"> 
          <iconify-icon icon="lucide:filter"></iconify-icon> FILTER 
        </a> 
      </div> 
    </header> 

    <!-- Category Tabs -->
    <div class="flex gap-4 border-b-2 border-[#171e19] mb-12 pb-3">
      <a href="/library" class="font-anton text-lg uppercase px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#171e19] text-white' : 'text-gray-500 hover:text-black'}">ALL (${list.length})</a>
      <a href="/library?status=published" class="font-anton text-lg uppercase px-4 py-2 rounded-lg ${filter === 'published' ? 'bg-[#171e19] text-white' : 'text-gray-500 hover:text-black'}">PUBLISHED</a>
      <a href="/library?status=draft" class="font-anton text-lg uppercase px-4 py-2 rounded-lg ${filter === 'draft' ? 'bg-[#171e19] text-white' : 'text-gray-500 hover:text-black'}">DRAFTS</a>
    </div>

    <div id="article-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
      ${list.map(a => `
        <div class="brutal-border p-8 rounded-2xl flex flex-col transition-all brutal-card article-card-item" data-title="${esc(a.title).toLowerCase()}"> 
          <div class="flex justify-between items-start mb-6"> 
            ${a.status === 'draft' 
              ? '<span class="bg-[#ffe17c]/20 text-[#171e19] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-[#ffe17c]">DRAFT</span>'
              : '<span class="bg-green-100 text-green-800 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">PUBLISHED</span>'
            } 
            <span class="text-xs font-bold text-[#171e19]/40">${date(a.createdAt)}</span> 
          </div> 
          <h3 class="font-anton text-2xl uppercase mb-4 flex-grow"><a href="/blog/${esc(a.id)}" class="hover:underline">${esc(a.title)}</a></h3> 
          <p class="text-sm text-[#171e19]/60 line-clamp-3 mb-6">${esc(a.summary)}</p>
          <div class="flex items-center gap-6 pt-6 border-t border-[#171e191a]"> 
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter ${a.status === 'draft' ? 'text-[#171e19]/30' : ''}"> 
              <iconify-icon icon="lucide:eye" class="text-lg ${a.status === 'draft' ? '' : 'text-[#ffe17c]'}"></iconify-icon> ${a.status === 'draft' ? '—' : (a.views || '12.4K')} 
            </div> 
            ${a.status !== 'draft' ? `
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter"> 
              <iconify-icon icon="lucide:message-square" class="text-lg text-[#ffe17c]"></iconify-icon> ${a.comments || 48} 
            </div>` : ''}
            <div class="ml-auto flex gap-2"> 
              <a href="/editor?edit=${esc(a.id)}" class="w-10 h-10 rounded-lg border border-[#171e191a] flex items-center justify-center hover:bg-[#171e19] hover:text-white transition-colors"> 
                <iconify-icon icon="lucide:edit-3"></iconify-icon> 
              </a> 
              <button onclick="delArticle('${esc(a.id)}')" class="w-10 h-10 rounded-lg border border-[#171e191a] flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"> 
                <iconify-icon icon="lucide:trash-2"></iconify-icon> 
              </button> 
            </div> 
          </div> 
        </div> 
      `).join('')}

      <a href="/editor" class="border-2 border-dashed border-[#171e1933] p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:border-[#ffe17c] group cursor-pointer min-h-[250px]"> 
        <iconify-icon icon="lucide:plus" class="text-5xl text-[#171e1933] group-hover:text-[#ffe17c] transition-colors"></iconify-icon> 
        <span class="font-anton text-xl uppercase text-[#171e1933] group-hover:text-[#171e19] transition-colors">CREATE NEW ARTICLE</span> 
      </a> 
    </div> 
  </main> 
  
  <footer class="bg-[#171e19] text-white py-20 px-8"> 
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12"> 
      <div> 
        <a id="footer-logo" href="#" class="font-anton text-4xl uppercase mb-8 block">Varsha<span class="text-[#ffe17c]">.</span></a> 
        <p class="text-[#b7c6c2] max-w-xs"> The premium platform for digital writers, creators, and modern thinkers. </p> 
      </div> 
      <div class="grid grid-cols-2 md:grid-cols-3 gap-16"> 
        <div> 
          <h4 class="font-anton text-lg uppercase mb-6">PLATFORM</h4> 
          <ul class="space-y-4 text-sm text-[#b7c6c2]"> 
            <li><a id="foot-1" href="/blog" class="hover:text-white">Features</a></li> 
            <li><a id="foot-2" href="/library" class="hover:text-white">Themes</a></li> 
            <li><a id="foot-3" href="/blog" class="hover:text-white">Showcase</a></li> 
          </ul> 
        </div> 
        <div> 
          <h4 class="font-anton text-lg uppercase mb-6">RESOURCES</h4> 
          <ul class="space-y-4 text-sm text-[#b7c6c2]"> 
            <li><a id="foot-4" href="/admin" class="hover:text-white">Help Center</a></li> 
            <li><a id="foot-5" href="/api/articles" class="hover:text-white">API Docs</a></li> 
            <li><a id="foot-6" href="/health" class="hover:text-white">Status</a></li> 
          </ul> 
        </div> 
        <div> 
          <h4 class="font-anton text-lg uppercase mb-6">LEGAL</h4> 
          <ul class="space-y-4 text-sm text-[#b7c6c2]"> 
            <li><a id="foot-7" href="#" class="hover:text-white">Privacy</a></li> 
            <li><a id="foot-8" href="#" class="hover:text-white">Terms</a></li> 
          </ul> 
        </div> 
      </div> 
    </div> 
    <div class="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6"> 
      <p class="text-xs tracking-widest text-[#b7c6c2]">© 2026 VARSHA PUBLISHING INC.</p> 
      <div class="flex gap-6 text-xl text-[#b7c6c2]"> 
        <a id="social-1" href="#" class="hover:text-[#ffe17c]"><iconify-icon icon="mdi:twitter"></iconify-icon></a> 
        <a id="social-2" href="#" class="hover:text-[#ffe17c]"><iconify-icon icon="mdi:github"></iconify-icon></a> 
        <a id="social-3" href="#" class="hover:text-[#ffe17c]"><iconify-icon icon="mdi:linkedin"></iconify-icon></a> 
      </div> 
    </div> 
  </footer> 
</div>

<script>
function filterArticles() {
  const val = document.getElementById('lib-search-input').value.toLowerCase();
  const items = document.querySelectorAll('.article-card-item');
  items.forEach(el => {
    const t = el.getAttribute('data-title') || '';
    el.style.display = t.includes(val) ? '' : 'none';
  });
}
async function delArticle(id) {
  if (confirm('Delete article?')) {
    const res = await fetch('/api/articles/' + id, { method: 'DELETE' });
    if (res.ok) location.reload();
    else alert('Failed to delete article');
  }
}
</script>
`);

exports.blog = (list) => layout('Blog Articles', `
<div class="max-w-7xl mx-auto py-12 px-6 pt-28">
  <h1 class="font-anton text-6xl uppercase mb-4">PUBLISHED ARTICLES</h1>
  <p class="text-gray-600 mb-12">Explore stories, tutorials, and insights built on Flux.</p>
  
  ${list.length ? `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      ${list.map(a => `
        <div class="bg-white brutal-border brutal-shadow rounded-2xl overflow-hidden flex flex-col">
          ${a.thumbnail ? `<img src="/uploads/${esc(a.thumbnail)}" alt="" class="w-full h-48 object-cover">` : '<div class="w-full h-48 bg-[#171e19] flex items-center justify-center font-anton text-white text-2xl">FLUX</div>'}
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">${date(a.createdAt)}</span>
              <h3 class="font-anton text-2xl uppercase mt-2 mb-3"><a href="/blog/${esc(a.id)}" class="hover:underline">${esc(a.title)}</a></h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">${esc(a.summary)}</p>
            </div>
            <a href="/blog/${esc(a.id)}" class="font-anton text-sm text-[#171e19] uppercase underline">READ ARTICLE &rarr;</a>
          </div>
        </div>
      `).join('')}
    </div>
  ` : `
    <div class="text-center py-20 bg-[#f8f9fa] brutal-border rounded-2xl">
      <p class="font-anton text-3xl uppercase text-gray-400 mb-4">NO ARTICLES YET</p>
      <a href="/editor" class="bg-[#ffe17c] text-black font-anton px-6 py-3 rounded-lg brutal-border uppercase">CREATE FIRST ARTICLE</a>
    </div>
  `}
</div>
`);

exports.article = (a) => layout(a.title, `
<article class="max-w-4xl mx-auto py-12 px-6 pt-28">
  <div class="mb-8">
    <span class="bg-[#ffe17c] text-black text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">${esc(a.status || 'PUBLISHED')}</span>
    <h1 class="font-anton text-6xl uppercase mt-4 mb-4">${esc(a.title)}</h1>
    <div class="flex items-center gap-4 text-sm text-gray-500 font-medium">
      <span>Published ${date(a.createdAt)}</span>
      <span>&middot;</span>
      <span>${a.views || 1} Views</span>
    </div>
  </div>

  ${a.thumbnail ? `<div class="mb-10 brutal-border rounded-2xl overflow-hidden"><img src="/uploads/${esc(a.thumbnail)}" class="w-full max-h-[500px] object-cover" alt=""></div>` : ''}

  <div class="prose max-w-none text-lg leading-relaxed text-[#171e19] space-y-6">
    ${esc(a.content).split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}
  </div>

  <div class="border-t border-gray-200 mt-12 pt-8 flex justify-between items-center">
    <a href="/blog" class="font-anton text-lg uppercase underline">&larr; BACK TO BLOG</a>
    <a href="/editor?edit=${esc(a.id)}" class="bg-[#171e19] text-white font-anton text-sm px-6 py-3 rounded-lg uppercase hover:bg-black">EDIT ARTICLE</a>
  </div>
</article>
`);

exports.admin = (list, edit, stats = {}) => layout('Admin Dashboard', `
<div class="min-h-screen bg-white flex relative">
  <!-- Mobile Sidebar Backdrop -->
  <div id="sidebar-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden lg:hidden"></div>

  <!-- Responsive Sidebar Navigation -->
  <aside id="admin-sidebar" class="fixed inset-y-0 left-0 w-72 bg-[#171e19] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0 shadow-2xl lg:shadow-none">
    <div class="p-6 md:p-8 flex items-center justify-between">
      <div>
        <a id="nav-logo" href="#" class="font-anton text-3xl uppercase tracking-tight">
          Varsha<span class="text-[#ffe17c]">.</span>
        </a>
        <div class="font-anton text-xs uppercase tracking-widest text-[#ffe17c] mt-1">CREATOR DASHBOARD</div>
      </div>
      <button id="close-sidebar-btn" onclick="toggleSidebar()" class="lg:hidden text-white/70 hover:text-white p-2 text-2xl flex items-center justify-center rounded-lg hover:bg-white/10 transition-custom" title="Close Sidebar">
        <iconify-icon icon="lucide:x"></iconify-icon>
      </button>
    </div>
    <nav class="flex-1 px-4 md:px-6 space-y-2 mt-2">
      <a id="nav-dashboard" href="/admin" class="flex items-center gap-4 px-4 py-3 bg-[#ffe17c] text-[#171e19] rounded-xl font-bold transition-custom">
        <iconify-icon icon="lucide:layout-dashboard" class="text-xl"></iconify-icon>
        DASHBOARD
      </a>
      <a id="nav-library" href="/library" class="flex items-center gap-4 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-xl font-medium transition-custom">
        <iconify-icon icon="lucide:book-open" class="text-xl"></iconify-icon>
        LIBRARY
      </a>
      <a id="nav-settings" href="/settings" class="flex items-center gap-4 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-xl font-medium transition-custom">
        <iconify-icon icon="lucide:settings" class="text-xl"></iconify-icon>
        SETTINGS
      </a>
    </nav>
    <div class="p-6 border-t border-white/10">
      <div class="flex items-center justify-between px-2 py-2">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-[#ffe17c] text-[#171e19] flex items-center justify-center font-anton shrink-0">V</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate">Varsha</p>
            <p class="text-[10px] text-white/40 uppercase tracking-widest truncate">Pro Creator</p>
          </div>
        </div>
        <a href="/admin/logout" class="text-red-400 hover:text-red-300 text-xs font-bold uppercase flex items-center gap-1 ml-2" title="Log Out">
          <iconify-icon icon="lucide:log-out" class="text-base"></iconify-icon>
          LOG OUT
        </a>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 lg:ml-72 min-w-0 transition-all duration-300">
    <!-- Responsive Header -->
    <header class="h-20 border-b border-[#171e191a] px-4 md:px-10 flex items-center justify-between sticky top-0 bg-white z-40">
      <div class="flex items-center gap-3">
        <button id="open-sidebar-btn" onclick="toggleSidebar()" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-[#171e191a] hover:bg-gray-100 transition-custom text-[#171e19]" title="Open Sidebar">
          <iconify-icon icon="lucide:menu" class="text-2xl"></iconify-icon>
        </button>
        <h1 class="font-anton text-xl md:text-2xl uppercase">Command Center</h1>
      </div>
      <div class="flex items-center gap-3 md:gap-4">
        <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-custom">
          <iconify-icon icon="lucide:bell" class="text-xl"></iconify-icon>
        </button>
        <a id="quick-write-btn" href="/editor" class="bg-[#171e19] text-white px-4 md:px-6 py-2.5 rounded-full font-bold text-xs tracking-widest hover:bg-black transition-custom uppercase flex items-center gap-2">
          <iconify-icon icon="lucide:plus"></iconify-icon>
          <span class="hidden sm:inline">Write New Article</span>
          <span class="sm:hidden">Write</span>
        </a>
      </div>
    </header>

    <div class="p-4 md:p-10">
      <!-- Responsive Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="bg-[#f8f9fa] border border-[#171e191a] p-6 rounded-3xl">
          <p class="text-xs font-bold text-[#171e19]/40 uppercase tracking-widest mb-4">Total Views</p>
          <h3 class="font-anton text-4xl mb-1">${stats.totalViews != null ? (stats.totalViews >= 1000 ? (stats.totalViews / 1000).toFixed(1) + 'K' : stats.totalViews) : '142.8K'}</h3>
          <p class="text-xs text-green-600 font-bold">+12% this month</p>
        </div>
        <div class="bg-[#f8f9fa] border border-[#171e191a] p-6 rounded-3xl">
          <p class="text-xs font-bold text-[#171e19]/40 uppercase tracking-widest mb-4">Subscribers</p>
          <h3 class="font-anton text-4xl mb-1">${(stats.subscribersCount || 12405).toLocaleString()}</h3>
          <p class="text-xs text-green-600 font-bold">+842 new</p>
        </div>
        <div class="bg-[#f8f9fa] border border-[#171e191a] p-6 rounded-3xl">
          <p class="text-xs font-bold text-[#171e19]/40 uppercase tracking-widest mb-4">Avg. Read Time</p>
          <h3 class="font-anton text-4xl mb-1">4m 12s</h3>
          <p class="text-xs text-[#171e19]/40 font-bold">Stable growth</p>
        </div>
        <div class="bg-[#171e19] text-white p-6 rounded-3xl">
          <p class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Platform Status</p>
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-[#ffe17c] animate-pulse"></div>
            <h3 class="font-anton text-2xl uppercase">Dominating</h3>
          </div>
          <p class="text-[10px] text-white/40 mt-4 uppercase">Global Edge Active</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Recent Articles -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="font-anton text-3xl uppercase">Recent Intel</h2>
            <a id="view-all-intel" href="/library" class="text-xs font-bold underline uppercase tracking-widest">View Library</a>
          </div>
          
          <div class="space-y-4">
            ${list.length ? list.map((a, idx) => `
              <div class="group bg-white border border-[#171e191a] p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xl transition-custom ${a.status === 'draft' ? 'opacity-60' : ''}">
                <div class="flex items-center gap-4 md:gap-6">
                  <div class="w-12 h-12 md:w-16 md:h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center font-anton text-lg md:text-xl shrink-0 ${a.status === 'draft' ? 'italic' : ''}">
                    ${a.status === 'draft' ? 'D' : String(idx + 1).padStart(2, '0')}
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-anton text-lg md:text-xl uppercase mb-1 truncate group-hover:text-[#ffe17c] transition-colors">${esc(a.title)}</h4>
                    <p class="text-xs md:text-sm text-[#171e19]/60 ${a.status === 'draft' ? 'italic uppercase tracking-widest text-[10px]' : ''}">
                      ${a.status === 'draft' ? 'Draft • Saved recently' : `Published ${date(a.createdAt)} • ${a.views || 0} reads`}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2 justify-end">
                  <a href="/editor?edit=${esc(a.id)}" class="w-10 h-10 border border-[#171e191a] rounded-full flex items-center justify-center hover:bg-[#171e19] hover:text-white transition-custom" title="Edit Article">
                    <iconify-icon icon="lucide:edit-3"></iconify-icon>
                  </a>
                  <a href="/blog/${esc(a.id)}" class="w-10 h-10 border border-[#171e191a] rounded-full flex items-center justify-center hover:bg-[#171e19] hover:text-white transition-custom" title="View Stats">
                    <iconify-icon icon="lucide:bar-chart-2"></iconify-icon>
                  </a>
                  <button onclick="delArticle('${esc(a.id)}')" class="w-10 h-10 border border-[#171e191a] rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-custom" title="Delete Article">
                    <iconify-icon icon="lucide:trash-2"></iconify-icon>
                  </button>
                </div>
              </div>
            `).join('') : '<p class="text-gray-400">No articles yet.</p>'}
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-10">
          <div>
            <h2 class="font-anton text-3xl uppercase mb-6">Quick Actions</h2>
            <div class="grid grid-cols-2 gap-4">
              <a href="/editor" class="aspect-square bg-[#ffe17c] p-6 rounded-3xl flex flex-col justify-between hover:shadow-[4px_4px_0px_0px_#171e19] transition-custom group">
                <iconify-icon icon="lucide:image" class="text-2xl"></iconify-icon>
                <span class="font-anton text-sm uppercase">Upload Assets</span>
              </a>
              <a href="/library" class="aspect-square bg-[#f8f9fa] border border-[#171e191a] p-6 rounded-3xl flex flex-col justify-between hover:bg-[#171e19] hover:text-white transition-custom group">
                <iconify-icon icon="lucide:mail" class="text-2xl"></iconify-icon>
                <span class="font-anton text-sm uppercase">Newsletter</span>
              </a>
              <a href="/admin" class="aspect-square bg-[#f8f9fa] border border-[#171e191a] p-6 rounded-3xl flex flex-col justify-between hover:bg-[#171e19] hover:text-white transition-custom group">
                <iconify-icon icon="lucide:users" class="text-2xl"></iconify-icon>
                <span class="font-anton text-sm uppercase">Audience</span>
              </a>
              <a href="/settings" class="aspect-square bg-[#f8f9fa] border border-[#171e191a] p-6 rounded-3xl flex flex-col justify-between hover:bg-[#171e19] hover:text-white transition-custom group">
                <iconify-icon icon="lucide:settings-2" class="text-2xl"></iconify-icon>
                <span class="font-anton text-sm uppercase">Workflow</span>
              </a>
            </div>
          </div>

          <div class="bg-[#272727] text-white p-8 rounded-3xl border-l-[8px] border-[#ffe17c]">
            <h4 class="font-anton text-xl uppercase mb-4">Creator Tip</h4>
            <p class="text-sm text-white/70 leading-relaxed mb-6">
              Articles with brutalist typography treatments see 40% higher scroll-through rates on Flux. Try bolding your headers.
            </p>
            <a id="tip-link" href="#" class="text-[#ffe17c] text-xs font-bold uppercase tracking-widest hover:underline">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<script>
function toggleSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('-translate-x-full');
  if (overlay) overlay.classList.toggle('hidden');
}
async function delArticle(id) {
  if (confirm('Delete article?')) {
    const res = await fetch('/api/articles/' + id, { method: 'DELETE' });
    if (res.ok) location.reload();
    else alert('Failed to delete article');
  }
}
</script>
`);

exports.settings = (user = {}) => layout('Account Settings', `
<div class="max-w-4xl mx-auto py-12 px-6 pt-28">
  <h1 class="font-anton text-5xl uppercase mb-2">ACCOUNT SETTINGS</h1>
  <p class="text-gray-500 mb-10">Manage profile details, credentials, and platform preferences.</p>

  <div class="space-y-8">
    <div class="bg-white brutal-border brutal-shadow p-8 rounded-2xl">
      <h3 class="font-anton text-2xl uppercase mb-6">PROFILE INFORMATION</h3>
      <form class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">DISPLAY NAME</label>
          <input type="text" value="Varsha" class="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium">
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">ADMIN USERNAME</label>
          <input type="text" value="admin" readonly class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-[#171e19]">
        </div>
      </form>
    </div>

    <div class="bg-white brutal-border brutal-shadow p-8 rounded-2xl">
      <h3 class="font-anton text-2xl uppercase mb-6">SECURITY & API ACCESS</h3>
      <div class="space-y-4">
        <div class="flex justify-between items-center p-4 bg-gray-50 border rounded-lg">
          <div>
            <h4 class="font-bold text-sm">SESSION TOKEN</h4>
            <p class="text-xs text-gray-500">Active HMAC Signed Session</p>
          </div>
          <a href="/admin/logout" class="text-xs font-bold text-red-600 uppercase hover:underline">LOG OUT</a>
        </div>
      </div>
    </div>
  </div>
</div>
`);

exports.editor = (edit = null) => layout('Pro Article Editor', `
<div class="max-w-6xl mx-auto py-8 px-6 pt-28">
  <div class="flex justify-between items-center mb-6">
    <h1 class="font-anton text-4xl uppercase">${edit ? 'EDIT ARTICLE' : 'PRO ARTICLE EDITOR'}</h1>
    <div class="flex items-center gap-4">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">AUTO-SAVE ACTIVE</span>
      <a href="/admin" class="text-sm font-bold text-gray-600 hover:text-black uppercase">CANCEL</a>
    </div>
  </div>

  <form id="editor-form" class="bg-white brutal-border brutal-shadow p-8 rounded-2xl space-y-6">
    <input type="hidden" name="aid" value="${edit ? esc(edit.id) : ''}">
    
    <div>
      <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">ARTICLE TITLE</label>
      <input name="title" required value="${edit ? esc(edit.title) : ''}" placeholder="Enter article headline..." class="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffe17c]">
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">SUMMARY</label>
      <input name="summary" value="${edit ? esc(edit.summary) : ''}" placeholder="Brief summary for cards and search..." class="w-full px-4 py-3 border border-gray-300 rounded-lg">
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">MARKDOWN CONTENT</label>
      <textarea name="content" rows="14" required placeholder="Write your article content here..." class="w-full p-4 font-mono text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffe17c]">${edit ? esc(edit.content) : ''}</textarea>
    </div>

    <div>
      <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">THUMBNAIL IMAGE ${edit && edit.thumbnail ? '(Select new image to replace current)' : ''}</label>
      <input type="file" id="thumb" accept="image/*" class="w-full border border-gray-300 p-2 rounded-lg text-sm">
    </div>

    <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
      <button type="submit" class="bg-[#ffe17c] text-[#171e19] font-anton text-xl px-10 py-4 rounded-xl brutal-border brutal-shadow hover:translate-x-1 transition-custom uppercase">
        ${edit ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
      </button>
    </div>
  </form>
</div>

<script>
let img = null;
const form = document.getElementById('editor-form');
document.getElementById('thumb').onchange = e => {
  const r = new FileReader();
  r.onload = () => img = r.result;
  if (e.target.files[0]) r.readAsDataURL(e.target.files[0]);
};

form.onsubmit = async e => {
  e.preventDefault();
  const x = form.elements, id = x.aid.value;
  const body = { title: x.title.value, summary: x.summary.value, content: x.content.value };
  if (img) body.thumbnail = img;
  
  const res = await fetch(id ? '/api/articles/' + id : '/api/articles', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    window.location.href = '/admin';
  } else {
    const err = await res.json().catch(() => ({ error: 'Submission failed' }));
    alert(err.error || 'Failed to save article');
  }
};
</script>
`);

exports.login = (err = '') => layout('Admin Login', `
<div class="max-w-md mx-auto py-20 px-6 pt-28">
  <div class="bg-white brutal-border brutal-shadow p-8 rounded-2xl">
    <h2 class="font-anton text-4xl uppercase mb-2">ADMIN LOGIN</h2>
    <p class="text-sm text-gray-500 mb-6">Enter your credentials to access the creator studio.</p>

    ${err ? `<div class="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg mb-4">${esc(err)}</div>` : ''}

    <form method="POST" action="/admin/login" class="space-y-4">
      <div>
        <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">USERNAME</label>
        <input name="username" required class="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium">
      </div>
      <div>
        <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">PASSWORD</label>
        <input name="password" type="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium">
      </div>
      <button type="submit" class="w-full bg-[#ffe17c] text-[#171e19] font-anton text-lg py-4 rounded-xl brutal-border brutal-shadow hover:translate-x-1 transition-custom uppercase mt-4">
        LOG IN
      </button>
    </form>
  </div>
</div>
`);

exports.notFound = () => layout('Page Not Found', `
<div class="max-w-md mx-auto py-24 text-center pt-28">
  <h1 class="font-anton text-8xl text-[#171e19]">404</h1>
  <p class="font-anton text-2xl uppercase mb-6">PAGE NOT FOUND</p>
  <a href="/" class="bg-[#ffe17c] text-[#171e19] font-anton px-8 py-4 rounded-xl brutal-border uppercase">RETURN HOME</a>
</div>
`);