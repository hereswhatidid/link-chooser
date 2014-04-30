=== Link Chooser ===
Contributors: hereswhatidid
Donate link: http://hereswhatidid.com/
Tags: link, javascript
Requires at least: 3.7.1
Tested up to: 3.9.0
Stable tag: 1.0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Use the core Add/edit Link dialog anywhere within the admin via JavaScript or simple field attributes.

== Description ==

With this plugin you are able to use the core Add/edit Link dialog anywhere in your admin screens.

It can be attached to any kind of input field by giving the field the 'wpLinkPopup' class and setting
the "data-linkvalue" attribute to any of the following values: "href", "title", or "target".

== Installation ==

= Using The WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Search for 'Link Chooser'
3. Click 'Install Now'
4. Activate the plugin on the Plugin dashboard

= Uploading in WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Navigate to the 'Upload' area
3. Select `link-chooser.zip` from your computer
4. Click 'Install Now'
5. Activate the plugin in the Plugin dashboard

= Using FTP =

1. Download `link-chooser.zip`
2. Extract the `link-chooser` directory to your computer
3. Upload the `link-chooser` directory to the `/wp-content/plugins/` directory
4. Activate the plugin in the Plugin dashboard


== Frequently Asked Questions ==

= How do I call the Link Chooser dialog manually via JavaScript? =

Here is a very basic example that logs the resulting link parameters to your console:

`wpLinkPopup.open( function( link ) {
				console.log( 'Link URL: ', link.href );
				console.log( 'Link Target: ', link.target );
				console.log( 'Link Title: ', link.title );
			});`

= How do I attach the Link Chooser to a standard input via data attribute? =

`<input type="text" class="wpLinkPopup" data-linkvalue="href">`

== Screenshots ==

1. Example of a dialog attached to a standard text field

== Changelog ==

= 1.0 =
* Initial deployment
