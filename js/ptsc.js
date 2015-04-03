/**
 * Project: Stormclient
 * Copyright 2010,2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1500 $
 * $Id: ptsc.js 1500 2011-05-17 16:24:10Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptsc.js $
 *
 * JS Objects: ./files.js
 *
 * statusCursor         : pt.statusCursor          ptsc.js (object)
 *
 * Notes:
 * 1. As more cursor changes are needed, it was time to consolidate all of the event
 *    handlers into one object.
 */
pt.statusCursor = { // object literal

  crosshair : function(oEvent) {
    pt.statusCursor.changeCursor(oEvent,'crosshair');
  },
  arrow : function(oEvent) {
    pt.statusCursor.changeCursor(oEvent,'default');
  },
  link : function(oEvent) {
    pt.statusCursor.changeCursor(oEvent,'pointer');
  },
  move : function(oEvent) {
    pt.statusCursor.changeCursor(oEvent,'move');
  },
  wait : function(oEvent) {
    pt.statusCursor.changeCursor(oEvent,'wait');
  },

  /** function changeCursor(oEvent,sCursor)
   * @access protected
   * @param oEvent [object]
   * @param sCursor [string]
   * @return [void]
   * @desc Change the cursor image. Methods above are normally called during assignment of
   * event handlers when a cursor should change over elements, like hyperlinks.
   * Usage:
   *   pt.$addEvent(oTarget,'mouseover',pt.statusCursor.link);  // pointer
   *   pt.$addEvent(oTarget,'mouseout',pt.statusCursor.arrow);  // default
   */
  changeCursor : function(oEvent,sCursor) {
    pt.stormEvent.getTarget(oEvent).style.cursor = sCursor;
  }
};