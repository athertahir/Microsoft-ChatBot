var builder = require('botbuilder');
var config_db = require('./config_db');
var config = config_db.config;
module.exports = [
	function (session) 
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
          console.log(err);
       }
    else
       {
          console.log('Reading rows from the Table...');

       // Read all rows from table
     request = new Request(
	 "select companyId,machineId from machineid where machineName='"+session.privateConversationData['machineName']+
"' and companyId IN(select companyId from companyPermissions where userId=(select companyId from users where username='"+
session.privateConversationData['username']+"' and userpassword='"+session.privateConversationData['userpassword']+"'))",
		
			function(err, rowCount, rows) 
                {
					console.log("select machineId from machineid where machineName='"+session.privateConversationData['machineName']+"'");
					//session.send('Wait Over');
					if(rowCount>0){
						getsetting(session);
					}
					else
						session.send('Error! \n\n 1) Machinename doesn\'t exist \n\n 2) You are not authorized  \n\n \t\t Available options are : \n\n \t\t Run slow pc optimization script on \'MACHINE_NAME\' now \n\n \t\t Run slow pc optimization script on \'MACHINE_NAME\' \'ENTER_TIME_HERE\' ' );
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
			else
			session.privateConversationData['companyId']=column.value;
			//session.send(column.metadata.colName+' ---- '+column.value);
            console.log('columns  '  + columns.rowCount);
			
         });
             });
    connection.execSql(request);
       }
   }
 );
   	
   }
];
function showSlowPcConfirmationCard(session) {
        var card= new builder.HeroCard(session)
		.title('Confirm!')
        .subtitle('"Please confirm you want to run Slow PC Script, '+session.privateConversationData['agentProcId'] +' , on machine with ID='+session.privateConversationData['machineId']+' at '+session.privateConversationData['datetime'])
		.buttons([
            builder.CardAction.postBack(session, 'Bot.Command.SubMenu.Service.SlowPC.NodeBot1', 'Yes'),
			builder.CardAction.postBack(session, 'Bot.Command.SubMenu.Service.SlowPC.NodeBot2', 'No')
        ]);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
}

function getsetting(session) 
   { 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err);
       }
    else
       {
          console.log('Reading rows from the Table...');

       // Read all rows from table
     request = new Request(
	"select kaseyaHostApi from setting where companyId='"+session.privateConversationData['companyId']+"'",
		
			function(err, rowCount, rows) 
                {
					console.log("select kaseyaHostApi from setting where companyId='"+session.privateConversationData['companyId']+"'");
					//session.send('Wait Over');
					if(rowCount>0)
						{
							getagentproduct(session) ;
						}
					else
						session.send('kaseyaHostApi Not Found');
					//session.endDialog();
                    console.log(rowCount + ' row(s) returned');
                }
            );
     request.on('row', function(columns) {
        columns.forEach(function(column) {	
			//session.privateConversationData['machineId']=column.value;
			session.privateConversationData['kaseyaHostApi']=column.value;
			console.log(column.metadata.colName+' ---- '+column.value);
            //console.log('columns  '  + columns.rowCount);
			
         });
             });
    connection.execSql(request);
       }
   }
 );
   	
   }
//////////////////
function getagentproduct(session) 
   { 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err);
       }
    else
       {
          console.log('Reading rows from the Table...');
       // Read all rows from table
     request = new Request(
	"SELECT AGENTPROCID FROM agentProc where  AGENTPROCNAME='"+session.privateConversationData['agentProcName']+"'",
		
			function(err, rowCount, rows) 
                {
					//console.log("select kaseyaHostApi from setting where companyId='"+session.privateConversationData['companyId']+"'");
					//session.send('Wait Over');
					if(rowCount>0)
						{
							showSlowPcConfirmationCard(session);
						}
					else
						session.send('AGENTPROCID Not Found');
					//session.endDialog();
                    console.log(rowCount + ' row(s) returned');
                }
            );
     request.on('row', function(columns) {
        columns.forEach(function(column) {	
			//session.privateConversationData['machineId']=column.value;
			session.privateConversationData['agentProcId']=column.value;
			console.log(column.metadata.colName+' ---- '+column.value);
            //console.log('columns  '  + columns.rowCount);
			
         });
             });
    connection.execSql(request);
       }
   }
 );
   	
   }



