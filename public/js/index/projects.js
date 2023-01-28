'use strict'

const slideWrapper = document.querySelector('.c-slide-wrapper');
const slideList = document.querySelector('.c-slide-list');
const slideCards = document.querySelectorAll('.c-slide-card');
const nextBtn = document.querySelector('.c-slide-btn.c-slide-next');
const prevBtn = document.querySelector('.c-slide-btn.c-slide-prev');
const slidePagination = document.querySelector('.c-slide-pagination');
let paginationBtns;

const state = 
{
    startPoint: 0,
    lastPositon: 0,
    currentPoint: 0,
    movment: 0,
    currentSlideIndex: 0
};

function translateSlide({position})
{
    state.lastPositon = position;
    slideList.style.transform = `translateX(${position}px)`;
};

function getCenterPosition({index})
{
    const card = slideCards[index];
    const cardWidth = card.clientWidth;
    const windowWidth = document.body.clientWidth;
    const margin = (windowWidth - cardWidth)/2;
    const position = margin - (index * cardWidth);
    return position;
};

function setVisibleSlide({index})
{
    if(index === -1 || index === slideCards.length)
    {
        index = state.currentSlideIndex;
    }
    const position = getCenterPosition({index: index});
    state.currentSlideIndex = index;
    slideList.style.transition = 'transform 0.5s';
    translateSlide({position: position});
    activePaginationButton({index: index});
};

function nextSlide()
{
    setVisibleSlide({index: state.currentSlideIndex + 1});
};

function prevSlide()
{
    setVisibleSlide({index: state.currentSlideIndex - 1});
};

function createPaginationBtn()
{
    slideCards.forEach(() =>
    {
        const paginationBtn = document.createElement('div');
        paginationBtn.classList.add('c-slide-pagination-btn');
        paginationBtn.classList.add('bx');
        paginationBtn.classList.add('bx-circle');
        slidePagination.append(paginationBtn);
    })
}

function activePaginationButton({index})
{
    const paginationBtn = paginationBtns[index];
    paginationBtns.forEach((paginationBtnItem) =>
    {
        paginationBtnItem.classList.remove('c-slide-pagination-btn--active');
    })
    paginationBtn.classList.add('c-slide-pagination-btn--active');
}

function onMouseDown(event, index)
{
    const card = event.currentTarget;
    state.startPoint = event.clientX;
    state.currentPoint = event.clientX - state.lastPositon;
    state.currentSlideIndex = index;
    slideList.style.transition = 'none';
    card.addEventListener('mousemove', onMouseMove);
};

function onMouseMove(event)
{
    state.movment = event.clientX - state.startPoint;
    const position = event.clientX - state.currentPoint;
    translateSlide({position});
};

function onMouseUp(event)
{
    if(event.clientX > event.currentTarget.clientWidth)
    {
        console.log('sla');
    }
    const card = event.currentTarget;
    const cardWidth = card.clientWidth;
    if(state.movment < -cardWidth/3)
    {
        nextSlide();
    }
    else if(state.movment > cardWidth/3)
    {
        prevSlide();
    }
    else
    {
        setVisibleSlide({index: state.currentSlideIndex});
    };
    card.removeEventListener('mousemove', onMouseMove);
};

function onTouchStart(event, index)
{
    const card = event.currentTarget;
    state.startPoint = event.touches[0].clientX;
    state.currentPoint = event.touches[0].clientX - state.lastPositon;
    state.currentSlideIndex = index;
    slideList.style.transition = 'none';
    card.addEventListener('touchmove', onTouchMove);
}

function onTouchMove(event)
{
    state.movment = event.touches[0].clientX - state.startPoint;
    const position = event.touches[0].clientX - state.currentPoint;
    translateSlide({position});
};

function onTouchEnd(event, index)
{
    const card = event.currentTarget;
    const cardWidth = card.clientWidth;
    if(state.movment < -cardWidth/7)
    {
        nextSlide();
    }
    else if(state.movment > cardWidth/7)
    {
        prevSlide();
    }
    else
    {
        setVisibleSlide({index: state.currentSlideIndex});
    };
    card.removeEventListener('touchmove', onTouchMove);
}

function onPaginationBtnClick(index)
{
    setVisibleSlide({index: index});
}

function setListeners()
{
    paginationBtns = document.querySelectorAll('.c-slide-pagination-btn');
    paginationBtns.forEach((paginationBtn, index) =>
    {
        paginationBtn.addEventListener('click', (event) =>
        {
            onPaginationBtnClick(index);
        });
    });
    slideCards.forEach((card, index) =>
    {
        if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) 
        {
            card.addEventListener('dragstart', (event) =>
            {
                event.preventDefault();
            });
            card.addEventListener('mousedown', (event) =>
            {
                onMouseDown(event, index);
            });
            card.addEventListener('mouseup', onMouseUp);
        }
        card.addEventListener('touchstart', (event) =>
        {
            onTouchStart(event, index);
        });
        card.addEventListener('touchend', onTouchEnd);

    });
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
}

function initSlider()
{
    createPaginationBtn();
    setListeners();
    setVisibleSlide({index: 0});
}

function githubCard()
{
    let repo = [];

    fetch('https://api.github.com/users/caio-couto/repos')
    .then((resp) => resp.json())
    .then((data) =>
    {
        repo = data;
        populateCard(getLatestProject(repo));
    });

    function getLatestProject(repository)
    {
        let latestProject = {};

        for(let i = 0; i < repo.length; i++) 
        {
            const project = repository[i];

            if(latestProject.pushed_at)
            {
                const currentDate = new Date(latestProject.pushed_at).getTime();
                const newDate = new Date(project.pushed_at).getTime();
                if(currentDate < newDate)
                {
                    latestProject = project;
                }
            }
            else
            {
                latestProject = project;
            }
        }

        return latestProject;
    }

    function populateCard(project)
    {
        const title = document.querySelector('.c-github-rep-title');
        const description = document.querySelector('.c-github-description');
        const avatar = document.querySelector('.c-github-image');
        const updated = document.querySelector('.c-github-updated');

        title.innerHTML = project.name;
        title.setAttribute('href', project.html_url)
        description.innerHTML = project.description? project.description : 'Ainda não há descrição';
        updated.innerHTML = timeDifference(new Date(), new Date(project.pushed_at));
        const userImage = document.createElement('img');
        userImage.classList.add('c-github-avatar');
        userImage.setAttribute('src', project.owner.avatar_url);
        avatar.appendChild(userImage);
    }

    function timeDifference(current, previous) 
    {
    
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;
    
        const elapsed = current - previous;
    
        if (elapsed < msPerMinute) 
        {
            if(elapsed/1000 < 30)
            {
                return 'Atualizado agora';
            }
            return `Atualizado há ${Math.round(elapsed/1000)} segundos`;   
        }
    
        else if (elapsed < msPerHour) 
        {
            return `Atualizado há ${Math.round(elapsed/msPerMinute)} minutos`;   
        }
    
        else if (elapsed < msPerDay ) 
        {
            return `Atualizado há ${Math.round(elapsed/msPerHour )} horas`;   
        }
    
        else if (elapsed < msPerMonth) 
        {
            return `Atualizado há ${Math.round(elapsed/msPerDay)} dias`;   
        }
    
        else if (elapsed < msPerYear) 
        {
            return `Atualizado há ${Math.round(elapsed/msPerMonth)} meses`;   
        }
    
        else 
        {
            return `Atualizado há ${Math.round(elapsed/msPerYear)} anos`;   
        }
    }
}

githubCard();
initSlider();