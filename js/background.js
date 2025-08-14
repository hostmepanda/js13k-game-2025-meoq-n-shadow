export function createBackground(ctx, canvas) {
    // Создаем простой градиентный фон
    const background = {
        render: function() {
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#87CEEB'); // светло-голубой
            gradient.addColorStop(1, '#4169E1'); // королевский синий

            // Заполняем фон градиентом
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Добавляем декоративные элементы (например, облака)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

            // Облако 1
            ctx.beginPath();
            ctx.arc(100, 80, 30, 0, Math.PI * 2);
            ctx.arc(130, 70, 25, 0, Math.PI * 2);
            ctx.arc(160, 80, 30, 0, Math.PI * 2);
            ctx.fill();

            // Облако 2
            ctx.beginPath();
            ctx.arc(canvas.width - 120, 50, 25, 0, Math.PI * 2);
            ctx.arc(canvas.width - 90, 45, 20, 0, Math.PI * 2);
            ctx.arc(canvas.width - 60, 50, 25, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    return background;
}