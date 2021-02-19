
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
	if (msg.fromMe || msg.author == "966554107812@c.us" || msg.author == "966507075505@c.us" || msg.author == "966536960975@c.us" || msg.author == "966552621511@c.us" ) {
		if(msg.body.startsWith("#python"))
		{
			var command_data = msg.body.slice(8, msg.body.length);
			command_data = command_data.split('"').join('"');
			command_data = command_data.replace(/\(/g, "(");
			command_data = command_data.replace(/\)/g, ")");
			fs.writeFile('command.py', command_data, function (err) {
				if (err) throw err;
				console.log('my command Saved!');
			});

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
					if(message_to_send.length < 360)
						msg.reply(message_to_send);
				}
			});




		}else if(msg.body.startsWith("#s")){
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
	if(msg.body.startsWith("#s"))
	{
		
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


client.initialize();
