/**
 * Jornada Bíblica — App Navigation v7.0
 * Content Hub + Sales Presell
 * Checkout externo simples (sem automação de backend)
 */

(function () {
  'use strict';

  // ─── PDF Base path ────────────────────────────────────────────
  const PDF_BASE = 'pdfs/';

  const PDF_MAP = {
    'parte1':              'Jornada-Da-Bíblia Parte 01.pdf',
    'parte2':              'Jornada-Da-Bíblia Parte 02.pdf',
    'parte3':              'Jornada-Da-Bíblia Parte 03.pdf',
    'parte4':              'Jornada-Da-Bíblia Parte 04.pdf',
    'nova-jerusalem':      'A_NOVA_JERUSALEM.pdf',
    'quatro-cavaleiros':   'OS_4_CAVALEIROS_DO_APOCALIPSE.pdf',
    'anticristo':          'O_ANTICRISTO.pdf',
    'mulher-vestida-sol':  'MULHER_VESTIDA_DE_SOL.pdf',
    'grande-prostituta':   'A_GRANDE_PROSTITUTA.pdf',
    'grande-tribulacao':   'A_GRANDE_TRIBULAÇÃO.pdf',
    'sete-trombetas':      'A_SETE_TROMBETAS.pdf',
    'besta-falso-profeta': 'A_BESTA_E_O_FALSO_PROFETA.pdf',
    '150-esbochos':        '150_ESBOCOS_LIMPO.pdf',
    '250-quiz':            '250 QUIZ BIBLICO.pdf',
    'plano-leitura':       'PLANO DE LEITURA DA BIBLIA.pdf',
  };

  // ─── DADOS DOS MÓDULOS ─────────────────────────────────────────
  // Módulos gratuitos (incluídos no produto principal)
  const MODULE_DATA = {
    'parte1':              { eyebrow: 'Jornada Principal', icon: '📘', badge: 'Parte 1', title: 'A Palavra que Transforma', desc: 'Entenda a estrutura da Bíblia e comece sua jornada com fundamento.', msg: 'Início de uma bela jornada.', back: 'jornada' },
    'parte2':              { eyebrow: 'Jornada Principal', icon: '📜', badge: 'Parte 2', title: 'Raízes da Fé', desc: 'A formação do povo de Deus no Antigo Testamento.', msg: 'Raízes profundas, frutos eternos.', back: 'jornada' },
    'parte3':              { eyebrow: 'Jornada Principal', icon: '✝️', badge: 'Parte 3', title: 'A Vinda do Messias', desc: 'A vida de Cristo e o cumprimento das promessas.', msg: 'Luz para o seu caminho.', back: 'jornada' },
    'parte4':              { eyebrow: 'Jornada Principal', icon: '🗺️', badge: 'Parte 4', title: 'Cronologias e Profecias', desc: 'Linha do tempo e a visão profética da história sagrada.', msg: 'História sagrada conectada.', back: 'jornada' },
    '150-esbochos':        { eyebrow: 'Materiais de Apoio', icon: '📝', badge: 'Material 1', title: '150 Esboços', desc: 'Material de apoio para ministrações e estudos em grupo.', msg: 'Ferramentas para o ministério.', back: 'apoio' },
    '250-quiz':            { eyebrow: 'Materiais de Apoio', icon: '❓', badge: 'Material 2', title: '250 Quiz Bíblico', desc: 'Teste seus conhecimentos de forma leve e divertida.', msg: 'Cada acerto fortalece sua fé.', back: 'apoio' },
    'plano-leitura':       { eyebrow: 'Materiais de Apoio', icon: '📅', badge: 'Material 3', title: 'Plano de Leitura', desc: 'Leia a Bíblia completa com constância e direção.', msg: 'Siga no seu ritmo, com fé.', back: 'apoio' },
    // Proféticos
    'nova-jerusalem':      { eyebrow: 'Estudos Proféticos', icon: '🌟', badge: 'Profético 1', title: 'A Nova Jerusalém', desc: 'A cidade eterna prometida aos filhos de Deus.', msg: 'Nosso lar eterno.', back: 'profeticos' },
    'quatro-cavaleiros':   { eyebrow: 'Estudos Proféticos', icon: '🐴', badge: 'Profético 2', title: 'Os 4 Cavaleiros', desc: 'Revelação dos quatro cavaleiros do Apocalipse.', msg: 'Sinais dos últimos tempos.', back: 'profeticos' },
    'anticristo':          { eyebrow: 'Estudos Proféticos', icon: '⚠️', badge: 'Profético 3', title: 'O Anticristo', desc: 'Quem é e como reconhecer o espírito do anticristo.', msg: 'Discernimento espiritual.', back: 'profeticos' },
    'mulher-vestida-sol':  { eyebrow: 'Estudos Proféticos', icon: '☀️', badge: 'Profético 4', title: 'Mulher Vestida de Sol', desc: 'O grande sinal visto no céu.', msg: 'A glória de Israel.', back: 'profeticos' },
    'grande-prostituta':   { eyebrow: 'Estudos Proféticos', icon: '🏛️', badge: 'Profético 5', title: 'A Grande Prostituta', desc: 'Babilônia e o sistema religioso apóstata.', msg: 'Discernimento é proteção.', back: 'profeticos' },
    'grande-tribulacao':   { eyebrow: 'Estudos Proféticos', icon: '⚡', badge: 'Profético 6', title: 'A Grande Tribulação', desc: 'O período mais sombrio da história humana.', msg: 'A Bíblia já anunciou.', back: 'profeticos' },
    'sete-trombetas':      { eyebrow: 'Estudos Proféticos', icon: '🎺', badge: 'Profético 7', title: 'As Sete Trombetas', desc: 'Os julgamentos que antecedem o fim.', msg: 'Hora de vigiar e orar.', back: 'profeticos' },
    'besta-falso-profeta': { eyebrow: 'Estudos Proféticos', icon: '🐉', badge: 'Profético 8', title: 'A Besta e o Falso Profeta', desc: 'As duas figuras do engano nos últimos dias.', msg: 'Ninguém engana os que pertencem a Deus.', back: 'profeticos' },
  };

  // ─── LINKS DE CHECKOUT EXTERNO ─────────────────────────────────
  // Para oferecer conteúdo premium no futuro, insira os links aqui.
  // O botão CTA no modal de vendas redirecionará para este link.
  const CHECKOUT_LINKS = {
    // Exemplo: 'nome-do-produto': 'https://app.syncpayments.com.br/payment-link/...',
  };

  // ─── MODAL DE VENDAS (CTA simples → checkout externo) ──────────
  const salesModal      = document.getElementById('sales-modal');
  const salesBuyBtn     = document.getElementById('sales-buy-btn');
  const salesTitle      = document.getElementById('sales-title');
  const salesPrice      = document.getElementById('sales-price');
  const salesCloseOverlay = document.getElementById('sales-close-overlay');
  const salesCloseBtn   = document.getElementById('sales-close-btn');

  let currentSlug = null;

  function openSalesModal(slug) {
    currentSlug = slug;
    // Texto padrão — será personalizado quando os produtos premium forem adicionados
    salesTitle.textContent = 'Conteúdo Exclusivo';
    if (salesPrice) salesPrice.textContent = 'Ver no checkout';
    salesModal.classList.add('active');
  }

  function closeSalesModal() {
    salesModal.classList.remove('active');
    currentSlug = null;
  }

  function goToCheckout() {
    if (!currentSlug) return;
    const url = CHECKOUT_LINKS[currentSlug];
    if (url) {
      window.location.href = url;
    } else {
      alert('Link de checkout não configurado ainda. Em breve!');
    }
  }

  if (salesBuyBtn) salesBuyBtn.addEventListener('click', goToCheckout);
  if (salesCloseOverlay) salesCloseOverlay.addEventListener('click', closeSalesModal);
  if (salesCloseBtn) salesCloseBtn.addEventListener('click', closeSalesModal);

  // ─── ABRIR MÓDULO ──────────────────────────────────────────────
  function openModulo(key) {
    const data = MODULE_DATA[key];
    if (!data) return;

    document.getElementById('modulo-eyebrow').textContent = data.eyebrow || 'Estudo';
    document.getElementById('modulo-icon').textContent    = data.icon    || '📖';
    document.getElementById('modulo-badge').textContent   = data.badge   || 'Módulo';
    document.getElementById('modulo-title').textContent   = data.title   || key;
    document.getElementById('modulo-desc').textContent    = data.desc    || '';
    document.getElementById('modulo-msg').textContent     = data.msg     || '';

    const lerBtn    = document.getElementById('modulo-btn-ler');
    const baixarBtn = document.getElementById('modulo-btn-baixar');
    const pdfUrl    = PDF_BASE + (PDF_MAP[key] || key + '.pdf');

    if (lerBtn)    { lerBtn.style.display = ''; lerBtn.onclick = () => window.open(pdfUrl, '_blank', 'noopener'); }
    if (baixarBtn) { baixarBtn.style.display = ''; baixarBtn.href = pdfUrl; baixarBtn.download = PDF_MAP[key] || key + '.pdf'; }

    document.getElementById('modulo-back-btn').onclick = () => showView(data.back || 'home');
    showView('modulo');
  }

  // ─── NAVEGAÇÃO ──────────────────────────────────────────────────
  const VIEWS = {
    welcome:    document.getElementById('view-welcome'),
    home:       document.getElementById('view-home'),
    estudos:    document.getElementById('view-estudos'),
    jornada:    document.getElementById('view-jornada'),
    bonus:      document.getElementById('view-bonus'),
    profeticos: document.getElementById('view-profeticos'),
    apoio:      document.getElementById('view-apoio'),
    modulo:     document.getElementById('view-modulo'),
    downloads:  document.getElementById('view-downloads'),
    guia:       document.getElementById('view-guia'),
    'dinamicas-biblicas': document.getElementById('view-dinamicas'),
    'acesso-dinamicas': document.getElementById('view-acesso-dinamicas'),
  };

  const NAV     = document.getElementById('bottom-nav');
  const NAV_KEY = {
    welcome: null,
    home: 'home', estudos: 'estudos', jornada: 'estudos',
    bonus: 'estudos', profeticos: 'estudos', apoio: 'estudos',
    modulo: 'estudos', downloads: 'downloads', guia: 'guia',
    'dinamicas-biblicas': null,
    'acesso-dinamicas': null,
  };

  let currentView     = 'welcome';
  let isTransitioning = false;

  function applyGreeting() {
    const el = document.querySelector('.greeting-desc');
    if (!el) return;
    const hour = new Date().getHours();
    const greetings = [
      { f: 5,  t: 11, e: '☀️',  m: 'Bom dia. Que o dia seja iluminado.' },
      { f: 12, t: 17, e: '🌤️', m: 'Boa tarde. Um bom momento para estudar.' },
      { f: 18, t: 22, e: '🌙',  m: 'Boa noite. Paz ao seu coração.' },
      { f: 23, t: 4,  e: '🕯️', m: 'Fortaleça o seu espírito.' },
    ];
    const match = greetings.find(g => hour >= g.f && hour <= g.t) || greetings[3];
    el.innerHTML = `${match.e} <em>${match.m}</em>`;
  }

  function showView(name) {
    if (isTransitioning || name === currentView) return;
    const target = VIEWS[name];
    if (!target) return;
    isTransitioning = true;
    const previous = VIEWS[currentView];
    if (previous) {
      previous.classList.remove('visible');
      setTimeout(() => { previous.classList.remove('active'); activate(target, name); }, 180);
    } else {
      activate(target, name);
    }
  }

  function activate(target, name) {
    target.classList.add('active');
    NAV.style.display = (name === 'welcome') ? 'none' : 'flex';
    if (name !== 'welcome') {
      const activeKey = NAV_KEY[name] || 'home';
      document.querySelectorAll('.nav-item').forEach(i =>
        i.classList.toggle('active', i.dataset.view === activeKey)
      );
    }
    if (name === 'home') applyGreeting();
    target.classList.add('visible');
    isTransitioning = false;
    currentView = name;
  }

  // ─── EVENT DELEGATION ─────────────────────────────────────────
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-entrar') { showView('home'); return; }
    const navItem = e.target.closest('.nav-item');
    if (navItem) { showView(navItem.dataset.view); return; }
    const cardNav = e.target.closest('[data-nav]');
    if (cardNav) { showView(cardNav.dataset.nav); return; }
    const moduloBtn = e.target.closest('[data-modulo]');
    if (moduloBtn) { e.preventDefault(); openModulo(moduloBtn.dataset.modulo); return; }
    const premiumBtn = e.target.closest('[data-premium]');
    if (premiumBtn) { e.preventDefault(); openSalesModal(premiumBtn.dataset.premium); return; }
  });

  // Lê parâmetro de view direto pela URL (ex: ?view=acesso-dinamicas)
  const params = new URLSearchParams(window.location.search);
  const startView = params.get('view');
  if (startView && VIEWS[startView]) {
    showView(startView);
  }

})();
