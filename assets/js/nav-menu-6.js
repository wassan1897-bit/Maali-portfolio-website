document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.querySelector('.menu-toggle')
	const menuOverlay = document.querySelector('.menu-overlay')
	const menuContent = document.querySelector('.menu-content')
	const menuPreviewImg = document.querySelector('.menu-preview-img')
	const menuLinks = document.querySelectorAll('.menu-overlay .link a')
	const menuOrigin = document.querySelector('.menu-origin')

	if (!menuToggle || !menuOverlay || !menuContent) return

	let isOpen = false
	let isAnimating = false

	menuToggle.addEventListener('click', () => {
		if (!isOpen) openMenu()
		else closeMenu()
	})

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isOpen) closeMenu()
	})

	// role="button": Enter and Space work like a click
	menuToggle.addEventListener('keydown', (e) => {
		if (e.key !== 'Enter' && e.key !== ' ') return
		e.preventDefault()
		menuToggle.click()
	})

	if (menuOrigin) {
		menuOrigin.addEventListener('click', (e) => {
			e.preventDefault()
			closeMenu()
		})
	}

	// The toggle lives in the hero header, inside ScrollSmoother's
	// transformed content, where position: fixed cannot escape and the
	// overlay covers it. While the menu is open it is lifted into <body>
	// (a same-size placeholder holds its spot in the header) so "Close"
	// stays on top of the overlay; closing puts it back.
	const togglePlaceholder = document.createElement('div')
	togglePlaceholder.setAttribute('aria-hidden', 'true')

	function pinToggle() {
		const rect = menuToggle.getBoundingClientRect()
		togglePlaceholder.style.cssText = `flex:none;width:${rect.width}px;height:${rect.height}px;margin-left:${getComputedStyle(menuToggle).marginLeft}`
		menuToggle.replaceWith(togglePlaceholder)
		document.body.appendChild(menuToggle)
		menuToggle.setAttribute('aria-label', 'Close menu')
		menuToggle.classList.add('is-fixed')
		menuToggle.style.top = `${rect.top}px`
		menuToggle.style.right = `${window.innerWidth - rect.right}px`
		menuToggle.style.left = 'auto'
		menuToggle.style.width = `${rect.width}px`
		menuToggle.style.height = `${rect.height}px`
	}

	function unpinToggle() {
		if (togglePlaceholder.parentNode) togglePlaceholder.replaceWith(menuToggle)
		menuToggle.setAttribute('aria-label', 'Open menu')
		menuToggle.classList.remove('is-fixed')
		menuToggle.style.top = ''
		menuToggle.style.right = ''
		menuToggle.style.left = ''
		menuToggle.style.width = ''
		menuToggle.style.height = ''
	}

	/* ---------------- Photo card (see nav-menu-6.css) ----------------
	   Three scenes, one active. Opening the menu plays the About
	   portrait's entrance on the active scene: Maali rises in first, the
	   background settles in behind him. Hovering a link switches to the
	   scene for that link's section. The pointer tilts the card and slides
	   the two layers at different depths. */
	const card = menuPreviewImg ? menuPreviewImg.querySelector('[data-menu-card]') : null
	const scenes = card ? Array.from(card.querySelectorAll('.menu-scene')) : []
	const DEFAULT_SCENE = 'about'
	const reduced = () =>
		!window.__motionPreview &&
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches

	const sceneEl = (name) => scenes.find((el) => el.dataset.scene === name)
	// plate = the far layer; pop = the near one (Maali's cutout on the
	// photo scenes, the lifted card or buttons on the section scenes)
	const layers = (el) => ({
		plate: el.querySelector('.menu-scene-plate img'),
		pop: el.querySelector('.menu-scene-pop img, .menu-scene-float img'),
	})

	// The near layers are centred with translate(-50%...) in CSS; hand that
	// to GSAP as percentages so animating y cannot overwrite it.
	scenes.forEach((el) => {
		const { plate, pop } = layers(el)
		if (el.classList.contains('menu-scene--shot')) {
			gsap.set(plate, { xPercent: -50, yPercent: -50, x: 0, y: 0 })
			gsap.set(pop, { xPercent: -50, yPercent: -50, x: 0 })
		} else if (pop) {
			gsap.set(pop, { xPercent: -50, x: 0 })
		}
	})

	// Hovering from link to link: the scenes crossfade (CSS, 650ms) while
	// the outgoing one drifts back and its near layer lifts away, and the
	// incoming one settles in from slightly close, its near layer rising
	// into place a beat after its plate.
	function showScene(name, animate) {
		const next = sceneEl(name) || sceneEl(DEFAULT_SCENE)
		if (!next) return
		const current = scenes.find((el) => el.classList.contains('is-active'))
		if (current === next) return
		scenes.forEach((el) => el.classList.toggle('is-active', el === next))
		// Home and About are whole desktop pages: the card turns landscape
		// for them (CSS animates the change of shape).
		if (card) card.classList.toggle('is-landscape', next.dataset.shape === 'landscape')
		if (!animate || reduced()) return
		if (current) {
			const out = layers(current)
			gsap.to(out.plate, { opacity: 1, duration: 0.01, overwrite: true })
			if (out.pop) gsap.to(out.pop, { y: -12, opacity: 0, duration: 0.45, ease: 'power2.in', overwrite: true })
		}
		const { plate, pop } = layers(next)
		gsap.fromTo(plate, { opacity: 0.4 }, { opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: true })
		if (pop) gsap.fromTo(pop, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, delay: 0.1, ease: 'power3.out', overwrite: true })
	}

	// Entrance on open: the same order as the About section's scroll
	// sequence (cutout, then plate), timed to follow the overlay's wipe.
	function playCardEntrance() {
		const el = sceneEl(DEFAULT_SCENE)
		if (!el || reduced()) return
		const { plate, pop } = layers(el)
		if (pop) gsap.fromTo(pop, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.55, overwrite: true })
		gsap.fromTo(plate, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: pop ? 0.85 : 0.6, overwrite: true, clearProps: 'transform' })
	}

	function resetPreviewImage() {
		showScene(DEFAULT_SCENE, false)
	}

	// No pointer tilt: the card holds a fixed 3D angle (nav-menu-6.css).

	function animateMenuToggle(isOpening) {
		const open = document.querySelector('p#menu-open')
		const close = document.querySelector('p#menu-close')

		gsap.to(isOpening ? open : close, {
			x: isOpening ? -5 : -5,
			y: isOpening ? -10 : 10,
			rotation: isOpening ? -5 : 5,
			opacity: 0,
			delay: 0.25,
			duration: 0.5,
			ease: 'power2.out',
		})

		gsap.to(isOpening ? close : open, {
			x: 0,
			y: 0,
			rotation: 0,
			opacity: 1,
			delay: 0.5,
			duration: 0.5,
			ease: 'power2.out',
		})
	}

	function openMenu() {
		if (isAnimating || isOpen) return
		isAnimating = true

		pinToggle()
		menuOverlay.classList.add('is-open')
		menuOverlay.setAttribute('aria-hidden', 'false')
		document.documentElement.classList.add('menu-is-open')
		animateMenuToggle(true)
		playCardEntrance()

		gsap.to(menuContent, {
			rotation: 0,
			x: 0,
			y: 0,
			scale: 1,
			opacity: 1,
			duration: 1.25,
			ease: 'power4.inOut',
		})

		gsap.to(['.menu-overlay .link a', '.menu-overlay .social a'], {
			y: '0%',
			delay: 0.75,
			opacity: 1,
			duration: 1,
			stagger: 0.1,
			ease: 'power3.out',
		})

		gsap.to(menuOverlay, {
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)',
			duration: 1.25,
			ease: 'power4.inOut',
			onComplete: () => {
				isOpen = true
				isAnimating = false
			},
		})
	}

	function closeMenu() {
		if (isAnimating || !isOpen) return
		isAnimating = true

		animateMenuToggle(false)

		gsap.to(menuContent, {
			rotation: -15,
			x: -100,
			y: -100,
			scale: 1.5,
			opacity: 0.25,
			duration: 1.25,
			ease: 'power4.inOut',
		})

		gsap.to(menuOverlay, {
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
			duration: 1.25,
			ease: 'power4.inOut',
			onComplete: () => {
				isOpen = false
				isAnimating = false
				menuOverlay.classList.remove('is-open')
				menuOverlay.setAttribute('aria-hidden', 'true')
				document.documentElement.classList.remove('menu-is-open')
				unpinToggle()
				gsap.set(['.menu-overlay .link a', '.menu-overlay .social a'], { y: '120%' })
				resetPreviewImage()
			},
		})
	}

	menuLinks.forEach(link => {
		link.addEventListener('mouseenter', () => {
			if (!isOpen || isAnimating) return
			showScene(link.dataset.scene || DEFAULT_SCENE, true)
		})

		link.addEventListener('click', () => {
			if (isOpen) closeMenu()
		})
	})
})
