const POSTS_PER_PAGE = 5;
let currentPage = 1;
let articlesData = [];

const container = document.getElementById('articles-container');
const paginationDiv = document.getElementById('pagination');

fetch('pages/pagelist.json?v=' + Date.now())
    .then(response => {
        if (!response.ok) throw new Error('Не удалось загрузить список статей');
        return response.json();
    })
    .then(data => {
        articlesData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        renderPage(currentPage);
        setupPagination();
    })
    .catch(error => {
        container.innerHTML = `<div class="message-group"><div class="message" style="color: red;">Ошибка: ${error.message}</div></div>`;
    });

function renderPage(page) {
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pageArticles = articlesData.slice(start, end);

    if (pageArticles.length === 0 && page > 1) {
        currentPage = 1;
        renderPage(1);
        return;
    }

    let prevDate = null;
    if (page > 1 && articlesData.length >= start) {
        const prevPost = articlesData[start - 1];
        if (prevPost) prevDate = prevPost.date;
    }

    let html = '';
    for (let article of pageArticles) {
        const currentDate = article.date;
        if (currentDate !== prevDate) {
            html += `<div class="system-message">${formatDateRu(currentDate)}</div>`;
        }


        let messageContent = article.title;
        if (article.description) {
            messageContent += '<br>' + '<br>' + article.description;
        }

        html += `
            <div class="message-group">
                <div class="message">
                    ${messageContent}
                </div>
                <div class="message-buttons">
                    <a href="pages/${article.file}" class="tg-button">Открыть</a>
                </div>
            </div>
        `;

        prevDate = currentDate;
    }

    container.innerHTML = html;
}

function setupPagination() {
    const totalPages = Math.ceil(articlesData.length / POSTS_PER_PAGE);
    const backHome = document.getElementById('back-home');

    // Если статей нет или всего одна страница — пагинация не нужна
    if (totalPages <= 1) {
        paginationDiv.innerHTML = ''; // очищаем пагинацию
        if (backHome) backHome.style.display = 'none'; // скрываем кнопку
        return;
    }

    // Иначе показываем кнопку (если она была скрыта)
    if (backHome) backHome.style.display = ''; // возвращаем стандартное отображение (блок)

    // Генерируем кнопки пагинации
    let buttonsHtml = '';
    buttonsHtml += `<button class="tg-button" id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    for (let i = 1; i <= totalPages; i++) {
        buttonsHtml += `<button class="tg-button page-num" data-page="${i}" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
    }
    buttonsHtml += `<button class="tg-button" id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;

    const paginationGroupHTML = `
        <div class="message-group">
            <div class="message">Это еще не все) <br> Я много всего пишу, я отбитый😤</div>
            <div class="message-buttons">
                ${buttonsHtml}
            </div>
        </div>
    `;

    paginationDiv.innerHTML = paginationGroupHTML;

    // Обработчики событий
    document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            setupPagination();
        }
    });

    document.getElementById('next-page')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            setupPagination();
        }
    });

    document.querySelectorAll('.page-num').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = parseInt(e.target.dataset.page);
            if (page !== currentPage) {
                currentPage = page;
                renderPage(currentPage);
                setupPagination();
            }
        });
    });
}

function formatDateRu(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
}
