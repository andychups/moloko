/**
 * @file
 * @date 17.07.14
 * @author andychups <andychups@yandex-team.ru>
 */

function Model (props) {
    this.props = props;
}

extend(Model, PubSub);

/**
 * Метод устанавливает свойство модели
 * @param {String} propertyName Имя свойства
 * @param {*} value
 */
Model.prototype.set = function (propertyName, value) {
    var props = this.props;

    if (props.hasOwnProperty(propertyName)) {
        this.trigger('change:'+propertyName, {'propertyName': propertyName, 'value': value, 'prevValue': this.props[propertyName]});
    }

    this.trigger('change', {'propertyName': propertyName, 'value': value});
    this.props[propertyName] = value;
}

/**
 * Метод возвращает свойство модели
 * @param {String} propertyName Имя свойства
 * @returns {*}
 */
Model.prototype.get = function (propertyName) {
    var props = this.props;

    return props.hasOwnProperty(propertyName) ? props[propertyName] : null;
}