var restify = require('restify');
var builder = require('botbuilder');
var dateFormat = require('dateformat');
var config_db = require('./config_db');
var config = config_db.config;
var but=[];
module.exports = [
    // Machine Name
    function (session) {
        builder.Prompts.text(session, 'Which logged in User?');
    },
    function (session, results, next) {
		session.privateConversationData['machineuser'] = results.response;
       // session.send('Username %s', session.privateConversationData['machineuser']);
        next();
    },
	 // DateTime
    function (session) {
        builder.Prompts.text(session, 'Enter DateTime');
    },
    function (session, results, next) {
var LUISURL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c13bfbfd-f841-407f-90c8-b8e6da0bcd94?subscription-key=2d757ec7cddd4c70b55e5422727d6f50&verbose=true&timezoneOffset=0&q=';
builder.LuisRecognizer.recognize(results.response, LUISURL, function (err, intents, entities) {
     if (entities) {
        var datetime = builder.EntityRecognizer.findEntity(entities, 'builtin.datetimeV2.datetime');
			if(datetime)
			{
			session.privateConversationData['datetime'] =dateFormat(datetime.resolution.values[0]['value'],"yyyy-mm-dd'T'HH:MM:ss'Z'");
			//session.send('Date is ' +session.privateConversationData['datetime']);
			next();
	//session.send("DateTime: %s ",dateFormat(datetime.resolution.values[0]['value']),"yyyy-MM-dd'T'HH:mm:ss'Z'");
	//session.privateConversationData['datetime'] =datetime.resolution.values[0]['value'];
	//session.send("DateTime: %s ",datetime.resolution.values[0]['value']);
			}
            else
			{
				session.send('Error! \n\n 1) DateTime not found\n\n');
				session.endDialog();
			}
     }
});	
        //session.dialogData.password = results.response;
		
       
    },
	function (session,next) 
   { 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var i=0;
// Create connection to database

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
          console.log('Reading rows from the Table...');
      // Read all rows from table
     request = new Request(
	 "select companyId,machineId,machineName,userName from machineid where LOWER(userName) LIKE LOWER('%"+session.privateConversationData['machineuser']+
"%') and companyId IN(select companyId from companyPermissions where userId=(select companyId from users where username='"+
session.privateConversationData['username']+"' and userpassword='"+session.privateConversationData['userpassword']+"'))",
		
			function(err, rowCount, rows) 
                {
					console.log( "select companyId,machineId,machineName,userName from machineid where LOWER(userName) LIKE LOWER('%"+session.privateConversationData['machineuser']+
"%') and companyId IN(select companyId from companyPermissions where userId=(select companyId from users where username='"+
session.privateConversationData['username']+"' and userpassword='"+session.privateConversationData['userpassword']+"'))");
					//session.send('Wait Over');
				if(rowCount>0){
						getUserNameCard(session);
						but=[];
					}
					else
						session.send('Error! \n\n 1) UserName doesn\'t exist \n\n 2) You are not authorized  \n\n \t\t Available options are : \n\n \t\t Run slow pc optimization script on \'MACHINE_NAME\' now \n\n \t\t Run slow pc optimization script on \'MACHINE_NAME\' \'ENTER_TIME_HERE\' ' );
					session.endDialog();
                    console.log(rowCount + ' row(s) returned');
                }
            );
     request.on('row', function(columns) {
        columns.forEach(function(column) {	
			//session.privateConversationData['machineId']=column.value;
			session.privateConversationData['machineIdfound']=true;
			if(!column.metadata.colName.indexOf('machineId'))
			session.privateConversationData['machineId']=column.value;
			else if(!column.metadata.colName.indexOf('companyId'))
			session.privateConversationData['companyId']=column.value;
			else if(!column.metadata.colName.indexOf('machineName'))
			session.privateConversationData['testmachineName']=column.value;
			else
			but.push( builder.CardAction.postBack(session, 'Bot.Command.MainMenu.lastloggedinuser.NodeBot'+session.privateConversationData['testmachineName'], column.value+' ('+session.privateConversationData['testmachineName']+')'));		
			//console.log(column.metadata.colName+' ---- '+column.value);
            //console.log('columns  '  + columns.rowCount);
			
         });
             });
    connection.execSql(request);
	//session.send('moved out of db3');
       }
   }
 );
   	
   }
]

function createUserNameCard(session) {		
	var card;
    card= new builder.HeroCard(session)
        .title('Select your choice')
		.buttons(but);
		return card;
}
function getUserNameCard(session) {
		var card = createUserNameCard(session);
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
}