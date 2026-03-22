
  (async function(){

  // Проверка: не делаем редирект, если это локальная разработка
  const isLocal = location.hostname === 'localhost' ||
                   location.hostname === '127.0.0.1' ||
                   location.hostname === '::1';
  if (location.protocol !== 'https:' && !isLocal) {
    location.replace(`https://${location.host}${location.pathname}${location.search}${location.hash}`);
    return;
  }

    
  const correctHash = "44c625f397467d30c9906158a71baed6a79f7845117f6f70135e20bdd8dfed75";

  async function hash(s){
    const e = new TextEncoder();
    const d = e.encode(s);
    const b = await crypto.subtle.digest('SHA-256', d);
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('');
  }

  async function show404(){
    try {
      const response = await fetch('/404.html');
      if (response.ok) {
        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
      } else {
        fallback404();
      }
    } catch (e) {
      fallback404();
    }
  }

  function fallback404(){
    if (!document.body) {
      window.addEventListener('DOMContentLoaded', () => {
        document.body.innerHTML = `
          <h1>404</h1>
          <p>File not found</p>
          <p><a href="/">Back to homepage</a></p>
        `;
        document.body.style.visibility = 'visible';
      });
      return;
    }
    document.body.innerHTML = `
      <h1>404</h1>
      <p>File not found</p>
      <p><a href="/">Back to homepage</a></p>
    `;
    document.body.style.visibility = 'visible';
  }

 function showContent() {
  const show = () => {
    document.body.style.visibility = 'visible';
    // Удаляем тег скрипта после того, как контент показан
    const scripts = document.querySelectorAll('script[src*="grnvnel;klvj;lwkrjwkvjfkv;wlnlkfjvnlskjdhclihewlfkjeklrjlkjhkljehrglejrh.js"]');
    scripts.forEach(script => script.remove());
  };
  if (document.body) show();
  else window.addEventListener('DOMContentLoaded', show);
}

  const p = sessionStorage.getItem('p');
  if (!p) {
    await show404();
    return;
  }
  const ph = await hash(p);
  if (ph !== correctHash) {
    await show404();
  } else {
    showContent();
  }
})();
