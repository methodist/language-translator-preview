/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

require('dotenv').load({silent: true});
var express  = require('express'),
  app        = express(),
  extend     = require('extend'),
  LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');



// Bootstrap application settings
require('./config/express')(app);


// If unspecified here, the LANGUAGE_TRANSLATOR_USERNAME and LANGUAGE_TRANSLATOR_PASSWORD environment properties will be checked
// After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property



var translator = new LanguageTranslatorV2({
  url: 'https://gateway.watsonplatform.net/language-translator/api'
});

// render index page
app.get('/', function(req, res) {
  res.render('index', {
    bluemixAnalytics: !!process.env.BLUEMIX_ANALYTICS,
  });
});

app.get('/api/models', function(req, res, next) {
  console.log('/v2/models');
  translator.getModels({}, function(err, models) {
    if (err)
      return next(err);
    else
      res.json(models);
  });
});

app.post('/api/identify', function(req, res, next) {
  console.log('/v2/identify');
  var params = {
    text: req.body.textData,
    'X-WDC-PL-OPT-OUT': req.header('X-WDC-PL-OPT-OUT')
  };
  translator.identify(params, function(err, models) {
    if (err)
      return next(err);
    else
      res.json(models);
  });
});

app.get('/api/identifiable_languages', function(req, res, next) {
  console.log('/v2/identifiable_languages');
  translator.getIdentifiableLanguages({}, function(err, models) {
    if (err)
      return next(err);
    else
      res.json(models);
  });
});

app.post('/api/translate',  function(req, res, next) {

    const bufferFrom = require('buffer-from');
    const request = require('request');

    var username;
    var password;

    // set username and password on local env
    if (process.env['LANGUAGE_TRANSLATOR_USERNAME']) {
        username = process.env['LANGUAGE_TRANSLATOR_USERNAME']
    }
    if (process.env['LANGUAGE_TRANSLATOR_PASSWORD']){
        password = process.env['LANGUAGE_TRANSLATOR_PASSWORD'];
    }
    
    // set username and password on ibm cloud env
    if (process.env.VCAP_SERVICES)
    {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var vcap = env.language_translator;
        username = vcap[0].credentials.username;
        password = vcap[0].credentials.password;
     }

    console.log( 'username: ' + username);
    console.log( 'password: ' + password);

    var headers = {
        Authorization: 'Basic ' + bufferFrom(username + ':' + password).toString('base64'),
        'Content-Type':'application/json',
        'X-Watson-Technology-Preview':'2017-07-01'
    }

    var options = {
        url: 'https://gateway.watsonplatform.net/language-translator/api/v2/translate',
        method: 'POST',
        headers: headers,
        json: true,
        body: {
            text: req.body.text,
            model_id: req.body.model_id
        }
    }

    console.log(options);

    console.log('/v2/translate');
    request(options, function (error, response, body) {
        if ( error ) {
            console.log("error.");
            console.log(error);
            return next(error);
        } else {
            console.log("normal end.");
            console.log(body);
            res.json(body);
        }
    })
})

// express error handler
require('./config/error-handler')(app);

var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
