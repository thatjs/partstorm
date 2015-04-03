/**
 * Project: Stormclient
 * Copyright 2009,2010,2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1523 $
 * $Id: pte.js 1523 2011-05-27 14:36:17Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/pte.js $
 *
 * stormEvent            : pt.stormEvent            pte.js (facade object literal)
 *
 * Notes:
 */

/** function bind(oObject)
 * @access public
 * @param [oObject] object
 * @link http://www.josh-davis.org
 * @desc Events need to fire within the appropriate scope. If an event simply called the
 * method of an object (we do this now) the method would execute as its own function
 * without any understanding of its parent object. However, by binding the method to its
 * parent it is able to see the object’s properties and sibling methods. The bind function
 * is pretty straight-forward as all it does is “apply” the parent object to the method and
 * pass along the arguments from the function call.
 */
Function.prototype.bind = function(oObject) {
 var method = this;
 return function () {
 	 return method.apply(oObject, arguments);
 };
};

/** stormEvent singleton
 * @access public
 * @link http://blog.josh-davis.org
 * @link http://jsdesignpatterns.com
 * @desc Store events in either acEvents or abEvents array for simple management and removal.
 * Private member variables:
 *   abEvents [array] storage database for all native browser events
 *   acEvents [array] storage database for all custom application events
 *
 * Browser events (click,mouseover...) are self managing. Custom application
 * events require a two step process. Once to register the event (and optionally bind to a
 * DOM object) and once to fire the event(s) which executes all events registered.
 *
 * Notes:
 *
 * 1. Refactored this object to work with both custom events and browser events as implemented
 *    by Josh Davis. Adapted his work to a Singleton that stores event object in private
 *    variables. Getter methods taken from http://www.jsdesignpatterns.com (page 146).
 * 2. Facade methods defined in pt.js provide convenience methods:
 *      pt.$addEvent(oObject,sEvent,oFunction[,oBinding]);
 *      pt.$removeEvent(oObject,sEvent,oFunction[,oBinding]);
 *      pt.$updateEvent(oObject,sEvent,oFunction[,oBinding]);
 *
 */
pt.stormEvent = (function() {
  var abEvents = [];   // private browser event objects
  var acEvents = [];   // private custom/application event objects

  return {

  /* Custom Event Methods */

    /** function getActionId(oObject,sEvent,oAction,oBinding)
     * @access public
     * @param [object] oObject,oAction,oBinding
     * @param [string] sEvent
     * @return [number,false] Return index or boolean false.
     * @desc Retrieve the numeric array index for the custom listener within the event.
     */
    getcActionId : function(oObject,sEvent,oAction,oBinding) {
       if (oObject && sEvent) {
         var oElem = acEvents[oObject][sEvent];
 	       if (oElem) {
 		       var nLen = oElem.length;
 		       for (var i=nLen-1;i>=0;i--) {
 			       if (oElem[i].oAction == oAction && oElem[i].oBinding == oBinding) {
 				       return i;
 			       }
 		       }
 	       }
 	       else {
 		       return false;
 	       }
       }
     },

     /** function addListener(oObject,sEvent,oAction,oBinding)
      * @access public
      * @param [object] oTarget,oAction,oBinding
      * @param [string] sEvent
      * @return [void]
      * @desc Add a new custom listener to an object for a given event. Odd things happens when a listener gets
      * registered multiple times, so we call this.getcActionId(oObject,sEvent,sAction,oBinding) to see
      * if it already exists, and only creates the array/object elements as needed.
      */
     addListener : function(oObject,sEvent,oAction,oBinding) {
       if (acEvents[oObject]) {
 	       if (acEvents[oObject][sEvent]) {
 		       if (this.getcActionId(oObject,sEvent,oAction,oBinding) === false) {
 			       var oCurrEvent = acEvents[oObject][sEvent];
 			       oCurrEvent[oCurrEvent.length] = {oAction : oAction, oBinding : oBinding};
 		       }
 	       }
 	       else {
 		       acEvents[oObject][sEvent] = [];
 		       acEvents[oObject][sEvent][0] = {oAction : oAction, oBinding : oBinding};
 	       }
       }
       else {
 	       acEvents[oObject] = [];
 	       acEvents[oObject][sEvent] = [];
 	       acEvents[oObject][sEvent][0] = {oAction : oAction, oBinding : oBinding};
       }
     },

     /** function removeListener(oObject,sEvent,oAction,oBinding)
      * @access public
      * @param [object] oTarget,oAction,oBinding
      * @param [string] sEvent
      * @desc Remove a custom listener by retrieving its array index and splicing it out.
      */
     removeListener : function(oObject,sEvent,oAction,oBinding) {
       if (acEvents[oObject]) {
 	       if (acEvents[oObject][sEvent]) {
 	         var nId = this.getcActionId(oObject,sEvent,oAction,oBinding);
 		       if (nId >= 0) {
 			       acEvents[oObject][sEvent].splice(nId,1);
 		       }
 	       }
       }
     },

     /** function fireEvent(oEvent,oObject,sEvent,aArgs)
      * @access public
      * @param [object] oEvent - Brower event object.
      * @param [object] oObject - The element attached to the action.
      * @param [array] aArgs - Arguements attached to the event.
      * @param [string] sEvent - Name of the event.
      * @return null
      * @desc Remove a listener by retrieving its array index and splicing it out.
      */
     fireEvent : function(oEvent,oObject,sEvent,aArgs) {
       oEvent = pt.stormEvent.getEvent(oEvent);

       if (oObject && acEvents) {
 	       var oEventElem = acEvents[oObject];
 	       if (oEventElem) {
 		       var oCurrElem = oEventElem[sEvent];
 		       if (oCurrElem) {
 			       for (var act in oCurrElem) {
 				       var action = oCurrElem[act].oAction;
 				       if (oCurrElem[act].oBinding) {
 					       action = action.bind(oCurrElem[act].oBinding);
 				       }
 				       action(oEvent,aArgs);
 			       }
 		       }
 	       }
       }
     },

  /* Browser Event Methods */

     /** function getbActionId(oObject,sEvent,oFunction,oBinding)
      * @access public
      * @param oObject [object] The element attached to the action.
      * @param sEvent  [string] The name of the event.
      * @param oFunction [function] The action to execute upon the event firing.
      * @param oBinding [object] The object to scope the action to.
      * @return [number,false] Returns an index or boolean false.
      * @desc Checks for the existance of a browser listener index. The
      * abEvents array is a single numerically indexed array of objects
      * because the browser handles all aspects of the event firing. As compared
      * to acEvents where we need manually fire events.
      */
     getbActionId : function(oObject,sEvent,oFunction,oBinding) {
       var nLen = abEvents.length;
       for (var i=0;i<=nLen;i++) {
         var oElem = abEvents[i];
         if (oElem) {
           if (oElem.oObject == oObject && oElem.sEvent == sEvent && oElem.oFunction == oFunction && oElem.oBinding == oBinding) {
             return i;
           }
         }
       }
       return false;
     },

     /** function addBrowserListener(oObject,sEvent,oFunction,oBinding)
      * @access public
      * @param oObject [object] The element attached to the action.
      * @param sEvent  [string] The name of the event (click, mouseover)
      * @param oFunction [function] The action to execute upon the event firing.
      * @param oBinding [object] The object to scope the action to.
      * @return [void]
      * @desc Adds a browser listener event. Use feature branching to select
      * the correct browser method. Not sure oBinding is necessary as most
      * Partstorm objects are contained in closures.
      */
     addBrowserListener : function(oObject,sEvent,oFunction,oBinding) {
       if (oObject && sEvent && oFunction) {
         if (this.getbActionId(oObject,sEvent,oFunction,oBinding) === false) {
           var oBoundAction = oFunction;
           if (oBinding) {
             oBoundAction = oAction.bind(oBinding);
           }
           if (oObject.addEventListener) {
             oObject.addEventListener(sEvent,oBoundAction,false);
           }
           else if (oObject.attachEvent) {
             oObject.attachEvent('on' + sEvent,oBoundAction);
           }
           else {
             oObject['on' + sEvent] = oBoundAction;
           }
           abEvents[abEvents.length] = {oObject:oObject,sEvent:sEvent,oFunction:oFunction,oBinding:oBinding,oBoundAction:oBoundAction};
         }
       }
     },

    /** function removeBrowserListener(oObject,sEvent,oFunction,oBinding)
     * @access public
     * @param oObject [object] The element attached to the action.
     * @param sEvent  [string] The name of the event (click, mouseover)
     * @param oFunction [function] The action to execute upon the event firing.
     * @param oBinding [object] The object to scope the action to.
     * @return [void]
     * @desc Removes a browser listener. Loop through abEvent storage array, can remove
     * based on any of the four arguments to narrow down to individual events.
     */
    removeBrowserListener : function(oObject,sEvent,oFunction,oBinding) {
      var nLen = abEvents.length;
      for (var i=0;i<=nLen;i++) {
        var oElem = abEvents[i];
        if (oElem) {
          if (oObject && sEvent && oFunction && oBinding) {
            if (oElem.oObject == oObject && oElem.sEvent == sEvent && oElem.oFunction == oFunction && oElem.oBinding == oBinding) {
              this.detachListener(oElem,i);
              break;
            }
          }
          else if (oObject && sEvent && oFunction) {
            if (oElem.oObject == oObject && oElem.sEvent == sEvent && oElem.oFunction == oFunction) {
              this.detachListener(oElem,i);
              break;
            }
          }
          else if (oObject && sEvent) {
            if (oElem.oObject == oObject && oElem.sEvent == sEvent) {
              this.detachListener(oElem,i);
              break;
            }
          }
          else if (oObject) {
            if (oElem.oObject == oObject) {
              this.detachListener(oElem,i);
              break;
            }
          }
          else {
            this.detachListener(oElem,i);
            break;
          }
        }
      }
    },

    /** function detachListener(oElem,nId)
     * @access protected
     * @param oElem [object] The browser listener object.
     * @param nId [number] The index of the object in the abEvent listener array.
     * @return [void]
     * @desc Detaches a browser listener from a DOM object (prevents memory leaks)
     */
    detachListener : function(oElem,nId) {
      var oObject = oElem.oObject;
      var sEvent = oElem.sEvent;
      var oBoundAction = oElem.oBoundAction;

      if (oObject.removeEventListener) {
        oObject.removeEventListener(sEvent,oBoundAction,false);
        sEvent = 'on' + sEvent;
      }
      if (oObject.detachEvent) {
        oObject.detachEvent(sEvent,oBoundAction);
      }

      oObject[sEvent] = null;
      delete oElem.oObject;
      delete oElem.sEvent;
      delete oElem.oFunction;
      delete oElem.oBinding;
      delete oElem.oBoundAction;
      delete abEvents[nId];

      abEvents.splice(nId,1);
    },

    getcEvents : function() {
      return acEvents;
    },

    getbEvents : function() {
      return abEvents;
    },

    /** function addEvent(oElement,sEvent,oFunction) Depreciatead
     * @access public
     * @param oElement [object]
     * @param sEvent [string]  (click, mouseover)
     * @param oFunction [function]
     * @return [boolean]
     * @desc Use branching to select the correct method to attach events to the page structure.
     * Depreciated. Useful for testing.
     */
    addEvent : function(oElement,sEvent,oFunction) {
      if (oElement.addEventListener) {
        oElement.addEventListener(sEvent,oFunction,false);
        return true;
      }
      else if (oElement.attachEvent) {
        var bResult = oElement.attachEvent('on'+sEvent,oFunction);
        return bResult;
      }
      else {
        oElement['on'+sEvent] = oFunction;
        return true;
      }
    },

    /** function addLoadEvent(oFunction)
     * @access public
     * @param oFunction [object]
     * @return [void]
     * @link Simon Willison  <http://simonwillison.net>
     * @desc Handle multiple onload handler functions without clobbering other Javascript used
     * on the same webpage. This is called last and it passed a collection of methods to execute
     * under a single function.
     */
    addLoadEvent : function(oFunction) {
      var oldonload = window.onload;
      if (typeof window.onload != 'function') {
        window.onload = oFunction;
      }
      else {
        window.onload = function() {
          if (oldonload) {
            oldonload();
          }
          oFunction();
        }
      }
    },

  /* Event Utility Methods */

    /** function getEvent(oEvent)
     * @access public
     * @param oEvent [object]
     * @return [object]
     * @desc Use branching to return the correct event object.
     */
    getEvent : function(oEvent) {
      return oEvent || window.event;
    },
    /** function getTarget(oEvent)
     * @access public
     * @param oEvent [object]
     * @return [object]
     * @desc Use branching to return the correct event target.
     */
    getTarget : function(oEvent) {
      return oEvent.target || oEvent.srcElement;
    },
    /** function getEventCoords : function(oEvent)
     * @access public
     * @param oEvent [object]
     * @return [array,object]
     * @desc Use branching to return the correct coordinates which correspond to the
     * event. Position is relative to the object firing the event. If 2nd parameter is
     * passed, return an object instead of the default array.
     */
    getEventCoords : function(oEvent) {
      var nx,ny;
      if (!oEvent) oEvent = window.event;
      if (oEvent.layerX && oEvent.layerY) {  // Firefox
        nx = oEvent.layerX; ny = oEvent.layerY;
      }
      else if (oEvent.offsetX && oEvent.offsetY) { // IE
        nx = oEvent.clientX; ny = oEvent.clientY;
      }
      return (arguments.length == 2) ? { x : nx, y : ny} : [nx,ny];
    },

    /** function stopPropagation(oEvent)
     * @access public
     * @param oEvent [object]
     * @return [void]
     * @desc Use branching to halt the event from propagating through the DOM structure.
     */
    stopPropagation : function(oEvent) {
      if (oEvent.stopPropagation) {
        oEvent.stopPropagation();
      }
      else {
        oEvent.cancelBubble = true;
      }
    },
    /** function preventDefault(oEvent)
     * @access public
     * @param oEvent [object]
     * @return [object]
     * @desc Use branching to prevent the default browser action.
     */
    preventDefault : function(oEvent) {
      if (oEvent.preventDefault) {
        oEvent.preventDefault();
      }
      else {
        oEvent.returnValue = false;
      }
    },
    /** function stopEvent(oEvent)
     * @access public
     * @param oEvent [object]
     * @return [void]
     * @desc Facade method to halt event propagation and prevent the default browser behavior.
     */
    stopEvent : function(oEvent) {
      this.stopPropagation(oEvent);
      this.preventDefault(oEvent);
    }
  }  // end return
})();