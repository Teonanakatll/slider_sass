import Swiper from 'swiper'
import { Parallax, Mousewheel, Controller, Pagination, Scrollbar, Navigation, Thumbs } from 'swiper/modules'
// в документации модули прописываются в функции слайдера
// Swiper.use([Parallax])

import MicroModal from 'micromodal'

// Power2 - модуль gsap анимации, плавности анимации и параметры анимации
import {gsap, Power2} from 'gsap'

document.addEventListener('DOMContentLoaded', () => {

// MICROMODAL

	MicroModal.init({
		openTrigger: 'data-micromodal-open',
		closeTrigger: 'data-micromodal-close',
		// отключает фокус при открытии формы, чтобы на телефонах при открытии формы не открывалась клавиатура
		disableFocus: true,
		disableScroll: true,
	// 	awaitOpenAnimation: true, 
	// 	awaitCloseAnimation: true, 
	})

// SWIPER

	const swiperIMG = new Swiper('.slider-img', {
		// при использовании скроллбара не работает зацикленная карусель
		modules: [Parallax, Mousewheel, Controller, Pagination, Thumbs],
		loop: false,
		speed: 2400,
		parallax: true,
		pagination: {
			el: '.slider-pagination-count .total',
			type: 'custom',
			renderCustom: function(swiper, current, total) {
				// используем интерполяцию для того чтобы произвести текстовую конкатенацию
				let totalRes = total >= 10 ? total : `0${total}`
				return totalRes
			}
		},

	})


	const swiperText = new Swiper('.slider-text', {
		// при использовании скроллбара не работает зацикленная карусель
		modules: [Parallax, Mousewheel, Controller, Pagination, Scrollbar, Navigation],
		loop: false,
		speed: 2400,
		parallax: true,
		mousewheel: {
			// invert: true,
			enabled: true,
			sensitivity: 2.4,
		},
		pagination: {
			el: '.swiper-pagination',
			// делаем точки кликабельными
			clickable: true,
		},
		scrollbar: {
			el: '.swiper-scrollbar',
			draggable: true,
		},
		navigation: {
			prevEl: '.swiper-button-prev',
			nextEl: '.swiper-button-next',
		},
	})

	// связываем свайперы через контроллеры
	swiperIMG.controller.control = swiperText
	swiperText.controller.control = swiperIMG


// GEAR

	// присваиваем переменной селектор колеса
	let gear = document.querySelector('.slider-gear')

	// slideNextTransitionStart - начало переключения слайда
	swiperText.on('slideNextTransitionStart', function() {
		// обьект, время, действие, параметры анимации
		gsap.to(gear, 2.8, {
			rotation: '+=60',
			ease: Power2.easeOut
		})
	})

	swiperText.on('slidePrevTransitionStart', function() {
		// обьект, время, действие, параметры анимации
		gsap.to(gear, 2.8, {
			rotation: '-=60',
			ease: Power2.easeOut
		})
	})

	// SLIDE COUNTER

	let curnum = document.querySelector('.slider-pagination-count .current'),
			pagcur = document.querySelector('.slider-pagination-current__num')

	swiperText.on('slideChange', function() {
		// в ind заносим номер текущего слайда
		let ind = swiperText.realIndex + 1,
				indRes = ind >= 10 ? ind : `0${ind}`
		// console.log(ind)
		// применяем gsap к переменной curnum длительностью 200мс
		gsap.to(curnum, .2, {
			force3D: true,
			y: 10,
			opacity: 0,
			ease: Power2.easeOut,
			// отработаем событие gsap - onComplite
			onComplite: function() {
				gsap.to(curnum, .1, {
					force3D: true,
					y: -10
				})
				// с помощю интерполяции конкатенируем 0 и значение переменной ind и подставляем полученный результат
				// в значение класса .current переменной curnum
				curnum.innerHTML = indRes
				pagcur.innerHTML = indRes
			}
		})
		gsap.to(curnum, .2, {
			force3D: true,
			y: 0,
			opacity: 1,
			ease: Power2.easeOut,
			delay: .3,
		})
	})

	// CURSOR

	const body   = document.querySelector('body'),
				cursor = document.getElementById('cursor'),
				links  = document.getElementsByTagName('a')

	let mouseX = 0, mouseY = 0, posX = 0, posY = 0

	// функция для определения координат
	function mouseCoords(e) {
		// присваиваем переменным координаты курсора
		mouseX = e.pageX
		mouseY = e.pageY
	}

	gsap.to({}, .01, {
		repeat: -1,
		onRepeat: () => {
			posX += (mouseX - posX) / 6
			posY += (mouseY - posY) / 6
			gsap.set(cursor, {
				css: {
					left: posX,
					top: posY
				}
			})
		}
	})

	// проходимся по всем ссылкам
	for(let i = 0; i < links.length; i++) {
		// добавляем прослушивание события 'mouseover'
		links[i].addEventListener('mouseover', () => {
			// при наведении на ссылку добавляем курсору класс active
			cursor.classList.add('active')
		})
		links[i].addEventListener('mouseout', () => {
			// при наведении на ссылку добавляем курсору класс active
			cursor.classList.remove('active')
		})
	}

	body.addEventListener('mousemove', e => {
		mouseCoords(e)
		cursor.classList.remove('hidden')
	})

	body.addEventListener('mouseout', e => {
		cursor.classList.add('hidden')
	})

})
