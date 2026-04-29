
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) menuBtn.addEventListener('click', ()=> nav.classList.toggle('show'));

const setActiveNav = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || href.endsWith('/'+path)) a.classList.add('active');
  });
};
setActiveNav();

async function loadNews() {
  const wrappers = document.querySelectorAll('[data-news]');
  if (!wrappers.length) return;
  wrappers.forEach(w => w.innerHTML = '<div class="notice">Carregando notícias de tecnologia...</div>');
  const render = (items) => wrappers.forEach(wrapper => {
    wrapper.innerHTML = items.map(item => `
      <article class="news-item">
        <h3>${item.title}</h3>
        <p>${item.text || ''}</p>
        <a class="download-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir conteúdo</a>
      </article>
    `).join('');
  });
  try {
    const topResp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topIds = await topResp.json();
    const ids = topIds.slice(0, 6);
    const items = await Promise.all(ids.map(async id => {
      const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const data = await r.json();
      return {
        title: data.title || 'Notícia de tecnologia',
        text: 'Leitura complementar de tecnologia e inovação para manter a comunidade atualizada.',
        url: data.url || `https://news.ycombinator.com/item?id=${id}`
      };
    }));
    render(items);
  } catch (e) {
    try {
      const resp = await fetch((window.location.pathname.includes('/pages/') ? '../' : '') + 'data/noticias.json');
      const items = await resp.json();
      render(items);
    } catch {
      render([{title:'Biblioteca do projeto', text:'Explore os materiais gratuitos já disponíveis no site.', url:(window.location.pathname.includes('/pages/') ? 'biblioteca.html' : 'pages/biblioteca.html')}]);
    }
  }
}
loadNews();
