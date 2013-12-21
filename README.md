## Link Chooser ##

**Link Chooser** enables the ability to use the core Add/edit Link dialog anywhere in your admin screens.

It can be attached to any kind of input field by giving the field the 'wpLinkPopup' class and setting
the "data-linkvalue" attribute to any of the following values: "href", "title", or "target".

### Example Usage ###

**Field Class:**

    <input type="text" class="wpPopupLink" data-linkvalue="href">

**Direct JavaScript Call**

    wpLinkPopup.open( function( link ) {
        console.log( 'Link URL: ', link.href );
        console.log( 'Link Target: ', link.target );
        console.log( 'Link Title: ', link.title );
    });