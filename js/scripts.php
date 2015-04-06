<?php
/**
 * Project: Stormclient - Definition list of Javascript files loaded.
 * Copyright 2010,2011 Partstorm
 * Version: 1.0.0
 * $Revision: 1528 $
 * $Id: scripts.php 1528 2011-05-28 06:45:37Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/scripts.php $
 *
 * File: ./includes/pt/stormclient/js/1.0.0/scripts.php
 *
 * To provide the most flexibility in configuring Stormclient, this file contains
 * a list of javascript files required for the application and maintains the correct
 * file order. Remember to update the index id when adding files.
 *
 * Stormclient global software version is read from:
 * localhost/public_html/includes/var/config/products/stormclient/scConfig.php
 *
 * Format: index key => array(filename => charset)
 *
 * Notes:
 * 1. This file is not included in production tag.
 * 2. lang/en-US has been removed for now, this allows Partstorm to offer our main website
 *    content in different languages. This is not part of the Stormclient product offering.
 * 3. pt_vars.js was not needed, all Stormclient variables were moved to ptc_vars.js
 * 4. pta.js (ajax) removed until needed in the future.
 * 5. ptc or ptc_auto, not both. Contain event handler methods. Autodetect for the first tag.
 * 6. To debug Javascript on localhost, append ?bDebug=true which permits access
 *    to the individual source files. Tested in Firebug and IE Development Toolbar.
 */

$aFiles = array(

  10   => array('ptc_config_dev' => 'utf-8'),
  20   => array('pt'          => 'utf-8'),
  // 30   => array('pt_vars'     => 'utf-8'),
  // 40   => array('pta'         => 'utf-8'),
  50   => array('ptact'       => 'utf-8'),
  60   => array('pte'         => 'utf-8'),
  // 70   => array('ptc'         => 'utf-8'),  // comment out ptc or ptc_auto
  75   => array('ptc_auto'    => 'utf-8'),
  80   => array('ptc_vars'    => 'utf-8'),
  90   => array('ptc_actions' => 'utf-8'),
  95   => array('ptc_data'    => 'utf-8'),
  100  => array('ptc_init'    => 'utf-8'),
  110  => array('ptm'         => 'utf-8'),
  120  => array('ptmp'        => 'utf-8'),
  130  => array('ptp'         => 'utf-8'),
  // 140  => array('lang/en-US'  => 'utf-8')
  150  => array('ptsc'        => 'utf-8')

  );

?>