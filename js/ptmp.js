/**
 * Project: Stormclient
 * Copyright 2010 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1490 $
 * $Id: ptmp.js 1490 2011-05-12 10:17:42Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptmp.js $
 *
 * JS Objects: files.js
 *
 * point                 : pt.math.point           ptmp.js  (object)
 *
 * Notes:
 *
 * Credits:
 * 1. Kevin Linden, http://www.kevlindev.com
 *    We have adapted the methods from his Point object.
 * 2. http://www.switchonthecode.com/tutorials/javascript-draggable-elements
 *    We have added methods to support bounding and applying a position to an element.
 */

/* Define pt.math namespace */
if (!pt.math) pt.math = {};

/** point Class
 * @access public
 * @param nXCoord,nYCoord [number]
 * @return [object]
 * @link http://www.kevlindev.com
 * @desc Point objects are used in the pt.stormAction.dragObject.
 */
pt.math.point = function(nXCoord,nYCoord) {
  this.x = nXCoord;
  this.y = nYCoord;
};

pt.math.point.prototype = {
  /** add : function(oP)
   * @access public
   * @param oP [object]
   * @return [object]
   * @desc Add the oP point to this point, returning a new point object.
   */
  add : function(oP) {
    return new pt.math.point(this.x + oP.x,this.y + oP.y);
  },
  /** subtract : function(oP)
   * @access public
   * @param oP [object]
   * @return [object]
   * @desc Subtract the oP point from this point, returning a new point object.
   */
  subtract : function(oP) {
    return new pt.math.point(this.x - oP.x,this.y - oP.y);
  },
  /** lerp : function(oP,t)
   * @access public
   * @param oP,t [object,number]
   * @return [object]
   * @desc Create a new point, finding the linear interpolation between two points.
   */
  lerp : function(oP,t) {
    return new pt.math.point(this.x + (oP.x - this.x) * t, this.y + (oP.y - this.y) * t);
  },
  /** distance : function(oP)
   * @access public
   * @param oP [object]
   * @return [number]
   * @desc Calculate the hypontenuse between the two points.
   */
  distance : function(oP) {
    var d = Math.sqrt(Math.pow(this.x - oP.x,2) + Math.pow(this.y - oP.y,2));
    return Math.abs(d);
  },
  /** min : function(oP)
   * @access public
   * @param oP [object]
   * @return [object]
   * @desc Compare and return the x and y values which are smaller in magnitude.
   */
  min : function(oP) {
    return (oP == null)
      ? new pt.math.point(this.x,this.y)
      : new pt.math.point(Math.min(this.x,oP.x), Math.min(this.y,oP.y));
  },
  /** max : function(oP)
   * @access public
   * @param oP [object]
   * @return [object]
   * @desc Compare and return the x and y values which are greater in magnitude.
   */
  max : function(oP) {
    return (oP == null)
      ? new pt.math.point(this.x,this.y)
      : new pt.math.point(Math.max(this.x,oP.x),Math.max(this.y,oP.y));
  },
  /** check : function()
   * @access public
   * @return [object]
   * @desc Validate that the point object contains numbers. Set to zero otherwise.
   */
  check : function() {
    if (isNaN(this.x)) this.x = 0;
    if (isNaN(this.y)) this.y = 0;
  },
  /** bound : function(oLower,oUpper)
   * @access public
   * @param oLower,oUpper [object]
   * @return [object]
   * @link http://www.switchonthecode.com/tutorials/javascript-draggable-elements
   * @desc Compare the upper and lower bound points and return a new point modified to the
   * bounding points.
   */
  bound : function(oLower,oUpper) {
    var oNewPos = this.max(oLower);
    return oNewPos.min(oUpper);
  },
  /** apply : function(oElement)
   * @access public
   * @param oElement [object]
   * @return [void]
   * @desc Apply the current point coordinates to the oElement.
   */
  apply : function(oElement) {
    if (typeof(oElement) == 'string') oElement = pt.$id(oElement);
    oElement.style.left = this.x + 'px';
    oElement.style.top = this.y + 'px';
  }
};

/* pt.math.point public static methods
 *
 * These functions are not related to a particular instance of a single point, but are
 * related to the class as a whole and do not depend on data contained within the
 * instances.
 */

/* function point.absCursor(oEvent)
 * @access public static
 * @param [object] oEvent
 * @return [object]
 * @desc Return a point object with absolute coordinates for the current cursor position.
 * @todo absolute position may not return correct values in some user agents, offsetParent issues.
 */
pt.math.point.absCursor = function(oEvent) {
  oEvent = pt.stormEvent.getEvent(oEvent);

  if (!window.scrollX) {
    return new pt.math.point(
      oEvent.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
      oEvent.clientY + document.documentElement.scrollTop + document.body.scrollTop
    );
  }
  else {
    return new pt.math.point(
      oEvent.clientX + window.scrollX,
      oEvent.clientY + window.scrollY
    );
  }
};