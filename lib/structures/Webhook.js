const {sendWebhook, sendFile} = require('./HookMain')
const SuperEmbed = require('./SuperEmbed');

module.exports = class Webhook {
    constructor(options){
        this.payload = {};

        if (typeof options == 'string'){
            this.hookURL = options;
            this.throwErrors = true;
            this.retryOnLimit = true;
        }
        else {
            this.hookURL = options.url;
            this.throwErrors = options.throwErrors == undefined ? true : options.throwErrors;
            this.retryOnLimit = options.retryOnLimit == undefined ? true : options.retryOnLimit;
        };
    };

    setUsername(username){
        this.payload.username = username;
    }

    setAvatar(avatarURL){
        this.payload.avatar_url = avatarURL;
    }

    async sendFile(filePath){
        try {
            const res = await sendFile(this.hookURL, filePath);

            if (res.statusCode != 200){
                throw new Error(`Error sending webhook: ${res.statusCode} status code. Response: ${await res.text()}`);
            };
        }
        catch(err){
            if (this.throwErrors) throw new Error(err.message);
        };
    }

    async send(payload){
        let endPayload = {
            ...this.payload
        };

        if (typeof payload === 'string'){
            endPayload.content = payload;
        }
        else {
            endPayload = {
                ...endPayload,
                ...payload.toJSON()
            };
        };

        try {
            const res = await sendWebhook(this.hookURL, endPayload);

            if (res.status == 429 && this.retryOnLimit){
                const body = await res.json();
                const waitUntil = body["retry_after"];

                setTimeout(() => sendWebhook(this.hookURL, endPayload), waitUntil);
            }
            else if (res.status != 204){
                throw new Error(`Error sending webhook: ${res.status} status code. Response: ${await res.text()}`);
            };
        }
        catch(err){
            if (this.throwErrors) throw new Error(err.message);
        };
    };

    info(title, fieldName, fieldValue, inline){
        const embed = new SuperEmbed()
        .newTitle(title)
        .newTime()
        .newColor(4037805);

        if (fieldName != undefined && fieldValue != undefined){
            embed.newField(fieldName, fieldValue, inline)
        };        
        
        this.send({ embed });
    };

    success(title, fieldName, fieldValue, inline){
        const embed = new SuperEmbed()
        .newTitle(title)
        .newTime()
        .newColor(65340);

        if (fieldName != undefined && fieldValue != undefined){
            embed.newField(fieldName, fieldValue, inline)
        };

        this.send({ embed });
    }
    
    warning(title, fieldName, fieldValue, inline){
        const embed = new SuperEmbed()
        .newTitle(title)
        .newTime()
        .newColor(16763904);

        if (fieldName != undefined && fieldValue != undefined){
            embed.newField(fieldName, fieldValue, inline)
        };

        this.send({ embed });
    }


    error(title, fieldName, fieldValue, inline){
        const embed = new SuperEmbed()
        .newTitle(title)
        .newTime()
        .newColor(16729149);

        if (fieldName != undefined && fieldValue != undefined){
            embed.newField(fieldName, fieldValue, inline)
        };

        this.send({ embed });
    }
};
