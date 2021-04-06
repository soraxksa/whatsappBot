
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

var fs = require('fs');


const {PythonShell} = require('python-shell');
const {spawn} = require('child_process');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const client = new Client();
const utf8 = require('utf8');
var XO   = require('tictactoejs');
const sagiri = require('sagiri');
const sauceClinet = sagiri("96a418eb1f0d7581fad16d30e0dbf1dbbdf4d3bd");

client.on('qr', (qr) => {
	qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

/*
client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});
*/

client.on('message', async msg =>{
	console.log("author:" + msg.author);
	console.log(msg.body);
	
	if(msg.body.startsWith("#"))
		options(msg);

});


client.on('message_create', async msg => {
	if (msg.fromMe || msg.author == "966554107812@c.us" || msg.author == "966507075505@c.us" || msg.author == "966552621511@c.us" ) {
		if(msg.body.startsWith("#python"))
		{
			var command_data = msg.body.slice(8, msg.body.length);
			command_data = command_data.split('"').join('"');
			command_data = command_data.replace(/\(/g, "(");
			command_data = command_data.replace(/\)/g, ")");

			PythonShell.runString(command_data, null, function (err, stdio) {
				if(err){
					console.log("error PythonShell");
					console.log(err);
					return;
				}
				console.log("good");
				console.log('%j', stdio);
				console.log("good2");
				console.log(typeof stdio);
				if(stdio)
				{
					console.log(stdio.length);
					console.log("good3");
					var message_to_send = "";
					for(var i = 0; i < stdio.length-1; i++)
					{
						if(Object.prototype.toString.call(stdio[i]) === "[object String]")
						{
							console.log("yes string");
							console.log(stdio[i]);
							message_to_send += stdio[i] + '\n';
						}
					}

					message_to_send += stdio[stdio.length-1];
					//if(message_to_send.length < 360)
						msg.reply(message_to_send);
				}
			});




		}
		else if(msg.body.startsWith("#s")){
			console.log("#s started");
			if(msg.hasMedia)
			{
				let chat = await msg.getChat();
				console.log("downloading media..");
				const attachmentData = await msg.downloadMedia();
				console.log("donwloading finished");
				console.log(`MimeType: ${attachmentData.mimetype}`);
				chat.sendMessage(attachmentData, { sendMediaAsSticker: true });
			}if(msg.hasQuotedMsg)
			{
				let chat = await msg.getChat();
				console.log("downloading quoted msg...");
				const quotedMsg = await msg.getQuotedMessage();
				const media111  = await quotedMsg.downloadMedia();
				//console.log("type:");
				//console.log(media111.data);
				fs.writeFile("test.jpg", new Buffer(media111.data, "base64"), function(err) {});
				console.log("downloading quoted msg finished.");
				//console.log(`MimeType: ${media111.mimetype}`);
				chat.sendMessage(media111, { sendMediaAsSticker: true });
			}
		}else if(msg.body.startsWith("#cmd")) {
			var command = msg.body.split('\n');
			console.log("#cmd\n");
			var val =  eval(command[1]);
			console.log(val);
			msg.reply(val);
		}else(msg.body.startsWith("#"))
			options(msg);
	}

	if(msg.body.startsWith("#xo"))
	{
		xo_game(msg);
	}
	 if(msg.body.startsWith("#sauce")){
		let chat = await msg.getChat();
		console.log("downloading quoted msg for sauce...");
		const quotedMsg = await msg.getQuotedMessage();
		const media111  = await quotedMsg.downloadMedia();
		fs.writeFile("test.jpg", new Buffer(media111.data, "base64"), function(err) {});
		console.log("downloading quoted msg finished.");
		const sauce = await sauceClinet("test.jpg");
		var replyString = "links:\n";
		for(var i = 0; i < sauce.length; i++)
		{
			replyString += sauce[i].url + " similarity:" + sauce[i].similarity + "\n";
		}
		console.log("the sauce:");
		console.log(sauce);
		console.log("end.");
		console.log(replyString);

		chat.sendMessage(replyString);
	}      

});

async function options( msg)
{
 
	if(msg.body.startsWith("#info"))
	{
		let chat = await msg.getChat();
		
			msg.reply(`
				*Group Details*
				Name: ${chat.name}
				Description: ${chat.description}
				Created At: ${chat.createdAt.toString()}
				Created By: ${chat.owner.user}
				Participant count: ${chat.participants.length}
			    `);

		
	}
	if(msg.body.startsWith("#rand"))
	{
		rand_msg(msg);
	}
}

function rand_msg(msg)
{        

	var lines = msg.body.split('\n');
	for(var i = 1; i < lines.length; i++)
	{
	    lines[i] = lines[i].trim().toLowerCase();
	}
	var index = getRandomIntInclusive(1, lines.length-1);
	if(lines[index] && !lines[index].startsWith("#python") && lines[index].length < 360)
		msg.reply(lines[index]); 
}


let games = [];

async function xo_game( msg)
{
	var lines = msg.body.split('\n');
	var first_line = lines[0].split(' ');
	console.log("lines[0] = " + lines[0]);
	if(first_line[1] == "1" || first_line[1] == "2" || first_line[1] == "3" )
	{
		if(msg.fromMe)
		{
			num1 = msg.from.split('@')[0].trim();
		}else{
			num1 = msg.author.split('@')[0].trim();
		}
		x = parseInt(first_line[1]);
		y = parseInt(first_line[2]);
		console.log("its move command, num1 = " + num1);
		console.log("x = " + x);
		console.log("y = " + y);

		var found = false;
		var i;
		for(i = 0; i < games.length; i++)
		{
			if(games[i][0] == num1 || games[i][1] == num1)
			{
				found = true;
				break;
			}
		}
		if(found)
		{
			console.log("game found!");
			var the_game = games[i][2];
			var player_turn = the_game.turn();
			var num1_turn;
			if(num1 == games[i][0])
				num1_turn = 'X';
			else
				num1_turn = 'O';

			if(num1_turn == player_turn)
			{
				console.log("num1_turn == player_turn");
				if(the_game.move(x, y))
				{
					console.log("the_game.move("+x+", "+y+")");
					let chat = await msg.getChat();
					chat.sendMessage( the_game.turn() + " turn\n" + the_game.ascii());
				}else{
					console.log("not vaild move");
				}
			}else{
				console.log('not player turn');
			}

			if(the_game.gameOver() || the_game.isDraw())
			{
				console.log("game ended.");
				games.pop(i);
				chat.sendMessage(the_game.status() + " won.");
			}


		}else{
			console.log("game not found with num1 = " + num1);
		}
	}else{

		if(msg.fromMe)
			num1 = msg.from.split('@')[0].trim();
		else
			num1 = msg.author.split('@')[0].trim();
		num2 = first_line[1].substring(1).trim();
		console.log("num1 = " + num1);
		console.log("num2 = " + num2);

		var found = false;
		var i;
		for(i = 0; i < games.length; i++)
		{
			if(games[i][0] == num1 || games[i][1] == num1)
			{
				found = true;
				break;
			}
		}
		if(found)
		{
			console.log("found game, deleting it.");
			games.pop(i);
		}else{
			var new_game =  new XO.TicTacToe();
			games.push([num1, num2, new_game]);
			console.log(new_game.ascii());
			var board_string = new_game.ascii();
			let chat = await msg.getChat();
			chat.sendMessage("X turn\n" + board_string);

		}
	}
}

client.initialize();
