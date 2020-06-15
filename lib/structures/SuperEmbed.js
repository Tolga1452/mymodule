const Colors = {
    DEFAULT: 0x000000,
    WHITE: 0xffffff,
    AQUA: 0x1abc9c,
    GREEN: 0x2ecc71,
    BLUE: 0x3498db,
    YELLOW: 0xffff00,
    PURPLE: 0x9b59b6,
    LUMINOUS_VIVID_PINK: 0xe91e63,
    GOLD: 0xf1c40f,
    ORANGE: 0xe67e22,
    RED: 0xe74c3c,
    GREY: 0x95a5a6,
    NAVY: 0x34495e,
    DARK_AQUA: 0x11806a,
    DARK_GREEN: 0x1f8b4c,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368a,
    DARK_VIVID_PINK: 0xad1457,
    DARK_GOLD: 0xc27c0e,
    DARK_ORANGE: 0xa84300,
    DARK_RED: 0x992d22,
    DARK_GREY: 0x979c9f,
    DARKER_GREY: 0x7f8c8d,
    LIGHT_GREY: 0xbcc0c0,
    DARK_NAVY: 0x2c3e50,
    BLURPLE: 0x7289da,
    GREYPLE: 0x99aab5,
    DARK_BUT_NOT_BLACK: 0x2c2f33,
    NOT_QUITE_BLACK: 0x23272a,
  };
function resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
      if (color === 'DEFAULT') return 0;
      color = Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (Array.isArray(color)) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }
    if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
    else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');
    return color;
}
function resolveString(data) {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.join('\n');
    return String(data);
  }
class SuperEmbed {
    constructor(data = {}, skipValidation = false) {
        this.setup(data, skipValidation);
      }
      setup(data, skipValidation) {
        this.type = data.type;
        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.color = resolveColor(data.color);
        this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;
        this.fields = [];
        if (data.fields) {
          this.fields = skipValidation ? data.fields.map(cloneObject) : this.constructor.normalizeFields(data.fields);
        }
    
        this.thumbnail = data.thumbnail
          ? {
              url: data.thumbnail.url,
              proxyURL: data.thumbnail.proxyURL || data.thumbnail.proxy_url,
              height: data.thumbnail.height,
              width: data.thumbnail.width,
            }
          : null;
    
        this.image = data.image
          ? {
              url: data.image.url,
              proxyURL: data.image.proxyURL || data.image.proxy_url,
              height: data.image.height,
              width: data.image.width,
            }
          : null;
    
        this.video = data.video
          ? {
              url: data.video.url,
              proxyURL: data.video.proxyURL || data.video.proxy_url,
              height: data.video.height,
              width: data.video.width,
            }
          : null;
    
        this.author = data.author
          ? {
              name: data.author.name,
              url: data.author.url,
              iconURL: data.author.iconURL || data.author.icon_url,
              proxyIconURL: data.author.proxyIconURL || data.author.proxy_icon_url,
            }
          : null;
    
        this.provider = data.provider
          ? {
              name: data.provider.name,
              url: data.provider.name,
            }
          : null;
    
        this.footer = data.footer
          ? {
              text: data.footer.text,
              iconURL: data.footer.iconURL || data.footer.icon_url,
              proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
            }
          : null;
    
        this.files = data.files || [];
      }
  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash
   * @type {?string}
   * @readonly
   */
  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  /**
   * The accumulated length for the embed title, description, fields and footer text
   * @type {number}
   * @readonly
   */
  get length() {
    return (
      (this.title ? this.title.length : 0) +
      (this.description ? this.description.length : 0) +
      (this.fields.length >= 1
        ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
        : 0) +
      (this.footer ? this.footer.text.length : 0)
    );
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of this field
   * @param {StringResolvable} value The value of this field
   * @param {boolean} [inline=false] If this field will be displayed inline
   * @returns {MessageEmbed}
   */
  addField(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  /**
   * Adds fields to the embed (max 25).
   * @param {...EmbedFieldData|EmbedFieldData[]} fields The fields to add
   * @returns {MessageEmbed}
   */
  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }

  /**
   * Removes, replaces, and inserts fields in the embed (max 25).
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of fields to remove
   * @param {...EmbedFieldData|EmbedFieldData[]} [fields] The replacing field objects
   * @returns {MessageEmbed}
   */
  spliceFields(index, deleteCount, ...fields) {
    this.fields.splice(index, deleteCount, ...this.constructor.normalizeFields(...fields));
    return this;
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Multiple files can be attached.
   * @param {Array<FileOptions|string|MessageAttachment>} files Files to attach
   * @returns {MessageEmbed}
   */
  attachFiles(files) {
    this.files = this.files.concat(files);
    return this;
  }

  /**
   * Sets the author of this embed.
   * @param {StringResolvable} name The name of the author
   * @param {string} [iconURL] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {MessageEmbed}
   */
  setAuthor(name, iconURL, url) {
    this.author = { name: Util.resolveString(name), iconURL, url };
    return this;
  }

  /**
   * Sets the color of this embed.
   * @param {ColorResolvable} color The color of the embed
   * @returns {MessageEmbed}
   */
  setColor(color) {
    this.color = Util.resolveColor(color);
    return this;
  }

  /**
   * Sets the description of this embed.
   * @param {StringResolvable} description The description
   * @returns {MessageEmbed}
   */
  setDesc(description) {
    description = resolveString(description);
    this.description = description;
    return this;
  }

  /**
   * Sets the footer of this embed.
   * @param {StringResolvable} text The text of the footer
   * @param {string} [iconURL] The icon URL of the footer
   * @returns {MessageEmbed}
   */
  setFooter(text, iconURL) {
    text = resolveString(text);
    this.footer = { text, iconURL};
    return this;
  }

  /**
   * Sets the image of this embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the thumbnail of this embed.
   * @param {string} url The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param {Date|number} [timestamp=Date.now()] The timestamp or date
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Sets the title of this embed.
   * @param {StringResolvable} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    title = resolveString(title);
    this.title = title;
    return this;
  }

  /**
   * Sets the URL of this embed.
   * @param {string} url The URL
   * @returns {MessageEmbed}
   */
  setURL(url) {
    this.url = url;
    return this;
  }

  /**
   * Transforms the embed to a plain object.
   * @returns {Object} The raw data of this embed
   */
  toJSON() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author
        ? {
            name: this.author.name,
            url: this.author.url,
            icon_url: this.author.iconURL,
          }
        : null,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconURL,
          }
        : null,
    };
  }
  static normalizeField(name, value, inline = false) {
    name = resolveString(name);
    if (!name) throw new RangeError('EMBED_FIELD_NAME');
    value = resolveString(value);
    if (!value) throw new RangeError('EMBED_FIELD_VALUE');
    return { name, value, inline };
  }
  static normalizeFields(...fields) {
    return fields
      .flat(2)
      .map(field =>
        this.normalizeField(
          field && field.name,
          field && field.value,
          field && typeof field.inline === 'boolean' ? field.inline : false,
        ),
      );
  }
}
}
module.exports = SuperEmbed;
