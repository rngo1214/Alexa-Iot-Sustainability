function activatePump (intent, session, callback) {

    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";

    //Set the pump to 1 for activation on the device

    var payloadObj={ "state":
                          { "desired":
                                   {"pump":1}
                          }
                 };

    //Prepare the parameters of the update call
    var paramsUpdate = {
        "thingName" : config.IOT_THING_NAME,
        "payload" : JSON.stringify(payloadObj)
    };

    //Update Device Shadow
    iotData.updateThingShadow(paramsUpdate, function(err, data) {
      if (err){
        //Handle the error here
      }
      else {
        speechOutput = "The pump has been activated!";
        console.log(data);
        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
      }    
    });
}

/*
function readTemperatureInSession(intent, session, callback) {
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';
	var body = '';

	//Update 
	var httpPromise = new Promise( function(resolve,reject){
		http.get({
			host: '112.171.138.94',
			path: '/temp_humi.php',
			port: '1470'
		}, function(response) {
			// Continuously update stream with data
			response.on('data', function(d) {
				body += d;
			});
			response.on('end', function() {
				// Data reception is done, do whatever with it!
				console.log(body);
				resolve('Done Sending');
			});
		});
	});
	httpPromise.then(
		function(data) {
			var info = JSON.parse(body);
			console.log('Function called succesfully:', data);
			sessionAttributes = createTemperatureAttributes(info.temperature);
			speechOutput = "Temperature is " + info.temperature + " degree Celsius. Humidity is " + info.humidity + " percent";
			repromptText = "Temperature is " + info.temperature + " degree Celsius. Humidity is " + info.humidity + " percent";
			console.log(speechOutput);
			callback(sessionAttributes,buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
		},
		function(err) {
			console.log('An error occurred:', err);
		}
	);
}
*/