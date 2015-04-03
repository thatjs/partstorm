/**
 * Project: Stormclient
 * Copyright 2010,2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1524 $
 * $Id: ptp.js 1524 2011-05-27 14:38:18Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptp.js $
 *
 * JS Objects: files.js
 *
 * stormPopup         : pt.i.stormPopup           ptp.js (declared interface)
 * stormPopup         : pt.stormPopup             ptp.js
 * stormPopupManager  : pt.stormPopupManager      ptp.js
 *
 * ptc                : ptc                       ptc_config.js (customer configuration)
 *
 * Notes:
 */

/* define interface */
pt.i.stormPopup = new pt.Interface('stormPopup',['show','hide','state','update']);

/** stormPopup Class
 * @access public
 * @param [string] sLayout
 * Usage:
 *   var obj = new pt.stormPopup('single');
 * This class contains the popup structure. Extend this class and override the update()
 * method to match the html structure generated in the constructor. Change the pt.stormPopupManager
 * to instantiate the new class or add logic to determine which popup to build.
 *
 * @todo Layout should be separated. Consider an object structure for dynamically building different
 * stormPopups. Data structure with a parser in the constructor. Maybe separate discrete sections into
 * their own objects, storm-tabs, storm-bar, storm-content, storm-topline, storm-content-left,
 * storm-content-right, storm-data. Factory pattern seems the logical choice. More thought needed.
 */
pt.stormPopup = function(sLayout) { // implements pt.i.stormPopup interface
  this.sLayout = sLayout;
  this.nCount = 1;
  this.oItem = {};   // each element to be updated
  this.oLayout = {}; // some wrapper elements need to be stored temporarily
  this.oBound = {lower : null, upper : null};
  this.bStatus = 'closed';

  var sPath = (ptc.graphicsDomain != '') ? ptc.graphicsDomain+ptc.imgRoot : ptc.domain+ptc.imgRoot;
  var sGraphicsPath = sPath+ptc.imgGraphics;
  this.sItemPath = sPath+ptc.imgDir+ptc.imgPrefix;

  // check configuration
  this.oTitles = {};
  var sSep = (ptc.bUseDataTitles) ? ptc.lang.titles.separator+' ' : '';
  for (var item in ptc.lang.titles.content) {
    this.oTitles[item] = (ptc.bUseDataTitles) ? ptc.lang.titles.content[item]+sSep : '';
  }

  switch (sLayout) {
    case 'single':
      var ce = pt.createElement; // alias this method
      /** @todo: refactor this object to use a factory pattern to assemble the Stormclient
       *    structure according to the sLayout type. What items are included in the display are not
       *    known at development time, this should be made easy for a developer to enhance
       *    or add to.
       */

      /** @todo: in a future release, we should build a php converter to take an html structure which
       *    is perfected for a browser and output the Javascript build code.
       */

      // this.oItem contains: stormPart, stormPartHref, stormDesc, stormPrice, stormDescLong
      this.oPopup = ce('div',
        {id : 'stormPopup', className : 'storm-popup'},   // 'storm-tabs debug'
        {display : 'none', position : 'absolute', 'z-index' : 1008 },
        pt.$tag('body')[0]
      );

      this.oLayout.topTabs = ce('div',
        {className : 'storm-tabs'},
        null,
        this.oPopup
      );

      this.oLayout.navUL = ce('ul',
        null,
        null,
        this.oLayout.topTabs
      );

      this.oLayout.activetab = ce('li',  // active tab
        {className : 'activetab'},
        null,
        this.oLayout.navUL
      );

      this.oLayout.activetabanchor = ce('a',  // mouseover action in css
        {id : 'stormPartHref', href : '#'},
        null,
        this.oLayout.activetab
      );

      pt.$addEvent(this.oLayout.activetabanchor,'click',pt.stormClient.actions.popup.blur);

      this.oItem.partnumber = ce('span',
        {id : 'stormPart'},
        null,
        this.oLayout.activetabanchor
      );
      pt.createTextNode('',this.oItem.partnumber);  // empty here, update later

      this.oLayout.topBar = ce('div',  // storm-bar
        { className : 'storm-bar clearfix'},
        null,
        this.oPopup
      );

      this.oLayout.topBarLeft = ce('div',
        { id : 'stormBarLeft', className : 'lf' },
        null,
        this.oLayout.topBar
      );

      this.oLayout.prevButton = ce('img',
        { src : sGraphicsPath+'previousArrow.gif'},
        null,
        this.oLayout.topBarLeft
      );

      pt.$addEvent(this.oLayout.prevButton,'click',pt.stormClient.actions.popup.prev);
      pt.$addEvent(this.oLayout.prevButton,'mouseover',pt.statusCursor.link);


      this.oLayout.topBarRight = ce('div',
        { id : 'stormBarRight'},
        null,
        this.oLayout.topBar
      );

      this.oLayout.nextButton = ce('img',
        { src : sGraphicsPath+'nextArrow.gif'},
        null,
        this.oLayout.topBarRight
      );

      pt.$addEvent(this.oLayout.nextButton,'click',pt.stormClient.actions.popup.next);
      pt.$addEvent(this.oLayout.nextButton,'mouseover',pt.statusCursor.link);

      this.oLayout.dragHandle = ce('img',
        { src : sGraphicsPath+'dragHandle.gif'},
        null,
        this.oLayout.topBarRight
      );

      var oDragCallback;
      // var oDragCallback = { end : function(nCount) { alert('drag ended, drag count = '+nCount) }};
      var oDrag = pt.stormAction.dragManager.add('sp1',this.oPopup,this.oLayout.dragHandle,oDragCallback);
      // oDrag.setBound(new pt.math.point(0,0), new pt.math.point(200,200));

      pt.$addEvent(this.oLayout.dragHandle,'mouseover',pt.statusCursor.move);
      if (pt.oBrowser.ie) pt.$addEvent(this.oLayout.dragHandle,'mouseout',pt.statusCursor.arrow);

      this.oLayout.closeButton = ce('img',
        { src : sGraphicsPath+'closeButton.gif', className : 'last'},
        null,
        this.oLayout.topBarRight
      );

      pt.$addEvent(this.oLayout.closeButton,'click',pt.close);
      pt.$addEvent(this.oLayout.closeButton,'mouseover',pt.statusCursor.link);

      this.oLayout.content = ce('div',  // storm-content
        { className : 'storm-content clearfix'},
        null,
        this.oPopup
      );

      this.oLayout.topLine = ce('div',  // storm-topline
        { className : 'storm-topline'},
        null,
        this.oLayout.content
      );

      this.oItem.desc = ce('div',  // desc
        {id : 'stormDesc', className : 'lf'},
        null,
        this.oLayout.topLine
      );
      pt.createTextNode('',this.oItem.desc);

      this.oItem.price = ce('div',  // price
        {id : 'stormPrice'},
        null,
        this.oLayout.topLine
      );
      pt.createTextNode('',this.oItem.price);

      /* main content */
      this.oLayout.main = ce('div',
        {className : 'storm-main clearfix'},
        null,
        this.oLayout.content
      );

      this.oLayout.mainLeft = ce('div',
        { id : 'stormMainLeft', className : 'lf' },
        null,
        this.oLayout.main
      );

      this.oItem.image = ce('img',
        { className : 'storm-img' },
        null,
        this.oLayout.mainLeft
      );

      this.oLayout.mainRight = ce('div',
        { id : 'stormMainRight' },
        null,
        this.oLayout.main
      );

      this.oLayout.data = ce('div',
        { className : 'storm-data' },
        null,
        this.oLayout.mainRight
      );

      this.oLayout.dataUL = ce('ul',  // ul wrapper
        null,
        null,
        this.oLayout.data
      );

      // the data items are defined in ptc.data
      var li,oElem,oAttr,oStyle;
      for (var item in ptc.data) {
        li = ce('li',
          null,
          null,
          this.oLayout.dataUL
        );

        if (this.oTitles && this.oTitles[item] && this.oTitles[item] != '') {
          var oTitle = ce('span',{ className : 'storm-title'},null,li);
          pt.createTextNode(this.oTitles[item],oTitle);
        }

        oElem = ptc.data[item];
        oAttr = (oElem.oAttr) ? oElem.oAttr : null;
        oStyle = (oElem.oStyle) ? oElem.oStyle : null;

        if (oElem.oItem) {
          switch (oElem.oItem.sType) {
            case 'a':
              // check for aButtons
              if (oElem.aButtons) {
                var i=0,nLen = oElem.aButtons.length;
                for (i;i<nLen;i++) {
                  var oButton = oElem.aButtons[i];
                  var oAnchorAttr = (oButton.oItem.sAction)
                    ? { href : oButton.oItem.href, id : oButton.oItem.id }
                    : { href : pt.stormClient.checkURL(oButton.oItem.href) };
                  var oAnchor = ce(oButton.oItem.sType,oAnchorAttr,null,li);
                  oButton.oAttr.src = pt.stormClient.checkURL(sGraphicsPath+oButton.oAttr.src);
                  if (i>0) oButton.oAttr.className += ' button-space';
                  oButton.oStyle = (oButton.oStyle) ? oButton.oStyle : null;
                  var oImg = ce(oButton.sTag,oButton.oAttr,oButton.oStyle,oAnchor);
                  if (ptc.demo == true) pt.$addEvent(oAnchor,'click',pt.stormClient.actions.demo.alertHref);
                }
              }
              else { // single button inside li

                var oAnchorAttr = { href : pt.stormClient.checkURL(oElem.oItem.href) };
                var oAnchor = ce(oElem.oItem.sType,oAnchorAttr,null,li);
                oAttr.src = pt.stormClient.checkURL(sGraphicsPath+oAttr.src);
                var oImg = ce(oElem.sTag,oAttr,oStyle,oAnchor);
                if (oElem.oItem.sAction) pt.$addEvent(oAnchor,oElem.oItem.sEvent,eval(oElem.oItem.sAction));
              }


              break;
            case 'select':
              var oSelect = ce(oElem.sTag,
                oAttr,
                oStyle,
                li);
              var i=0,oOption,sSel,nSel = oElem.oItem.nSelected,nLen = oElem.oItem.aValues.length;
              for (i;i<nLen;i++) {
                oAttr = (nSel == i) ? { selected : 'selected' } : null;
                oOption = ce('option',
                  oAttr,
                  null,
                  oSelect);
                pt.createTextNode(oElem.oItem.aValues[i],oOption);
              }
              if (oElem.oItem.sAction) pt.$addEvent(oSelect,oElem.oItem.sEvent,eval(oElem.oItem.sAction));
              break;
            case 'text':
            default:
              this.oItem[item] = ce(oElem.sTag,
                oAttr,
                oStyle,
                li);
              pt.createTextNode(oElem.oItem.sValue,this.oItem[item]);
              break;
          }
        }
      }

      break;
    default:
      var sMsg = 'Shared layout type, declared as ' + sLayout + ' is not supported.';
      pt.stormMessage.add({ object : 'pt.stormPopup', type : 'error', severity : 'medium', args : arguments,
        msg : sMsg});
      throw new Error('pt.stormPopup: ' + sMsg);
      break;
  }

  if (ptc.bUseKeyEvents) pt.$addEvent(document,'keydown',pt.stormClient.actions.popup.keyDown);

};

pt.stormPopup.prototype = {
  show : function(oItem) {
    if (this.state() != 'open') {
      this.oPopup.style.position = 'absolute';
      this.oPopup.style.left = oItem.oCoords.x + 'px';
      this.oPopup.style.top = (oItem.oCoords.x + 20) + 'px';
      this.oPopup.style.display = 'block';
      this.bStatus = 'open';
    }
    this.update(oItem.sItem);
    this.nCount++;
  },
  hide : function() {
    if (this.state() == 'open') {
      this.oPopup.style.display = 'none';
    }
    this.bStatus = 'closed';
  },
  state : function() {
    return this.bStatus;
  },
  update : function(sItem) {
    var i=0,aData = pt.stormData.client, nLen = aData.length;
    for (i;i<nLen;i++) {
      if (sItem == aData[i].stormpart) { // item found in list, update popup

        // @todo: replace with loop structure
        pt.setNodeText(this.oItem.partnumber, this.oTitles.partnumber+sItem);
        pt.setNodeText(this.oItem.desc, this.oTitles.desc+aData[i].stormdesc);
        pt.setNodeText(this.oItem.desclong, aData[i].stormdesclong);
        pt.setNodeText(this.oItem.price, this.oTitles.price+aData[i].stormprice);

        // update image src
        this.oItem.image.src = this.sItemPath+sItem+ptc.imgSuffix+ptc.imgExt;

        // update the addToBasket href
        pt.stormClient.actions.basket.updateButtonAnchor(sItem);

        // update the client position, if outside the viewable area of the window
        pt.stormClient.actions.popup.checkPosition(this.oPopup);
        break;
      }
    }

    // set the last data row item id
    pt.stormClient.nLastItem = i;
    return false;
  }
};

/** stormPopupManager Class
 * @access protected
 * @param [string] sType
 * @return [object]
 * @desc The manager class handles the creation of the stormPopup and stores it
 * for reuse.
 * Usage:
 *   var obj = pt.stormPopupManager.display(sType);
 */
pt.stormPopupManager = (function() { // stormPopupManager singleton
  var aInstances = {};
  return {
    display : function(sType) {
      if (aInstances[sType]) {
        return aInstances[sType];
      }
      else {
        var oLayout = new pt.stormPopup(sType);
        pt.Interface.ensureImplements(oLayout,pt.i.stormPopup);  // ensure oLayout implements interface methods
        aInstances[sType] = oLayout;
        return oLayout;
      }
    }
  }
})();
