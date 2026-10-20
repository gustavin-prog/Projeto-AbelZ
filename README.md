# Escola Estadual Professor Abel Freire Coelho — Página Institucional (PWA)

PWA com a página institucional da **Escola Estadual Professor Abel Freire Coelho**
(Mossoró/RN), contendo endereço, telefone, zona de localização e toda a oferta
acadêmica da escola. Funciona online e **offline** (Service Worker + cache),
pode ser instalada como aplicativo no Android, iOS e desktop.

## 📋 Informações exibidas na página

| Item | Valor |
| --- | --- |
| Endereço | Rua Doutor João Marcelino, s/n — Nova Betânia, Mossoró/RN |
| **CEP** | **59610-200** |
| **Telefone** | **(84) 3315-5658** |
| **Zona** | **Urbana** |
| **Etapas do Ensino** | **Ensino Médio Regular** e **Curso Técnico Integrado / Educação Profissional** |
| Dependência | Estadual |
| Código INEP | 24002330 |
| Turno | Diurno |

Dados públicos do Censo Escolar/INEP e consulta de CEP (ViaCEP).

## 🗂️ Estrutura

```
.
├── index.html               # página institucional (conteúdo completo)
├── offline.html             # fallback exibido quando não há conexão
├── manifest.webmanifest     # manifesto do PWA (nome, ícones, atalhos, screenshots, cores)
├── sw.js                    # Service Worker (precache + strategies de fetch)
├── css/
│   └── styles.css           # estilos, responsivo, tema claro/escuro
├── js/
│   └── app.js               # tema, menu, instalar app, status online, scrollspy
├── icons/
│   ├── favicon.svg          # ícone vetorial (fonte dos demais)
│   ├── favicon-64.png
│   ├── icon-192.png         # ícone "any" 192×192
│   ├── icon-512.png         # ícone "any" 512×512
│   ├── icon-maskable-192.png# ícone "maskable" 192×192
│   ├── icon-maskable-512.png# ícone "maskable" 512×512
│   └── apple-touch-icon.png # 180×180 (iOS)
├── screenshots/
│   ├── screenshot-desktop-1280x720.png
│   └── screenshot-mobile-540x960.png
└── README.md
```

## 🖼️ Pré-visualização

| Desktop | Celular |
| --- | --- |
| ![Desktop](screenshots/screenshot-desktop-1280x720.png) | ![Celular](screenshots/screenshot-mobile-540x960.png) |

## 🚀 Como publicar

A página é estática: basta servir a pasta por HTTPS (o Service Worker **exige HTTPS**
ou `localhost`).

```bash
# qualquer servidor estático serve
npx serve .
python3 -m http.server 8080
```

Depois abra `http://localhost:8080` e teste o "Instalar app" no menu do navegador.

### GitHub Pages
1. Publique os arquivos na branch `main` (ou `gh-pages`).
2. Em **Settings → Pages**, aponte para a branch e a pasta `/ (root)`.
3. Acesse `https://<usuario>.github.io/<repo>/`.

### Netlify / Vercel / Cloudflare Pages
- **Build command:** deixar em branco
- **Publish directory:** `/` (raiz do repositório)
- Todo o restante é estático — nenhuma configuração extra.

## ✅ Checklist de PWA

- [x] `manifest.webmanifest` válido (`name`, `icons`, `start_url`, `display: standalone`, atalhos, screenshots)
- [x] Service Worker registrado em `./sw.js` com escopo `./`
- [x] Ícones 192×192, 512×512 e *maskable* (Android), 180×180 (iOS), favicon SVG
- [x] `theme-color` e `color-scheme` (light/dark) + botão de alternância de tema
- [x] `apple-touch-icon` + `apple-mobile-web-app-capable`
- [x] Precache dos assets e fallback `offline.html`
- [x] Estratégia *network-first* para navegações e *stale-while-revalidate* para estáticos
- [x] `viewport-fit=cover` e áreas seguras em telas com notch
- [x] Estrutura semântica + `skip-link` + foco visível + `aria-*` nos controles
- [x] JSON-LD `EducationalOrganization` (dados estruturados para buscadores)
- [x] Layout responsivo (360 px → 1440 px) e folha de impressão

## 🧪 Testes rápidos

- **Offline:** DevTools → Network → *Offline* → recarregar a página.
- **Instalação:** DevTools → Application → Manifest / Service Workers.
- **Lighthouse:**ighthouse contra `http://localhost:8080` (espera-se 100 em
  *Best Practices* e *Installable*).

## ♻️ Atualização do cache

Ao alterar os arquivos, incremente a constante `VERSION` em `sw.js`:

```js
const VERSION = 'v1.0.0';   // -> 'v1.0.1'
```

O Service Worker remove os caches antigos automaticamente no evento `activate`.

## 📝 Nota

Esta é uma página institucional **não oficial**, construída a partir de dados públicos
do Censo Escolar/INEP. Para informações oficiais e matrícula, procure a Secretaria de
Estado da Educação do Rio Grande do Norte (SEECRN).
