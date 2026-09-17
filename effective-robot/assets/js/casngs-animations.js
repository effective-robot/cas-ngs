/*!
 * CASNGS Earth — motion engine (dependency-free).
 * Observes every block carrying a registered animation style and reveals it
 * the first time it enters the viewport. Blocks already in view on load
 * reveal immediately; late-injected content (query loops, infinite scroll)
 * is picked up by a lightweight MutationObserver.
 */
( function () {
	'use strict';

	var SELECTOR = [
		'.is-style-anim-fade-up',
		'.is-style-anim-slide-right',
		'.is-style-anim-cinematic',
		'.is-style-anim-blur-rise',
		'.is-style-anim-scale-in'
	].join( ',' );

	var io = null;

	function reveal( el ) {
		el.classList.add( 'is-in' );
		if ( io ) {
			io.unobserve( el );
		}
	}

	function observe( el ) {
		if ( el.classList.contains( 'is-in' ) ) {
			return;
		}
		if ( ! io ) {
			return;
		}
		io.observe( el );
	}

	function init() {
		var els = Array.prototype.slice.call( document.querySelectorAll( SELECTOR ) );

		if ( ! ( 'IntersectionObserver' in window ) ) {
			els.forEach( reveal );
			return;
		}

		io = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						reveal( entry.target );
					}
				} );
			},
			{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
		);

		els.forEach( observe );

		/* Pick up blocks rendered after load (query loops, AJAX). */
		if ( 'MutationObserver' in window ) {
			var mo = new MutationObserver( function ( mutations ) {
				mutations.forEach( function ( mutation ) {
					Array.prototype.forEach.call( mutation.addedNodes, function ( node ) {
						if ( node.nodeType !== 1 ) {
							return;
						}
						if ( node.matches && node.matches( SELECTOR ) ) {
							observe( node );
						}
						if ( node.querySelectorAll ) {
							Array.prototype.forEach.call( node.querySelectorAll( SELECTOR ), observe );
						}
					} );
				} );
			} );
			mo.observe( document.body, { childList: true, subtree: true } );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
