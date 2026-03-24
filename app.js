/**
 * Jornada Bíblica — App Navigation v6.0
 * Multi-Persona + Supabase + SyncPay
 * Fluxo de teste mínimo ativo
 */

(function () {
  'use strict';

  // ─── INIT SUPABASE ─────────────────────────────────────────────
  const SUPABASE_URL = 'https://cauwhwtzlthaihjvgwfg.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_eg3VEDklXsIzRGcK5kTX6g_dZ3nINil';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const CURRENT_PERSONA = 'bispo-jornada';

  // ─── ⚙️ CONFIGURAÇÃO SYNCPAY ────────────────────────────────────
  // Edite os links aqui. Cada chave é o slug do produto no Supabase.
  // Substitua 'SUA_HASH_SYNCPAY_AQUI' pelo link real do produto na SyncPay.
  const SYNCPAY_LINKS = {
    // ── PRODUTO DE TESTE ──
    'teste-premium': 'http://app.syncpayments.com.br/payment-link/a1612a0e-fd0d-4982-b13d-b3830b27b418',

    // ── PRODUTOS DE PRODUÇÃO (preencher quando tiver os links) ──
    'nova-jerusalem':      'https://checkout.syncpay.com.br/HASH_1',
    'quatro-cavaleiros':   'https://checkout.syncpay.com.br/HASH_2',
    'anticristo':          'https://checkout.syncpay.com.br/HASH_3',
    'mulher-vestida-sol':  'https://checkout.syncpay.com.br/HASH_4',
    'grande-prostituta':   'https://checkout.syncpay.com.br/HASH_5',
    'grande-tribulacao':   'https://checkout.syncpay.com.br/HASH_6',
    'sete-trombetas':      'https://checkout.syncpay.com.br/HASH_7',
    'besta-falso-profeta': 'https://checkout.syncpay.com.br/HASH_8',
  };

  // Parâmetro que a SyncPay usa para receber o ID externo da compra
  const SYNCPAY_EXTERNAL_ID_PARAM = 'external_id';

  // Slugs que exigem compra (qualquer slug com entrada no SYNCPAY_LINKS é pago)
  const PAID_PRODUCTS = Object.keys(SYNCPAY_LINKS);

  let userPurchases = [];
  let internalUserId = null;
  let allProducts = [];

  // ─── BROWSER ID (identidade invisível) ─────────────────────────
  function getBrowserId() {
    let id = localStorage.getItem('jb_browser_id');
    if (!id) {
      id = 'br_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('jb_browser_id', id);
    }
    return id;
  }
  const browserId = getBrowserId();

  // ─── CARREGAMENTO DE DADOS ──────────────────────────────────────
  async function loadAppData() {
    try {
      // 1. Garantir que o usuário existe no banco
      const { data: user, error: userErr } = await supabase
        .from('users')
        .upsert([{ browser_id: browserId }], { onConflict: 'browser_id' })
        .select('id')
        .single();
      if (userErr) throw userErr;
      internalUserId = user.id;

      // 2. Carregar produtos da persona
      const { data: metaPersona } = await supabase
        .from('personas')
        .select('id')
        .eq('slug', CURRENT_PERSONA)
        .single();

      if (metaPersona) {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('persona_id', metaPersona.id);
        allProducts = products || [];
      }

      // 3. Carregar compras concluídas deste usuário
      const { data: purchases } = await supabase
        .from('purchases')
        .select('products(slug)')
        .eq('user_id', internalUserId)
        .eq('status', 'completed');

      userPurchases = purchases ? purchases.map(p => p.products?.slug).filter(Boolean) : [];

      updateUI();
      subscribeToPurchases();
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  // ─── ATUALIZAÇÃO DA INTERFACE ───────────────────────────────────
  function updateUI() {
    PAID_PRODUCTS.forEach(slug => {
      const buttons = document.querySelectorAll(`[data-modulo="${slug}"]`);
      const isUnlocked = userPurchases.includes(slug);
      buttons.forEach(btn => {
        btn.classList.toggle('locked', !isUnlocked);
        btn.classList.toggle('unlocked', isUnlocked);
      });
    });
  }

  // ─── REALTIME: ouve mudanças de purchase e recarrega ───────────
  function subscribeToPurchases() {
    if (!internalUserId) return;
    supabase.channel('purchases-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'purchases',
        filter: `user_id=eq.${internalUserId}`
      }, (payload) => {
        if (payload.new.status === 'completed') {
          loadAppData();
        }
      })
      .subscribe();
  }

  // ─── MODAL DE VENDAS ───────────────────────────────────────────
  const salesModal       = document.getElementById('sales-modal');
  const salesBuyBtn      = document.getElementById('sales-buy-btn');
  const salesProcessing  = document.getElementById('sales-processing');
  const salesTitle       = document.getElementById('sales-title');
  const salesPrice       = document.getElementById('sales-price');

  let currentSlugToBuy = null;

  function openSalesModal(slug) {
    // Tenta buscar dados do banco primeiro; fallback para MODULE_DATA estático
    const dbProduct = allProducts.find(p => p.slug === slug);
    const staticData = MODULE_DATA[slug];
    const name  = dbProduct?.name  || staticData?.title || slug;
    const price = dbProduct?.price ?? staticData?.price ?? null;

    currentSlugToBuy = slug;
    salesTitle.textContent = name;
    salesPrice.textContent = price !== null
      ? `R$ ${Number(price).toFixed(2).replace('.', ',')}`
      : 'Ver preço no checkout';

    salesModal.classList.add('active');
    salesBuyBtn.style.opacity = '1';
    salesBuyBtn.disabled = false;
    salesProcessing.style.display = 'none';
  }

  async function handleCheckout() {
    if (!currentSlugToBuy || !internalUserId) return;

    // Busca produto no banco para pegar o ID real
    const dbProduct = allProducts.find(p => p.slug === currentSlugToBuy);
    const staticData = MODULE_DATA[currentSlugToBuy];
    const price = dbProduct?.price ?? staticData?.price ?? 0;

    if (!dbProduct) {
      console.warn('Produto não encontrado no banco. Verifique se o SQL de seed foi executado.');
    }

    salesBuyBtn.style.opacity = '0.5';
    salesBuyBtn.disabled = true;
    salesProcessing.style.display = 'block';

    try {
      // 1. Criar purchase com status pending
      const purchasePayload = {
        user_id:    internalUserId,
        product_id: dbProduct?.id || null,
        amount:     price,
        status:     'pending',
      };

      const { data: purchase, error } = await supabase
        .from('purchases')
        .insert(purchasePayload)
        .select('id')
        .single();

      if (error) throw error;

      // 2. Montar URL do checkout da SyncPay com external_id = purchase.id
      const baseUrl = SYNCPAY_LINKS[currentSlugToBuy];
      if (!baseUrl || baseUrl.includes('SUA_HASH') || baseUrl.includes('HASH_')) {
        throw new Error(
          `⚠️ Link SyncPay não configurado para o produto "${currentSlugToBuy}". ` +
          'Edite SYNCPAY_LINKS no app.js.'
        );
      }

      const checkoutUrl = `${baseUrl}?${SYNCPAY_EXTERNAL_ID_PARAM}=${purchase.id}`;
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error('Erro no checkout:', err);
      alert(err.message || 'Houve um erro ao preparar seu checkout. Tente novamente.');
      salesBuyBtn.style.opacity = '1';
      salesBuyBtn.disabled = false;
      salesProcessing.style.display = 'none';
    }
  }

  // Fechar modal
  if (salesBuyBtn)
    salesBuyBtn.addEventListener('click', handleCheckout);
  const salesCloseOverlay = document.getElementById('sales-close-overlay');
  const salesCloseBtn     = document.getElementById('sales-close-btn');
  if (salesCloseOverlay) salesCloseOverlay.addEventListener('click', () => salesModal.classList.remove('active'));
  if (salesCloseBtn)     salesCloseBtn.addEventListener('click',     () => salesModal.classList.remove('active'));

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

  // ─── MÓDULOS ESTÁTICOS (fallback quando banco não retorna) ──────
  // Inclui os dois módulos de teste + produção
  const MODULE_DATA = {
    // ── TESTE ──────────────────────────────────────────────────────
    'teste-liberado': {
      eyebrow: 'Módulo de Teste',
      icon: '✅',
      badge: 'Liberado',
      title: 'Estudo Inicial Liberado',
      desc: 'Este é um conteúdo de teste já liberado para todos os usuários.',
      msg: 'Bem-vindo ao conteúdo de teste.',
      back: 'teste',
      price: 0,
      placeholder: true,
    },
    'teste-premium': {
      eyebrow: 'Módulo de Teste',
      icon: '🔒',
      badge: 'Premium',
      title: 'Módulo Premium de Teste',
      desc: 'Pagamento confirmado com sucesso. Este conteúdo foi liberado automaticamente para teste do fluxo.',
      msg: 'Acesso liberado! Bem-vindo ao conteúdo premium.',
      back: 'teste',
      price: 1.00,
      placeholder: true,
    },

    // ── PRODUÇÃO ────────────────────────────────────────────────────
    'parte1': { eyebrow: 'Jornada Principal', icon: '📘', badge: 'Parte 1', title: 'Introdução', desc: 'Entenda a estrutura da Bíblia.', msg: 'Início de uma bela jornada.', back: 'jornada' },
    'parte2': { eyebrow: 'Jornada Principal', icon: '📜', badge: 'Parte 2', title: 'Antigo Testamento', desc: 'Formação do povo de Deus.', msg: 'Raízes da nossa fé.', back: 'jornada' },
    'parte3': { eyebrow: 'Jornada Principal', icon: '✝️', badge: 'Parte 3', title: 'Novo Testamento', desc: 'Vida de Cristo.', msg: 'Luz para o seu caminho.', back: 'jornada' },
    'parte4': { eyebrow: 'Jornada Principal', icon: '🗺️', badge: 'Parte 4', title: 'Complementos', desc: 'Cronologias e linha do tempo.', msg: 'História sagrada conectada.', back: 'jornada' },
    '150-esbochos': { eyebrow: 'Materiais de Apoio', icon: '📝', badge: 'Material 1', title: '150 Esboços', desc: 'Apoio para ministrações.', msg: 'Ferramentas valiosas.', back: 'apoio' },
    '250-quiz':     { eyebrow: 'Materiais de Apoio', icon: '❓', badge: 'Material 2', title: '250 Quiz', desc: 'Teste seus conhecimentos.', msg: 'Cada acerto é aprendizado.', back: 'apoio' },
    'plano-leitura':{ eyebrow: 'Materiais de Apoio', icon: '📅', badge: 'Material 3', title: 'Plano de Leitura', desc: 'Constância diária.', msg: 'Siga no seu ritmo.', back: 'apoio' },
  };

  // ─── ABRIR MÓDULO ──────────────────────────────────────────────
  let currentModuloKey = null;

  function openModulo(key) {
    // Se é pago e ainda não foi comprado → abre modal de vendas
    if (PAID_PRODUCTS.includes(key) && !userPurchases.includes(key)) {
      openSalesModal(key);
      return;
    }

    const data = MODULE_DATA[key] || allProducts.find(p => p.slug === key);
    if (!data) return;

    currentModuloKey = key;
    document.getElementById('modulo-eyebrow').textContent = data.eyebrow || 'Estudo';
    document.getElementById('modulo-icon').textContent    = data.icon    || '📖';
    document.getElementById('modulo-badge').textContent   = data.badge   || 'Módulo';
    document.getElementById('modulo-title').textContent   = data.title   || data.name;
    document.getElementById('modulo-desc').textContent    = data.desc    || data.description || '';
    document.getElementById('modulo-msg').textContent     = data.msg     || '';

    const lerBtn   = document.getElementById('modulo-btn-ler');
    const baixarBtn = document.getElementById('modulo-btn-baixar');

    // Módulos placeholder não têm PDF real
    if (data.placeholder) {
      lerBtn.style.display    = 'none';
      baixarBtn.style.display = 'none';
    } else {
      lerBtn.style.display    = '';
      baixarBtn.style.display = '';
      const pdfUrl = PDF_BASE + (PDF_MAP[key] || key + '.pdf');
      lerBtn.onclick    = () => window.open(pdfUrl, '_blank', 'noopener');
      baixarBtn.href     = pdfUrl;
      baixarBtn.download = PDF_MAP[key] || key + '.pdf';
    }

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
    teste:      document.getElementById('view-teste'),   // ← nova view de teste
  };

  const NAV     = document.getElementById('bottom-nav');
  const NAV_KEY = {
    welcome: null,
    home: 'home', estudos: 'estudos', jornada: 'estudos',
    bonus: 'estudos', profeticos: 'estudos', apoio: 'estudos',
    modulo: 'estudos', downloads: 'downloads', guia: 'guia',
    teste: 'teste',  // ← aba de teste na nav
  };

  let currentView    = 'welcome';
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
  });

  // ─── INIT ─────────────────────────────────────────────────────
  loadAppData();

})();
