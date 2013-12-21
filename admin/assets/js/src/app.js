/* global wpLinkPopup */
( function( $ ) {
	'user strict';

	$(document).ready( function() {
		wpLinkPopup.init();
		$( '.select-image' ).on( 'click.link-chooser', function( e ) {
			e.preventDefault();

			wpLinkPopup.open( function( link ) {
				$( '#linkurl' ).val( link.href );
				$( '#linktarget' ).val( link.target );
				$( '#linktitle' ).val( link.title );
			});
		});

		$( '.wpLinkPopup' ).each( function() {
			var value = $( this ).data( 'linkvalue' );

			$( this ).on( 'click', function( ) {
				var field = $( this );
				wpLinkPopup.open( function( link ) {
					field.val( link[value] );
				});
			});
		});
	});
})( jQuery );