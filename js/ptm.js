/**
 * Project: Stormclient
 * Copyright 2010,2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1489 $
 * $Id: ptm.js 1489 2011-05-12 10:08:04Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptm.js $
 *
 * Objects: files.js
 *
 * stormMessage       : pt.stormMessage       ptm.js
 *
 * Notes:
 *
 */
/** stormMessage singleton
 * @access public
 * @desc The stormMessage object is the database store for errors which occur within
 * Partstorm software. Central storage is necessary to ensure it gets routed correctly.
 * These messages are not intended for visitors or end users. Developers can query this for errors.
 *
 * Notes:
 * 1. Private member variables:
 *     aStormMessage is the database for all stormMessages
 * 2. Formats for adding messages:
 *     pt.stormMessage.add(
 *       { object : 'pt.stormPopup', type : 'error', severity : 'high', args : arguments,
 *         msg : 'Shared layout type, declared as ' + sLayout + ' is not supported.'
 *       });
 * 3. All message objects automatically have an id attribute added which contains the
 *    current error number. This allows message objects to be handled then removed from
 *    the database.
 */
pt.stormMessage = (function() {
  var aStormMessage = [];  // private variable
  var nError = 0;
  return {
    add : function(oError) {
      oError.id = nError;
      aStormMessage[nError] = oError;
      nError++;
      if (pt.overrides.nVerboseErrors == 1) throw new Error(oError.msg);
    },

    remove : function(nId) {
      aStormMessage.splice(nId,1);
    },

    getAll : function() {
      return (nError >= 1) ? aStormMessage : null;
    }

  };

})();