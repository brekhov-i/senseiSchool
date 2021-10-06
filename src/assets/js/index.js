'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.windowPopup');
  const btnOpenWindow = document.querySelector('.btnOpenWindow');
  const formCloseBtn = form.querySelector('.windowPopup__close')

  btnOpenWindow.addEventListener('click', () => {
    if(!form.classList.contains('open')) {
      form.classList.add('open');
    }
  })

  formCloseBtn.addEventListener('click', () => {
    if(form.classList.contains('open')) {
      form.classList.remove('open');
    }
  })


  //Title SectionAbout
  const title = document.querySelector('.aboutCourse__title');
  const mobileText = "конкретный результат в каждом уроке:";
  let oldTitleText = title.innerText;
  window.addEventListener('resize', () => {
    if(window.innerWidth < 480) { 
      title.innerText = mobileText;
    } else {
      title.innerText = oldTitleText;
    }
  })
  if(window.innerWidth < 480) {
    title.innerText = mobileText;
  } else if(oldTitleText !== "") {
    title.innerText = oldTitleText;
  }
})