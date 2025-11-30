// Глобальные переменные для слайд-шоу
let slideIndex = 1;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadNews();
    initializeContactForm();
    initializeSlideshow();
});

// Навигация по сайту
function initializeNavigation() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('section');
    
    // Показываем главную страницу при загрузке
    document.getElementById('home').style.display = 'block';
    
    // Обработчик кликов по меню
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Скрываем все разделы
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Показываем выбранный раздел
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).style.display = 'block';
            
            // Добавляем анимацию появления
            document.getElementById(targetId).classList.add('fade-in');
            
            // Удаляем класс анимации после завершения
            setTimeout(() => {
                document.getElementById(targetId).classList.remove('fade-in');
            }, 1000);
            
            // Анимация для активной ссылки меню
            menuLinks.forEach(item => {
                item.style.backgroundColor = '';
            });
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
    });
}

// Загрузка новостей
function loadNews() {
    // В реальном приложении здесь был бы fetch запрос к файлу с новостями
    // Для демонстрации создаем массив новостей
    const news = [
        { title: 'Новый проект', content: 'Завершил итоговую работу по Веб-программированию.' },
        { title: 'Изучение нового', content: 'Начал изучать язык Javascript.' },
        { title: 'Защита', content: 'Защитил проект по Моделированию систем.' }
    ];
    
    const newsList = document.getElementById('news-list');
    
    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        `;
        newsList.appendChild(newsItem);
    });
}

// Инициализация формы обращений
function initializeContactForm() {
    document.getElementById('message-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Сохраняем сообщение в текстовый файл
        saveMessageToFile(name, email, message);
        
        // Показываем сообщение об успехе
        document.getElementById('form-message').innerHTML = `
            <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 4px;">
                Спасибо, ${name}! Ваше сообщение успешно отправлено и сохранено.
            </div>
        `;
        
        // Очищаем форму
        document.getElementById('message-form').reset();
    });
}

// Функция для сохранения сообщения в текстовый файл
function saveMessageToFile(name, email, message) {
    // Создаем содержимое файла
    const timestamp = new Date().toLocaleString('ru-RU');
    const fileContent = `=== НОВОЕ ОБРАЩЕНИЕ ===
Дата и время: ${timestamp}
Имя: ${name}
Email: ${email}
Сообщение: ${message}
========================

`;
    
    // Создаем Blob объект с текстом
    const blob = new Blob([fileContent], { type: 'text/plain; charset=utf-8' });
    
    // Создаем URL для Blob
    const url = URL.createObjectURL(blob);
    
    // Создаем временную ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    
    // Генерируем имя файла с timestamp для уникальности
    const filename = `обращение_${Date.now()}.txt`;
    a.download = filename;
    
    // Программно кликаем по ссылке для скачивания
    document.body.appendChild(a);
    a.click();
    
    // Очищаем
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Альтернативный вариант - сохранение всех сообщений в один файл
function saveMessageToSingleFile(name, email, message) {
    // Получаем существующие сообщения из localStorage или создаем новый массив
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    
    // Добавляем новое сообщение
    const newMessage = {
        timestamp: new Date().toLocaleString('ru-RU'),
        name: name,
        email: email,
        message: message
    };
    
    messages.push(newMessage);
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Создаем содержимое для скачивания
    let fileContent = 'АРХИВ ОБРАЩЕНИЙ\n';
    fileContent += '================\n\n';
    
    messages.forEach((msg, index) => {
        fileContent += `Обращение #${index + 1}\n`;
        fileContent += `Дата и время: ${msg.timestamp}\n`;
        fileContent += `Имя: ${msg.name}\n`;
        fileContent += `Email: ${msg.email}\n`;
        fileContent += `Сообщение: ${msg.message}\n`;
        fileContent += '----------------\n\n';
    });
    
    // Создаем и скачиваем файл
    const blob = new Blob([fileContent], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'архив_обращений.txt';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Функция для добавления кнопки скачивания архива (опционально)
function addDownloadArchiveButton() {
    const contactSection = document.getElementById('contact');
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Скачать архив обращений';
    downloadBtn.style.marginTop = '10px';
    downloadBtn.addEventListener('click', downloadMessagesArchive);
    
    const formMessage = document.getElementById('form-message');
    formMessage.parentNode.insertBefore(downloadBtn, formMessage.nextSibling);
}

function downloadMessagesArchive() {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    
    if (messages.length === 0) {
        alert('Нет сохраненных обращений');
        return;
    }
    
    let fileContent = 'АРХИВ ОБРАЩЕНИЙ\n';
    fileContent += '================\n\n';
    
    messages.forEach((msg, index) => {
        fileContent += `Обращение #${index + 1}\n`;
        fileContent += `Дата и время: ${msg.timestamp}\n`;
        fileContent += `Имя: ${msg.name}\n`;
        fileContent += `Email: ${msg.email}\n`;
        fileContent += `Сообщение: ${msg.message}\n`;
        fileContent += '----------------\n\n';
    });
    
    const blob = new Blob([fileContent], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'архив_обращений.txt';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Слайд-шоу для фотогалереи
function initializeSlideshow() {
    showSlides(slideIndex);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }
    
    // Автоматическое переключение слайдов каждые 5 секунд
    setTimeout(() => {
        plusSlides(1);
    }, 5000);
}