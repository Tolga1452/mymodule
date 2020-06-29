"use strict";

const Client = require("./lib/Client");

function Discord(token, options) {
    return new Client(token, options);
}

Discord.Base = require("./lib/structures/Base");
Discord.Bucket = require("./lib/util/Bucket");
Discord.Call = require("./lib/structures/Call");
Discord.CategoryChannel = require("./lib/structures/CategoryChannel");
Discord.Channel = require("./lib/structures/Channel");
Discord.Pagination = require("./lib/structures/Pagination");
Discord.Client = Client;
Discord.Collection = require("./lib/util/Collection");
Discord.MessageCollector = require("./lib/structures/messageCollector")
Discord.ReactionCollector = require("./lib/structures/reactionCollector")
Discord.SuperEmbed = require("./lib/structures/SuperEmbed")
Discord.Command = require("./lib/command/Command");
Discord.CommandClient = require("./lib/command/CommandClient");
Discord.Constants = require("./lib/Constants");
Discord.DiscordHTTPError = require("./lib/errors/DiscordHTTPError");
Discord.DiscordRESTError = require("./lib/errors/DiscordRESTError");
Discord.ExtendedUser = require("./lib/structures/ExtendedUser");
Discord.GroupChannel = require("./lib/structures/GroupChannel");
Discord.Guild = require("./lib/structures/Guild");
Discord.GuildChannel = require("./lib/structures/GuildChannel");
Discord.GuildIntegration = require("./lib/structures/GuildIntegration");
Discord.GuildPreview = require("./lib/structures/GuildPreview");
Discord.Invite = require("./lib/structures/Invite");
Discord.Member = require("./lib/structures/Member");
Discord.Message = require("./lib/structures/Message");
Discord.NewsChannel = require("./lib/structures/NewsChannel");
Discord.Permission = require("./lib/structures/Permission");
Discord.PermissionOverwrite = require("./lib/structures/PermissionOverwrite");
Discord.PrivateChannel = require("./lib/structures/PrivateChannel");
Discord.Relationship = require("./lib/structures/Relationship");
Discord.RequestHandler = require("./lib/rest/RequestHandler");
Discord.Role = require("./lib/structures/Role");
Discord.SequentialBucket = require("./lib/util/SequentialBucket");
Discord.Shard = require("./lib/gateway/Shard");
Discord.SharedStream = require("./lib/voice/SharedStream");
Discord.StoreChannel = require("./lib/structures/StoreChannel");
Discord.TextChannel = require("./lib/structures/TextChannel");
Discord.UnavailableGuild = require("./lib/structures/UnavailableGuild");
Discord.User = require("./lib/structures/User");
Discord.VERSION = require("./package.json").version;
Discord.VoiceChannel = require("./lib/structures/VoiceChannel");
Discord.VoiceConnection = require("./lib/voice/VoiceConnection");
Discord.VoiceConnectionManager = require("./lib/voice/VoiceConnectionManager");
Discord.VoiceState = require("./lib/structures/VoiceState");
Discord.Webhook = require("./lib/structures/Webhook")

module.exports = Discord;
