/**
 * Реализация паттерна Publish/Subscribe
 *
 * **Основные возможности**
 *
 * * Подписка/отписка на один или несколько каналов
 * * Публикация на один или несколько каналов
 * * Метод *.one* подпишется на канал/каналы и отпишется после первой публикации
 *
 * **Пример**
 *
 * ```javascript
 * var channel = new PubSub();
 *
 * channel.subscribe('channel1 channel2', function (e, data) {
 *    console.log(e, data);
 * })
 *
 * channel.subscribe('channel3', function (e, data) {
 *    console.log(e, data);
 * });
 *
 * channel.publish('channel1 channel2 channel3', {'key': 'value'});
 *
 * channel.unsubscribe('channel1 channel2 channel3');
 *
 * ```
 *
 */

/**
 * @constructor
 */
function PubSub () {
    /**
     * Хэш с каналами
     * @protected
     * @type {Object}
     */
    this._channels = {};
}

/**
 * Публикация для одного или нескольких каналов
 * @public
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
 * Публикация для одного канала
 * @protected
 * @param {String} channelName
 * @param {Array} [args]
 * @returns {PubSub}
 */
PubSub.prototype._publish = function (channelName, args) {
    var channels = this._channels,
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
 * Подписка на публикации в однои или нескольких каналах
 * @public
 * @param {String} channelName
 * @param {Function} callback
 * @returns {PubSub}
 */
PubSub.prototype.subscribe = function (channelName, callback) {
    this._subscribe(channelName, callback);

    return this;
};

/**
 * Подписка на публикации в одном или нескольких каналах
 * @public
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
 * @protected
 * @param {String} channelName
 * @param {Function} callback
 * @param {Boolean} isOnce
 * @returns {null}
 */
PubSub.prototype._subscribe = function (channelName, callback, isOnce) {
    var channels = this._channels,
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
 * @public
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
 * @protected
 * @param {String} channelName
 * @param {Function} [callback]
 * @returns {PubSub}
 */
PubSub.prototype._unsubscribe = function (channelName, callback) {
    var channels = this._channels,
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