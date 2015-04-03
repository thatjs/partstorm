/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1526 $
 * $Id: ptc.js 1526 2011-05-28 04:21:54Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc.js $
 *
 * JS Objects: files.js
 *
 * stormClient        : pt.stormClient          ptc.js (object literal)
 *
 * stormData          : pt.stormData.client     ptc_data.js
 *                    : pt.stormClient.{var}    ptc_vars.js (configuration)
 *
 * Notes:
 * 1. Defines the method to set event handlers for Stormclient. Included examples of attaching
 *    events.
 * 2. This version does not use the Autodetect feature.
 */

// stormClient object literal
pt.stormClient = {};

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

/** pt.stormClient.setEventHandlers = function()
 * @access public
 * @return [void]
 * @desc The simplest method to setup a webpage for Stormclient is to add the attribute id="stormLink"
 * to the element that you want to open Stormclient. This function can just as easily be overriden
 * by copying this method to the last Javascript output on your webpage.
 */
pt.stormClient.setEventHandlers = function() {
  var oTag = pt.$id('stormLink');
  if (!oTag) {
    pt.stormMessage.add({ "oTag" : oTag, type : 'error', severity : 'high', args : arguments,
        msg : 'pt.stormClient.setEventHandlers() - attribute id="stormLink" was not found in html page.' });
    return false;
  }
  pt.$addEvent(oTag,'click',pt.open);
  pt.stormClient.setStormData();
};

/** pt.stormClient.setStormData = function()
 * @access public
 * @return [boolean]
 * @desc Stormclient expects to have the variable stormdata set somewhere on the page which contains the
 * data that will be displayed. This is a regular array, where the first row contains the metadata that
 * hooks into Stormclient's update() method.
 * Usage:
 * var stormdata = [
 *   ['stormpart','stormdesc','stormprice','stormdesclong'],
 *   ['0125230530','Case Bolt M5x30mm SHCS (1)','0.99','Crankcase bolt M5x30mm SHCS, four are use to secure the front crankcase to the rear.']
 * ];
 */
pt.stormClient.setStormData = function() {
  if (!pt.stormData) pt.stormData = {};
  if (!pt.stormData.client) pt.stormData.client = [];
  if (stormdata && stormdata.length >= 1) {  // look for Javascript data
    if (!stormdata) {
      pt.stormMessage.add({ "stormdata" : stormdata, type : 'error', severity : 'high', args : arguments,
        msg : 'pt.stormClient.setStormData() - inline or linked stormdata array is not defined, but expected.' });
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
};

/** pt.stormClient.formatPrice = function(sPrice)
 * @access public
 * @return [string]
 * @desc Helper method to prepend currency symbol when displaying the price.
 */
pt.stormClient.formatPrice = function(sPrice) {
  return (sPrice.indexOf(ptc.lang.titles.currencySymbol) == -1) ? ptc.lang.titles.currencySymbol+sPrice : sPrice;
};