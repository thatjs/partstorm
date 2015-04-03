/**
 * Project: Stormclient
 * Copyright 2009,2010,2011 Partstorm. All rights reserved.
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1480 $
 * $Id: pta.js 1480 2011-05-10 19:10:18Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/pta.js $
 *
 * JS Objects: files.js
 *
 * i.ajax             : pt.i.ajax               pta.js (declared interface)
 * ajaxHandler        : pt.ajaxHandler          pta.js
 * ajaxQueuedHandler  : pt.ajaxQueuedHandler    pta.js
 * ajaxOfflineHandler : pt.ajaxOfflineHandler   pta.js
 * ajaxManager        : pt.ajaxManager          pta.js (object literal, factory)
 *
 * Dependency Objects
 * statusDisplay        : pt.statusDisplay         pts.js (object literal)
 * statusDisplayManager : pt.statusDisplayManager  pts.js (object literal, factory)
 *
 * Usage:
 *   var oAjax = pt.ajaxManager.createXhrHandler();
 *   var callback = {
 *     success : function(responseText) { alert('Success: ' + responseText); },
 *     failure : function(statusCode) { alert('Failure: ' + statusCode); },
 *     status : { id      : 'ajax-status',
 *                msg     : pt.stormBuilder.panel.titles.sLoadZones,   // or 'Loading ...'
 *                target  : 'ptb-dialog-message' }
 *   };
 *   oAjax.request('GET','script.php', callback);
 *
 */
pt.i.ajax = new pt.Interface('iAjax',['request','createXhrObject']);

/** ajaxHandler Class
 * @access public
 * @link http://www.jsdesignpatterns.com (page 100)
 * Usage:
 *   var obj = new pt.ajaxHandler('GET','script.php', callback);
 */
pt.ajaxHandler = function() {}; // implements pt.iAjax interface
pt.ajaxHandler.prototype = {

  /** function request(sMethod,sUrl,oCallback,aPostVars)
   * @access protected
   * @param sMethod,sUrl,oCallback,aPostVars [string,object,array]
   * @return [object]
   * @desc Perform the steps needed to send off a request and process the response.
   */
  request : function(sMethod,sUrl,oCallback,aPostVars) {
    var oXhr = this.createXhrObject();
    oXhr.onreadystatechange = function() {
      if (oXhr.readyState !== 4) {
        this.showStatus(oCallback.status);
        return;
      }
      (oXhr.status === 200) ?
        oCallback.success(oXhr.responseText,oXhr.responseXML) :
        oCallback.failure(oXhr.status);
        this.hideStatus(oCallback.status.id);
    };
    oXhr.open(sMethod,sUrl,true);
    if (sMethod !== 'POST') aPostVars = null;
    oXhr.send(aPostVars);
  },

  /** function createXhrObject : function() Factory method
   * @access protected
   * @return [object]
   * @desc Using the Factory design pattern, assign the correct ajax object supported
   * by the browser and overwrite this method once found, also called memorizing.
   */
  createXhrObject : function() {
    var aMethods = [
      function () { return new XMLHttpRequest(); },
      function () { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); },
      function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
      function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
    ];
    var nLen = aMethods.length;
    for (var i=0;i<nLen;i++) {
      try {
        aMethods[i]();
      } catch(e) {
          continue;
      }
      // if we reached this point, aMethods[i] worked.
      this.createXhrObject = aMethods[i]; // memorize the method.
      return aMethods[i];
    }
    // if we reach this point, none of the methods worked.
    var sMethod = 'pt.ajaxHandler.createXhrObject',sMsg = 'Could not create an XMLHttpRequest object.';
    pt.stormMessage.add({ object : sMethod, type : 'error', severity : 'high', args : arguments,
      msg : sMsg });
    throw new Error(sMethod + ': ' + sMsg);
  },

  /** function showStatus : function(oStatus) bridge
   * @access protected
   * @param [object] oStatus
   * @return [void]
   * @desc Display the ajax status indicator and update the text message if necessary. Handling
   * is passed to pt.statusDisplay.
   */
  showStatus : function(oStatus) {
    pt.statusDisplay.show(oStatus);
  },

  /** function hideStatus : function(mStatus) bridge
   * @access protected
   * @param [object,string] mStatus
   * @return [void]
   * @desc Turn off the ajax status indicator. Pass either string 'ajax-status' string or
   * { id : 'ajax-status' } object.
   */
  hideStatus : function(mStatus) {
    pt.statusDisplay.hide(mStatus);
  }

};

/** ajaxQueuedHandler Class
 * @access public
 * @link http://www.jsdesignpatterns.com (page 101)
 * Usage:
 *   var obj = new pt.ajaxQueuedHandler('GET','script.php', callback);
 */
pt.ajaxQueuedHandler = function() { // implements pt.ajaxHandler, pt.i.ajax
  this.aQueue = [];
  this.bRequestInProgress = false;
  this.nRetryDelay = 5;  // In seconds.
};

pt.extend(pt.ajaxQueuedHandler,pt.ajaxHandler);

pt.ajaxQueuedHandler.prototype.request = function(sMethod,sUrl,oCallback,aPostVars,bOverride) {
  if (this.bRequestInProgress && !bOverride) {
    this.aQueue.push({
      method : sMethod,
      url : sUrl,
      callback : oCallback,
      postvars : aPostVars
    });
  }
  else {
    this.bRequestInProgress = true;
    var oXhr = this.createXhrObject();
    var that = this;
    oXhr.onreadystatechange = function() {
      if (oXhr.readyState !== 4) return;
      if (oXhr.status === 200) {
        oCallback.success(oXhr.responseText,oXhr.responseXML);
        that.advanceQueue();
      }
      else {
        oCallback.failure(oXhr.status);
        setTimeout(function() { that.request(sMethod,sUrl,oCallback,aPostVars); },
          that.nRetryDelay * 1000);
      }
    };
    oXhr.open(sMethod,sUrl,true);
    if (sMethod !== 'POST') aPostVars = null;
    oXhr.send(aPostVars);
  }
};

pt.ajaxQueuedHandler.prototype.advancedQueue = function() {
  if (this.aQueue.length === 0) {
    this.bRequestInProgress = false;
    return;
  }
  var oReq = this.aQueue.shift();
  this.request(oReq.method,oReq.url,oReq.callback,oReq.postVars,true);
};

/** ajaxOfflineHandler Class
 * @access public
 * @link http://www.jsdesignpatterns.com (page 103)
 * Usage:
 *   var obj = new pt.ajaxOfflineHandler('GET','script.php', callback);
 */
pt.ajaxOfflineHandler = function() { // implements pt.ajaxHandler, pt.i.ajax
  this.aStoredRequests = [];
};

pt.extend(pt.ajaxOfflineHandler,pt.ajaxHandler);

pt.ajaxOfflineHandler.prototype.request = function(sMethod,sUrl,oCallback,aPostVars,bOverride) {
  if (pt.ajaxManager.isOffline()) { // store requests until we are online
    this.aStoredRequests.push({
      method : sMethod,
      url : sUrl,
      callback : oCallback,
      postVars : aPostVars
    });
  }
  else { // call pt.ajaxHandler's request method if we are online
    this.flushStoredRequests();
    pt.ajaxOfflineHandler.superclass.request(sMethod,sUrl,oCallback,aPostVars);
  }
};

pt.ajaxOfflineHandler.prototype.flushStoredRequests = function() {
  var nLen = this.aStoredRequests.length;
  for (var i=0;i<nLen;i++) {
    var oReq = this.aStoredRequests[i];
    pt.ajaxOfflineHandler.superclass.request(oReq.method,oReq.url,oReq.callback,oReq.postVars);
  }
};

/** ajaxManager object literal, singleton
 * @access public
 * @link http://www.jsdesignpatterns.com (page 103)
 * Usage:
 *   var obj = pt.ajaxManager.createXhrHandler();
 *   var callback = {
 *     success : function(responseText) { alert('Success: ' + responseText); },
 *     failure : function(statusCode) { alert('Failure: ' + statusCode); }
 *   };
 *   obj.request('GET','script.php', callback);
 *
 * Need to test and update the usage with stormclient variables.
 */
pt.ajaxManager = { // implements pt.ajaxHandler, pt.i.ajax

  /** function createXhrObject : function() Factory method
   * @access public
   * @return [object]
   * @desc Using the Factory design pattern, assign the correct ajax object
   * based on the user's Internet connection's latency.
   */
  createXhrHandler : function() {
    var oXhr;
    if (this.isOffline()) {
      oXhr = new pt.ajaxOfflineHandler();
    }
    else if (this.isHighLatency()) {
      oXhr = new pt.ajaxQueuedHandler();
    }
    else {
      oXhr = new pt.ajaxHandler();
    }

    pt.Interface.ensureImplements(oXhr,pt.i.ajax);
    return oXhr;
  },

  /** function isOffline : function()
   * @access protected
   * @return [boolean]
   * @desc Run a quick request with ajaxHandler to see if it succeeds.
   * Return true to load pt.ajaxOfflineHandler object.
   */
  isOffline : function() {
    // stubbed out
    return false;
  },

  /** function isHighLatency : function()
   * @access protected
   * @return [boolean]
   * @desc Run a series of requests with ajaxHandler and time the responses. Best
   * done once, as a branching function. Return true to load pt.ajaxQueuedHander
   * object.
   */
  isHighLatency : function() {
    // stubbed out, need to implement pt.timer
    return false;
  }

};