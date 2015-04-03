/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1540 $
 * $Id: ptc_config.js 1540 2011-05-31 07:08:35Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_config.js $
 *
 * Notes:
 * 1. This file contains the customer's website configuration. Asset paths should be updated
 *    to match your website. Most other default options can be used as is or changed as
 *    needed.
 * 2. Depending on how your images are organized, you will probably override the product directory
 *    on individual pages, the simplest method is to include a small javascript tag either at the end
 *    of the head section or inside the html body tag.
 *      <script type="text/javacript">ptc.imgDir = 'productDir/';</script>
 * 3. Developers: Stormclient will look for the Javascript variable stormdata, if it is defined,
 *    it will read this and update the pt.stormData.client array. Metadata should be contained in the
 *    first row.
 */
/* Partstorm Customer Configuration Namespace: ptc */
var ptc = {

  // website paths
  domain : 'http://www.your-domain.com/',    // enter your webite domain
  graphicsDomain : '',                       // alternate domain for graphics
  imgRoot : 'images/',                       // set to the root directory for graphics
  imgGraphics : 'navbar/',                   // sub-directory for ui and navigation graphics

  // global options, can be overridden on a per page basis
  imgDir : 'demo/g231h/',                    // sub-directory for product images, override on product pages
  imgPrefix : '',                            // set an image prefix if needed
  imgSuffix : '',                            // set an image suffix if needed
  imgExt    : '.jpg',                        // image file type for product photos

  // eCommerce configuration
  sEngine        : 'Miva Merchant',
  sBasketType    : 'get',
  sBasketRoot    : 'Merchant2/merchant.mvc?Screen=BASK&Store_Code=Demo&Action=ADPR&Product_Code=',
  sBasketSuffix  : '&Attributes=Yes&Quantity=',
  sCheckout      : 'Merchant2/merchant.mvc?Screen=OINF&Store_Code=Demo',

  // setup for items displayed in data section of Stormclient
  data : {
    desclong : {
      sTag   : 'span',
      oAttr  : { 'id' : 'stormDescLong'},
      oItem  : { sType : 'text', sValue : '' }
    },

    quantity : {
      sTag   : 'select',
      oAttr  : { 'id' : 'stormQty', 'name' : 'stormQty' },
      oItem  : { sType : 'select', aValues : [1,2,3,4,5,6,7,8,9,10], nSelected : 0, sEvent : 'change', sAction : 'pt.stormClient.actions.basket.update' }
    },

    /* inline buttons */
    buttons : {
      oItem    : { sType : 'a' },
      aButtons : [ { sTag   : 'img',
                     oAttr  : { className : 'button', src : 'addToBasket.gif' },
                     oItem  : { sType : 'a', id : 'stormBasketHref', href : '#', sEvent : 'load', sAction : 'init'}},

                   { sTag   : 'img',
                     oAttr  : { className : 'button', src : 'checkout.gif' },
                     oItem  : { sType : 'a', href : 'Merchant2/merchant.mvc?Screen=OINF&Store_Code=Demo' }}
                 ]

    }

    /** buttons on their own separate lines
    ,
    buttonMoreInfo : {
      sTag   : 'img',
      oAttr  : { className : 'button', src : 'moreinfo.gif'},
      oItem  : { sType : 'a', href : 'moreinfo.html'}
    }

   */

  },

  // stormpopup configuration
  bUseDataTitles    : true,    // adds titles to data displayed
  bUseKeyEvents     : true,    // true allows item navigation using arrow keys
  bCheckPosition    : true,    // true moves the client inside the browser window

  // development and debug settings
  verboseErrors : 0,  // developers: change to 1 to output internal errors to console
  demo : true,        // true: override addToBasket and checkout buttons click behavior  // reset to false

  // system settings, do not change these
  version : '1.0.0',
  lang : {}

};

// update for your locale/language
ptc.lang.titles = {

  separator      : ':',
  currency       : 'USD',
  currencySymbol : '$'             // use '' empty string for no symbol

};

ptc.lang.titles.content = {
  partnumber     : 'Part No',      // use empty '' to not show an individual title
  desc           : 'Item',
  price          : 'Our Price',    // can be Msrp or Price

  // titles for data section
  desclong       : 'Description',
  quantity       : 'Qty'
};
