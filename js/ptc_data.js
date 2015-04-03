/**
 * Project: Stormclient
 * Copyright 2011 Partstorm
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1542 $
 * $Id: ptc_data.js 1542 2011-05-31 07:11:31Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/ptc_data.js $
 *
 * JS Objects: files.js
 *
 * Notes:
 *
 * 1. Stormclient needs an object structure to correctly load data based on part number
 *    or part key alone. To make this flexible, there has to be a matched pair of
 *    pt.stormData.client (data) to data display items (structure).
 *
 * 2. The autodetect version parses the html and obtains the significant columns as set on the
 *    page. This is set during parsing, and we update based on ids set for the different
 *    display items. We may change this later, if looping produces poor reaction times, changing
 *    to a direct object based array for direct access by part number.
 *
 * 3. Developers can dynamically generate the pt.stormData.client Javascript giving them more
 *    flexiblity to change the structure dynamically.
 */
// populated in ptc.js, ptc_auto.js
var stormdata;
pt.stormData = {};
pt.stormData.client = [];

