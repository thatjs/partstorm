/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1522 $
 * $Id: ptc_auto.js 1522 2011-05-27 14:34:03Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_auto.js $
 *
 * JS Objects: files.js
 *
 * stormClient        : pt.stormClient              ptc.js (object literal)
 *
 *                    : ptc                         ptc_config.js (customer configuration)
 * stormData          : pt.stormData.client         ptc_data.js
 *                    : pt.stormClient.{var}        ptc_vars.js (core configuration)
 *                    : pt.stormClient.autodetect   ptc_auto.js (object literal)
 *
 * Notes:
 * 1. When using the Autodetect feature, use this file ptc_auto.js and remove ptc.js, if
 *    Autodetect is not needed, ptc.js is used instead, but not both.
 */
// stormClient object literal
if (!pt.stormClient) pt.stormClient = {};

// stormClient.autodetect object literal
pt.stormClient.autodetect = {

  /** metadata : function(sId)
   * @access public
   * @param sId [string]
   * @return [object] oConfig
   * @desc Autodetect the child node key integers when parsing a fixed html structure like a table
   * or collection of div tags.
   */
  metadata : function(sId) {
    var i=0,oConfig,oConfigMeta,sTag,oTagCmd,oTag = pt.$id(sId);
    if (!oTag) {
      pt.stormMessage.add({ "oTag" : oTag, type : 'error', severity : 'high', args : arguments,
        msg : 'pt.stormClient.autodetect.metadata() - attribute id="'+sId+'" was not found in html page.' });
      return false;
    }
    else {
      sTag = oTag.tagName.toLowerCase();
      oTagCmd = pt.stormClient.autodetect.getTagCommands(sTag);

      oConfig = { nStartRow : null,  // set when the first storm* attribute is found in aTag
                  'sTag' : sTag,     // format: stormpart => 0, stormdesc => 1, holds the aTag corresponding keys
                  'oTag' : oTag,     // store tagName and tag object for further processing
                  'oTagCmd' : oTagCmd };

      var nLen = eval(oTagCmd.nLen),pStorm = pt.stormClient.pStorm;  // see autodetect.getTagCommands()
      for (i;i<nLen;i++) {
        if (oConfig.nStartRow != null && i > oConfig.nStartRow) {  // test exit condition
          oConfig.nStartRow = 'found';
          break; // break i loop
        }

        var j=0,nCmdLen = eval(oTagCmd.sCmdLen);
        var sClass = (pt.oBrowser.ie) ? 'className' : 'class'; // IE issue
        var oGet = {}; oGet[pt.stormClient.sPtId] = null; oGet[sClass] = null;
        for (j;j<nCmdLen;j++) {
          var oAttr = pt.getAttribute(eval(oTagCmd.sCmd),oGet);
          if (oAttr[pt.stormClient.sPtId] != null) {
            oConfig[oAttr[pt.stormClient.sPtId]] = j;  // html5 stormpart => 0
          }
          else {
            if (oAttr[sClass] != null) {
              var aMatch = oAttr[sClass].match(pStorm);
              if (aMatch) {
                oConfig[aMatch[0]] = j;  // html4/5 stormpart => 0
              }
            }
          }
          if (oConfig.nStartRow == null) {
            for (var item in oConfig) {
              if (pStorm.test(item)) oConfig.nStartRow = i;  // test for storm* items, set exit condition
            }
          }
        }
      }
      return oConfig;
    }

  },

  /** getTagCommands : function(sTag)
   * @access protected
   * @param sTag [string]
   * @return [object]
   * @desc Each html structure uses predefined objects in the DOM, this is a helper method to
   * return an object containing the correct DOM access methods for for a particular html element.
   */
  getTagCommands : function(sTag) {
    var oTag = {};
    switch (sTag) {
      case 'table':
        oTag.nLen = 'oTag.rows.length';
        oTag.sCmdLen = 'oTag.rows[i].childNodes.length';
        oTag.sCmd = 'oTag.rows[i].childNodes[j]';
        break;
      case 'div':
        oTag.nLen = 'var aTag=pt.$tag("div",oTag);aTag.length';
        oTag.sCmdLen = 'var aSpan = pt.$tag("span",aTag[i]);aSpan.length';
        oTag.sCmd = 'aSpan[j]';
        break;
    }
    return oTag;
  },

  /** setEventHandlers : function(oConfig)
   * @access protected
   * @param oConfig [object]
   * @return [void]
   * @desc Set the event handlers corresponding to the autodetect feature.
   */
  setEventHandlers : function(oConfig) {
    var i = (pt.stormClient.bSkipTitleRow == true) ? 1 : 0;
    var item, sTag = oConfig.sTag, oTag = oConfig.oTag;

    var nLen = eval(oConfig.oTagCmd.nLen);

    for (i;i<nLen;i++) {

      var oItem = {};

      switch (sTag) {
        case 'table':
          pt.$addEvent(oTag.rows[i].childNodes[oConfig.stormpart],'click',pt.open);
          // pt.$addEvent(oTag.rows[i].childNodes[oConfig.stormpart],'mouseover',pt.open);
          pt.$addEvent(oTag.rows[i].childNodes[oConfig.stormpart],'mouseover',pt.statusCursor.link);

          for (item in oConfig) {
            if (item == 'nStartRow' || item == 'sTag' || item == 'oTag' || item == 'oTagCmd') continue;
            if (item == 'stormlink') { // special cases
              // extract hyperlink from anchor tag, not portable, structure dependent
              oItem[item] = pt.$tag('a',oTag.rows[i].childNodes[oConfig[item]])[0].href;
            }
            else if (item == 'stormprice') {  // autodetect table
              oItem[item] = pt.stormClient.formatPrice(pt.getNodeText(oTag.rows[i].childNodes[oConfig[item]]).replace(pt.stormClient.pSpace,'')); // $0.99_ trailing space
            }
            else {
              oItem[item] = pt.getNodeText(oTag.rows[i].childNodes[oConfig[item]]); // stormpart = 01244...
            }
          }
          pt.stormData.client.push(oItem);
          break;
      }
    }
  },

  /** updateStormData : function(oConfig)
   * @access protected
   * @param oConfig [object]
   * @return [void]
   * @desc Append extra data to the pt.stormData.client array of objects. Each object contains the
   * stormpart member variable to match against.
   */
  updateStormData : function(oConfig) {
    if (!pt.stormData.client || pt.stormData.client.length == 0) {
      pt.stormMessage.add({ "oConfig" : oConfig, type : 'error', severity : 'high', args : arguments,
        msg : 'pt.stormClient.autodetect.updateStormData(oConfig) - pt.stormData.client array is not defined or empty, check for other errors.' });
      return false;
    }
    else if (!oConfig) {
      if (!stormdata) {
        pt.stormMessage.add({ "stormdata" : stormdata, type : 'error', severity : 'high', args : arguments,
          msg : 'pt.stormClient.autodetect.updateStormData() - inline or linked stormdata array is not defined, but expected.' });
        return false;
      }
      else {  // extra data contained in linked/inline Javascript
        var i,j,k,oConfig = {},aMetaData = stormdata.shift(),nLenMeta = aMetaData.length,nLenData = stormdata.length,i=j=k=0;
        for (i;i<nLenMeta;i++) { // retrieve metadata
          oConfig[aMetaData[i]] = i;
        }
        var aRow,nLenRow,sItem,sMatch,item,i=0;
        for (i;i<nLenData;i++) { // iterate stormdata
          aRow = stormdata[i];
          nLenRow = aRow.length,sMatch = '',j=0;
          for (j;j<nLenRow;j++) {
            sItem = aRow[j];
            if (sMatch == 'found') {
              for (item in oConfig) {
                if (item == 'stormpart') continue;
                if (item == 'stormprice') {
                  pt.stormData.client[k][item] = pt.stormClient.formatPrice(aRow[oConfig[item]]);
                }
                else {
                  pt.stormData.client[k][item] = aRow[oConfig[item]]; // add all defined items
                }
              }
            }
            else {
              if (pt.stormData.client[k].stormpart == sItem) {
                var sMatch = 'found';
              }
            }
          }
          if (sMatch == 'found') k++;
        }
      }
    }
    else { // extra data contained in page html contemt
      var oTag = oConfig.oTag;
      var i,j,k,oDiv,oSpan,item,sItem,i=j=k=0;

      if (oTag.children) {
        var nLenExtra = oTag.children.length;
        for (i;i<nLenExtra;i++) {
          oDiv = oTag.children[i];  // oTag = div wrapper, oDiv = array of div tags
          var nLenDiv = oDiv.children.length;

          var sMatch = '',j=0;
          for (j;j<nLenDiv;j++) {
            oSpan = oDiv.children[j];
            sItem = pt.getNodeText(oSpan);
            if (sItem == '') break;  // break span looping, this row only contains metadata attributes

            if (sMatch == 'found') {
              for (item in oConfig) {
                if (item == 'nStartRow' || item == 'sTag' || item == 'oTag' || item == 'oTagCmd' || item == 'stormpart') continue;
                if (item == 'stormprice') {
                  pt.stormData.client[k][item] = pt.stormClient.formatPrice(pt.getNodeText(oDiv.children[oConfig[item]]));
                }
                else {
                  pt.stormData.client[k][item] = pt.getNodeText(oDiv.children[oConfig[item]]);  // add all other defined items
                }
              }
            }
            else {
              if (pt.stormData.client[k].stormpart == sItem) {
                var sMatch = 'found';
              }
            }
          }
          if (sMatch == 'found') k++;
        }
      }
    }

  }

};

/** pt.stormClient.checkURL = function(sPath)
 * @access public
 * @return [string]
 * @desc Helper method to prepend the domain name onto an asset path.
 */
pt.stormClient.checkURL = function(sPath) {
  if (sPath.indexOf(ptc.domain) == -1) {
    if (sPath.substring(0,1) == '/') {
      sPath = sPath.substring(1);
    }
    sPath = ptc.domain+sPath;
  }
  return sPath;
};

/** pt.stormClient.formatPrice = function(sPrice)
 * @access public
 * @return [string]
 * @desc Helper method to prepend currency symbol when displaying the price.
 */
pt.stormClient.formatPrice = function(sPrice) {
  return (sPrice.indexOf(ptc.lang.titles.currencySymbol) == -1) ? ptc.lang.titles.currencySymbol+sPrice : sPrice;
};

/** pt.stormClient.setEventHandlers = function()
 * @access public
 * @return [void]
 * @desc Set event handlers using autodetect based on page structure. Load any extra data if defined.
 */
pt.stormClient.setEventHandlers = function() {

  var oConfig = pt.stormClient.autodetect.metadata('ptenable');  // object or false

  if (oConfig && oConfig.nStartRow == 'found') {
    pt.stormClient.autodetect.setEventHandlers(oConfig);
  }
  else {
    pt.stormMessage.add({ "oConfig" : oConfig, type : 'error', severity : 'high', args : arguments,
      msg : 'pt.stormClient.setEventHandlers() - storm attributes not set in html structure, unable set event handlers.' });
    return false;
  }

  if (stormdata && stormdata.length >= 1) {  // look for extra data Javascript
    pt.stormClient.autodetect.updateStormData();
  }
  else { // look for extra data html
    oConfig = pt.stormClient.autodetect.metadata('stormdata');
    pt.stormClient.autodetect.updateStormData(oConfig);
  }

};
