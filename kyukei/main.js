'use strict';

{
    const foodEmojis = ['☕', '🍵', '🎃', '🐮', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🐓']


    const goElement = document.querySelector('.go');
    const returnElement = document.querySelector('.return');
    const button = document.querySelector('button');



    function randomEmoji(count, delay) {
        const randomNumber = Math.floor(Math.random() * foodEmojis.length);
        const emoji = foodEmojis[randomNumber];

        console.log("実行", count, emoji);

        goElement.textContent = `お昼休憩に入ります${emoji}`;
        returnElement.textContent = `戻りました${emoji}`;

        if (count <= 1) {
            button.disabled = false;
            return;
        }

        const nextDelay = Math.max(delay * 0.75, 10);

        setTimeout(() => {
            randomEmoji(count - 1, nextDelay);
        }, delay);

    }

    button.addEventListener('click', () => {
        button.disabled = true;
        randomEmoji(10, 1100);
    });



}


