<?php
/**
 *
 * @package   Link_Chooser
 * @author    Gabe Shackle <gabe@hereswhatidid.com>
 * @license   GPL-2.0+
 * @link      http://hereswhatidid.com
 * @copyright 2014 Gabe Shackle
 *
 * @wordpress-plugin
Plugin Name:       Link Chooser
Plugin URI:        http://hereswhatidid.com/plugins/link-chooser/
Description:       Use the core Add/edit Link dialog anywhere within the admin via JavaScript or simple field attributes.
Version:           1.0.2
Author:            Gabe Shackle
Author URI:        http://hereswhatidid.com/
Text Domain:       link-chooser-locale
License:           GPL-2.0+
License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
Domain Path:       /languages
GitHub Plugin URI: https://github.com/hereswhatidid/link-chooser/
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

//register_activation_hook( __FILE__, array( 'Link_Chooser', 'activate' ) );
//register_deactivation_hook( __FILE__, array( 'Link_Chooser', 'deactivate' ) );

//add_action( 'plugins_loaded', array( 'Link_Chooser', 'get_instance' ) );

/*----------------------------------------------------------------------------*
 * Dashboard and Administrative Functionality
 *----------------------------------------------------------------------------*/

if ( is_admin() ) {

	require_once( plugin_dir_path( __FILE__ ) . 'admin/class-link-chooser-admin.php' );
	add_action( 'plugins_loaded', array( 'Link_Chooser_Admin', 'get_instance' ) );

}
