/**
 * @file
 * @date 01.05.14
 * @author andychups <andychups@yandex-team.ru>
 *
 * TODO:
 * + Множественная подписка и отписка
 * + one
 * - namespace
 */

function PubSub () {
    this.channels = {};
}

/**
 * Публикация события в один или несколько каналов
 * @returns {PubSub}
 */
PubSub.prototype.publish = function () {
    var args = Array.prototype.slice.call(arguments),
        channelName = args.shift(),
        channelNames;

    channelNames = channelName.split(' ');

    for (var i = 0, l = channelNames.length; i < l; i++) {
        this._publish(channelNames[i], args.slice());
    }

    return this;
};

/**
 * Публикация события для одного канала
 * @param {String} channelName
 * @param {Array} [args]
 * @returns {PubSub}
 * @private
 */
PubSub.prototype._publish = function (channelName, args) {
    var channels = this.channels,
        channel;

    if (!channels.hasOwnProperty(channelName)) {
        return this;
    }

    args.unshift({'name': channelName, 'timestamp': (+new Date)});
    channel = channels[channelName];

    for (var i = 0, l = channel.length; i < l; i++) {
        channel[i].callback.apply(channel[i], args);

        if (channel[i].once) {
            this._unsubscribe(channelName, channel[i].callback);
        }
    }

    return null;
};

/**
 * Подписка на события в однои или нескольких каналах
 * @param {String} channelName
 * @param {Function} callback
 * @returns {PubSub}
 */
PubSub.prototype.subscribe = function (channelName, callback) {
    this._subscribe(channelName, callback);

    return this;
};

/**
 * Подписка на события в однои или нескольких каналах
 * @param {String} channelName
 * @param {Function} callback
 * @returns {PubSub}
 */
PubSub.prototype.one = function (channelName, callback) {
    this._subscribe(channelName, callback, true);

    return this;
};

/**
 * Подписка на события в однои или нескольких каналах
 * @param {String} channelName
 * @param {Function} callback
 * @param {Boolean} isOnce
 * @returns {null}
 * @private
 */
PubSub.prototype._subscribe = function (channelName, callback, isOnce) {
    var channels = this.channels,
        channelNames;

    channelNames = channelName.split(' ');

    for (var i = 0, l = channelNames.length; i < l; i++) {
        channelName = channelNames[i];

        if (!channels.hasOwnProperty(channelName)) {
            channels[channelName] = [];
        }

        channels[channelName].push({'once': isOnce, 'callback': callback});
    }

    return null;
};

/**
 * Отписка от публикаций в одном или нескольких каналах
 * @param {String} channelName
 * @param {Function} [callback]
 * @returns {PubSub}
 */
PubSub.prototype.unsubscribe = function (channelName, callback) {
    var channelNames = channelName.split(' ');

    for (var i = 0, l = channelNames.length; i < l; i++) {
        this._unsubscribe(channelNames[i], callback);
    }

    return this;
};

/**
 * Отписка от получения событий в одном канале
 * @param {String} channelName
 * @param {Function} [callback]
 * @returns {PubSub}
 */
PubSub.prototype._unsubscribe = function (channelName, callback) {
    var channels = this.channels,
        channel,
        unremovedCallbacks = [];

    if (!channels.hasOwnProperty(channelName)) {
        return null;
    }

    if (!(typeof callback === 'function')) {
        delete channels[channelName];
        return null;
    }

    channel = channels[channelName];

    for (var i = 0, l = channel.length; i < l; i++) {
        if (channel[i].callback !== callback) {
            unremovedCallbacks.push(channel[i]);
        }
    }

    channel.length = 0;

    Array.prototype.push.apply(channel, unremovedCallbacks);

    return null;
};