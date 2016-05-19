/*
  App ID for the skill. 
 */
var APP_ID = "amzn1.echo-sdk-ams.app.0ec449c7-0d05-40f3-81a8-9a1c8e925f45";

/*
  The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/*
  RetailSkill is a child of AlexaSkill
 */
var RetailSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
RetailSkill.prototype = Object.create(AlexaSkill.prototype);
RetailSkill.prototype.constructor = RetailSkill;

RetailSkill.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
    console.log("RetailSkill onSessionStarted requestId: " + sessionStartedRequest.requestId +
        ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

/*When a person says "Alexa, open Vanguard", the system is supposed to
 give an introduction to the app which includes some sample phrases so the user 
 doesn't have to guess which features the app offers
*/
RetailSkill.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
    console.log("RetailSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
	getWelcomeResponse(response);
};

/* onSessionEnded is where a developer can manually cleanup any session variables or save state 
 for the user. This method should be used for any "logging out" functionality if private data
 is ever incorporated 
*/
RetailSkill.prototype.eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
    console.log("RetailSkill onSessionEnded requestId: " + sessionEndedRequest.requestId +
        ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

/*
The intent handlers are called whenever an intent request is forwarded to the lambda function. 
These methods will all return a response with custom text and card attributes that will be rendered by the Echo
*/
RetailSkill.prototype.intentHandlers = {
    // register custom intent handlers
    "ContactIntent": function(intent, session, response) {
		//Standard to handle intents with methods named "handleIntentName"
		handleContactIntent(intent, session, response);
    },
	"GetStockQuote" : function(intent, session, response) {
		handleGetStockQuote(intent,session,response);
	},
	"AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },
    "AMAZON.HelpIntent": function(intent, session, response) {
        //this method is invoked anytime the user says something like "Help me" more info on build in intents can be found
        //at https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/implementing-the-built-in-intents
		var repromptText = "You can say things like " +
			"Get contact info, " +
			"Learn about Vanguard, " +
			"Get a stock quote, " +
			"or Exit";
        response.ask("What would you like to do?", repromptText);
    }
};

/*
This method just demonstrates how we could implement basic authentication by asking for a pin code. As a final implementation, 
you would probably want to use an identity management system. Amazon also provides this if wanted
*/
function handleContactIntent(intent, session, response) {
	//var sessionAttributes = {};
    var speechOutput = "You may reach Vanguard at 877-662-7447 between 8AM and 10PM";
    var cardTitle = "Contact Info";
    var cardContent = "Hours: 8AM to 10PM\nPhone Number: 877-662-7447";

    response.tellWithCard(speechOutput, cardTitle, cardContent);

}

function handleGetStockQuote(intent,session,response) {
	//var sessionAttributes = {};
    var speechOutput = "You would like a stock quote";
    response.tell(speechOutput);
}

function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var speechText = "Welcome to the Vanguard Retail Application.";
    var repromptText = "Please choose an action by saying, " +
        "Get contact info, " +
        "Learn about Vanguard, " +
        "Get a stock quote, " +
        "or Exit";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechOutput, repromptOutput);
}


// Create the handler that responds to the Alexa Request.
exports.handler = function(event, context) {
    // Create an instance of the RetailSkill skill.
    var skill = new RetailSkill();
    skill.execute(event, context);
};
