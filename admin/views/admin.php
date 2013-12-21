<?php
/**
 * @package   Link_Chooser
 * @author    Gabe Shackle <gabe@hereswhatidid.com>
 * @license   GPL-2.0+
 * @link      http://hereswhatidid.com
 * @copyright 2014 Gabe Shackle
 */
?>

<div class="wrap">

	<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
	<form action="#">
		<h3><?php _e( 'Sample Usage via JavaScript:', $this->plugin_slug ); ?></h3>
		<pre>
			wpLinkPopup.open( function( link ) {
				console.log( '<?php _e( 'Link URL: ', $this->plugin_slug ); ?>', link.href );
				console.log( '<?php _e( 'Link Target: ', $this->plugin_slug ); ?>', link.target );
				console.log( '<?php _e( 'Link Title: ', $this->plugin_slug ); ?>', link.title );
			});
		</pre>
		<table class="form-table">
			<tbody>
				<tr>
					<th><label for="linkurl"><?php _e( 'Link URL: ', $this->plugin_slug ); ?></label></th>
					<td><input type="text" name="linkurl" id="linkurl" class="regular-text"></td>
				</tr>
				<tr>
					<th><label for="linktarget"><?php _e( 'Link Target: ', $this->plugin_slug ); ?></label></th>
					<td><input type="text" name="linktarget" id="linktarget" class="regular-text"></td>
				</tr>
				<tr>
					<th><label for="linktitle"><?php _e( 'Link Title: ', $this->plugin_slug ); ?></label></th>
					<td><input type="text" name="linktitle" id="linktitle" class="regular-text"></td>
				</tr>
				<tr>
					<th colspan="2"><button class="button button-primary select-image"><?php _e( 'Select Link', $this->plugin_slug ); ?></button></th>
				</tr>
				<tr>
					<th><label for="testfield"><?php _e( 'Sample Field: ', $this->plugin_slug ); ?></label></th>
					<td><input type="text" placeholder="<?php _e( 'Link HREF', $this->plugin_slug ); ?>" name="testfield" id="testfield" class="wpLinkPopup regular-text" data-linkvalue="href"> <span class="description"><?php _e( 'Link HREF', $this->plugin_slug ); ?></span><br>
						<input type="text" placeholder="<?php _e( 'Link Title', $this->plugin_slug ); ?>" name="testfield2" id="testfield2" class="wpLinkPopup regular-text" data-linkvalue="title"> <span class="description"><?php _e( 'Link Title', $this->plugin_slug ); ?></span><br>
						<p class="description"><?php _e( 'Fields with the class "wpLinkPopup" will automatically launch the link chooser on click.', $this->plugin_slug ); ?></p>
						<p class="description"><?php _e( 'The returned value is determined by the "data-linkvalue" attribute.  The available options are "href", "title", and "target".', $this->plugin_slug ); ?></p>
					</td>
				</tr>
			</tbody>
		</table>
		<input type="hidden" name="activeEditor" id="activeEditor">
	</form>

</div>
