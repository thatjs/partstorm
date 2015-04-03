/**
 * Project: Stormclient
 * Copyright 2011 Partstorm. All rights reserved.
 * License: eula.txt
 * Version: 0.1.0 (1.0.0)
 * $Revision: 1357 $
 * $Id: files.js 1357 2011-03-05 19:11:01Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/files.js $
 *
 * Each class contains a pointer to this file. This file maps Javascript objects,
 * variable names and filenames to provide a reference for locating a particular
 * object within Parstorm software.
 *
 * Partstorm Stormclient Application:
 *
 * pt                       : var pt                         pt.js  (namespace)
 * Interface                : pt.Interface                   pt.js
 * timer                    : pt.timer                       pt.js
 *
 * iAjax                    : pt.iAjax                       pta.js (declared interface)
 * ajaxHandler              : pt.ajaxHandler                 pta.js
 * ajaxQueuedHandler        : pt.ajaxQueuedHandler           pta.js
 * ajaxOfflineHandler       : pt.ajaxOfflineHandler          pta.js
 * ajaxManager              : pt.ajaxManager                 pta.js (factory)
 *
 * stormClient              : pt.stormClient                 ptc.js (object literal)
 * stormData                : pt.stormData                   ptc_data.js (dynamic generation)
 * stormState               : pt.stormState                  ptc_data.js
 *                          : pt.stormClient.init            ptc_init.js (onLoad event handler)
 *                          : pt.stormClient.{var}           ptc_vars.js (configuration)
 *
 * point                    : pt.math.point                  ptmp.js  (object) ok
 *
 * stormClient.actions      : pt.stormClient.actions         ptc_actions.js (public events)
 *
 * statusCursor             : pt.statusCursor                pts.js (object literal)
 * stormEvent               : pt.stormEvent                  pte.js (branched singleton)
 *
 *
 * ... not currently implemented ...
 * iClientAction            : pt.iClientAction               ptc_act.js (declared interface)
 * stormActionSvg           : pt.stormActionSvg              ptc_act.js
 * stormActionImage         : pt.stormActionImage            ptc_act.js
 *
 * stormAction               : pt.stormAction                ptact.js (namespace) ok
 *
 * i.dragCallback            : pt.i.dragCallback             ptact.js (interface)
 * stormAction.dragObject    : pt.stormAction.dragObject     ptact.js (class)
 * stormAction.dragManager   : pt.stormAction.dragManager    ptact.js (singleton) ok
 *
 * stormMessage             : pt.stormMessage                ptm.js (singleton)
 *
 * Notes:
 * 1. Development: Order of files is important. Server side php is responsible for organizing
 *    the file order, caching and minification.
 * 2. Production Tags:
 *     stormclient-1.0.0-min.js (top header comment, single line of compressed js.
 *     stormclient-1.0.0.js (top header comment, retain function comments)
 *       this may be a problem with the current formating of the development files.
 *       - it may be possible to remove a fixed number of lines, to remove the head
 *         comment in the development files (without globally removing all comments)
 *         or just the first comment. Experimentation is needed.
 * 3. This file is not included in production tags.
 *
 */