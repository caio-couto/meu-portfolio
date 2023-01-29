class code
{
    constructor(code, typingSpeed = 110, typingBreaks = 1000)
    {
        this.code = code;
        this.typingSpeed = typingSpeed;
        this.typingBreaks = typingBreaks;
    }

    waitForMs(ms)
    {
        return new Promise((resolve) =>
        {
            return setTimeout(resolve, ms);
        });
    };

    async typeSentense()
    {   
        const lines = Array(...this.code.getElementsByClassName('c-code-line'));
        this.populateCountLines();
        
        for(let i = 0; i < lines.length; i++)
        {
            const line = lines[i];
            const sentences = Array(...line.getElementsByClassName('c-code-word'));
            const bar = line.querySelector('.c-code-bar');

            bar.classList.add('active');

            await this.waitForMs(this.typingBreaks);

            for(let i = 0; i < sentences.length; i++)
            {
                const sentence = sentences[i];
                const letters = sentence.dataset.sentence.split('');
                sentence.style.color = sentence.dataset.color;

                let j = 0;
                while(j < letters.length)
                {
                    bar.classList.add('typing');
                    await this.waitForMs(this.typingSpeed);
                    sentence.innerHTML = sentence.innerHTML + letters[j];
                    j++
                };
                bar.classList.remove('typing');
            }

            await this.waitForMs(this.typingBreaks);
            
            if(i < lines.length - 1)
            {
                bar.classList.remove('active');
            }
        }
    };

    populateCountLines()
    {
        const count = this.code.querySelector('.c-code-countLines');
        const numLines = count.dataset.numlines;

        for(let i = 1; i <= numLines; i++)
        {
            count.innerHTML = count.innerHTML + `<span>${i}</span>`;
        }
    }
}

const codeHtml = document.getElementById('code');

const wello = new code(codeHtml);

wello.typeSentense();