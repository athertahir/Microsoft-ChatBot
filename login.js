var builder = require('botbuilder');
var config_db = require('./config_db');
var config = config_db.config;
var count=0;

module.exports = [
    // USERNAME
    function (session) {
	session.send('Welcome to the PivBot!');
        builder.Prompts.text(session, 'Enter Username');
    },
    function (session, results, next) {
        session.dialogData.username = results.response;
		session.privateConversationData['username'] = results.response;
        //session.send('Username %s', session.dialogData.username);
        next();
    },
	 // PASSWORD
    function (session) {
        builder.Prompts.text(session, 'Enter Password');
    },
    function (session, results, next) {
        session.dialogData.password = results.response;
		session.privateConversationData['userpassword'] = results.response;
        //session.send('Password %s', session.dialogData.password);
        next();
    },
	function (session,next) 
   { 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
count=0;
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
            "select rolename from roles where Id=(select companyid from users where username='"+session.dialogData.username+"' and userpassword='"+session.dialogData.password+"')",
		
			function(err, rowCount, rows) 
                {
					count=rowCount;
					if(count>0)
					session.privateConversationData['login'] = true;
					console.log(count + ' rowes(s) returned');
					userlogin(session);
					session.endDialog();
                    console.log(count + ' row(s) returned');
                   // process.exit();
                }
            );
     request.on('row', function(columns) {
        columns.forEach(function(column) {	
			//console.log('column.count  '+request.count);
				
			//session.send('login2 is '+session.privateConversationData['login']);			
			if(!column.value.indexOf('accounts_receivable'))
			session.privateConversationData['accounts_receivable'] = true;
			if(!column.value.indexOf('customer_service'))
			session.privateConversationData['customer_service'] = true;
			if(!column.value.indexOf('hr'))
			session.privateConversationData['hr'] = true;
			if(!column.value.indexOf('marketing'))
			session.privateConversationData['marketing'] = true;
			if(!column.value.indexOf('operations'))
			session.privateConversationData['operations'] = true;
			if(!column.value.indexOf('sales'))
			session.privateConversationData['sales'] = true;
			if(!column.value.indexOf('service'))
			session.privateConversationData['service'] = true;
			//session.send(column.metadata.colName+' ---- '+column.value);
            console.log('columns  '  + columns.rowCount);
			i=i+1;

			//session.send('moved out of db1');
			
         });
	//if(i==count)
//	{
	//session.privateConversationData['login'] = true;
	//session.send('calling user login');
//	userlogin(session);
	//}
	//else
	//session.send('Not calling user login');
	//session.send(i+' -- '+count);
             });
	//session.send('moved out of db2');
    connection.execSql(request);
	//session.send('moved out of db3');
       }
   }
 );
   	
   }
]
function userlogin(session) {
	    //session.send('ab2 '+session.privateConversationData['login']);
		//session.privateConversationData['login'] = true;
		//session.send('ab2 '+session.privateConversationData['login']);
		if(session.privateConversationData['login'] == true)
		{
		session.send('Login Successful');
		session.send('Hi there. I m PivBot, an IT automation and Artificial Intelligence (AI) service provided by Catalyst Technology Group to help you perform a variety of IT tasks. Please choose an area to get started');	
		getMainMenuHeroCard(session);
		}
		else{
		session.send('Login failed');
		}
}
function createMainMenuHeroCard(session) {
	var but=[];
		if(session.privateConversationData['accounts_receivable'] == true)
		but.push( builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot1', 'Bills/Invoices'));
		if(session.privateConversationData['customer_service'] == true)
		but.push( builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot2', 'Customer Service'));
		if(session.privateConversationData['hr'] == true)
		but.push( builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot3', 'HR'));
		if(session.privateConversationData['marketing'] == true)
		but.push( builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot4', 'Marketing'));
		if(session.privateConversationData['operations'] == true)
		but.push(builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot5', 'Operations'));
		if(session.privateConversationData['sales'] == true)
		but.push(builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot6', 'Sales'));
		if(session.privateConversationData['service'] == true)
		but.push( builder.CardAction.postBack(session, 'Bot.Command.MainMenu.NodeBot7', 'Service'));		
	var card;
    card= new builder.HeroCard(session)
        .title('Select your choice')
		.buttons(but);
		return card;
}
function getMainMenuHeroCard(session) {
		var card = createMainMenuHeroCard(session);
        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
}