"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_azure_1 = require("botbuilder-azure");
const path = __importStar(require("path"));
const useEmulator = (process.env.NODE_ENV == 'development');
const connector = useEmulator ? new botbuilder_1.ChatConnector() : new botbuilder_azure_1.BotServiceConnector({
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
const azureTableClient = new botbuilder_azure_1.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
const storage = useEmulator ? new botbuilder_1.MemoryBotStorage() : new botbuilder_azure_1.AzureBotStorage({ gzipData: false }, azureTableClient);
const bot = new botbuilder_1.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));
// bot.set('storage', storage);
bot.dialog('/', function (session) {
    session.send('あなたは ' + session.message.text + 'と言いました。');
});
if (useEmulator) {
    const restify = require('restify');
    const server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
}
else {
    module.exports = connector.listen();
}
//# sourceMappingURL=index.js.map