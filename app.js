var restify = require('restify');
var builder = require('botbuilder');
var opn = require('opn');
var selectedbutton='';
var login='login';
var config_db = require('./config_db');
var config = config_db.config;
var userStore = [];
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 81 || 80, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '97f026c9-5f05-4ab0-8e75-d893874ac009',
    appPassword: 'tbinuAOGTJL8#:*bkI7469]'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	console.log(session.message.address);
	session.send(session.message.address);
    var newAddresses = userStore;
    newAddresses.forEach(function (address) {
    console.log('Sending Message to Address: ', address);
    // new conversation address, copy without conversationId
    var newConversationAddress = Object.assign({}, address);
        
		bot.send(new builder.Message()
                    .text(session.message.text)
                    .address(address));
		//bot.send('aam swe');  

    });


});
bot.on('conversationUpdate', function (message) {
	session.send('here');
	console.log('Address : ');
	console.log(message.address);
	console.log('Member Added : ');
	console.log(message.membersAdded);
	var address = message.address;
	//delete address.conversation;
	var exist=false;
	userStore.forEach(function(value){
		if(value.serviceUrl==address.serviceUrl)
		exist=true;
	});
	if(!exist)
	userStore.push(address);
/*
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
			console.log(identity);
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
*/
});
