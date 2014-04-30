<?php
/**
 * Plugin Name.
 *
 * @package   Link_Chooser
 * @author    Gabe Shackle <gabe@hereswhatidid.com>
 * @license   GPL-2.0+
 * @link      http://hereswhatidid.com
 * @copyright 2014 Gabe Shackle
 */

/**
 * Plugin class. This class should ideally be used to work with the
 * administrative side of the WordPress site.
 *
 * If you're interested in introducing public-facing
 * functionality, then refer to `class-link-chooser.php`
 *
 * @package Link_Chooser
 * @author  Gabe Shackle <gabe@hereswhatidid.com>
 */
class Link_Chooser_Admin {

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 *
	 * @var     string
	 */
	const VERSION = '1.0.0';

	/**
	 * Slug of the plugin screen.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_screen_hook_suffix = null;

	/**
	 * Initialize the plugin by loading admin scripts & styles and adding a
	 * settings page and menu.
	 *
	 * @since     1.0.0
	 */
	private function __construct() {
		$this->plugin_slug = 'link-chooser';

		// Load admin style sheet and JavaScript.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

		// Add the options page and menu item.
		add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );

		// Add an action link pointing to the options page.
		$plugin_basename = plugin_basename( plugin_dir_path( __DIR__ ) . $this->plugin_slug . '.php' );
		add_filter( 'plugin_action_links_' . $plugin_basename, array( $this, 'add_action_links' ) );

		add_action( 'admin_footer', array( $this, 'link_popup_template' ) );
		add_filter( 'wp_link_query_args', array( $this, 'filter_link_query_args' ), 10, 2 );
		add_filter( 'wp_link_query', array( $this, 'filter_link_query' ), 10, 2 );

	}

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_styles() {

		if ( SCRIPT_DEBUG ) {
			$style_path = plugins_url( 'assets/css/styles.dev.css', __FILE__ );
		} else {
			$style_path = plugins_url( 'assets/css/styles.min.css', __FILE__ );
		}
		wp_enqueue_style( $this->plugin_slug .'-admin-styles', $style_path, array( 'thickbox', 'editor-buttons', 'wp-jquery-ui-dialog' ), self::VERSION);

	}

	/**
	 * Register and enqueue admin-specific JavaScript.
	 *
	 * @since     1.0.0
	 *
	 * @return    null    Return early if no settings page is registered.
	 */
	public function enqueue_admin_scripts() {

		if ( SCRIPT_DEBUG ) {
			$script_path = plugins_url( 'assets/js/scripts.dev.js', __FILE__ );
		} else {
			$script_path = plugins_url( 'assets/js/scripts.min.js', __FILE__ );
		}
		wp_enqueue_script( $this->plugin_slug . '-admin-script', $script_path, array( 'jquery', 'jquery-ui-dialog' ), self::VERSION );
		$dialogTranslation = array(
			'title' => __( 'Insert/edit link', $this->plugin_slug ),
			'update' => __( 'Update', $this->plugin_slug ),
			'save' => __( 'Add Link', $this->plugin_slug ),
			'noTitle' => __( '(no title)', $this->plugin_slug ),
			'noMatchesFound' => __( 'No matches found.', $this->plugin_slug ),
		);
		wp_localize_script( $this->plugin_slug . '-admin-script', 'wpLinkL10nPopup', $dialogTranslation );

	}

	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */
	public function add_plugin_admin_menu() {

		/*
		 * Add a settings page for this plugin to the Settings menu.
		 */
		$this->plugin_screen_hook_suffix = add_options_page(
			__( 'Link Chooser Example', $this->plugin_slug ),
			__( 'Link Chooser Demo', $this->plugin_slug ),
			'manage_options',
			$this->plugin_slug,
			array( $this, 'display_plugin_admin_page' )
		);

	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */
	public function display_plugin_admin_page() {
		include_once( 'views/admin.php' );
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */
	public function add_action_links( $links ) {

		return array_merge(
			array(
				'settings' => '<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_slug ) . '">' . __( 'Settings', $this->plugin_slug ) . '</a>'
			),
			$links
		);

	}

	/**
	 * Insert the Link Chooser Dialog template in the admin footer
	 *
	 * @since 	1.0.0
	 * @return 	void
	 */	
	public function link_popup_template() {
		?>
		<script id="wpLinkChooserDialog" type="text/x-template">
		<div style="display: none;">
			<form id="wp-link-chooser" tabindex="-1">
				<?php wp_nonce_field( 'internal-linking', '_ajax_linking_nonce', false ); ?>
				<div class="link-selector">
					<div class="link-options">
						<p class="howto"><?php _e( 'Enter the destination URL' ); ?></p>
						<div>
							<label><span><?php _e( 'URL' ); ?></span><input class="url-field" type="text" name="href" /></label>
						</div>
						<div>
							<label><span><?php _e( 'Title' ); ?></span><input class="link-title-field" type="text" name="linktitle" /></label>
						</div>
						<div class="link-target">
							<label><input type="checkbox" class="link-target-checkbox" /> <?php _e( 'Open link in a new window/tab' ); ?></label>
						</div>
					</div>
					<?php $show_internal = '1' == get_user_setting( 'wplink', '0' ); ?>
					<p class="howto toggle-arrow <?php if ( $show_internal ) echo 'toggle-arrow-active'; ?> internal-toggle"><?php _e( 'Or link to existing content' ); ?></p>
					<div class="search-panel"<?php if ( ! $show_internal ) echo ' style="display:none"'; ?>>
						<div class="link-search-wrapper">
							<label>
								<span class="search-label"><?php _e( 'Search' ); ?></span>
								<input type="search" class="link-search-field" autocomplete="off" />
								<span class="spinner"></span>
							</label>
						</div>
						<div class="link-search-wrapper">
							<label>
								<span class="search-label"><?php _e( 'Content Type' ); ?></span>
								<select class="search-content-type">
									<option value="all"><?php _e( 'All', $this->plugin_slug ); ?></option>
									<?php
									$post_types = get_post_types( array(), 'objects' );
									foreach( $post_types as $post_type ) {
										?>
										<option value="<?php echo $post_type->name; ?>"><?php echo $post_type->labels->name; ?></option>
										<?php
									}
									?>
								</select>
								<span class="spinner"></span>
							</label>
						</div>
						<div class="search-results query-results">
							<ul></ul>
							<div class="river-waiting">
								<span class="spinner"></span>
							</div>
						</div>
						<div class="most-recent-results query-results">
							<div class="query-notice"><em><?php _e( 'No search term specified. Showing recent items.' ); ?></em></div>
							<ul></ul>
							<div class="river-waiting">
								<span class="spinner"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="submitbox">
					<div class="wp-link-update">
						<input type="submit" value="<?php esc_attr_e( 'Add Link' ); ?>" class="button-primary wp-link-submit" name="wp-link-submit">
					</div>
					<div class="wp-link-cancel">
						<a class="submitdelete deletion" href="#"><?php _e( 'Cancel' ); ?></a>
					</div>
				</div>
			</form>
		</div>
		</script>
		<?php
	}

	/**
	 * Add support for passing custom post type selectors to the link ajax query
	 * @param  	array  $query 	The unfiltered link ajax query parameters
	 * @return 	array        	The filtered parameters
	 * @since  	1.0.0
	 */
	public function filter_link_query_args( $query = array() ) {
		if ( ! empty( $_POST['contentType'] ) && $_POST['contentType'] !== 'all' ) {
			$query['post_type'] = array( $_POST['contentType'] );
			if ( $_POST['contentType'] === 'attachment' ) {
				$query['post_status'] = 'inherit';
			}
		}
		return $query;
	}
	/**
	 * Customize the returned links in the case of Media being the selected post type
	 * @param  	array  $query 	The unfiltered link ajax query results
	 * @return 	array        	The filtered results
	 * @since  	1.0.0
	 */
	public function filter_link_query( $results = array() ) {
		if ( ! empty( $_POST['contentType'] ) && $_POST['contentType'] !== 'all' ) {
			if ( $_POST['contentType'] === 'attachment' ) {
				foreach( $results as $index => $result ) {
					$results[$index]['permalink'] = wp_get_attachment_url( $result['ID'] );
				}
			}
		}
		return $results;
	}

}
