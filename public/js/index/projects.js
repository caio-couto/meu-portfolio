'use strict'

const slideWrapper = document.querySelector('.l-slide-wrapper');
const slideList = document.querySelector('.c-slide-list');
const slideCards = document.querySelectorAll('.c-slide-card');
const nextBtn = document.querySelector('.c-slide-btn.c-slide-next');
const prevBtn = document.querySelector('.c-slide-btn.c-slide-prev');
const slidePagination = document.querySelector('.c-slide-pagination');
const mobile = document.querySelector('.c-slide-mobile');
let paginationBtns;
let isLeave = false;
let isMobile = false;
let isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

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

function setChevronVisibility()
{
    if(state.currentSlideIndex == 0)
    {
        prevBtn.classList.remove('active');
    }
    else
    {
        prevBtn.classList.add('active');
    }

    if(state.currentSlideIndex == slideCards.length - 1)
    {
        nextBtn.classList.remove('active');
    }
    else
    {
        nextBtn.classList.add('active');
    }
}

function getCenterPosition({index})
{
    const card = slideCards[index];
    const cardWidth = card.clientWidth;
    const windowWidth = slideWrapper.clientWidth;
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
    setChevronVisibility();
    if(isMobile === false)
    {
        const currentCard = slideCards[index];
        currentCard.classList.add('active');
        slideCards.forEach((card) => card != currentCard && card.classList.remove('active'));
    }
};

function nextSlide()
{
    setVisibleSlide({index: state.currentSlideIndex + 1});
    mobileDescription({index: state.currentSlideIndex})
};

function mobileDescription({index})
{
    if (isMobile)
    {
        const text = mobile.getElementsByTagName('p')[0];
        const description = slideCards[index].getElementsByTagName('p')[0].innerHTML;
        const more = mobile.getElementsByTagName('i')[0];

        text.innerHTML = description;

        if (description.length < 150)
        {
            more.style.display = 'none';
        }
        else if (more.style.display == 'none' || description.length >= 150)
        {
            more.style.display = 'inline';
        }
    }
}

function prevSlide()
{
    setVisibleSlide({index: state.currentSlideIndex - 1});
    mobileDescription({index: state.currentSlideIndex})

};

function createPaginationBtn()
{
    slideCards.forEach(() =>
    {
        const paginationBtn = document.createElement('div');
        paginationBtn.classList.add('c-slide-pagination-btn');
        paginationBtn.classList.add('bx');
        paginationBtn.classList.add('bxs-circle');
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

function onMouseOut(event)
{
    const card = event.currentTarget;
    if(event.target == card)
    {
        isLeave = false;
    }
    else
    {
        isLeave = true;
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseout', onMouseOut);
    }
}

function onMouseDown(event, index)
{
    const card = event.currentTarget;
    state.startPoint = event.clientX;
    state.currentPoint = event.clientX - state.lastPositon;
    state.currentSlideIndex = index;
    slideList.style.transition = 'none';
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseout', onMouseOut);
};

function onMouseMove(event)
{
    state.movment = event.clientX - state.startPoint;
    const position = event.clientX - state.currentPoint;
    translateSlide({position});
};

function onMouseUp(event)
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
    document.body.removeEventListener('mousemove', onMouseMove);
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
        if(!isTouch) 
        {

            card.addEventListener('dragstart', (event) =>
            {
                event.preventDefault();
            });
            card.addEventListener('mousedown', (event) =>
            {
                onMouseDown(event, index);
            });
            card.addEventListener('mouseup', onMouseUp, {capture: true});
        }
        else
        {
            isMobile = true;
            card.addEventListener('touchstart', (event) =>
            {
                onTouchStart(event, index);
            });
            card.addEventListener('touchend', onTouchEnd);
        }
    });

    const more = mobile.getElementsByTagName('i')[0];
    const text = mobile.getElementsByTagName('p')[0];
    more.addEventListener('click', () =>
    {
        if (text.style.display != 'inline')
        {
            text.style.display = 'inline';
            more.innerText = 'mostrar menos'
        }
        else
        {
            text.style.display = '-webkit-box';
            more.innerText = 'mostrar mais'
        }
    });

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
}

function initSlider()
{
    createPaginationBtn();
    setListeners();
    setVisibleSlide({index: 0});
    mobileDescription({index: 0});
}

function githubCard()
{
    const githubCard = document.querySelector('.l-github');
    let repo = [];

    fetch('https://api.github.com/users/caio-couto/repos')
    .then((resp) => resp.json())
    .then((data) =>
    {
        repo = data;
        populateCard(getLatestProject(repo));
    })
    .catch(() =>
    {
        githubCard.style.display = 'none';
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
