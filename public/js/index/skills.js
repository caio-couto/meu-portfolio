
const cards = document.querySelectorAll('.skills-grid-item');

function handleOnMouseMove(event)
{
    const { currentTarget: target } = event;
    
    const rect = target.getBoundingClientRect(),
    x = event.clientX - rect.left,
    y = event.clientY - rect.top;
  
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
}

cards.forEach((card) =>
{
    card.addEventListener('mousemove', (event) => handleOnMouseMove(event));
});

