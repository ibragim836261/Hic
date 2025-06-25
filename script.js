javascript
document.getElementById('phone-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const resultDiv = document.getElementById('result');

    // Проверка лимита запросов
    try {
        const limitResponse = await fetch('/api/check-limit');
        const data = await limitResponse.json();

        if (data.remaining === 0) {
            return resultDiv.innerHTML = 'Превышено количество запросов на сегодня';
        }

        // Отправка номера в бота
        const botToken = '8087552842:AAEG3Zn7bMoe42xIEtcRa1f6zqZYpx0gW2o';
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: 8087552842,
                text: phone
            })
        });

        // Получение ответа от бота (ожидание 10 секунд)
        const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timeout: 10 })
        });
        
        const updates = await response.json();
        const lastMessage = updates.result.pop()?.message.text || 'Нет данных';

        resultDiv.innerHTML = `<pre>${lastMessage}</pre>`;
    } catch (error) {
