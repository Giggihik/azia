
const BOT_TOKEN = '8725347558:AAGSiLBVez8CgaJg7xYx9opX7d1r_Vx07cY';
const CHAT_ID = '5680166179';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const message = document.getElementById('message').value.trim();
        const resultDiv = document.getElementById('formResult');

        if (!name || !contact || !message) {
            resultDiv.innerHTML = 'Заполните все поля';
            resultDiv.style.color = 'red';
            return;
        }

        const text = `Новая заявка из ресторана Azia\n\nИмя: ${name}\nКонтакт: ${contact}\nСообщение: ${message}`;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Отправка...';

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text })
            });
            const data = await response.json();
            if (data.ok) {
                resultDiv.innerHTML = 'Сообщение отправлено! Мы свяжемся с вами.';
                resultDiv.style.color = 'green';
                form.reset();
            } else {
                resultDiv.innerHTML = 'Ошибка: ' + data.description;
                resultDiv.style.color = 'red';
            }
        } catch (err) {
            resultDiv.innerHTML = 'Ошибка соединения. Попробуйте позже.';
            resultDiv.style.color = 'red';
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
            setTimeout(() => resultDiv.innerHTML = '', 4000);
        }
    });
});