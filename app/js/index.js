!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s="./src/assets/js/index.js")}({"./src/assets/js/index.js":
/*!********************************!*\
  !*** ./src/assets/js/index.js ***!
  \********************************/
/*! no static exports found */function(module,exports,__webpack_require__){"use strict";eval("\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var form = document.querySelector('.windowPopup');\n  var btnOpenWindow = document.querySelector('.btnOpenWindow');\n  var formCloseBtn = form.querySelector('.windowPopup__close');\n  btnOpenWindow.addEventListener('click', function () {\n    if (!form.classList.contains('open')) {\n      form.classList.add('open');\n    }\n  });\n  formCloseBtn.addEventListener('click', function () {\n    if (form.classList.contains('open')) {\n      form.classList.remove('open');\n    }\n  }); //Title SectionAbout\n\n  var title = document.querySelector('.aboutCourse__title');\n  var mobileText = \"конкретный результат в каждом уроке:\";\n  var oldTitleText = title.innerText;\n  window.addEventListener('resize', function () {\n    if (window.innerWidth < 480) {\n      title.innerText = mobileText;\n    } else {\n      title.innerText = oldTitleText;\n    }\n  });\n\n  if (window.innerWidth < 480) {\n    title.innerText = mobileText;\n  } else if (oldTitleText !== \"\") {\n    title.innerText = oldTitleText;\n  }\n});\n\n//# sourceURL=webpack:///./src/assets/js/index.js?")}});
//# sourceMappingURL=index.js.map
