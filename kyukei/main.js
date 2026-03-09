'use strict';

{
    const foodEmojis = ['☕', '🍵', '🎃', '🐮', '🍴', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍛', '🍤', '🍱', '🍣', '🍥', '🍙', '🍘', '🍚', '🍜', '🍲', '🍢', '🍡', '🍳', '🍞', '🍩', '🍮', '🍦', '🍨', '🍧', '🎂', '🍰', '🍪', '🍫', '🍬', '🍭', '🍯', '🍎', '🍏', '🍊', '🍋', '🍒', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🍠', '🍆', '🍅', '🌽', '🐓']

    const emojiElement = document.querySelectorAll('.emojiSpan');
    const startButton = document.querySelector('#start');
    const goCopyButton = document.querySelector('#goCopy');
    const returnCopyButton = document.querySelector('#returnCopy');
    const copyButton = document.querySelectorAll('.copyButton');

    copyButton.forEach(el => el.disabled = true);
    
    function randomEmoji(count, delay) {
        return new Promise((resolve) => {

            function loop(count, delay) {
                const randomNumber = Math.floor(Math.random() * foodEmojis.length);
                const emoji = foodEmojis[randomNumber];

                emojiElement.forEach(el => el.textContent = emoji);

                if (count <= 1) {
                    startButton.disabled = false;
                    resolve();
                    return;
                }

                const nextDelay = Math.max(delay * 0.75, 10);

                setTimeout(() => {
                    loop(count - 1, nextDelay);
                }, delay);
            }

            loop(count, delay);
        })

    }

    startButton.addEventListener('click', async () => {
        copyButton.forEach(el => el.disabled = true);

        startButton.disabled = true;
        copyButton.forEach((el) => {
            el.textContent = 'copy';
        });
        await randomEmoji(10, 800);

        copyButton.forEach(el => el.disabled = false);
    });


    goCopyButton.addEventListener('click', () => {
        const goText = document.querySelector('#goText').textContent;
        navigator.clipboard.writeText(goText)
            .then(() => {
                goCopyButton.textContent = 'copied!';
                console.log('copied!')
            });
    });

    returnCopyButton.addEventListener('click', () => {
        const returnText = document.querySelector('#returnText').textContent;
        navigator.clipboard.writeText(returnText)
            .then(() => {
                returnCopyButton.textContent = 'copied!';
                console.log('copied!')
            });
    });
}