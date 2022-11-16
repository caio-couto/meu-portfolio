const codeSentence = document.querySelectorAll('.c-code__sentece');
const codeSentenceArray = [...codeSentence]
const codeLines = codeSentenceArray.map((element) =>
{
    let link = false;
    if(element.querySelector('.c-code__text.code__text--link') != undefined)
    {
        link = true;
    };

    const sentence = 
    {
        element: element,
        text: element.querySelector('.c-code__text'),
        cursor: element.querySelector('.c-code__cursor'),
    };
    if(element.querySelector('.c-code__brackets') != undefined)
    {
        sentence.brakets = element.querySelector('.c-code__brackets');
    };
    return sentence;
});

async function typeSentense(sentence, line, delay, color, link, href)
{
    const lettes = sentence.split('');
    const {cursor, text} = line;
    cursor.classList.remove('c-code__cursor--active');
    let component = undefined;
    if(link == true)
    {
        component = document.createElement('a');
        component.classList.add('code__link');
        component.setAttribute('href', href);
    }
    else
    {
        component = document.createElement('span');
    };
    component.style.color = color;
    text.appendChild(component);
    let i = 0;
    while(i < lettes.length)
    {
        await waitForMs(delay);
        component.innerHTML = component.innerHTML + lettes[i];
        i++
    };
    cursor.classList.add('c-code__cursor--active');
};

function visibilityElement(element)
{
    elementClasse = element.getAttribute('class').split(' ');
    element.classList.toggle(`${elementClasse[0]}--hidden`);
};

function  waitForMs(ms)
{
    return new Promise((resolve) =>
    {
        return setTimeout(resolve, ms);
    });
};

if (window.matchMedia("(max-width: 930px)").matches != true)
{

    document.addEventListener("DOMContentLoaded", async function()
    {
        countLine();
        visibilityElement(codeLines[0].cursor);
        visibilityElement(codeLines[0].element);
        await waitForMs(700);
        await typeSentense('var ', codeLines[0], 110, '#2354a0');
        await typeSentense('dev ', codeLines[0], 110, '#70beef');
        await typeSentense(' = ', codeLines[0], 110, '#a6a6a6');
        await typeSentense('{', codeLines[0], 110, '#c3c10a')
        visibilityElement(codeLines[0].brakets);
        await waitForMs(700);
        visibilityElement(codeLines[0].cursor);
        visibilityElement(codeLines[0].brakets);
        visibilityElement(codeLines[1].element);
        visibilityElement(codeLines[1].cursor);
        visibilityElement(codeLines[4].brakets);
        await waitForMs(700);
        await typeSentense('name: ', codeLines[1], 100, '#70beef');
        await typeSentense("'caio couto'", codeLines[1], 100, '#ba7f55');
        await typeSentense(',', codeLines[1], 100, '#a6a6a6');
        visibilityElement(codeLines[1].cursor);
        visibilityElement(codeLines[2].element);
        visibilityElement(codeLines[2].cursor);
        await waitForMs(700);
        await typeSentense('linkedin: ', codeLines[2], 100, '#70beef',)
        await typeSentense("'https://www.linkedin.com/in/caio...'", codeLines[2], 100, '#ba7f55', true, 'https://www.linkedin.com/in/caio-cavalcante-do-couto-759aa2224/');
        await typeSentense(',', codeLines[2], 100, '#a6a6a6');
        visibilityElement(codeLines[2].cursor);
        visibilityElement(codeLines[3].element);
        visibilityElement(codeLines[3].cursor);
        await waitForMs(700);
        await typeSentense('gitHub: ', codeLines[3], 100, '#70beef',)
        await typeSentense("'https://github.com/caio-couto'", codeLines[3], 100, '#ba7f55', true, 'https://github.com/caio-couto');
    });
}

function countLine()
{
    const vsCountLine = document.querySelector('.c-code__liner-counter');
    for(let i = 0; i <= 4; i++) 
    {
        const div = document.createElement('div');
        div.classList.add('c-code__line-item');
        div.innerText = i + 1;
        vsCountLine.appendChild(div);
    };
};