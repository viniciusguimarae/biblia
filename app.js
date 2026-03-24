/**
 * Jornada Bíblica — App Navigation v4.0
 * Navegação completa com 15 PDFs reais e tela de módulo intermediária
 */

(function () {
  'use strict';

  // ─── PDF Base path ────────────────────────────────────────────
  const PDF_BASE = 'pdfs/';

  // ─── Mapeamento de chave → nome real do arquivo PDF ──────────
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

  // ─── Dados de cada módulo (para tela intermediária) ───────────
  const MODULE_DATA = {
    'parte1': {
      eyebrow: 'Jornada Principal',
      badge: 'Parte 1',
      icon: '📘',
      title: 'Introdução à Jornada Bíblica',
      desc: 'Uma visão geral para entender a estrutura da Bíblia e como aproveitar melhor sua jornada de estudo.',
      msg: 'Que esta leitura seja o início de uma bela e profunda jornada.',
      back: 'jornada',
    },
    'parte2': {
      eyebrow: 'Jornada Principal',
      badge: 'Parte 2',
      icon: '📜',
      title: 'Antigo Testamento',
      desc: 'Explore a formação do povo de Deus, os livros históricos, poéticos e proféticos do Antigo Testamento.',
      msg: 'O Antigo Testamento revela as raízes da nossa fé. Boa leitura.',
      back: 'jornada',
    },
    'parte3': {
      eyebrow: 'Jornada Principal',
      badge: 'Parte 3',
      icon: '✝️',
      title: 'Novo Testamento',
      desc: 'Estude os evangelhos, a vida de Cristo, as cartas apostólicas e a mensagem central do Novo Testamento.',
      msg: 'Os evangelhos trazem luz e direção. Que esta leitura ilumine o seu caminho.',
      back: 'jornada',
    },
    'parte4': {
      eyebrow: 'Jornada Principal',
      badge: 'Parte 4',
      icon: '🗺️',
      title: 'Complementos e Linha do Tempo',
      desc: 'Revise cronologias, materiais complementares e recursos que ajudam a consolidar seu entendimento.',
      msg: 'A linha do tempo bíblica conecta toda a história sagrada. Aproveite.',
      back: 'jornada',
    },
    'nova-jerusalem': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 1',
      icon: '🌅',
      title: 'A Nova Jerusalém',
      desc: 'Um estudo sobre a cidade santa e a esperança final apresentada nas profecias bíblicas.',
      msg: 'A Nova Jerusalém é a promessa final de toda a Escritura. Bom estudo.',
      back: 'profeticos',
    },
    'quatro-cavaleiros': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 2',
      icon: '🐎',
      title: 'Os 4 Cavaleiros do Apocalipse',
      desc: 'Entenda o significado simbólico dos cavaleiros e seu papel nas profecias do Apocalipse.',
      msg: 'Que esta leitura aprofunde sua compreensão das profecias.',
      back: 'profeticos',
    },
    'anticristo': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 3',
      icon: '📖',
      title: 'O Anticristo',
      desc: 'Um material para compreender esse personagem profético à luz das Escrituras.',
      msg: 'Estude com calma e discernimento. A verdade está na Palavra.',
      back: 'profeticos',
    },
    'mulher-vestida-sol': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 4',
      icon: '☀️',
      title: 'A Mulher Vestida de Sol',
      desc: 'Explore o simbolismo dessa visão e sua interpretação no contexto bíblico.',
      msg: 'Um símbolo poderoso. Que este estudo traga clareza e paz.',
      back: 'profeticos',
    },
    'grande-prostituta': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 5',
      icon: '📜',
      title: 'A Grande Prostituta',
      desc: 'Um estudo temático sobre uma das figuras mais marcantes das profecias apocalípticas.',
      msg: 'Que a leitura de hoje fortaleça sua compreensão profética.',
      back: 'profeticos',
    },
    'grande-tribulacao': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 6',
      icon: '⚡',
      title: 'A Grande Tribulação',
      desc: 'Aprenda sobre esse período profético e sua relevância dentro do Apocalipse.',
      msg: 'Estude com fé e serenidade. A Palavra traz paz até nos temas difíceis.',
      back: 'profeticos',
    },
    'sete-trombetas': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 7',
      icon: '📯',
      title: 'As Sete Trombetas',
      desc: 'Entenda a sequência das trombetas e seus significados dentro da narrativa profética.',
      msg: 'Cada trombeta carrega uma mensagem. Que você compreenda cada uma.',
      back: 'profeticos',
    },
    'besta-falso-profeta': {
      eyebrow: 'Estudos Proféticos',
      badge: 'Estudo 8',
      icon: '🦁',
      title: 'A Besta e o Falso Profeta',
      desc: 'Um estudo sobre esses símbolos proféticos e seu papel no fim dos tempos.',
      msg: 'Que este estudo fortaleça seu discernimento e sua fé.',
      back: 'profeticos',
    },
    '150-esbochos': {
      eyebrow: 'Materiais de Apoio',
      badge: 'Material 1',
      icon: '📝',
      title: '150 Esboços Bíblicos',
      desc: 'Um material de apoio com diversos esboços para aprofundar estudos e ministrações.',
      msg: 'Estes esboços são ferramentas valiosas para o seu estudo.',
      back: 'apoio',
    },
    '250-quiz': {
      eyebrow: 'Materiais de Apoio',
      badge: 'Material 2',
      icon: '❓',
      title: '250 Quiz Bíblico',
      desc: 'Um recurso prático para revisar conteúdos e testar seus conhecimentos bíblicos.',
      msg: 'Teste seus conhecimentos com leveza. Cada acerto é aprendizado.',
      back: 'apoio',
    },
    'plano-leitura': {
      eyebrow: 'Materiais de Apoio',
      badge: 'Material 3',
      icon: '📅',
      title: 'Plano de Leitura da Bíblia',
      desc: 'Um plano organizado para ajudar você a manter constância e avançar na leitura das Escrituras.',
      msg: 'Um plano é um convite à consistência. Siga no seu ritmo.',
      back: 'apoio',
    },
  };

  // ─── View map ────────────────────────────────────────────────
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
  };

  const NAV = document.getElementById('bottom-nav');

  // ─── Nav tab key para cada view ──────────────────────────────
  // Qual aba deve estar ativa para cada view?
  const NAV_KEY = {
    welcome:    null,
    home:       'home',
    estudos:    'estudos',
    jornada:    'estudos',
    bonus:      'estudos',
    profeticos: 'estudos',
    apoio:      'estudos',
    modulo:     'estudos',
    downloads:  'downloads',
    guia:       'guia',
  };

  // ─── Estado da navegação ─────────────────────────────────────
  let currentView = 'welcome';
  let isTransitioning = false;
  let currentModuloKey = null; // guarda qual módulo está aberto

  // ─── Saudação contextual ─────────────────────────────────────
  function applyGreeting() {
    const el = document.querySelector('.greeting-desc');
    if (!el) return;
    const hour = new Date().getHours();
    const greetings = [
      { from: 5,  to: 11, emoji: '☀️', msg: 'Bom dia. Que este momento ilumine o seu dia.' },
      { from: 12, to: 17, emoji: '🌤️', msg: 'Boa tarde. Um bom momento para sua jornada.' },
      { from: 18, to: 22, emoji: '🌙', msg: 'Boa noite. Que a Palavra traga paz ao seu coração.' },
      { from: 23, to: 29, emoji: '🕯️', msg: 'Que a leitura de hoje fortaleça o seu espírito.' },
    ];
    const h24 = hour < 5 ? hour + 24 : hour;
    const match = greetings.find(g => h24 >= g.from && h24 < g.to) || greetings[3];
    el.innerHTML = `${match.emoji} <em>${match.msg}</em>`;
  }

  // ─── Tela de Módulo: preenche conteúdo dinâmico ──────────────
  function openModulo(key) {
    const data = MODULE_DATA[key];
    if (!data) return;

    currentModuloKey = key;

    document.getElementById('modulo-eyebrow').textContent = data.eyebrow;
    document.getElementById('modulo-icon').textContent = data.icon;
    document.getElementById('modulo-badge').textContent = data.badge;
    document.getElementById('modulo-title').textContent = data.title;
    document.getElementById('modulo-desc').textContent = data.desc;
    document.getElementById('modulo-msg').textContent = data.msg;

    const pdfUrl = PDF_BASE + PDF_MAP[key];
    const lerBtn = document.getElementById('modulo-btn-ler');
    const baixarBtn = document.getElementById('modulo-btn-baixar');

    lerBtn.onclick = () => window.open(pdfUrl, '_blank', 'noopener');
    baixarBtn.href = pdfUrl;
    baixarBtn.download = PDF_MAP[key];

    // Botão de voltar: retorna para a view de origem
    document.getElementById('modulo-back-btn').onclick = () => showView(data.back);

    showView('modulo');
  }

  // ─── Navegação Centralizada ───────────────────────────────────
  function showView(name) {
    if (isTransitioning || name === currentView) return;
    const target = VIEWS[name];
    if (!target) return;

    isTransitioning = true;
    const previous = VIEWS[currentView];

    if (previous) {
      previous.classList.remove('visible');
      setTimeout(() => {
        previous.classList.remove('active');
        activate(target, name);
      }, 180);
    } else {
      activate(target, name);
    }
  }

  function activate(target, name) {
    target.classList.add('active');

    const isWelcome = name === 'welcome';
    NAV.style.display = isWelcome ? 'none' : 'flex';

    if (!isWelcome) {
      const activeKey = NAV_KEY[name] || 'home';
      document.querySelectorAll('.nav-item').forEach(i => {
        i.classList.toggle('active', i.dataset.view === activeKey);
      });
    }

    if (name === 'home') applyGreeting();

    // Reset de scroll no contêiner interno
    const content = target.querySelector('.view-content');
    if (content) content.scrollTop = 0;

    target.classList.add('visible');
    isTransitioning = false;

    currentView = name;
    if (history.pushState) {
      history.pushState(null, null, (name === 'welcome' ? '#' : '#' + name));
    }
  }

  // ─── Event Listeners ──────────────────────────────────────────
  document.addEventListener('click', (e) => {

    // Botão "Entrar na Jornada"
    if (e.target.id === 'btn-entrar') {
      showView('home');
      return;
    }

    // Itens da nav bottom
    const navItem = e.target.closest('.nav-item');
    if (navItem) {
      showView(navItem.dataset.view);
      return;
    }

    // Cards com data-nav (navegação entre views)
    const cardNav = e.target.closest('[data-nav]');
    if (cardNav) {
      showView(cardNav.dataset.nav);
      return;
    }

    // Botões de módulo (abre tela intermediária)
    const moduloBtn = e.target.closest('[data-modulo]');
    if (moduloBtn) {
      e.preventDefault();
      openModulo(moduloBtn.dataset.modulo);
      return;
    }
  });

  // ─── Init (corrige refresh mantendo a view) ──────────────────
  const hash = window.location.hash.replace('#', '').trim();
  const validStart = VIEWS[hash] ? hash : 'welcome';

  if (VIEWS[validStart]) {
    VIEWS[validStart].classList.add('active');
    setTimeout(() => {
      const content = VIEWS[validStart].querySelector('.view-content');
      if (content) content.scrollTop = 0;
      VIEWS[validStart].classList.add('visible');
    }, 60);
    currentView = validStart;
    NAV.style.display = (validStart === 'welcome') ? 'none' : 'flex';
    if (validStart === 'home') applyGreeting();
    if (validStart !== 'welcome') {
      const activeKey = NAV_KEY[validStart] || 'home';
      document.querySelectorAll('.nav-item').forEach(i => {
        i.classList.toggle('active', i.dataset.view === activeKey);
      });
    }
  }

})();
