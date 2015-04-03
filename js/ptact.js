/**
 * Project: Stormclient
 * Copyright 2011 Partstorm.
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1505 $
 * $Id: ptact.js 1505 2011-05-25 13:05:40Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptact.js $
 *
 * Objects: files.js
 *
 * iDragCallback             : pt.i.dragCallback            ptact.js (interface)
 *
 * stormAction               : pt.stormAction               ptact.js (namespace)
 *
 * stormAction.dragObject    : pt.stormAction.dragObject    ptact.js (class)
 * stormAction.dragManager   : pt.stormAction.dragManager   ptact.js (singleton)
 * point                     : pt.math.point                ptmp.js  (object)
 *
 * Notes:
 */
pt.i.dragCallback = new pt.Interface('iDragCallback',['start','move','end']);

/* Define stormAction namespace */
if (!pt.stormAction) pt.stormAction = {};

/** function pt.stormAction.dragHandler(oDragElement,oDragHandle,oCallback,bAttachLater)
 * @access public
 * @link http://www.jsdesignpatterns.com (page 32)
 * @return [object]
 * @desc Create a new draggable object.
 * Usage:
 *   var oDrag = pt.stormAction.dragManager.add(sId,oDragElement,oDragHandle,oCallback,bAttachLater);
 *   [oDrag.setBound(new pt.math.point(0,0), new pt.math.point(200,200));]
 * Notes:
 * 1. Constructor parameters are automatic private variables and are available within
 *    the closure scope.
 * 2. Added callback events and bounding features to the core dragObject from:
 *    @link http://www.switchonthecode.com/tutorials/javascript-draggable-elements
 */
pt.stormAction.dragObject = (function() {

  // Private Attributes and Methods, reserve for future use.

  return function(oDragElement,oDragHandle,oCallback,bAttachLater) {  // return the contructor

    if (typeof(oDragElement) == 'string') oDragElement = pt.$id(oDragElement);
    if (typeof(oDragHandle) == 'string') oDragHandle = pt.$id(oDragHandle);
    if (oDragHandle == null) oDragHandle = oDragElement;
    if (oCallback != null) pt.Interface.minImplements(oCallback,pt.i.dragCallback);
    bAttachLater = (bAttachLater == true) ? true : false;

    // Private attributes, accessible by instance objects, declared here.
    var oBound = null;
    var oCursorPos = null;
    var oElementPos = null;
    var bDragging = false;
    var bListening = false;
    var bRemoved = false;

    // Private methods
    function onDragStart(oEvent) {
      if (bDragging || !bListening || bRemoved) {
        return;
      }

      bDragging = true;

      if (oCallback != null && oCallback.start != null) {
        oCallback.start(oEvent,oDragElement);
      }

      oCursorPos = pt.math.point.absCursor(oEvent);
      oElementPos = new pt.math.point(parseInt(oDragElement.style.left),
                                      parseInt(oDragElement.style.top));

      oElementPos.check();

      pt.$addEvent(document,'mousemove',onDragContinue);
      pt.$addEvent(document,'mouseup', onDragStopEvent);

      return pt.stormEvent.stopEvent(oEvent);
    };

    function onDragContinue(oEvent) {
      if (!bDragging || bRemoved) {
        return;
      }

      var oNewPos = pt.math.point.absCursor(oEvent);
      oNewPos = oNewPos.add(oElementPos).subtract(oCursorPos);
      oNewPos = oNewPos.bound(getLowerBound(),getUpperBound());
      oNewPos.apply(oDragElement);

      if(oCallback != null && oCallback.move != null) {
        oCallback.move(oNewPos,oDragElement);
      }
      return pt.stormEvent.stopEvent(oEvent);
    };

    function onDragStopEvent(oEvent) {
      onDragStop();
      return pt.stormEvent.stopEvent(oEvent);
    };

    function onDragStop(oEvent) {
      if(!bDragging || bRemoved) {
        return;
      }

      pt.$removeEvent(document,'mousemove',onDragContinue);
      pt.$removeEvent(document,'mouseup',onDragStopEvent);
      oCursorPos = null;
      oElementPos = null;
      if(oCallback != null && oCallback.end != null) {
        oCallback.end(oDragElement);
      }
      bDragging = false;
    };

    /** function getLowerBound()
     * @access public
     * @return [object,null]
     * @desc Accessor method for lower bounding point.
     */
    function getLowerBound() {
      return (oBound == null)
        ? null
        : oBound.lower;
    };
    /** function getUpperBound()
     * @access public
     * @return [object,null]
     * @desc Accessor method for upper bounding point.
     */
    function getUpperBound() {
      return (oBound == null)
        ? null
        : oBound.upper;
    };

    /* public methods */
    this.remove = function() {
      if (bRemoved) {
        return;
      }

      this.stopListening(true);
      oDragElement = null;
      oDragHandle = null;
      oBound.lower = null;
      oBound.upper = null;
      if (oCallback) {
        oCallback.start = null;
        oCallback.move = null;
        oCallback.end = null;
      }
      bRemoved = true;
    };

    this.startListening = function() {
      if (bListening || bRemoved) {
        return;
      }
      bListening = true;
      pt.$addEvent(oDragHandle,'mousedown',onDragStart);
    };

    this.stopListening = function(bNow) {
      if (!bListening || bRemoved) {
        return;
      }
      pt.$removeEvent(oDragHandle,'mousedown',onDragStart);
      bListening = false;

      if (bNow && bDragging) {
        onDragStop();
      }
    };

    /* public setter methods */

    /** setBound = function(oUpperPoint,oLowerPoint)
     * @access public
     * @param oUpperPoint,oLowerPoint [object]
     * @return [void]
     * @desc Set upper and lower points to define a boundary which this.oElement must remain
     * within.
     */
    this.setBound = function(oUpperPoint,oLowerPoint) {
      oBound = {};
      var oTmpLower = oLowerPoint.min(oUpperPoint);
      oBound.upper = oLowerPoint.max(oUpperPoint);
      oBound.lower = oTmpLower;
    };

    /* Getter Methods */
    this.isDragging = function() { return bDragging; };
    this.isListening = function() { return bListening; };
    this.isRemoved = function() { return bRemoved; };

  }
})();

/** dragManager singleton
 * @access public
 * @desc The dragManager is the database store for dragObjects permitting changing of
 * listening state and removal after a dragObject is no longer required.
 * Private member variables:
 *   aInstances [object] storage database for all dragObjects
 *   nCount [number] count of dragObjects
 * Usage:
 *   var oCallback = { end : function() { alert('drag ended!'); } };
 *   pt.stormAction.dragManager.add(sId,oDragElement,oDragHandle,oCallback,bAttachLater);
 *
 * The identifier for each dragObject is currently a string, however this may change
 * and become an id or class attribute of the oDragElement. Supported callback method
 * names are: start, move and end.
 */
pt.stormAction.dragManager = (function() {
  var aInstances = {};   // private drag object definitions, sc1
  var nCount = 1;       // private drag object counter

  return {
    add : function(sId,oDragElement,oDragHandle,oCallback,bAttachLater) {
      bAttachLater = (bAttachLater == true) ? true : false;
      if (aInstances[sId] && aInstances[sId].bRemoved == false) {
        if (!bAttachLater && aInstances[sId].isListening == false) {
          aInstances[sId].startListening();
        }
        return;
      }

      aInstances[sId] = new pt.stormAction.dragObject(oDragElement,oDragHandle,oCallback,bAttachLater);
      nCount++;

      if (!bAttachLater) {
        aInstances[sId].startListening();
      }
      return aInstances[sId];
    },
    get : function(sId) {
      return aInstances[sId];
    }
  }
})();