/**
 * Project: Stormclient
 * Copyright 2010,2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1497 $
 * $Id: pts.js 1497 2011-05-15 18:00:19Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/pts.js $
 *
 * JS Objects: ./files.js
 *
 * statusCursor         : pt.statusCursor          ptsc.js (object)
 *
 * statusDisplay        : pt.statusDisplay         pts.js (object literal)
 * statusDisplayManager : pt.statusDisplayManager  pts.js (object literal, factory)
 *
 * statusDisplay.data   : pt.statusDisplay.data    pts_data.js
 *
 * Dependencies:
 *                      : pt.stormBuilder.oStatusDisplay  ptb_vars.js
 *
 * Usage:
 *    var oStatus = { id : 'ajax-status', msg : pt.stormBuilder.panel.titles.sAutoSaveZones,
 *                    target : 'ptb-dialog-message' [, nDelay : 2 ] };
 *    pt.statusDisplay.show(oStatus);
 *  For testing, use the following:
 *    pt.timer.addTimeout('autosave-test-end',"pt.stormBuilder.action.button.hideStatus()",0.1);
 *     or
 *    pt.timer.addTimeout('autosave-test-end',"pt.statusDisplay.hide('ajax-status')",0.1);
 *
 * Notes:
 *
 * 1. Each statusDisplay object after it is created and attached to the DOM stores a compact
 *    version in pt.statusDisplayManager which currently consists of the following:
 *    [ajax-status]
 *
 *      Predefined properties:
 *
 *      sId     : 'ajax-status'         // easy reference to public id
 *      sParent : 'ptb-messages'        // id for parent container
 *      sTarget : 'ptb-dialog-message'  // id for text changes
 *      sClassPrefix : 'ptb-msg'        // allows different text formatting w/spinner
 *      sToggle : 'ptb-spinner-icon'    // id for item that changes (sImg, sParent, sTarget)
 *      sAction : 'display'             // Dom style property to use for toggle
 *
 *      Storage properties:
 *
 *      oTarget : null                  // object cache reference, only one call to pt.$id()
 *      sDefaultMsg : ''                // container for storing a default message
 *
 * 2. Successive calls to pt.statusDisplay.show() do not require the original target property. Only
 *    the id and msg properties are needed to update the statusDisplay text.
 *
 * 3. Calling pt.statusDisplay.hide('ajax-status') can be passed a simple string identifier or an
 *    object { id : 'ajax-status' [, nDelay : 2] }. By default, the .hide() method remains visible
 *    for 1 second. To close immediately, call pt.statusDisplay.close(oStatus) instead.
 *
 * 4. This could be refactored in the future to a class. Then extended for each different type
 *    of statusDisplay needed. The key, is to override the buildDisplay method in the child class
 *    to handle any special requirements and return the correct object and parameters. The interface
 *    could be reinstated to enforce compliance in the child objects.
 *
 */
pt.statusDisplay = {  // object literal

  /** function show(oStatus)
   * @access public
   * @param oStatus [object]
   * @return [void]
   * @desc Display to the user a message about the current action. Optionally change the css styling
   * and toggle this item's display/visibility. If it does not exist, create the html structure and
   * attach it to the DOM.
   * @todo refactor the oTarget call to pt.$id() and store the dom reference in aInstance[sId].oTarget
   * inside pt.statusDisplayManager(). Need to have a mechanism to associate string target ids with
   * their objects. Maybe oTarget is an array, use string id to access it?
   */
  show : function(oStatus) {
    var oDisplay = pt.statusDisplayManager.create(oStatus);
    var oTarget = pt.$id(oDisplay.sTarget);  // oTarget
    if (oStatus.msg) {
      oTarget.childNodes[0].nodeValue = oStatus.msg;
    }
    if (oDisplay.sClassPrefix) {
      this.updateClass(oTarget,oDisplay.sClassPrefix,'-show');
    }
    if (oDisplay.sToggle) {
      this.toggle(oDisplay,'show');
    }
  },
  /** function hide(oStatus) bridge
   * @access public
   * @param oStatus [object]
   * @return [void]
   * @see pt.statusDisplay.close(oStatus)
   * @desc Hide the statusDisplay. A delay is introduced to ensure that the statusDisplay
   * is visible to the user for at least the minimum time, currently 1 second in situations
   * where the statusDisplay may seem not to function when action executions are fast.
   */
  hide : function(oStatus) {
    pt.stormBuilder.oStatusDisplay.oStatus = oStatus;
    var nDelay = (oStatus.nDelay) ? oStatus.nDelay : pt.stormBuilder.oStatusDisplay.nDelay;
    pt.timer.addTimeout('statusDisplay-hide','pt.statusDisplay.doClose()',(nDelay/60));
  },
  /** function doClose() bridge
   * @access protected
   * @return [void]
   * @desc Javascript workaround method to access a parameter that was stored before a timeout
   * or interval method call was set.
   */
  doClose : function() {
    oStatus = pt.stormBuilder.oStatusDisplay.oStatus;
    this.close(oStatus);
    pt.stormBuilder.oStatusDisplay.oStatus = null;
  },
  /** function close(oStatus)
   * @access public
   * @return [void]
   * @desc Hide the statusDisplay. Optionally restore css styling with a default message if it was
   * defined.
   * @todo testing is needed in IE to verify that the default message is properly restored.
   * @todo refactor the oTarget call to pt.$id(), see show()
   */
  close : function(oStatus) {
    var oDisplay = pt.statusDisplayManager.create(oStatus);
    var oTarget = pt.$id(oDisplay.sTarget);  // oTarget
    if (oDisplay.sClassPrefix) {
      this.updateClass(oTarget,oDisplay.sClassPrefix,'-hide');
    }
    if (oDisplay.sDefaultMsg) {
      oTarget.childNodes[0].nodeValue = oDisplay.sDefaultMsg;
    }
    if (oDisplay.sToggle) {
      this.toggle(oDisplay,'hide');
    }
  },

  /* Private Methods */

  /** function updateClass(oTarget,sPrefix,sSuffix)
   * @access private
   * @param oTarget [object]
   * @param sPrefix,sSuffix [string]
   * @return [void]
   * @desc Retrieve the className property from oTarget, if the current value matches the new value, just
   * return, otherwise set the new value.
   */
  updateClass : function(oTarget,sPrefix,sSuffix) {
    var oClass = pt.getAttribute(oTarget,{className:null});
    if (oClass.className == sPrefix+sSuffix) return;
    oClass.className = sPrefix+sSuffix;
    pt.setAttribute(oTarget,oClass);  // update className attribute
  },
  /** function toggle(oDisplay,sAction)
   * @access private
   * @param oDisplay [object]
   * @param sAction [string]
   * @return [void]
   * @desc Status display structures can use either display or visibility to toggle the
   * element's state. This method ensures the correct action is taken. If pt.statusDisplay.show()
   * or .hide() is called successively just return without executing a style change.
   */
  toggle : function(oDisplay,sAction) {
    var oAction = { show : 'inline,visible', hide : 'none,hidden'};
    var oToggle = pt.statusDisplayManager.getTarget(oDisplay.sId,oDisplay.sToggle);
    switch (oDisplay.sAction) {
      case 'display':
        if (oToggle.style.display.indexOf(oAction[sAction]) != -1 || (oToggle.style.display == '' && sAction == 'show')) return;
        oToggle.style.display = (sAction == 'show') ? 'inline' : 'none';
      break;
      case 'visibility':
        if (oToggle.style.visibility.indexOf(oAction[sAction]) != -1 || (oToggle.style.visibility == '' && sAction == 'show')) return;
        oToggle.style.visibility = (sAction == 'show') ? 'visible' : 'hidden';
      break;
    }
  }
};

/** pt.statusDisplayManager object literal, Factory True Singleton
 * @access protected
 * Usage:
 *   var oDisplay = pt.statusDisplayManager.create(oStatus);
 * This object store contains statusDisplay objects. Designed initially for ajax-status
 * indication but can be easily extended for message alerts. The key objective is to be able
 * to update the message at different stages of an event and be able to hide the messages
 * at the end of the event.
 */
pt.statusDisplayManager = (function() {
  var aInstance = {};

  return {
    /** function create() Factory True Singleton
     * @access protected
     * @return [object]
     * @desc First predefined structure: ajax-status
     *
     * Each instance is an object. The ajax-status has a single <span> tag which can accept different
     * string messages. We define the target attribute in the instance object for this id.
     */
    create : function(oStatus) {
      if (typeof oStatus === 'string') oStatus = { id : oStatus };  // handle simple hide toggles
      if (aInstance[oStatus.id]) {
        return aInstance[oStatus.id];
      }
      else { // logic to determine if a predefined structure exists.
        var oResult = false, oDisplay = {};

        oDisplay.sTarget = oStatus.target || oStatus.data.target;  // target attribute required
        oDisplay.sId = oStatus.id;  // easy reference to id

        if (pt.statusDisplay.data[oStatus.id]) { // pts_data.js contains ajax-status
          oResult = this.buildDisplay(oStatus,pt.statusDisplay.data[oStatus.id]);
        }
        else if (oStatus.data) { // nothing predefined, check for inline structure
          oResult = this.buildDisplay(oStatus,oStatus.data);
        }
        else { // create simple default html message structure
          oResult = this.buildDisplayDefault(oStatus);
        }
      }

      if (oResult != false) {
        for (var item in oResult) {
          if (item == 'undefined' || oResult[item] == 'null') continue;
          oDisplay[item] = oResult[item];
        }
        aInstance[oStatus.id] = oDisplay;
        return aInstance[oStatus.id];
      }
      else {
        pt.stormMessage.add({ object : 'pt.statusDisplayManager.create', type : 'error', severity : 'high', args : arguments,
        msg : 'this.buildDisplay() returned false.'});
        return false;
      }

    },

    /* Private Methods */

    /** function buildDisplay(oStatus,oData)
     * @access private
     * @return [object]
     * @desc Check to see if a target already exists in html structure, commonly output by scripting. Then
     * augment the structure with the oData object contents. If no existing structure is found, build the
     * html from oData and attach to the DOM. Finally return an object containing the specifics about this
     * statusDisplay object.
     */
    buildDisplay : function(oStatus,oData) {  // sId = 'ajax-status', oData.sType = 'ptb-spinner', oData.sParent = 'ptb-messages'
      if (!oStatus.target) {
        pt.stormMessage.add({ object : 'pt.statusDisplayManager', type : 'error', severity : 'medium', args : arguments,
        msg : 'oStatus argument missing target attribute.'});
        return false;
      }
      if (!oData.oTags) {
        pt.stormMessage.add({ object : 'pt.statusDisplayManager', type : 'error', severity : 'medium', args : arguments,
        msg : 'oData argument contains no data structures.'});
        return false;
      }

      var oParent = pt.$id(oData.sParent);

      // check to see if oData.target is exists under either a <div> or <span> tag in childNodes
      var mTarget = false;
      var nLen = oParent.childNodes.length;
      if (nLen >= 1) {
        for (var i=0;i<nLen;i++) {
          if (oParent.childNodes[i].id == oStatus.target) {
            mTarget = i;  // target id exists <span or <div
            break;
          }
        }
      }

      // add to dom
      if (mTarget !== false) { // contains int of matching child id
        var sOrigMsg = pt.getNodeText(oParent.childNodes[mTarget]);
        var oImg = this.buildElement('img',oData.oTags['img']);
        oParent.insertBefore(oImg,oParent.childNodes[mTarget]);
      }
      else // does not exist in html
      {
        var oTags = oData.oTags;

        for (var tag in oTags) { // loop through tag elements in data object
          if (tag == 'undefined') continue;
          if (tag == 'span' || tag == 'div') {
            if (oTags[tag].attribs.id == 'target') {
              oTags[tag].attribs.id = oStatus.target; // update the id placeholder to the object's text node id.
            }
          }
          // new element is appended to parent
          var oElem = this.buildElement(tag,oTags[tag]);
          oParent.appendChild(oElem);
        }
      }

      return { sParent : oData.sParent,
               sClassPrefix : (oData.sClassPrefix) ? oData.sClassPrefix : null,
               sDefaultMsg  : (sOrigMsg) ? sOrigMsg : null,
               sToggle      : (oData.sToggle)? oData.sToggle : null,
               sAction      : (oData.sAction)? oData.sAction : null };
    },

    /** function buildDisplayDefault(oStatus)
     * @access private
     * @return [object]
     * @desc Wrapper method to provide a default structure when a predefined structure inside
     * pts_data.js or inline structure does not exist. This is not entirely needed but provides
     * a friendly way to inform developers that something is off.
     */
    buildDisplayDefault : function(oStatus) {
      var oData = {
        sParent : 'ptb-messages',
        sClassPrefix : 'ptb-msg',
        oTags : {
          div : {
            attribs : {
              id : 'target'
            }
          }
        }
      };
      this.buildDisplay(oStatus.id,oData);
    },

    /** function buildElement(sTag,oTag,oParent) bridge
     * @access private
     * @return [object]
     * @desc Convenience method to keep the logic code clean.
     */
    buildElement : function(sTag,oTag,oParent) {
      var oElem = pt.createElement(sTag,
        (oTag.attribs) ? oTag.attribs : null,
        (oTag.style) ? oTag.style : null,
        (oParent) ? oParent : null
      );
      return oElem;
    },

    /** function getTarget(sId,sTarget)
     * @access private
     * @return [object]
     * @desc Check to see if a DOM reference is already stored. If create a reference and
     * store it.
     */
    getTarget : function(sId,sTarget) {
      if (!aInstance[sId].oTarget) {
        aInstance[sId].oTarget = pt.$id(sTarget);
      }
      return aInstance[sId].oTarget;
    }
  }
})();