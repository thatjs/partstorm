/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1509 $
 * $Id: ptc_init.js 1509 2011-05-25 13:44:45Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_init.js $
 *
 * JS Objects: files.js
 *
 * Notes:
 */

/** function pt.stormClient.init : function()
 * @access public
 * @return [void]
 * @desc Called after page is loaded to set event handlers using pt.$addLoadEvent() method which
 * will not clobber, but chain together with other onload event handlers on the page.
 */
pt.stormClient.init = function() {
  pt.setVar('sc');
  pt.stormClient.bOnLoadFired = 'true';
  pt.stormClient.setEventHandlers();
};

pt.$addLoadEvent(pt.stormClient.init);