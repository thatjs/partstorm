/**
 * Project: Stormclient
 * Copyright 2009,2010,2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1520 $
 * $Id: pt.js 1520 2011-05-27 14:28:51Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/pt.js $
 *
 * JS Objects: files.js
 *
 * pt                 : var pt                  pt.js  (namespace)
 * Interface          : pt.i                    pt.js
 * timer              : pt.timer                pt.js
 *
 * Notes:
 * 1. Initially, we thought we could maintain a single core pt.js file to be used in all
 *    Partstorm applications. This version is now optimized for Stormclient.
 * 2. Errors are currently thrown to pt.stormMessage which allows developers to
 *    query for them. An override exists in pt.overrides object in ptc_vars.js,
 *    which when set to 1 will throw a Javascript error also. Most thrown errors are
 *    configuration or implementation errors intended for developers and should not be
 *    obvious to the end user, stormMessage accomplishes this goal.
 */

/* Partstorm Namespace: pt */
var pt = {

  /** @var oBrowser [object] boolean values
   * @access public
   * @link http://www.prototypejs.org
   * @desc Simple feature detection derived from Prototype JS.
   */
  oBrowser : {
    ie : ((document.all != undefined) && !window.opera),
    firefox : navigator.userAgent.indexOf("Firefox") != -1,
    opera   : !!window.opera,
    safari  : navigator.userAgent.indexOf("Safari") != -1
  },

  /** @var oDom [object] boolean values
   * @access public
   * @desc Simple dom feature detection to support setting style attributes. Notation !!
   * ensures boolean instead of an object or undefined values. Required by pt._$ and
   * pt.setStyles methods.
   */
  oDom : {
    isID     : (!!document.getElementById),
    isAll    : (!!document.all),
    isLayers : ((navigator.appName.indexOf('Netscape') != -1) && (parseInt(navigator.appVersion) == 4))
  },

  /** function pt.extend(oSubClass,oSuperClass) classical inheritance
   * @access public
   * @param [oSubClass] new object
   * @param [oSuperClass] object being extended
   * @link http://www.jsdesignpatterns.com (page 44)
   * @return [void]
   * @desc In classical inheritance the new object's prototype is manually set to the prototype
   * object of the superclass before any methods are added to the new object's prototype. The
   * superclass attribute correctly points to the superclass.
   */
  extend : function(oSubClass,oSuperClass) {
    var F = function() {};
    F.prototype = oSuperClass.prototype;
    oSubClass.prototype = new F();
    oSubClass.prototype.constructor = oSubClass;

    oSubClass.superclass = oSuperClass.prototype;
    if (oSuperClass.prototype.constructor == Object.prototype.constructor) {
      oSuperClass.prototype.constructor = oSuperClass;
    }
  },

  /** function pt.$id(sId)
   * @access public
   * @param [sId] string
   * @return [object||aObjects]
   * @desc Retrieve parent document element from its id string attribute. If more than one
   * argument is passed to the function, return an array of elements. Calls the private
   * method pt._$(sId) which handles browser differences.
   */
  $id : function(sId) {
    if (arguments.length === 1) {
      return pt._$(sId);
    } else {
      var aElements = [], nLen = arguments.length;
      for (var i=0;i<nLen;i++) {
        if (typeof arguments[i] === 'string') {
          aElements.push(pt._$(arguments[i]));
        }
      }
      return aElements;
    }
  },

  /** function pt.$tag(sTag,oObject)
   * @access public
   * @param sTag [string]
   * @param oObject [object]
   * @return [array,false]
   * @desc Return elements by their html tag, either from the document or within another page
   * element passed to the function.
   */
  $tag : function(sTag,oObject) {
    return (arguments.length == 2) ? oObject.getElementsByTagName(sTag) : document.getElementsByTagName(sTag);
  },

  /** function pt.$addEvent(oElement,sEvent,oFunction,oBinding)
   * @access public
   * @param oElement,oBinding [object]
   * @param sEvent [string]  (root event name: click, mouseover)
   * @param oFunction [function]
   * @return [boolean]
   * @desc Facade method for pt.stormEvent.addBrowserListener() method.
   */
  $addEvent : function(oElement,sEvent,oFunction,oBinding) {
    return pt.stormEvent.addBrowserListener(oElement,sEvent,oFunction,oBinding);
  },

  /** function pt.$removeEvent(oElement,sEvent,oFunction,oBinding)
   * @access public
   * @return [boolean]
   * @desc Facade method for pt.stormEvent.removeBrowserListener() method.
   */
  $removeEvent : function(oElement,sEvent,oFunction,oBinding) {
    return pt.stormEvent.removeBrowserListener(oElement,sEvent,oFunction,oBinding);
  },

  /** function pt.$updateEvent(oElement,sEvent,oFunction,oBinding)
   * @access public
   * @param oElement,{oBinding} [object]
   * @param sEvent [string]  (root event name: click, mouseover)
   * @param oFunction [function]
   * @return [boolean]
   * @desc Facade method to first remove functions assigned to an event, then add
   * the new event. Necessary for the pt.stormEvent object, where a DOM object can
   * receive multiple functions for the same event (click,mouseover) and clobbering
   * is prevented.
   *
   * Dropped support for oBinding.
   */
  $updateEvent : function(oElement,sEvent,oFunction) {
    pt.stormEvent.removeBrowserListener(oElement,sEvent);
    pt.stormEvent.addBrowserListener(oElement,sEvent,oFunction);
  },

  /** function pt.$addLoadEvent(oFunction)
   * @access public
   * @param oFunction [function]
   * @return [void]
   * @desc Facade method for pt.stormEvent.addLoadEvent() method.
   */
  $addLoadEvent : function(oFunction) {
    pt.stormEvent.addLoadEvent(oFunction);
  },

  /** function pt.createElement(sTag,oAttribs,oStyles,oParent,sNS)
   * @access public
   * @param sTag     [string]
   * @param oAttribs [object]
   * @param oStyles  [object]
   * @param oParent  [object]
   * @param sNS      [string] namespace vocabulary
   * @return [object]
   * @desc Create an element from a namespace or a regular html element
   * and append it to the dom if oParent is passed. Return the new element.
   */
  createElement : function(sTag,oAttribs,oStyles,oParent,sNS) {
    var oElem = (sNS) ? document.createElementNS(sNS,sTag) : document.createElement(sTag);
    if (oAttribs) pt.setAttribute(oElem,oAttribs,sNS);
    if (oStyles) pt.setStyles(oElem,oStyles);
    if (oParent) oParent.appendChild(oElem);
    return oElem;
  },

  /** createTextNode : function(sText,oParent)
   * @access public
   * @param sText [string]
   * @param oParent [object]
   * @return [object]
   * @desc Create a text node and return it. Append to the dom if oParent
   * is passed.
   */
  createTextNode : function(sText,oParent) {
    var oNode = document.createTextNode(sText);
    if (oParent) oParent.appendChild(oNode);
    return oNode;
  },

  /** function pt.getAttribute(oElement,oAttrib,sNS)
   * @access public
   * @param oElement [object]
   * @param oAttrib  [object]
   * @param sNS      [string] namespace vocabulary
   * @return [object]
   * @desc Get an element's html attribute(s). If sNS is set, then call
   * getAttributeNS, passing null as the first value. oAttrib expects an object
   * formatted as 'attributeName:null' which will return the same object, with
   * the value for that attribute. Multiple attributes delimited by commas.
   * Changed the assignment. Do not modify oAttrib null value, if attribute exists
   * but is empty.
   * Usage:
   *   pt.getAttribute(oElement,{stroke:null},ns).stroke = newColor;
   *   var oAttr = pt.getAttribute(oElement,{stroke:null,"stroke-width":null},ns);
   *     returns { stroke:orange, stroke-width:1 }
   */
  getAttribute : function(oElement,oAttrib,sNS) {
    if (sNS) {
      for (var item in oAttrib) {
        oAttrib[item] = oElement.getAttributeNS(null,item);
      }
    }
    else {
      for (var item in oAttrib) {
        if (oElement[item] != '') {
          oAttrib[item] = (pt.oBrowser.ie) ? oElement[item] : oElement.getAttribute(item);
        }
      }
    }
    return oAttrib;
  },

  /** function pt.setAttribute(oElement,oAttribs,sNS)
   * @access public
   * @param oElement [object]
   * @param oAttribs [object]
   * @param sNS      [string] namespace vocabulary
   * @return [void]
   * @desc Set an element's html attributes. If sNS is set, then call
   * setAttributeNS, passing null to the first parameter, because
   * passing sNS will not allow any attributes to be set.
   */
  setAttribute : function(oElement,oAttribs,sNS) {
    if (sNS) {
      for (var item in oAttribs) {
        oElement.setAttributeNS(null,item,oAttribs[item]);
      }
    }
    else {
      for (var item in oAttribs) {
        oElement[item] = oAttribs[item];
      }
    }

  },

  /** function pt.getNodeText(oNode)
   * @access public
   * @param oNode [object]
   * @return [string]
   * @desc Different major browsers implement accessing the textNode differently, return the
   * value that exists.
   * Usage:
   *   pt.getNodeText(oParent.childNodes[1]);
   */
  getNodeText : function(oNode) {
    return (oNode.textContent || oNode.innerText) || oNode.innerHTML;
  },

  /** function pt.getKeys(aSource)
   * @access public
   * @param aSource [array]
   * @return [array]
   */
  getKeys : function(aSource) {
    var aResult = [];
    for (var item in aSource) {
      aResult.push(item);
    }
    return aResult;
  },

  /** function pt.setVar(sType)
   * @access public
   * @param sType [string]
   * @return [void]
   */
  setVar : function(sType) {
    var sAppType = sType;
  },

  /** function pt.deleteNode(oNode)
   * @access public
   * @param oNode [object]
   * @author http://www.josh-davis.org
   * @desc Delete a node from the DOM tree after event listeners and any node children
   * have been removed. ... not tested ...
   */
  deleteNode : function(oNode) {
    if (oNode) {
      pt.deleteChildren(oNode); //delete node's children
      pt.stormEvent.removeBrowserListener(oNode);  // make sure this works without by passing object alone
      if (typeof oNode.outerHTML !== 'undefined') {
        oNode.outerHTML = ''; //prevent pseudo-leak in IE
      }
      else {
        if (oNode.parentNode) {
          oNode.parentNode.removeChild(oNode); //remove the node from the DOM tree
          delete oNode; //clean up just to be sure
        }
      }
    }
  },

  /** function pt.deleteChildren(oNode)
   * @access public
   * @param oNode [object]
   * @author http://www.josh-davis.org
   * @desc Loop through the children nodes and remove them. ... not tested ...
   */
  deleteChildren : function(oNode) {
    if(oNode) {
      var nLen = oNode.childNodes.length;
      for (var i=0;i<=nLen;i++) {
        var oChildNode = oNode.childNodes[i];
        if (oChildNode.hasChildNodes()) { //if the child node has children then delete them first
          pt.deleteChildren(oChildNode);
          pt.stormEvent.removeBrowserListener(oChildNode); //remove listeners
          if (typeof oChildNode.outerHTML !== 'undefined') {
            oChildNode.outerHTML = ''; //prevent pseudo-leak in IE
          }
          else {
            oNode.removeChild(oChildNode); //remove the child from the DOM tree
            delete oChildNode; //clean up just to be sure
          }
        }
      }
    }
  },

  /** open : function(oEvent)
   * @access public
   * @param [object] oEvent
   * @return [void]
   * @desc Facade method to open the stormPopup.
   */
  open : function(oEvent) {
    pt.stormClient.actions.popup.open(oEvent);
  },

  /** close : function(oEvent)
   * @access public
   * @param [object] oEvent
   * @return [void]
   * @desc Facade method to close the stormPopup.
   */
  close : function(oEvent) {
    pt.stormClient.actions.popup.close(oEvent);
  }

};  // end pt

/** function pt._$(sId) branched singleton
 * @access private
 * @param [sId] string
 * @return [object]
 * @link http://www.jsdesignpatterns.com (page 80)
 * @desc Set the correct object accessor method based on the browser's DOM support.
 * Parenthesis at the end of this method, force the anonymous function to execute
 * immediately and assigns the correct function supported in the browser.
 */
pt._$ = (function() {
  var isID = function(sId) {
    return document.getElementById(sId);
  };
  var isAll = function(sId) {
    return document.all[sId];
  };
  var isLayers = function(sId) {
    return document.layers[sId];
  };

  if (pt.oDom.isID) {
    return isID;
  }
  else if (pt.oDom.isAll) {
    return isAll;
  }
  else if (pt.oDom.isLayers) {
    return isLayers;
  }
})();

/**function pt.setStyles(oElement,oStyles) branched singleton
 * @access public
 * @param oElement [object]
 * @param oStyles  [object]
 * @link http://www.jsdesignpatterns.com (page 80)
 * @return [void]
 * @desc Set the html element's style attributes based on the browser's DOM support.
 * Parenthesis at the end of this method, force the anonymous function to execute immediately
 * and assigns the correct function supported in the brower.
 */
pt.setStyles = (function() {
  var isID = function(oElement,oStyles) {
    for (var item in oStyles) {
      oElement[item] = oStyles[item];
    }
  };
  var isAll = function(oElement,oStyles) {
    for (var item in oStyles) {
      document.all[oElement].style.item = oStyles[item];
    }
  };
  var isLayers = function(oElement,oStyles) {
    for (var item in oStyles) {
      document.layers[oElement].item = oStyles[item];
    }
  };

  if (pt.oDom.isID) {
    return isID;
  }
  else if (pt.oDom.isAll) {
    return isAll;
  }
  else if (pt.oDom.isLayers) {
    return isLayers;
  }
})();

/** function pt.setNodeText(oNode,sText) branched singleton
 * @access public
 * @param oNode [object]
 * @param sText [string]
 * @link http://www.jsdesignpatterns.com (page 80)
 * @return [void]
 * @desc Different major browsers implement accessing the textNode differently, set the
 * value based on what exists.
 * Usage:
 *   pt.setNodeText(oParent.childNodes[1],'new text');
 *   pt.setNodeText(oNode,'new text');
 * Parenthesis at the end of this method, force the anonymous function to execute immediately
 * and assigns the correct function supported in the brower.
 */
pt.setNodeText = (function() {
  var isTextContent = function(oNode,sText) {
    oNode.textContent = sText;
  };
  var isInnerText = function(oNode,sText) {
    oNode.innerText = sText;
  };
  var isInnerHTML = function(oNode,sText) {
    oNode.innerHTML = sText;
  };
  if (pt.oBrowser.firefox) {
    return isTextContent;
  }
  else if (pt.oBrowser.safari || pt.oBrowser.opera) {
    return isInnerText;
  }
  else {
    return isInnerHTML;
  }
})();

/** function pt.getViewport() branched singleton
 * @access public
 * @return [object]
 * @link http://www.jsdesignpatterns.com (page 80)
 * @link http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
 * @desc Helper method to correctly return the viewable window width, height and scroll left and top position.
 */
pt.getViewport = (function() {
  var isNonIE = function() {
    return { width : window.innerWidth, height : window.innerHeight, scrollLeft : window.pageXOffset, scrollTop : window.pageYOffset };
  };
  var isDocumentElement = function() {
    return { width : document.documentElement.clientWidth, height : document.documentElement.clientHeight, scrollLeft : document.documentElement.scrollLeft, scrollTop : document.documentElement.scrollTop };
  };
  var isDocumentBody = function() {
    return { width : document.body.clientWidth, height : document.body.clientHeight, scrollLeft : document.body.scrollLeft, scrollTop : document.body.scrollTop };
  };
  if (typeof(window.innerWidth) == 'number') {  // non IE
    return isNonIE;
  }
  else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) { // IE 6+ in 'standards compliant mode'
    return isDocumentElement;
  }
  else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {  // IE 4 compatible
    return isDocumentBody;
  }
})();

/** function pt.timer() singleton
 * @access public
 * @methods addTimer(sId), addInterval(sId,sMethod,nMinutes), addTimeout(sId,sMethod,nMinutes)
 * @return [void]
 * @desc The timer object manages simple timed events. Interval and timeout events accept
 * defined action methods and time (default is in minutes) for the delay.
 * Usage:
 *    pt.timer.addInterval('autosave','pt.stormClient.action.autosave()',5);
 *    pt.timer.addTimeout('logout','pt.stormClient.action.logout()',29);
 *    pt.timer.addTimeout('status','pt.stormClient.action.statusDisplay()',{msec:500});
 *      last parameter is time, 5,29 = minutes, {min:5},{sec:3},{msec:500}
 *
 *    pt.timer.addTimer('pt');   // included already at the end of this singleton
 *    pt.timer.end('pt');     // 0.171 for 6 stormZones from ptb_data.js
 *    var aTotalTime = pt.timer.getSeconds('pt');
 */
pt.timer = (function() {
  var aInterval = {};  // private interval objects
  var aTimeout  = {};  // private timeout objects
  var aTimer    = [];  // private timer array

  return {
    addInterval : function(sId,sMethod,mTime) {
      this.clear(sId,'i');
      aInterval[sId] = window.setInterval(sMethod,this.toMsec(mTime));
    },

    addTimeout : function(sId,sMethod,mTime) {
      this.clear(sId,'t');
      aTimeout[sId] = window.setTimeout(sMethod,this.toMsec(mTime));
    },

    addTimer : function(sId) {  // overwrite
      aTimer[sId] = [new Date()];
    },

    // simple timer methods
    record : function(sId) {
      try {
        aTimer[sId].push(new Date());
      }
      catch(e) {
        this.addTimer(sId);
      }
    },

    end : function(sId) {
      if (aTimer[sId] !== 'undefined') {
        aTimer[sId].push(new Date());
      }
    },

    get : function(sId) {  // returns milliseconds, /1000 for seconds
      var t = aTimer[sId],aResults = [];
      if (t.length == 2) {
        aResults.push(t[1].getTime() - t[0].getTime());
      }
      else {
        var nLen = t.length;
        if (nLen%2 == 1) nLen--; // drop unpaired time
        for (var i=0;i<nLen;i+=2) {
          aResults.push(t[i+1].getTime() - t[i].getTime());
        }
      }
      t = aTimer[sId] = null;
      return aResults;
    },

    getSeconds : function(sId) {
      // there might be an array mapping function to do this faster?
      var aResults = this.get(sId);
      var nLen = aResults.length;
      for (var i=0;i<nLen;i++) {
        aResults[i] = aResults[i]/1000;
      }
      return aResults;
    },

    // interval & timeout utility methods
    clear : function(sId,sType) {
      switch (sType) {
        case 'i':
          window.clearInterval(aInterval[sId]);
          break;
        case 't':
          window.clearTimeout(aTimeout[sId]);
          break;
      }
    },

    checkTimeout : function(sId) {  // not sure when a timeout is cleared that the private variable is also cleared, needs testing.
      return (aTimeout[sId]) ? true : false;
    },

    toMsec : function(mTime) {
      if (typeof(mTime) == 'number') mTime = {min:mTime};
      for (var sMeasure in mTime) {
        switch (sMeasure) {
          case 'msec':
            return mTime[sMeasure];
          case 'sec':
            return (mTime[sMeasure] * 1000);
          case 'min':
            return (mTime[sMeasure] * 60 * 1000);
          case 'hr':
          case 'hour':
            return (mTime[sMeasure] * 60 * 60 * 1000);
        }
      }
    },

    list : function(sType) {
      switch (sType) {
        case 'i':
          return aInterval;
          break;
        case 't':
          return aTimeout;
          break;
        default:
          return aTimer[sType];
          break;
      }
    }
  }
})();

pt.timer.addTimer('pt');

/* pt Object Manipulation classes. */

/* pt.Interface namespace */
pt.i = {};

/** function pt.Interface(sName,aMethods)
 * @access public
 * @param [sName] string object name
 * @param [aMethods] string list of methods
 * @link http://www.jsdesignpatterns.com (page 19)
 * @return [object]
 * @desc Provides a check that an object contains the methods defined in the Interface.
 * Usage: var pt.i.stormLink = new pt.Interface('iStormLink',['add','remove','getLink']);
 *        var pt.i.stormMap  = new pt.Interface('iStormMap',['getId']);
 */
pt.Interface = function(sName,aMethods) {
  var sMethod = 'pt.Interface',sMsg;
  if (arguments.length != 2) {
    sMsg = 'Constructor called with ' + arguments.length + ' arguments, but expected exactly 2.';
    pt.stormMessage.add({ object : 'pt.Interface', type : 'error', severity : 'high', args : arguments,
      msg : sMsg });
    throw new Error(sMethod + ': ' + sMsg);
  }

  this.sName = sName;
  this.aMethods = [];

  var nLen = aMethods.length;
  for (var i=0; i<nLen; i++) {
    if (typeof aMethods[i] !== 'string') {
      sMsg = 'Constructor expects method names to be passed in as a string.';
      pt.stormMessage.add({ object : 'pt.Interface', type : 'error', severity : 'high', objectName : sName,
        msg : sMsg });
      throw new Error(sMethod + ': ' + sMsg);
    }
    this.aMethods.push(aMethods[i]);
  }
};

/* Public Static Method */

/** function pt.Interface.ensureImplements(oObject)
 * @access public
 * @param [oObject] object to test, is always 1st argument.
 * @link http://www.jsdesignpatterns.com (page 19)
 * @return [void||error]
 * @desc If the object passed in does not contain all the methods defined in the Interface objects,
 * throw an error.
 * Usage: var oStormLink = new StormLink();
 *        pt.Interface.ensureImplements(oStormLink,pt.i.stormLink,pt.i.stormMap);
 * The check tests that the oStormLink class contains all of the methods defined in the two
 * interfaces. Added throw new Error() to make sure developer sees a message and can check the
 * details in pt.stormMessage.getAll().
 */
pt.Interface.ensureImplements = function(oObject) {
  var nObjects = arguments.length;
  var sMethod = 'pt.Interface.ensureImplements',sMsg;
  if (nObjects < 2) {
    sMsg = 'Called with ' + arguments.length + 'arguments, but expected at least 2.';
    pt.stormMessage.add({ object : 'pt.Interface.ensureImplements', type : 'error', severity : 'high', args : arguments,
      msg : sMsg });
    throw new Error(sMethod + ': ' + sMsg);
  }

  for (var i=1;i<nObjects;i++) {
    var oInterface = arguments[i];
    if (oInterface.constructor !== pt.Interface) {
      sMsg = 'Expects arguments two or greater to be instances of pt.Interface.';
      pt.stormMessage.add({ object : sMethod, type : 'error', severity : 'high', args : arguments,
        msg : sMsg });
      throw new Error(sMethod + ': ' + sMsg);
    }

    var nMethods = oInterface.aMethods.length;
    for (var j=0;j<nMethods;j++) {
      var method = oInterface.aMethods[j];
      if (!oObject[method] || typeof oObject[method] !== 'function') {
        sMsg = 'Object does not implement the ' + oInterface.sName + ' interface. Method name: ' + method + ' was not found.';
        pt.stormMessage.add({ object : sMethod, type : 'error', severity : 'high', args : arguments,
          msg : sMsg });
        throw new Error(sMethod + ': ' + sMsg);
      }
    }
  }
};

/** function pt.Interface.minImplements(oObject)
 * @access public
 * @param [oObject] object to test, is always 1st argument.
 * @link http://www.jsdesignpatterns.com (page 19)
 * @return [void||error]
 * @desc If the object passed in does not contain at least one of the defined functions
 * in the Interface objects, throw an error.
 * Usage: var oStormLink = new StormLink();
 *        pt.Interface.minImplements(oStormLink,pt.i.stormLink,pt.i.stormMap);
 * We prepend the sType to the arguments list.
 */
pt.Interface.minImplements = function(oObject) {
  var nObjects = arguments.length,bMethodFound = false;
  var sMethod = 'pt.Interface.minImplements',sMsg;
  if (nObjects < 2) {
    sMsg = 'Called with ' + arguments.length + 'arguments, but expected at least 2.';
    throw new Error(sMethod + ': ' + sMsg);
  }

  for (var i=1;i<nObjects;i++) {
    var oInterface = arguments[i];
    if (oInterface.constructor !== pt.Interface) {
      sMsg = 'Expects arguments two or greater to be instances of pt.Interface.';
      throw new Error(sMethod + ': ' + sMsg);
    }

    var nMethods = oInterface.aMethods.length;
    for (var j=0;j<nMethods;j++) {
      var method = oInterface.aMethods[j];  // interface 'start','move','end'
      if (oObject[method]) {
        bMethodFound = true;
      }
    }
  }
  if (bMethodFound == false) {
    var sNames='',nCount=1;
    for (var sName in oObject) {
      if (sName == 'undefined') continue;
      if (typeof(oObject[sName]) != 'function') continue;
      sNames += (nCount == 1) ? sName : ',' + sName;
      nCount++;
    }
    sMsg = 'Object does not implement any methods of the ' + oInterface.sName + ' interface. Method names: ' + sNames + ' was not found.';
    throw new Error(sMethod + ': ' + sMsg);
  }
};