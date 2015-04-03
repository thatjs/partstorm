/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1525 $
 * $Id: ptc_actions.js 1525 2011-05-27 14:41:44Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_actions.js $
 *
 * JS Objects: files.js
 *
 * stormClient           : pt.stormClient               ptc.js or ptc_auto.js (object literal)
 *
 *                       : ptc                          ptc_config.js (customer configuration)
 *                       : pt.stormClient.init          ptc_init.js (onLoad event handler)
 *                       : pt.stormClient.{var}         ptc_vars.js (core configuration)
 *                       : pt.stormClient.actions       ptc_actions.js (register events)
 *
 * Notes:
 * 1. pt.stormClient.actions object, contains action method calls from event handlers.
 * 2. Implementation methods are really bridge functions.
 */

/* define the namespace */
if (!pt.stormClient) pt.stormClient = {};
pt.stormClient.actions = {};

/* event handler methods, bridge pattern */
pt.stormClient.actions.popup = {
  /** open : function(oEvent)
   * @access public
   * @param oEvent [object]
   * @return [void]
   * @desc Opens the stormPopup and displays the data which corresponds to the value stored
   * in the element that triggered the event. If the stormPopup is already open, we just
   * update the data. Assumes that the event is triggered from a part number.
   * @link pt.open()
   */
  open : function(oEvent) {
    oEvent = pt.stormEvent.getEvent(oEvent);
    var oTarget = pt.stormEvent.getTarget(oEvent);
    oTarget.blur();
    var oItem = { oCoords : pt.stormEvent.getEventCoords(oEvent,'object'),
                  sItem : pt.getNodeText(oTarget)};
    pt.stormPopupManager.display(pt.stormClient.sPopupType).show(oItem);
  },
  /** close : function(oEvent)
   * @access public
   * @param oEvent [object]
   * @return [void]
   * @desc Close the stormPopup.
   * @link pt.close()
   */
  close : function(oEvent) {
    oEvent = pt.stormEvent.getEvent(oEvent);
    pt.stormEvent.getTarget(oEvent).blur();
    pt.stormPopupManager.display(pt.stormClient.sPopupType).hide();
  },
  /** next : function()
   * @access public
   * @return [false]
   * @desc Load the next item in the item list.
   */
  next : function() {
    return pt.stormClient.actions.popup.adjacent(1);
  },
  /** prev : function()
   * @access publioc
   * @return [false]
   * @desc Load the previous item in the item list.
   */
  prev : function() {
    return pt.stormClient.actions.popup.adjacent(-1);
  },
  /** adjacent : function(nIncr)
   * @access protected
   * @param nIncr [number]
   * @return [false]
   * @desc Load the next/previous item in the item list, if we are at the end of items skip to the first
   * or last item in the list.
   */
  adjacent : function(nIncr) {
    var nItem = pt.stormClient.nLastItem, nLastItem = pt.stormData.client.length-1,oItem;
    if (pt.stormClient.nLastItem == 0 && nIncr == -1) {
      oItem = pt.stormData.client[nLastItem];
    }
    else if (pt.stormClient.nLastItem == nLastItem && nIncr == 1) {
      oItem = pt.stormData.client[0];
    }
    else {
      oItem = pt.stormData.client[nItem+nIncr];
    }
    pt.stormPopupManager.display(pt.stormClient.sPopupType).update(oItem.stormpart);
    return false;
  },
  /** keyDown : function(oEvent)
   * @access public
   * @param oEvent [object]
   * @return [false]
   * @desc Bridge for keyboard triggered events. Can be turned on/off in ptc_config.
   */
  keyDown : function(oEvent) {
    oEvent = pt.stormEvent.getEvent(oEvent);
    switch (oEvent.keyCode) {
      case 37: // left arrow
        return pt.stormClient.actions.popup.adjacent(-1);
      case 39: // right arrow
        return pt.stormClient.actions.popup.adjacent(1);
      case 27: // esc
        pt.stormPopupManager.display(pt.stormClient.sPopupType).hide();
        return false;
    }
  },
  /** blur : function(oEvent)
   * @access protected
   * @param oEvent [object]
   * @return [false]
   * @desc Convenience method to avoid leaving focus on image elements.
   */
  blur : function(oEvent) {
    oEvent = pt.stormEvent.getEvent(oEvent);
    pt.stormEvent.getTarget(oEvent).blur();
    return false;
  },
  /** checkPosition : function(oClient)
   * @access public
   * @param oClient [object] instance
   * @return [object]
   * @desc Check the positioning of Stormclient. If the user scrolls the page or moves the
   * client offscreen, reposition it within the viewable area of the browser window.
   */
  checkPosition : function(oClient) {
    if (ptc.bCheckPosition == false) return;  // could be a problem on mobiles
    var nMargin = 20,oViewport = pt.getViewport();  // width,height,scrollLeft,scrollTop
    if ((parseInt(oClient.style.top) < oViewport.scrollTop)) {
      oClient.style.top = (oViewport.scrollTop + nMargin) + 'px';
    }
    else {
      if ((parseInt(oClient.style.top) + oClient.offsetHeight) > (oViewport.height+oViewport.scrollTop)) {
        if (oViewport.scrollLeft > 0) nMargin += 20;
        oClient.style.top = ((oViewport.height+oViewport.scrollTop) - oClient.offsetHeight - nMargin) + 'px';
      }
    }
    if ((parseInt(oClient.style.left) < oViewport.scrollLeft)) {
      nMargin = 20;
      oClient.style.left = (oViewport.scrollLeft + nMargin) + 'px';
    }
    else {
      if ((parseInt(oClient.style.left) + oClient.offsetWidth) > (oViewport.width+oViewport.scrollLeft)) {
        nMargin = 20;
        if (oViewport.scrollTop > 0) nMargin += 20; // right side scroll bar
        oClient.style.left = ((oViewport.width+oViewport.scrollLeft) - oClient.offsetWidth - nMargin) + 'px';
      }
    }
    return oClient;
  }
};

pt.stormClient.actions.basket = {
  /** initBasket : function()
   * @access protected
   * @return [false]
   * @desc Setup the pt.stormClient.oBasket object.
   */
  init : function() {
    var sTitle = ptc.lang.titles.content.partnumber+ptc.lang.titles.separator+' ';
    pt.stormClient.oBasket = { 'sTitle' : sTitle, oAnchor : pt.$id('stormBasketHref') };
  },
  /** update : function(oEvent)
   * @access public
   * @param oEvent [object]
   * @return [void]
   * @desc Bridge function. Default sAction attached to the quantity select box.
   */
  update : function(oEvent) {
    return pt.stormClient.actions.basket.updateButtonAnchor();
  },
  /** updateButtonAnchor : function(sItem)
   * @access public
   * @param sItem [string]
   * @return [void]
   * @desc Reset the href set in configuration, inject the item number and quantity.
   */
  updateButtonAnchor : function(sItem) {
    var sTitle,sPart = (sItem) ? sItem : pt.getNodeText(pt.$id('stormPart'));  // Part No: 0125331... or 0125331
    if (!pt.stormClient.oBasket) pt.stormClient.actions.basket.init();

    if (ptc.bUseDataTitles) {
      sTitle = pt.stormClient.oBasket.sTitle;
      if (sPart.indexOf(sTitle) != -1) {  // title is included
        sPart = sPart.substring(sTitle.length);
      }
    }

    var sQty,oQty = pt.$id('stormQty');  // need to test for select, value has to be cleaned.
    if (oQty.tagName.toLowerCase() == 'select') {
      sQty = parseInt(oQty.options[oQty.selectedIndex].value) || 1;
      oQty.blur();
    }
    pt.stormClient.oBasket.oAnchor.href = ptc.sBasketRoot+sPart+ptc.sBasketSuffix+sQty;
  }
};

pt.stormClient.actions.demo = {
  /** alertHref : function(oEvent)
   * @access public
   * @param oEvent [object]
   * @return [false]
   * @desc When testing Stormclient, it can be useful to override the click events for the buttons
   * like addToBasket and checkout.
   */
  alertHref : function(oEvent) {
    oEvent = pt.stormEvent.getEvent(oEvent);
    var oButton = pt.stormEvent.getTarget(oEvent);
    var oAnchor = oButton.parentNode;  // a <- img
    var sHref = oAnchor.href;
    if (sHref.indexOf('#') == -1) {  // original link
      if (!pt.stormClient.aButton) pt.stormClient.aButton = [];
      pt.stormClient.aButton[oButton.id] = sHref;
      oAnchor.href = "#";
    }
    else {
      sHref = pt.stormClient.aButton[oButton.id];
    }
    var sEngine = (ptc.sEngine) ? ptc.sEngine : 'not specified',
        sMsg = (ptc.sBasketType && ptc.sBasketType.toLowerCase() == 'get') ? 'The hyperlink for this button contains:' : 'The action for this button contains:';

    alert('Stormclient demo mode.\neCommerce engine: '+sEngine+'\n'+sMsg+'\n\n'+sHref);
    oAnchor.blur();

    return false;
  }

};