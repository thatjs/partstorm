/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1538 $
 * $Id: ptc_config_dev.js 1538 2011-05-31 07:02:33Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_config_dev.js $
 *
 * Notes:
 * 1. This file contains the configuration for the partstorm website. This differs from the ptc
 *    configuration file included with Stormclient in terms of the default directories.
 */
/* Partstorm Customer Configuration Namespace: ptc */
var ptc = {

  // website paths
  domain : 'http://localhost',   // development domain
  graphicsDomain : '',                       // alternate domain for graphics
  imgRoot : 'images/products/sc/',           // development images root directory
  imgGraphics : '1.0.0/',                    // development subdomain for version

  // global options, can be overridden on a per page basis
  imgDir : 'demo/g231h/',
  imgPrefix : '',
  imgSuffix : '',
  imgExt    : '.jpg',

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
