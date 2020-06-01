"use strict";

const Client = require("./lib/Client");

function Erisly(token, options) {
    return new Client(token, options);
}

Erisly.Base = require("./lib/structures/Base");
Erisly.Bucket = require("./lib/util/Bucket");
Erisly.Call = require("./lib/structures/Call");
Erisly.CategoryChannel = require("./lib/structures/CategoryChannel");
Erisly.Channel = require("./lib/structures/Channel");
Erisly.Pagination = require("./lib/structures/Pagination");
Erisly.Client = Client;
Erisly.Collection = require("./lib/util/Collection");
Erisly.MessageCollector = require("./lib/structures/messageCollector")
Erisly.ReactionCollector = require("./lib/structures/reactionCollector")
Erisly.SuperEmbed = require("./lib/structures/SuperEmbed")
Erisly.Command = require("./lib/command/Command");
Erisly.CommandClient = require("./lib/command/CommandClient");
Erisly.Constants = require("./lib/Constants");
Erisly.DiscordHTTPError = require("./lib/errors/DiscordHTTPError");
Erisly.DiscordRESTError = require("./lib/errors/DiscordRESTError");
Erisly.ExtendedUser = require("./lib/structures/ExtendedUser");
Erisly.GroupChannel = require("./lib/structures/GroupChannel");
Erisly.Guild = require("./lib/structures/Guild");
Erisly.GuildChannel = require("./lib/structures/GuildChannel");
Erisly.GuildIntegration = require("./lib/structures/GuildIntegration");
Erisly.GuildPreview = require("./lib/structures/GuildPreview");
Erisly.Invite = require("./lib/structures/Invite");
Erisly.Member = require("./lib/structures/Member");
Erisly.Message = require("./lib/structures/Message");
Erisly.NewsChannel = require("./lib/structures/NewsChannel");
Erisly.Permission = require("./lib/structures/Permission");
Erisly.PermissionOverwrite = require("./lib/structures/PermissionOverwrite");
Erisly.PrivateChannel = require("./lib/structures/PrivateChannel");
Erisly.Relationship = require("./lib/structures/Relationship");
Erisly.RequestHandler = require("./lib/rest/RequestHandler");
Erisly.Role = require("./lib/structures/Role");
Erisly.SequentialBucket = require("./lib/util/SequentialBucket");
Erisly.Shard = require("./lib/gateway/Shard");
Erisly.SharedStream = require("./lib/voice/SharedStream");
Erisly.StoreChannel = require("./lib/structures/StoreChannel");
Erisly.TextChannel = require("./lib/structures/TextChannel");
Erisly.UnavailableGuild = require("./lib/structures/UnavailableGuild");
Erisly.User = require("./lib/structures/User");
Erisly.VERSION = require("./package.json").version;
Erisly.VoiceChannel = require("./lib/structures/VoiceChannel");
Erisly.VoiceConnection = require("./lib/voice/VoiceConnection");
Erisly.VoiceConnectionManager = require("./lib/voice/VoiceConnectionManager");
Erisly.VoiceState = require("./lib/structures/VoiceState");

module.exports = Erisly;
