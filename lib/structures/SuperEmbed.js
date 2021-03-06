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

function cloneObject(obj) {
    return Object.assign(Object.create(obj), obj);
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

  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

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

  newField(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }

  spliceFields(index, deleteCount, ...fields) {
    this.fields.splice(index, deleteCount, ...this.constructor.normalizeFields(...fields));
    return this;
  }

  attachFiles(files) {
    this.files = this.files.concat(files);
    return this;
  }

  newAuthor(name, iconURL, url) {
    this.author = { name: resolveString(name), iconURL, url };
    return this;
  }

  newColor(color) {
    this.color = resolveColor(color);
    return this;
  }

  newDesc(description) {
    description = resolveString(description);
    this.description = description;
    return this;
  }

  newFooter(text, iconURL) {
    text = resolveString(text);
    this.footer = { text, iconURL, proxyIconURL: undefined };
    return this;
  }

  newImage(url) {
    this.image = { url };
    return this;
  }

  newThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  newTime(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  newTitle(title) {
    title = resolveString(title);
    this.title = title;
    return this;
  }

  newURL(url) {
    this.url = url;
    return this;
  }

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

module.exports = SuperEmbed;
