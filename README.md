# O Grimório

**Version:** `v0.1.0` · **Status:** Early preview · **Built with:** HTML5, CSS3 and vanilla JavaScript

*An evolving digital grimoire for the study of magick, symbolism, divination and self-knowledge.*

**Languages:** [English](#english) · [Português](#português)

---

<a id="english"></a>
## English

### About the project

**O Grimório** is a digital archive inspired by traditional grimoires, botanical manuscripts and the visual language of 1990s desktop interfaces. It brings together editorial content, a live almanac and small interactive experiences in a single website.

Version **0.1.0** establishes the interface and its first working features. The project is under active development; some sections are currently previews rather than complete services.

### Features in v0.1.0

- **Retro desktop-inspired interface:** window frames, title bars, classic controls, textured paper, botanical colors and violet accents.
- **Responsive layout:** a fixed navigation header, an adaptive sidebar on desktop and rearranged panels for smaller screens; reduced-motion preferences are respected.
- **Navigation and category menus:** expandable menus for Magick and Manifestation, with links to the site's main sections.
- **Local content search:** searches the article previews displayed on the homepage, ignoring case and accents and supporting multiple search terms. Results update as you type.
- **Astronomical almanac:** displays the visitor's local date, weekday in Portuguese and Latin, the Sun's and Moon's tropical zodiac positions (degrees and minutes), lunar phase and Southern Hemisphere season. Solar and lunar calculations use the bundled **Astronomy Engine** library.
- **Festival calendar:** shows a curated celebration for selected dates, including Thelemic and other entries defined in the project's calendar.
- **Daily Thoth Tarot card:** randomly selects one of **78 cards** for each browser, preserves that draw in `localStorage` for **24 hours**, and keeps the card concealed until the visitor reveals it. A second click opens a detailed window containing the card's description, keywords, everyday interpretation and esoteric/astrological correspondences.
- **Recent activity:** remembers up to **three internal links** visited from articles, tools or search results, using the browser's local storage.
- **Interactive window controls:** modal windows, dismissible messages, a minimizable/restorable visitor panel and decorative retro-style interface controls.
- **Editorial and tool previews:** article cards for magick, Tarot, manifestation, dreams and related subjects, alongside a visual self-knowledge area for natal charts, numerology, personal arcana and synastry.

### What's still a preview?

The **sign-up, sign-in and password-recovery interfaces are demonstrations**: they do not create accounts, authenticate users or actually send emails. The displayed visitor total is illustrative, not a live counter. Several article links and self-knowledge tools are placeholders awaiting their full implementations.

The search currently covers the homepage's article previews; it is **not** a site-wide search engine. Tarot and recent activity data are stored **locally in each browser**, not synced between devices.

### Run locally

No package installation or JavaScript build step is required. Keep the referenced assets in their expected directories, start a local static server from the directory containing `index.html`, and open the URL below.

```bash
python -m http.server 5500
```

Open **http://localhost:5500/**. Alternatively, use a local-server extension such as VS Code Live Server.

### Project structure

```text
.
├── index.html                 # Page structure and dialogs
├── styles.css                 # Design system and responsive styles
├── app.js                     # Interactions and application logic
├── tarot-data.js              # Metadata for all 78 Thoth cards
├── assets-site/               # Site imagery, icons and Astronomy Engine
└── assets-tarot/
    └── thoth/                 # Tarot card images (00.jpg to 77.jpg)
```

### Next steps

Possible future developments include complete article pages, functional self-knowledge tools, genuine account management and expanded content. These are **plans**, not features available in v0.1.0.

---

<a id="português"></a>
## Português

### Sobre o projeto

**O Grimório** é um acervo digital inspirado nos grimórios tradicionais, nos manuscritos botânicos e na linguagem visual dos computadores dos anos 1990. Reúne conteúdo editorial, um almanaque atualizado e pequenas experiências interativas em um único site.

A versão **0.1.0** estabelece a interface e as primeiras funcionalidades operacionais. O projeto continua em desenvolvimento; algumas seções ainda são prévias, não serviços completos.

### Funcionalidades da v0.1.0

- **Interface retrô inspirada em sistemas clássicos:** janelas, barras de título, controles antigos, papel texturizado, cores botânicas e detalhes em violeta.
- **Layout responsivo:** cabeçalho de navegação fixo, coluna lateral adaptativa no desktop e reorganização dos painéis em telas menores, com respeito à preferência por movimento reduzido.
- **Navegação e menus de categorias:** menus expansíveis de Magia e Manifestação, além de atalhos para as seções principais.
- **Pesquisa local de conteúdo:** busca nas prévias dos artigos presentes na página inicial, ignorando diferenças entre maiúsculas/minúsculas e acentos, com suporte a múltiplos termos. Os resultados são atualizados durante a digitação.
- **Almanaque astronômico:** exibe a data local do visitante, o dia da semana em português e latim, as posições tropicais do Sol e da Lua no zodíaco (graus e minutos), a fase lunar e a estação do ano no Hemisfério Sul. Os cálculos solares e lunares utilizam a biblioteca **Astronomy Engine**, incluída no projeto.
- **Calendário de festividades:** mostra celebrações selecionadas, incluindo datas thelêmicas e outras entradas definidas no calendário do projeto.
- **Carta diária do Tarot de Thoth:** sorteia aleatoriamente uma das **78 cartas** para cada navegador, mantém o sorteio no `localStorage` durante **24 horas** e deixa a carta oculta até sua revelação. Um segundo clique abre uma janela com descrição, palavras-chave, interpretação prática e correspondências esotéricas/astrológicas.
- **Histórico recente:** registra até **três links internos** visitados a partir de artigos, ferramentas ou resultados da pesquisa, com armazenamento local no navegador.
- **Janelas interativas:** modais, mensagens temporárias, painel de visitantes minimizável/restaurável e controles decorativos no estilo retrô.
- **Prévias editoriais e de ferramentas:** cartões sobre magia, Tarot, manifestação, sonhos e temas relacionados, além de uma área visual de autoconhecimento com mapa astral, numerologia, arcano pessoal e sinastria.

### O que ainda é demonstrativo?

As interfaces de **cadastro, login e recuperação de senha são demonstrativas**: ainda não criam contas, autenticam usuários nem enviam e-mails. O número de visitantes exibido é ilustrativo, não um contador em tempo real. Diversos links de artigos e ferramentas de autoconhecimento ainda são marcadores para implementações futuras.

A pesquisa abrange atualmente as prévias de artigos da página inicial, **não** todo o conteúdo de um site completo. A carta diária e o histórico são armazenados **localmente em cada navegador**, sem sincronização entre dispositivos.

### Como executar localmente

Não é necessário instalar pacotes nem compilar JavaScript. Mantenha os arquivos de recursos nas pastas esperadas, inicie um servidor estático na pasta que contém `index.html` e abra o endereço indicado.

```bash
python -m http.server 5500
```

Acesse **http://localhost:5500/**. Outra opção é usar uma extensão de servidor local, como o Live Server do VS Code.

### Estrutura do projeto

```text
.
├── index.html                 # Estrutura da página e janelas modais
├── styles.css                 # Sistema visual e responsividade
├── app.js                     # Interações e lógica da aplicação
├── tarot-data.js              # Metadados das 78 cartas do Thoth
├── assets-site/               # Imagens, ícones e Astronomy Engine
└── assets-tarot/
    └── thoth/                 # Imagens das cartas (00.jpg a 77.jpg)
```

### Próximas etapas

Entre as possibilidades futuras estão artigos completos, ferramentas de autoconhecimento funcionais, autenticação real de usuários e ampliação do acervo. São **planos**, não funcionalidades disponíveis na v0.1.0.
