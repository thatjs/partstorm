/**
 * Project: Stormclient
 * Copyright 2011 Partstorm.
 * License: eula.txt
 * Version: 1.0.0
 * $Revision: 1545 $
 * $Id: readme.txt 1545 2011-05-31 10:02:40Z $
 * $HeadURL: http://localhost/partstorm/trunk/stormclient/js/1.0.0/readme.txt $
 */

This file is not in the production tag.

Development of the trunk has been moved. All current and future development is
done in branches:

/pub3/www/sites/partstorm.net/public_html/includes/pt/stormclient/js/1.0.0/

svn:/partstorm/branches/stormclient/js/1.0.0/

which allows testing and development through localhost

- trunk contains ./js ./css directories which contain the latest software
- branches contain ./js/1.0.0/ ./css/1.0.0 versioned directories (checked out inside localhost)
- tags contain main version directory ./stormclient-1.0.0/, and subdirectories ./stormclient, ./docs, ./samples ...
    + root legal,license,readme,changlog files

tags structure is what the customer will receive, less demonstration files ./demo (svn externals)

- finished tags are checked out to localhost/tags/stormclient-1.0.0/ and tested locally
before uploading to production server.

ChangeLog:

Stormclient-1.0.0

- Autodetect object added to parse existing webpages and set event handlers on part numbers
  in an automatic system. Only requires that metadata attributes are added to the existing
  html structure to tell Stormclient which data items correspond to data within Stormclient.

- Autodetect handles adding extra data that can be displayed inside Stormclient. Current
  implementation requires additional html structures or linked/inline Javascript array using
  the stormdata variable. Html structures for tables and nested div tags are currently supported.

- The pt.stormClient object exists in two files. One with Autodetect and one without. Both are
  included in the production tag but only one version is used at a time. When not using Autodetect,
  the customer can override the pt.stormClient.setEventHandlers() method to setup events for
  their website and provide the stormdata variable containing the data for Stormclient.

- Added keyboard events using the left and right arrow keys to navigate forward and backwards
  though products. Closing Stormclient can be done with the ESC key.

- All Stormclient html build code exists inside pt.stormPopup object. This object should be
  extended when overriding.

- Separated the customer configuration data, by moving it to the ptc variable. Placed in front
  of the main Stormclient application code so that it can be easily edited.

- Setup the extra data display items (DOM actions to build the html elements) are now placed
  in the customer's configuration file, for improved flexibility.

- Added support for addToBasket and checkout buttons. Currently configurable for eCommerce backends
  that use GET http requests to add or update their shopping cart. Includes a demo mode for
  debugging the target href.

- Added a wrapper method for prices, to make sure they contain the currency symbol defined in
  the customer's configuration.

- Added metadata attributes to be added to data columns in the form of standalone html attributes
  following the html5 custom attribute format, or as class values which are supported in both html4/5.

- Fully tested on Firefox 3, IE7-8.
