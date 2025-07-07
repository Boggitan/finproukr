// ФинансПро Украина - JavaScript функциональность

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
	initScrollAnimations();
	initSmoothScroll();
	initCookieBanner();
	initHeaderScroll();
});

// Анимации при скролле
function initScrollAnimations() {
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};

	const observer = new IntersectionObserver(function (entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	}, observerOptions);

	// Наблюдаем за всеми элементами с классом fade-in
	document.querySelectorAll('.fade-in').forEach(el => {
		observer.observe(el);
	});
}

// Плавный скролл для якорных ссылок
function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});
}

// Изменение хедера при скролле
function initHeaderScroll() {
	const header = document.querySelector('header');
	let lastScrollY = window.scrollY;

	window.addEventListener('scroll', () => {
		const currentScrollY = window.scrollY;

		if (currentScrollY > 100) {
			header.style.background = 'rgba(26, 28, 44, 0.98)';
			header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
		} else {
			header.style.background = 'rgba(26, 28, 44, 0.95)';
			header.style.boxShadow = 'none';
		}

		lastScrollY = currentScrollY;
	});
}

// Cookie баннер функциональность
function initCookieBanner() {
	// Проверяем, есть ли уже согласие
	if (!getCookie('cookieConsent')) {
		setTimeout(() => {
			document.getElementById('cookieBanner').classList.add('show');
		}, 1000);
	}
}

function setCookie(name, value, days) {
	const expires = new Date();
	expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function acceptCookies() {
	setCookie('cookieConsent', 'true', 30);
	const banner = document.getElementById('cookieBanner');
	banner.style.opacity = '0';
	setTimeout(() => {
		banner.classList.remove('show');
		banner.style.opacity = '1';
	}, 500);
}

// Паралакс эффект для хиро секции
window.addEventListener('scroll', () => {
	const scrolled = window.pageYOffset;
	const hero = document.querySelector('.hero');
	if (hero) {
		const rate = scrolled * -0.5;
		hero.style.transform = `translateY(${rate}px)`;
	}
});

// Анимация счетчиков на странице достижений
function animateCounters() {
	const counters = document.querySelectorAll('[data-count]');

	counters.forEach(counter => {
		const updateCount = () => {
			const target = +counter.getAttribute('data-count');
			const count = +counter.innerText;
			const increment = target / 100;

			if (count < target) {
				counter.innerText = Math.ceil(count + increment);
				setTimeout(updateCount, 20);
			} else {
				counter.innerText = target;
			}
		};
		updateCount();
	});
}

// Мобильное меню (добавим позже если потребуется)
function toggleMobileMenu() {
	const menu = document.querySelector('.nav-menu');
	menu.classList.toggle('active');
}

// Валидация формы
function validateForm(form) {
	const inputs = form.querySelectorAll('input[required], textarea[required]');
	let isValid = true;

	inputs.forEach(input => {
		if (!input.value.trim()) {
			input.style.borderColor = '#ff4444';
			isValid = false;
		} else {
			input.style.borderColor = 'var(--borders)';
		}
	});

	// Проверка email
	const emailInput = form.querySelector('input[type="email"]');
	if (emailInput && emailInput.value) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailInput.value)) {
			emailInput.style.borderColor = '#ff4444';
			isValid = false;
		}
	}

	// Проверка телефона
	const phoneInput = form.querySelector('input[type="tel"]');
	if (phoneInput && phoneInput.value) {
		const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
		if (!phoneRegex.test(phoneInput.value)) {
			phoneInput.style.borderColor = '#ff4444';
			isValid = false;
		}
	}

	return isValid;
}

// Функция отправки формы
async function submitForm(formData, email) {
	const subject = 'Новая заявка с сайта ФинансПро Украина';
	const body = `
Имя: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email}
Сообщение: ${formData.message}

Согласие на обработку данных: ${formData.privacy ? 'Да' : 'Нет'}
Согласие с условиями: ${formData.disclaimer ? 'Да' : 'Нет'}
    `;

	const encodedBody = btoa(unescape(encodeURIComponent(body)));

	try {
		const response = await fetch('mailto:' + email, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
				'Subject': subject,
				'From': formData.email
			},
			body: encodedBody
		});

		return true;
	} catch (error) {
		console.error('Ошибка отправки:', error);
		return false;
	}
}

// Показать уведомление
function showNotification(message, type = 'success') {
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.innerHTML = message;
	notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--active)' : '#ff4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
    `;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.remove();
	}, 5000);
}

// CSS для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 