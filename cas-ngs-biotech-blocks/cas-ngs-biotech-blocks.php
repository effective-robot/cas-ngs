<?php
/**
 * Plugin Name:       CAS-NGS Biotech Blocks
 * Plugin URI:        https://cas-ngs.com
 * Description:       Modular Gutenberg blocks, 3D DNA simulation engine (Three.js + GSAP ScrollTrigger), and fallback shortcodes for CAS-NGS biotechnology layouts (3D DNA Background, Hero Sequencer Terminal, Bento Grid, Process Timeline, and Conversion CTA Banner).
 * Version:           1.2.1
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            CAS-NGS
 * Text Domain:       cas-ngs-biotech-blocks
 * Domain Path:       /languages
 * License:           GPL-2.0-or-later
 *
 * @package CAS_NGS_Biotech_Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

define( 'CAS_BIO_BLOCKS_VERSION', '1.2.1' );
define( 'CAS_BIO_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'CAS_BIO_BLOCKS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register Custom Gutenberg Block Category
 */
function cas_bio_register_block_category( $categories ) {
  return array_merge(
    array(
      array(
        'slug'  => 'cas-ngs-biotech',
        'title' => __( 'CAS-NGS Biotech Blocks', 'cas-ngs-biotech-blocks' ),
        'icon'  => 'analytics',
      ),
    ),
    $categories
  );
}
add_filter( 'block_categories_all', 'cas_bio_register_block_category', 10, 1 );

/**
 * Register the Editor Script handle BEFORE block registration so
 * block.json editorScript: "cas-ngs-biotech-blocks-editor" resolves correctly.
 */
function cas_bio_register_editor_script() {
  wp_register_script(
    'cas-ngs-biotech-blocks-editor',
    CAS_BIO_BLOCKS_URL . 'assets/js/biotech-blocks-editor.js',
    array(
      'wp-blocks',
      'wp-element',
      'wp-block-editor',
      'wp-components',
      'wp-i18n',
      'wp-plugins',
      'wp-edit-post',
      'wp-data',
    ),
    CAS_BIO_BLOCKS_VERSION,
    true
  );

  wp_localize_script(
    'cas-ngs-biotech-blocks-editor',
    'casBioBlocksData',
    array(
      'defaultModelUrl' => CAS_BIO_BLOCKS_URL . 'assets/models/dna.glb',
      'pluginUrl'       => CAS_BIO_BLOCKS_URL,
    )
  );
}
add_action( 'init', 'cas_bio_register_editor_script', 5 );

/**
 * Register Gutenberg Blocks via block.json metadata
 */
function cas_bio_register_blocks() {
  $blocks = array(
    'dna-background',
    'act1-hero-sequencer',
    'act2-bento-grid',
    'act3-process-timeline',
    'act4-cta-banner',
  );

  foreach ( $blocks as $block ) {
    $block_dir = CAS_BIO_BLOCKS_PATH . 'blocks/' . $block;
    if ( file_exists( $block_dir . '/block.json' ) ) {
      register_block_type( $block_dir );
    }
  }
}
add_action( 'init', 'cas_bio_register_blocks', 10 );

/**
 * Register & enqueue frontend stylesheet, Three.js, GSAP & animation engine.
 */
function cas_bio_enqueue_frontend_assets() {
  // Scoped Design System Stylesheet
  wp_register_style(
    'cas-ngs-biotech-blocks-css',
    CAS_BIO_BLOCKS_URL . 'assets/css/biotech-blocks.css',
    array(),
    CAS_BIO_BLOCKS_VERSION
  );
  wp_enqueue_style( 'cas-ngs-biotech-blocks-css' );

  // GSAP Core 3.12.5
  if ( ! wp_script_is( 'gsap', 'registered' ) ) {
    wp_register_script(
      'gsap',
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
      array(),
      '3.12.5',
      true
    );
  }
  wp_enqueue_script( 'gsap' );

  // GSAP ScrollTrigger 3.12.5
  if ( ! wp_script_is( 'gsap-scroll-trigger', 'registered' ) ) {
    wp_register_script(
      'gsap-scroll-trigger',
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
      array( 'gsap' ),
      '3.12.5',
      true
    );
  }
  wp_enqueue_script( 'gsap-scroll-trigger' );

  // Three.js r128
  if ( ! wp_script_is( 'three', 'registered' ) ) {
    wp_register_script(
      'three',
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
      array(),
      'r128',
      true
    );
  }
  wp_enqueue_script( 'three' );

  // Three.js GLTFLoader
  if ( ! wp_script_is( 'three-gltf-loader', 'registered' ) ) {
    wp_register_script(
      'three-gltf-loader',
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
      array( 'three' ),
      'r128',
      true
    );
  }
  wp_enqueue_script( 'three-gltf-loader' );

  // Telemetry, 3D Engine & Animation Engine
  wp_register_script(
    'cas-ngs-biotech-blocks-engine',
    CAS_BIO_BLOCKS_URL . 'assets/js/biotech-blocks-engine.js',
    array( 'gsap', 'gsap-scroll-trigger', 'three', 'three-gltf-loader' ),
    CAS_BIO_BLOCKS_VERSION,
    true
  );

  wp_localize_script(
    'cas-ngs-biotech-blocks-engine',
    'casBioBlocksData',
    array(
      'defaultModelUrl' => CAS_BIO_BLOCKS_URL . 'assets/models/dna.glb',
      'pluginUrl'       => CAS_BIO_BLOCKS_URL,
    )
  );

  wp_enqueue_script( 'cas-ngs-biotech-blocks-engine' );
}
add_action( 'wp_enqueue_scripts', 'cas_bio_enqueue_frontend_assets' );

/**
 * Enqueue styles and Three.js inside block editor
 */
function cas_bio_enqueue_editor_assets() {
  wp_enqueue_style( 'cas-ngs-biotech-blocks-css' );
  if ( ! wp_script_is( 'three', 'registered' ) ) {
    wp_register_script(
      'three',
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
      array(),
      'r128',
      true
    );
  }
  wp_enqueue_script( 'three' );

  if ( ! wp_script_is( 'three-gltf-loader', 'registered' ) ) {
    wp_register_script(
      'three-gltf-loader',
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
      array( 'three' ),
      'r128',
      true
    );
  }
  wp_enqueue_script( 'three-gltf-loader' );
}
add_action( 'enqueue_block_editor_assets', 'cas_bio_enqueue_editor_assets' );

/**
 * Universal Block Template Renderer — shared by Gutenberg (render.php) and Shortcodes.
 */
function cas_bio_render_block_template( $block_slug, $attributes = array() ) {
  $file = CAS_BIO_BLOCKS_PATH . 'blocks/' . sanitize_file_name( $block_slug ) . '/render.php';
  if ( ! file_exists( $file ) ) {
    return '';
  }

  // Ensure assets are queued when invoked via shortcode or template injection
  wp_enqueue_style( 'cas-ngs-biotech-blocks-css' );
  wp_enqueue_script( 'gsap' );
  wp_enqueue_script( 'gsap-scroll-trigger' );
  wp_enqueue_script( 'three' );
  wp_enqueue_script( 'three-gltf-loader' );
  wp_enqueue_script( 'cas-ngs-biotech-blocks-engine' );

  ob_start();
  include $file;
  return ob_get_clean();
}

/**
 * Fallback Shortcode Registration
 */
function cas_bio_shortcode_dna_background( $atts = array() ) {
  return cas_bio_render_block_template( 'dna-background', is_array( $atts ) ? $atts : array() );
}
add_shortcode( 'cas_dna_background', 'cas_bio_shortcode_dna_background' );
add_shortcode( 'cas_3d_dna', 'cas_bio_shortcode_dna_background' );

function cas_bio_shortcode_hero_sequencer( $atts = array() ) {
  return cas_bio_render_block_template( 'act1-hero-sequencer', is_array( $atts ) ? $atts : array() );
}
add_shortcode( 'cas_hero_sequencer', 'cas_bio_shortcode_hero_sequencer' );

function cas_bio_shortcode_bento_grid( $atts = array() ) {
  return cas_bio_render_block_template( 'act2-bento-grid', is_array( $atts ) ? $atts : array() );
}
add_shortcode( 'cas_bento_grid', 'cas_bio_shortcode_bento_grid' );

function cas_bio_shortcode_process_timeline( $atts = array() ) {
  return cas_bio_render_block_template( 'act3-process-timeline', is_array( $atts ) ? $atts : array() );
}
add_shortcode( 'cas_process_timeline', 'cas_bio_shortcode_process_timeline' );

function cas_bio_shortcode_cta_banner( $atts = array() ) {
  return cas_bio_render_block_template( 'act4-cta-banner', is_array( $atts ) ? $atts : array() );
}
add_shortcode( 'cas_cta_banner', 'cas_bio_shortcode_cta_banner' );

/**
 * Register Page Template Metadata / Custom Post Meta
 * Allows the 3D DNA Background to be activated globally per page/post via document settings.
 */
function cas_bio_register_post_meta() {
  $meta_fields = array(
    '_cas_enable_dna_background' => 'boolean',
    '_cas_dna_model_url'         => 'string',
    '_cas_dna_scale'             => 'number',
    '_cas_dna_offset_x'          => 'number',
    '_cas_dna_offset_y'          => 'number',
    '_cas_dna_strand_color'      => 'string',
    '_cas_dna_accent_color'      => 'string',
    '_cas_dna_ambient_intensity' => 'number',
  );

  foreach ( $meta_fields as $key => $type ) {
    register_post_meta( '', $key, array(
      'show_in_rest'  => true,
      'single'        => true,
      'type'          => $type,
      'auth_callback' => function() { return current_user_can( 'edit_posts' ); },
    ) );
  }
}
add_action( 'init', 'cas_bio_register_post_meta' );

/**
 * Sidebar Meta Box for easy page-level toggle in standard & block editor
 */
function cas_bio_add_meta_box() {
  add_meta_box(
    'cas_bio_dna_bg_meta',
    __( '3D DNA Simulation Settings', 'cas-ngs-biotech-blocks' ),
    'cas_bio_render_meta_box',
    array( 'page', 'post' ),
    'side',
    'default'
  );
}
add_action( 'add_meta_boxes', 'cas_bio_add_meta_box' );

function cas_bio_render_meta_box( $post ) {
  wp_nonce_field( 'cas_bio_save_dna_meta', 'cas_bio_dna_nonce' );
  $enabled       = get_post_meta( $post->ID, '_cas_enable_dna_background', true );
  $scale         = get_post_meta( $post->ID, '_cas_dna_scale', true );
  $offset_x      = get_post_meta( $post->ID, '_cas_dna_offset_x', true );
  $offset_y      = get_post_meta( $post->ID, '_cas_dna_offset_y', true );
  $strand_color  = get_post_meta( $post->ID, '_cas_dna_strand_color', true );
  $accent_color  = get_post_meta( $post->ID, '_cas_dna_accent_color', true );
  $ambient_int   = get_post_meta( $post->ID, '_cas_dna_ambient_intensity', true );

  if ( '' === $scale ) $scale = '1.0';
  if ( '' === $offset_x ) $offset_x = '0.0';
  if ( '' === $offset_y ) $offset_y = '0.0';
  if ( empty( $strand_color ) ) $strand_color = '#8c6d58';
  if ( empty( $accent_color ) ) $accent_color = '#4ade80';
  if ( '' === $ambient_int ) $ambient_int = '1.8';
  ?>
  <p>
    <label>
      <input type="checkbox" name="cas_enable_dna_background" value="1" <?php checked( $enabled, 1 ); ?> />
      <strong><?php esc_html_e( 'Activate 3D DNA Background', 'cas-ngs-biotech-blocks' ); ?></strong>
    </label>
  </p>
  <p class="description" style="font-size:12px;color:#666;margin-bottom:12px;">
    <?php esc_html_e( 'Fixed Three.js full-viewport canvas with 1-pose-per-section GSAP scroll cycling behind all content.', 'cas-ngs-biotech-blocks' ); ?>
  </p>

  <p>
    <label style="font-size:12px;display:block;margin-bottom:3px;"><?php esc_html_e( 'Scale Multiplier:', 'cas-ngs-biotech-blocks' ); ?></label>
    <input type="number" step="0.1" name="cas_dna_scale" value="<?php echo esc_attr( $scale ); ?>" style="width:100%;" />
  </p>
  <p>
    <label style="font-size:12px;display:block;margin-bottom:3px;"><?php esc_html_e( 'X Offset:', 'cas-ngs-biotech-blocks' ); ?></label>
    <input type="number" step="0.1" name="cas_dna_offset_x" value="<?php echo esc_attr( $offset_x ); ?>" style="width:100%;" />
  </p>
  <p>
    <label style="font-size:12px;display:block;margin-bottom:3px;"><?php esc_html_e( 'Y Offset:', 'cas-ngs-biotech-blocks' ); ?></label>
    <input type="number" step="0.1" name="cas_dna_offset_y" value="<?php echo esc_attr( $offset_y ); ?>" style="width:100%;" />
  </p>
  <p>
    <label style="font-size:12px;display:block;margin-bottom:3px;"><?php esc_html_e( 'Strand Color (Hex):', 'cas-ngs-biotech-blocks' ); ?></label>
    <input type="text" name="cas_dna_strand_color" value="<?php echo esc_attr( $strand_color ); ?>" style="width:100%;" />
  </p>
  <p>
    <label style="font-size:12px;display:block;margin-bottom:3px;"><?php esc_html_e( 'Accent Color (Hex):', 'cas-ngs-biotech-blocks' ); ?></label>
    <input type="text" name="cas_dna_accent_color" value="<?php echo esc_attr( $accent_color ); ?>" style="width:100%;" />
  </p>
  <p>
    <label style="font-size:12px;display:block;margin-bottom:3px;"><?php esc_html_e( 'Ambient Intensity:', 'cas-ngs-biotech-blocks' ); ?></label>
    <input type="number" step="0.1" name="cas_dna_ambient_intensity" value="<?php echo esc_attr( $ambient_int ); ?>" style="width:100%;" />
  </p>
  <?php
}

function cas_bio_save_meta_box( $post_id ) {
  if ( ! isset( $_POST['cas_bio_dna_nonce'] ) || ! wp_verify_nonce( $_POST['cas_bio_dna_nonce'], 'cas_bio_save_dna_meta' ) ) {
    return;
  }
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
    return;
  }
  if ( ! current_user_can( 'edit_post', $post_id ) ) {
    return;
  }

  $val = ! empty( $_POST['cas_enable_dna_background'] ) ? 1 : 0;
  update_post_meta( $post_id, '_cas_enable_dna_background', $val );

  if ( isset( $_POST['cas_dna_scale'] ) ) {
    update_post_meta( $post_id, '_cas_dna_scale', floatval( $_POST['cas_dna_scale'] ) );
  }
  if ( isset( $_POST['cas_dna_offset_x'] ) ) {
    update_post_meta( $post_id, '_cas_dna_offset_x', floatval( $_POST['cas_dna_offset_x'] ) );
  }
  if ( isset( $_POST['cas_dna_offset_y'] ) ) {
    update_post_meta( $post_id, '_cas_dna_offset_y', floatval( $_POST['cas_dna_offset_y'] ) );
  }
  if ( isset( $_POST['cas_dna_strand_color'] ) ) {
    update_post_meta( $post_id, '_cas_dna_strand_color', sanitize_hex_color( $_POST['cas_dna_strand_color'] ) );
  }
  if ( isset( $_POST['cas_dna_accent_color'] ) ) {
    update_post_meta( $post_id, '_cas_dna_accent_color', sanitize_hex_color( $_POST['cas_dna_accent_color'] ) );
  }
  if ( isset( $_POST['cas_dna_ambient_intensity'] ) ) {
    update_post_meta( $post_id, '_cas_dna_ambient_intensity', floatval( $_POST['cas_dna_ambient_intensity'] ) );
  }
}
add_action( 'save_post', 'cas_bio_save_meta_box' );

/**
 * Template Hook: Inject 3D DNA Background if enabled via page metadata
 */
function cas_bio_maybe_render_global_dna_background() {
  if ( ! is_singular() ) {
    return;
  }
  $post_id = get_the_ID();
  if ( ! $post_id ) {
    return;
  }

  $enabled = get_post_meta( $post_id, '_cas_enable_dna_background', true );
  if ( ! $enabled ) {
    return;
  }

  $post = get_post( $post_id );
  if ( $post && ( has_block( 'cas-ngs/dna-background', $post ) || has_shortcode( $post->post_content, 'cas_dna_background' ) || has_shortcode( $post->post_content, 'cas_3d_dna' ) ) ) {
    return; // Already inserted in page content
  }

  $meta_attrs = array(
    'model_url'         => get_post_meta( $post_id, '_cas_dna_model_url', true ),
    'scale'             => get_post_meta( $post_id, '_cas_dna_scale', true ),
    'offset_x'          => get_post_meta( $post_id, '_cas_dna_offset_x', true ),
    'offset_y'          => get_post_meta( $post_id, '_cas_dna_offset_y', true ),
    'strand_color'      => get_post_meta( $post_id, '_cas_dna_strand_color', true ),
    'accent_color'      => get_post_meta( $post_id, '_cas_dna_accent_color', true ),
    'ambient_intensity' => get_post_meta( $post_id, '_cas_dna_ambient_intensity', true ),
  );

  echo cas_bio_render_block_template( 'dna-background', $meta_attrs );
}
add_action( 'wp_footer', 'cas_bio_maybe_render_global_dna_background', 1 );
