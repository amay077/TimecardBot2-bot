import { ChatConnector, MemoryBotStorage, UniversalBot, Session } from 'botbuilder';
import { BotServiceConnector, AzureTableClient, AzureBotStorage } from 'botbuilder-azure';
import * as path from 'path';

const useEmulator = (process.env.NODE_ENV == 'development');

const connector = useEmulator ? new ChatConnector() : new BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

const tableName = 'botdata';
const azureTableClient = new AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
const storage = useEmulator ? new MemoryBotStorage() : new AzureBotStorage({ gzipData: false }, azureTableClient);

const bot = new UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));
// bot.set('storage', storage);

bot.dialog('/', function (session: Session) {
    session.send('あなたは ' + session.message.text + 'と言いました。');
});

if (useEmulator) {
    const restify = require('restify');
    const server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = connector.listen();
}
