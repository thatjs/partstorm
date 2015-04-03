/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1519 $
 * $Id: ptc_vars.js 1519 2011-05-26 06:06:59Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_vars.js $
 *
 * Notes:
 * 1. This file contains stormclient's private core javascript variables which may hook into the
 *    html structure.
 */

if (!pt.overrides) pt.overrides = {};
pt.overrides.nVerboseErrors = ptc.verboseErrors;  // developers: change in ptc_config.js

pt.stormClient.sPopupType = 'single';  // stormclient default type
pt.stormClient.sPtId = 'data-ptid';    // stormclient autodetect metadata attribute name for html5
pt.stormClient.bSkipTitleRow = true;   // stormclient autodetect skip the row containing titles
pt.stormClient.pStorm = new RegExp("storm\\w+");        // stormclient regexp for storm* attributes
pt.stormClient.pSpace = new RegExp("^\\s+|\\s+$","g");  // stormclient regexp for empty space front or back
