const ReactionCollector = require("./reactionCollector");

function Paginate(client, message, pages, options = { 
    time: 1000 * 60 * 3, 
    onEnd: "removeAll" 
}, emojis = {
    backward: "⬅️",
    stop: "⏹️",
    forward: "➡️"
}) {

    this.client = client;
    this.message = message;
    this.pages = pages;
    this.options = options;
    this.emojis = emojis;

    if (!this.client) throw new Error("Specify the client to be processed on.", "DeficiencyError");
    if (!this.message) throw new Error("Specify the message to be processed on.", "DeficiencyError");
    if (!this.pages) throw new Error("Specify pages to be shown", "DeficiencyError");
    if (!this.options.time) throw new Error("Specify a reaction time.", "TimeError");
    if (
        !this.emojis.backward ||
        !this.emojis.stop || 
        !this.emojis.forward
    ) throw new Error("Specify emojis to skip the page, return to previous page and stop the process.", "EmojiError");

    this.addPage = function(page) {
        if (!page) throw new Error("Specify the page to be added", "DeficiencyError");
        try {
            if (Array.isArray(page)) {
                this.pages = this.pages.concat(page);
            } else {
                this.pages.push(page);
            }
            return { pages: this.pages };
        } catch(err) {
            throw new Error(err, "UnknownError");
        }
    }

    this.editEmoji = function(name, value) {
        if (!name) throw new Error("Specify the emoji name to be edited", "DeficiencyError");
        if (!value) throw new Error("Specify an emoji.", "DeficiencyError");
        switch (name) {
            case "backward":
                this.emojis[name] = value;
                break;
            case "stop":
                this.emojis[name] = value;
                break;
            case "forward":
                this.emojis[name] = value;
                break;
            default:
                throw new Error("Specify a valid emoji name to be edited.", "DeficiencyError");
        }
    }

    this.setup = async function() {
        let page = 1;
        let msg = await this.client.createMessage(this.message.channel.id, this.pages[page - 1]);

        await msg.addReaction(this.emojis.backward).catch((err) => {
            throw new Error("Specify a valid backward emoji", "EmojiError");
        });
        await msg.addReaction(this.emojis.stop).catch((err) => {
            throw new Error("Specify a valid stop emoji", "EmojiError");
        });
        await msg.addReaction(this.emojis.forward).catch((err) => {
            throw new Error("Specify a valid forward emoji", "EmojiError");
        });

        let backwardFilter = (message, emoji, userID) => emoji.name === this.emojis.backward && userID === this.message.author.id;
        let stopFilter = (message, emoji, userID) => emoji.name === this.emojis.stop && userID === this.message.author.id;
        let forwardFilter = (message, emoji, userID) => emoji.name === this.emojis.forward && userID === this.message.author.id;

        let backward = new ReactionCollector(this.client, msg, (backwardFilter), {
            time: this.options.time
        });

        let stop =  new ReactionCollector(this.client, msg, (stopFilter), {
            time: this.options.time
        });

        let forward = new ReactionCollector(this.client, msg, (forwardFilter), {
            time: this.options.time
        });

        backward.on("collect", async (message, emoji, userID) => {
            await msg.removeReaction(emoji.name, userID);

            if (page === 1) return;
            page--;
            
            await msg.edit(this.pages[page - 1]);
        });

        stop.on("collect", async (message, emoji, userID) => {

            if (this.options.onEnd == "remove") {
                await msg.removeReaction(emoji.name, userID);
            } else if (this.options.onEnd == "removeAll") {
                await msg.removeReactions();
            } else if (this.options.onEnd == "delete") {
                await msg.delete();
            }

            backward.stop("ENDED");
            forward.stop("ENDED");
            stop.stop("ENDED");
        });

        forward.on("collect", async (message, emoji, userID) => {
            await msg.removeReaction(emoji.name, userID);

            if (page === this.pages.length) return;
            page++;
                await msg.edit(this.pages[page - 1]);

        });

        backward.on("end", (collected, reason) => {
            if (reason == "time") throw new Error("Specify a valid time", "TimeError");
            if (reason != "ENDED") throw new Error(reason, "UnknownError");
        });

        stop.on("end", (collected, reason) => {
            if (reason == "time") throw new Error("Specify a valid time", "TimeError");
            if (reason != "ENDED") throw new Error(reason, "UnknownError");
        });

        forward.on("end", (collected, reason) => {
            if (reason == "time") throw new Error("Specify a valid time", "TimeError");
            if (reason != "ENDED") throw new Error(reason, "UnknownError");
        });

        return {
            backwardCollector: backward,
            stopCollector: stop,
            forwardCollector: forward
        };
    }



}

module.exports = Paginate;