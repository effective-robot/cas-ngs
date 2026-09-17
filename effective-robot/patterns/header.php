<?php
/**
 * Title: Header
 * Slug: twentytwentyfive/header
 * Categories: header
 * Block Types: core/template-part/header
 * Description: Floating glass dock — 85% wide, detached from the top edge, blurred at 16px. Brand left, navigation centered, CTA right. Collapses to the native hamburger overlay on mobile.
 */
?>
<!-- wp:group {"metadata":{"name":"Header Dock"},"className":"site-header-dock","backgroundColor":"glass","style":{"border":{"radius":"22px"},"spacing":{"padding":{"top":"0.65rem","bottom":"0.65rem","left":"1.25rem","right":"1rem"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","verticalAlignment":"center"}} -->
<div class="wp-block-group site-header-dock has-glass-background-color has-background" style="border-radius:22px;padding-top:0.65rem;padding-right:1rem;padding-bottom:0.65rem;padding-left:1.25rem">

	<!-- wp:group {"metadata":{"name":"Brand"},"style":{"spacing":{"blockGap":"0.65rem"}},"layout":{"type":"flex","flexWrap":"nowrap","verticalAlignment":"center"}} -->
	<div class="wp-block-group">
		<!-- wp:site-logo {"width":34} /-->
		<!-- wp:site-title {"level":0,"style":{"typography":{"fontStyle":"normal","fontWeight":"600"},"elements":{"link":{"color":{"text":"var:preset|color|contrast"},"typography":{"textDecoration":"none"}}}}} /-->
	</div>
	<!-- /wp:group -->

	<!-- wp:navigation {"overlayMenu":"mobile","icon":"menu","layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"blockGap":"1.75rem"}}} /-->

	<!-- wp:buttons {"metadata":{"name":"Header CTA"},"layout":{"type":"flex","justifyContent":"right"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"backgroundColor":"contrast","textColor":"base","style":{"border":{"radius":"999px"}}} -->
		<div class="wp-block-button"><a class="wp-block-button__link has-base-color has-contrast-background-color has-text-color has-background wp-element-button" style="border-radius:999px">Get in touch</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->

</div>
<!-- /wp:group -->
