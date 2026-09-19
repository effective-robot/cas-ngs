/*!
 * CASNGS Earth — motion engine and custom nav header 0 proximity dock.
 */
( function () {
	'use strict';

	var SELECTOR = '.is-style-anim-fade-up,.is-style-anim-slide-right,.is-style-anim-cinematic,.is-style-anim-blur-rise,.is-style-anim-scale-in';
	var io = null;
	function reveal( el ) { el.classList.add( 'is-in' ); if ( io ) { io.unobserve( el ); } }
	function observe( el ) { if ( ! el.classList.contains( 'is-in' ) && io ) { io.observe( el ); } }
	function initAnimations() {
		var els = Array.prototype.slice.call( document.querySelectorAll( SELECTOR ) );
		if ( ! ( 'IntersectionObserver' in window ) ) { els.forEach( reveal ); return; }
		io = new IntersectionObserver( function ( entries ) { entries.forEach( function ( entry ) { if ( entry.isIntersecting ) { reveal( entry.target ); } } ); }, { threshold: .15, rootMargin: '0px 0px -8% 0px' } );
		els.forEach( observe );
		if ( 'MutationObserver' in window ) { new MutationObserver( function ( mutations ) { mutations.forEach( function ( mutation ) { Array.prototype.forEach.call( mutation.addedNodes, function ( node ) { if ( node.nodeType !== 1 ) { return; } if ( node.matches && node.matches( SELECTOR ) ) { observe( node ); } if ( node.querySelectorAll ) { Array.prototype.forEach.call( node.querySelectorAll( SELECTOR ), observe ); } } ); } ); } ).observe( document.body, { childList: true, subtree: true } ); }
	}

	function initDock() {
		var dock = document.querySelector( '[data-custom-nav-dock]' );
		if ( ! dock || ! ( 'matchMedia' in window ) ) { return; }
		var nav = dock.querySelector( '.wp-block-navigation__container' );
		if ( ! nav ) { return; }
		var items = Array.prototype.slice.call( nav.querySelectorAll( ':scope > .wp-block-navigation-item' ) );
		if ( ! items.length || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches || ! window.matchMedia( '(hover: hover) and (pointer: fine)' ).matches ) { return; }
		var proximity = 122, spring = .19, damping = .70, values = items.map( function () { return { value: 0, velocity: 0, target: 0 }; } ), active = false, frame = 0;
		function setTargets( clientX ) { var rects = items.map( function ( item ) { return item.getBoundingClientRect(); } ); items.forEach( function ( item, index ) { var center = rects[ index ].left + rects[ index ].width / 2; var near = Math.max( 0, Math.min( 1, 1 - Math.abs( clientX - center ) / proximity ) ); values[ index ].target = near * near * ( 3 - 2 * near ); item.dataset.navNear = values[ index ].target > .08 ? 'true' : 'false'; } ); active = true; }
		function reset() { values.forEach( function ( state, index ) { state.target = 0; items[ index ].dataset.navNear = 'false'; } ); active = true; }
		function draw() { if ( active ) { var moving = false; values.forEach( function ( state, index ) { state.velocity += ( state.target - state.value ) * spring; state.velocity *= damping; state.value += state.velocity; if ( Math.abs( state.target - state.value ) > .001 || Math.abs( state.velocity ) > .001 ) { moving = true; } else { state.value = state.target; state.velocity = 0; } var content = items[ index ].querySelector( '.wp-block-navigation-item__content' ); if ( content ) { content.style.setProperty( '--nav-dock-scale', ( 1 + state.value * .04 ).toFixed( 3 ) ); } } ); if ( ! moving && values.every( function ( state ) { return state.target === 0; } ) ) { active = false; } } frame = requestAnimationFrame( draw ); }
		nav.addEventListener( 'pointermove', function ( event ) { setTargets( event.clientX ); }, { passive: true } );
		nav.addEventListener( 'pointerleave', reset );
		window.addEventListener( 'pointermove', function ( event ) { var rect = nav.getBoundingClientRect(); if ( event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom ) { reset(); } }, { passive: true } );
		frame = requestAnimationFrame( draw );
		window.addEventListener( 'pagehide', function () { cancelAnimationFrame( frame ); }, { once: true } );
	}

	function init() { initAnimations(); initDock(); }
	if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', init ); } else { init(); }
} )();
