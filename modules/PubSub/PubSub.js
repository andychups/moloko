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

function PubSubEvent (once, callback) {
    this.once = once;

    this.callback = callback;
}

/**
 * Публикация для одного или нескольких каналов
 * @public
 * @returns {PubSub}
 */
PubSub.prototype.publish = function () {
    var args,
        channelName,
        channelNames,
        i,
        l;

    /**
     * Рассчитываем, что пользователь не мудак и не будет вызавать метод без параметров
     */
    switch (arguments.length) {
        case 1:
            channelName = arguments[0];
            args = [];
        break;

        case 2:
            channelName = arguments[0];
            args = [arguments[1]];
        break;

        case 3:
            channelName = arguments[0];
            args = [arguments[1], arguments[2]];
        break;

        case 4:
            channelName = arguments[0];
            args = [arguments[1], arguments[2], arguments[3]];
        break;

        default:
            args = Array.prototype.slice.call(arguments);
            channelName = args.shift();
        break;
    }


    if (channelName.indexOf(' ') === -1) {
        this._publish(channelName, args);
        return this;
    } else {
        channelNames = channelName.split(' ');
        i = 0;
        l = channelNames.length;

        for (; i < l; i++) {
            this._publish(channelNames[i], args.slice());
        }
    }

    return this;
};

/**
 * Шоркат метода publish
 * @type {Function}
 */
PubSub.prototype.trigger = PubSub.prototype.publish;

/**
 * Публикация для одного канала
 * @protected
 * @param {String} channelName
 * @param {Array} [args]
 * @returns {PubSub}
 */
PubSub.prototype._publish = function (channelName, args) {
    var channels = this._channels,
        channel,
        channelEventObject,
        i,
        l;

    if (!channels.hasOwnProperty(channelName)) {
        return null;
    }

    args.unshift({'name': channelName, 'timestamp': (+new Date)});
    channel = channels[channelName];

    l = channel.length;
    i = l;

    for (;i;) {
        channelEventObject = channel[l - i];
        channelEventObject.callback.apply(channelEventObject, args);

        if (channelEventObject.once) {
            this._unsubscribe(channelName, channelEventObject.callback);
        }

        --i;
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
 * Шорткат метода subscribe
 * @type {Function}
 */
PubSub.prototype.on = PubSub.prototype.subscribe;

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
    var channelNames,
        i,
        l;

    if (channelName.indexOf(' ') === -1) {
        this._addEventToChannel(channelName, callback, isOnce);

        return null;
    }

    channelNames = channelName.split(' ');

    l = channelNames.length;
    i = l;

    for (;i;) {
        this._addEventToChannel(channelNames[l - i], callback, isOnce);
        --i;
    }

    return null;
};

/**
 * Добавляет обработчик в канал
 * @param {String} channelName
 * @param {Function} callback
 * @param {Boolean} [isOnce = false]
 * @private
 */
PubSub.prototype._addEventToChannel = function (channelName, callback, isOnce) {
    var channels = this._channels;

    if (!channels.hasOwnProperty(channelName)) {
        channels[channelName] = [];
    }

    channels[channelName].push(new PubSubEvent(isOnce, callback));
};

/**
 * Отписка от публикаций в одном или нескольких каналах
 * @public
 * @param {String} channelName
 * @param {Function} [callback]
 * @returns {PubSub}
 */
PubSub.prototype.unsubscribe = function (channelName, callback) {
    var channelNames;

    if (channelName.indexOf(' ') === -1) {
        this._unsubscribe(channelName, callback);

        return this;
    }

    channelNames = channelName.split(' ');

    for (var i = 0, l = channelNames.length; i < l; i++) {
        this._unsubscribe(channelNames[i], callback);
    }

    return this;
};

/**
 * Шорткат метода unsubscribe
 * @type {Function}
 */
PubSub.prototype.off = PubSub.prototype.unsubscribe;

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