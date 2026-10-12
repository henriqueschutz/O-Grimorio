/**
 * O GRIMÓRIO — comportamentos da página inicial
 *
 * O arquivo é dividido por recurso para facilitar manutenção sem framework:
 * 1. menus em cascata; 2. pesquisa; 3. almanaque; 4. tarot diário;
 * 5. histórico local; 6. janelas e formulários demonstrativos.
 */

/* const mantém a referência da função; a seta (=>) define uma função curta.
   Os atalhos $ e $$ buscam um elemento ou uma lista dentro do escopo informado. */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* Funções nomeadas agrupam ações reutilizáveis; esta mostra uma notificação temporária. */
/** Mostra uma mensagem breve sem bloquear a navegação. */
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

/* --------------------------------------------------------------------------
   1. MENUS EM CASCATA
   Hover resolve desktop; clique e teclado resolvem toque e acessibilidade.
   Os ouvintes de evento sincronizam o estado visual e o atributo aria-expanded.
   -------------------------------------------------------------------------- */

const navGroups = $$('.nav-group');

function closeMenus(except = null) {
  navGroups.forEach((group) => {
    if (group === except) return;
    group.classList.remove('is-open');
    $('.has-menu', group)?.setAttribute('aria-expanded', 'false');
  });
}

navGroups.forEach((group) => {
  const trigger = $('.has-menu', group);
  trigger.addEventListener('click', () => {
    const willOpen = !group.classList.contains('is-open');
    closeMenus(group);
    group.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-group')) closeMenus();
});

/* --------------------------------------------------------------------------
   2. PESQUISA EXPANSÍVEL
   Abre/fecha o campo, normaliza os termos e monta links para os resultados.
   -------------------------------------------------------------------------- */

const categoryBar = $('.category-bar');
const searchForm = $('#search-form');
const searchTrigger = $('#search-trigger');
const searchField = $('#search-field');
const searchClose = $('.search-close');
const searchResults = $('#search-results');
const searchResultsList = $('#search-results-list');
const searchableItems = $$('.searchable-item');

function openSearch() {
  closeMenus();
  categoryBar.classList.add('search-open');
  searchTrigger.setAttribute('aria-expanded', 'true');
  searchResults.hidden = false;
  searchResultsList.innerHTML = '<p class="search-empty">Digite para consultar as páginas abertas do arquivo.</p>';
  window.setTimeout(() => searchField.focus(), 80);
}

function closeSearch() {
  categoryBar.classList.remove('search-open');
  searchTrigger.setAttribute('aria-expanded', 'false');
  searchResults.hidden = true;
  searchField.value = '';
  searchTrigger.focus();
}

function normalizeText(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function renderSearchResults(query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    searchResultsList.innerHTML = '<p class="search-empty">Digite para consultar as páginas abertas do arquivo.</p>';
    return;
  }

  const matches = searchableItems.filter((item) => {
    const haystack = normalizeText(`${item.dataset.search} ${item.textContent}`);
    return normalizedQuery.split(/\s+/).every((term) => haystack.includes(term));
  });

  if (!matches.length) {
    searchResultsList.innerHTML = '<p class="search-empty">Nenhum registro encontrado. Tente um termo mais amplo.</p>';
    return;
  }

  searchResultsList.replaceChildren(...matches.map((item) => {
    const title = $('h3', item).textContent;
    const category = $('.card-category', item).textContent;
    const href = $('a', item).getAttribute('href');
    const link = document.createElement('a');
    link.className = 'search-hit';
    link.href = href;
    link.innerHTML = `<strong>${title}</strong><span>${category}</span>`;
    return link;
  }));
}

/**
 * O primeiro clique abre a pesquisa.
 * Com a pesquisa aberta, clicar novamente no botão executa a busca.
 */
searchTrigger.addEventListener('click', () => {
  if (categoryBar.classList.contains('search-open')) {
    searchForm.requestSubmit();
    return;
  }

  openSearch();
});

/** O X fecha a pesquisa e apaga o termo digitado. */
searchClose.addEventListener('click', closeSearch);

/** Os resultados são atualizados enquanto a pessoa digita. */
searchField.addEventListener('input', () => {
  renderSearchResults(searchField.value);
});

/**
 * Ao pesquisar, as categorias reaparecem.
 * Os resultados permanecem visíveis abaixo do cabeçalho.
 */
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  renderSearchResults(searchField.value);
  categoryBar.classList.remove('search-open');
  searchTrigger.setAttribute('aria-expanded', 'false');
  searchField.blur();
});

/* --------------------------------------------------------------------------
   3. ALMANAQUE
   Atualiza data local, celebração, estação e posições astronômicas exibidas
   nos widgets laterais. Astronomy Engine fornece as longitudes do Sol e da Lua.
   -------------------------------------------------------------------------- */

let now = new Date();

const weekdays = [
  { pt: 'DOMINGO', latin: 'DIES SOLIS' },
  { pt: 'SEGUNDA-FEIRA', latin: 'DIES LUNAE' },
  { pt: 'TERÇA-FEIRA', latin: 'DIES MARTIS' },
  { pt: 'QUARTA-FEIRA', latin: 'DIES MERCURII' },
  { pt: 'QUINTA-FEIRA', latin: 'DIES IOVIS' },
  { pt: 'SEXTA-FEIRA', latin: 'DIES VENERIS' },
  { pt: 'SÁBADO', latin: 'DIES SATURNI' }
];

const months = [
  'JANEIRO',
  'FEVEREIRO',
  'MARÇO',
  'ABRIL',
  'MAIO',
  'JUNHO',
  'JULHO',
  'AGOSTO',
  'SETEMBRO',
  'OUTUBRO',
  'NOVEMBRO',
  'DEZEMBRO'
];

const zodiacSigns = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes'
];

/**
 * Converte uma longitude de 0–360° em signo, grau e minuto.
 * Exemplo: "Libra · 07°32′".
 */
function formatZodiacLongitude(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const totalMinutes = Math.round(normalized * 60) % (360 * 60);
  const signIndex = Math.floor(totalMinutes / (30 * 60));
  const minutesInsideSign = totalMinutes % (30 * 60);
  const degrees = Math.floor(minutesInsideSign / 60);
  const minutes = minutesInsideSign % 60;

  return `${zodiacSigns[signIndex]} · ${String(degrees).padStart(2, '0')}°${String(minutes).padStart(2, '0')}′`;
}

function getSunSignSymbol(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const symbols = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
  return symbols[signIndex];
}

function getMoonSignSymbol(longitude) {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const symbols = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
  return symbols[signIndex];
}

/**
 * Traduz o ângulo da fase lunar para uma das oito fases principais.
 * 0° é Lua nova, 90° é quarto crescente e 180° é Lua cheia.
 */
function getMoonPhaseName(angle) {
  const phases = [
    'lua nova',
    'lua crescente',
    'quarto crescente',
    'lua gibosa crescente',
    'lua cheia',
    'lua gibosa minguante',
    'quarto minguante',
    'lua minguante'
  ];

  const phaseIndex = Math.floor(((angle + 22.5) % 360) / 45);
  return phases[phaseIndex];
}

/** Determina a estação considerando o hemisfério sul. */
function getSouthernSeason(date) {
  const value = (date.getMonth() + 1) * 100 + date.getDate();

  if (value >= 1221 || value < 320) return 'verão';
  if (value < 621) return 'outono';
  if (value < 923) return 'inverno';

  return 'primavera';
}

/**
 * Calendário pagão do Grimório.
 * As chaves seguem o formato MM-DD.
 */
const paganFestivals = {
  '02-01': 'Asteria (Meio do Verão)',
  '03-20': 'Equinócio dos Deuses (Anno Novo Thelêmico e Equinócio de Outono)',
  '04-08': 'Primeiro Dia da Escrita',
  '04-09': 'Segundo Dia da Escrita',
  '04-10': 'Terceiro Dia da Escrita',
  '05-01': 'Bacchanalia (Meio de Outono)',
  '06-21': 'Escarabeia (Solstício de Inverno)',
  '08-01': 'Prometheia (Meio de Inverno)',
  '08-12': 'A Festa do Profeta e sua Noiva',
  '09-22': 'Babalya (Equinócio de Primavera)',
  '10-01': 'Ophidia (Meio da Primavera)',
  '12-25': 'Sol Invictus (Solstício de Verão)'
};

/**
 * Atualiza a janela "hoje".
 */
function renderAlmanac() {
  now = new Date();

  const weekday = weekdays[now.getDay()];

  const festivalKey = [
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  const sunLongitude = Astronomy.SunPosition(now).elon;
  const moonLongitude = Astronomy.EclipticGeoMoon(now).lon;
  const moonPhaseAngle = Astronomy.MoonPhase(now);

  $('#day-number').textContent =
    String(now.getDate()).padStart(2, '0');

  $('#weekday').textContent =
    weekday.pt;

  $('#weekday-latin').textContent =
    `(${weekday.latin})`;

  $('#month-year').textContent =
    `${months[now.getMonth()]} · ${now.getFullYear()}`;

  $('#sun-sign').textContent =
    formatZodiacLongitude(sunLongitude);

  $('#sun-symbol').textContent =
    getSunSignSymbol(sunLongitude);

  $('#moon-sign').textContent =
  formatZodiacLongitude(moonLongitude);

  $('#moon-phase').textContent =
  `· ${getMoonPhaseName(moonPhaseAngle)}`;

  $('#moon-symbol').textContent =
    getMoonSignSymbol(moonLongitude);

  $('#season').textContent =
    getSouthernSeason(now);

  $('#festival').textContent =
    paganFestivals[festivalKey] ?? '—';
}

renderAlmanac();
window.setInterval(renderAlmanac, 60_000);


const majorNames = [
  'O Louco',
  'O Mago',
  'A Sacerdotisa',
  'A Imperatriz',
  'O Imperador',
  'O Hierofante',
  'Os Amantes',
  'O Carro',
  'Ajustamento',
  'O Eremita',
  'Fortuna',
  'Luxúria',
  'O Enforcado',
  'A Morte',
  'Arte',
  'O Diabo',
  'A Torre',
  'A Estrela',
  'A Lua',
  'O Sol',
  'O Aeon',
  'O Universo'
];

const suits = ['Varas', 'Copas', 'Espadas', 'Discos'];

const ranks = [
  'Ás', '2', '3', '4', '5', '6', '7',
  '8', '9', '10', 'Cavaleiro', 'Rainha',
  'Príncipe', 'Princesa'
];

const cardNames = [
  ...majorNames,
  ...suits.flatMap((suit) =>
    ranks.map((rank) => `${rank} de ${suit}`)
  )
];

const tarotDeck = cardNames.map((name, index) => ({
  name,
  image: `assets-tarot/thoth/${String(index).padStart(2, '0')}.jpg`
}));

/* 4. TAROT DIÁRIO
   Monta o baralho, persiste a carta por 24 horas e controla revelação e detalhes.
   localStorage guarda o estado no navegador; JSON converte-o entre texto e objeto.
*/
const TAROT_KEY = 'o-grimorio-tarot-v1';
const TAROT_DURATION = 24 * 60 * 60 * 1000;

const tarotButton = $('#tarot-card');
const tarotImage = $('#tarot-image');
const tarotDialog = $('#tarot-dialog');

function saveTarotState(state) {
  try {
    localStorage.setItem(TAROT_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Não foi possível salvar a carta:', error);
  }
}

function drawTarotCard() {
  return {
    index: Math.floor(Math.random() * tarotDeck.length),
    drawnAt: Date.now(),
    revealed: false
  };
}

function loadTarotState() {
  try {
    const saved = JSON.parse(localStorage.getItem(TAROT_KEY));
    const elapsed = Date.now() - saved?.drawnAt;

    if (
      Number.isInteger(saved?.index) &&
      saved.index >= 0 &&
      saved.index < tarotDeck.length &&
      typeof saved.revealed === 'boolean' &&
      elapsed >= 0 &&
      elapsed < TAROT_DURATION
    ) {
      return {
        ...saved,
        revealed: false
      };
    }
  } catch (error) {
    console.warn('Carta anterior não encontrada:', error);
  }

  const newState = drawTarotCard();
  saveTarotState(newState);
  return newState;
}

let tarotState = loadTarotState();

function renderTarot() {
  const card = tarotDeck[tarotState.index];
  const details = tarotInfo[card.name];

  if (!details) {
    console.error(`Metadados ausentes para: ${card.name}`);
    return;
  }

  // Nome da carta: "Interferência — 8 de Espadas"
  const displayName = details.title === card.name
    ? card.name
    : `${details.title} — ${card.name}`;

  // Imagem da carta
  tarotImage.src = card.image;
  tarotImage.alt = displayName;

  // Informações resumidas da lateral
  $('#tarot-title').textContent = displayName;

  $('#tarot-meta').hidden = !tarotState.revealed;

  $('#tarot-window').classList.toggle(
    'is-revealed',
    tarotState.revealed
  );

  // Texto abaixo da carta
  $('#tarot-disclaimer').textContent = tarotState.revealed
    ? 'Clique novamente na carta para mais informações e significados!'
    : 'Clique aqui para ver sua carta do dia!';

  // Informações completas do popup
  $('#tarot-dialog-image').src = card.image;
  $('#tarot-dialog-image').alt = displayName;

  $('#tarot-dialog-title').textContent = details.title;

  $('#tarot-dialog-subtitle').textContent =
    details.title === card.name
      ? 'Tarot de Thoth'
      : card.name;

  $('#tarot-dialog-description').textContent = details.description;
  $('#tarot-dialog-keywords').textContent = details.keywords;
  $('#tarot-dialog-practical').textContent = details.practical;
  $('#tarot-dialog-attribution').textContent = details.attribution;

  // Estado de revelação
  tarotButton.classList.toggle(
    'is-revealed',
    tarotState.revealed
  );

  tarotButton.setAttribute(
    'aria-expanded',
    String(tarotState.revealed)
  );

  tarotButton.setAttribute(
    'aria-label',
    tarotState.revealed
      ? `Carta do dia: ${displayName}. Abrir detalhes.`
      : 'Revelar carta do dia'
  );
}

function refreshExpiredTarot() {
  if (Date.now() - tarotState.drawnAt >= TAROT_DURATION) {
    tarotState = drawTarotCard();
    saveTarotState(tarotState);
    renderTarot();
  }
}

tarotButton.addEventListener('click', () => {
  refreshExpiredTarot();

  if (!tarotState.revealed) {
    tarotState.revealed = true;
    saveTarotState(tarotState);
    renderTarot();
    return;
  }

  tarotDialog.showModal();
});

renderTarot();

window.setInterval(refreshExpiredTarot, 60_000);
/* 5. ÚLTIMOS ACESSOS
   Guarda no navegador até três links internos usados em artigos, ferramentas
   ou resultados da busca; a lista é reconstruída com elementos do DOM.
*/

const recentStorageKey = 'o-grimorio-recent-links';

function readRecentLinks() {
  try {
    return JSON.parse(localStorage.getItem(recentStorageKey)) || [];
  } catch {
    return [];
  }
}

function renderRecentLinks() {
  const recentList = $('#recent-links');
  const stored = readRecentLinks();
  if (!stored.length) return;

  recentList.replaceChildren(...stored.slice(0, 3).map((entry) => {
    const item = document.createElement('li');
    const time = document.createElement('span');
    const link = document.createElement('a');
    time.textContent = entry.time;
    link.href = entry.href;
    link.textContent = entry.title;
    item.append(time, link);
    return item;
  }));
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || !link.closest('.article-card, .tool-node, .search-hit')) return;

  const entry = {
    href: link.getAttribute('href'),
    title: link.closest('.article-card')?.querySelector('h3')?.textContent || link.querySelector('strong')?.textContent || link.textContent.trim(),
    time: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
  };

  const next = [entry, ...readRecentLinks().filter((item) => item.href !== entry.href)].slice(0, 3);
  localStorage.setItem(recentStorageKey, JSON.stringify(next));
  renderRecentLinks();
});

renderRecentLinks();

/* --------------------------------------------------------------------------
   6. JANELAS, DIÁLOGOS E FORMULÁRIOS DEMONSTRATIVOS
   Controla minimizar/restaurar, abrir/fechar diálogos e validar os formulários
   de demonstração sem recarregar a página.
   -------------------------------------------------------------------------- */

const visitorPopup = $('#visitor-popup');
const visitorRestore = $('#restore-visitors');

function minimizeVisitors() {
  visitorPopup.classList.add('is-minimized');
  visitorRestore.hidden = false;
}

$('#minimize-visitors').addEventListener('click', minimizeVisitors);
$('#close-visitors').addEventListener('click', minimizeVisitors);

visitorRestore.addEventListener('click', () => {
  visitorPopup.classList.remove('is-minimized');
  visitorRestore.hidden = true;
});

$$('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    dialog?.showModal();
  });
});

$$('.dialog-close').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});

$$('.auth-dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

$$('[data-demo-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.closest('dialog').close();
    form.reset();
    showToast('Bem-vindo ao Círculo Mágicko. Seu grimório está pronto para ser aberto.');
  });
});

$('.quiet-button').addEventListener('click', () => {
  showToast('As instruções para recuperar sua chave foram enviadas ao seu e-mail.');
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeMenus();
  if (categoryBar.classList.contains('search-open')) closeSearch();
});

/* Ajusta a coluna lateral ao espaço visível: fixa-a entre cabeçalho e rodapé,
   centraliza-a e reduz sua escala se não couber; no celular, restaura o fluxo. */

function fitSidebarToViewport() {
  const side = document.querySelector('.side-column');
  const header = document.querySelector('.site-header');
  const contentGrid = document.querySelector('.content-grid');
  const footer = document.querySelector('.site-footer');

  if (!side || !header || !contentGrid || !footer) return;

  if (window.innerWidth <= 900) {
    side.style.removeProperty('--side-scale');
    side.style.removeProperty('top');
    side.style.removeProperty('right');
    return;
  }

  const headerBottom = header.getBoundingClientRect().bottom;
  const topLimit = headerBottom + 16;
  const bottomLimit = Math.min(window.innerHeight, footer.getBoundingClientRect().top) - 16;
  const available = bottomLimit - topLimit;
  side.style.top = `${topLimit + available / 2}px`;
  side.style.right = `${document.documentElement.clientWidth - contentGrid.getBoundingClientRect().right}px`;

  const required = side.scrollHeight;

  if (required <= 0 || available <= 0) return;

  const scale = Math.min(1, available / required);

  side.style.setProperty('--side-scale', scale.toFixed(3));
}

function syncTarotImageRatio() {
  const img = document.getElementById('tarot-image');
  const button = document.getElementById('tarot-card');

  if (img.naturalWidth && img.naturalHeight) {
    button.style.aspectRatio =
      `${img.naturalWidth} / ${img.naturalHeight}`;
  }
}

/* ResizeObserver refaz o ajuste quando o painel muda de tamanho; os eventos
   load, resize e scroll também o recalculam ao carregar, redimensionar e rolar. */
const tarotImgElement = document.getElementById('tarot-image');

tarotImgElement.addEventListener('load', syncTarotImageRatio);
syncTarotImageRatio();

const sidebarElement = document.querySelector('.side-column');

new ResizeObserver(fitSidebarToViewport).observe(sidebarElement);

window.addEventListener('load', fitSidebarToViewport);
window.addEventListener('resize', fitSidebarToViewport);
window.addEventListener('scroll', fitSidebarToViewport, { passive: true });