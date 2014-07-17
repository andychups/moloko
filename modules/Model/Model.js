/**
 * @file
 * @date 17.07.14
 * @author andychups <andychups@yandex-team.ru>
 */

function Model (props) {
    this.props = props;
}

inherit(PubSub, Model);

/**
 * Метод устанавливает свойство модели
 * @param {String} propertyName Имя свойства
 * @param {*} value
 */
Model.prototype.set = function (propertyName, value) {
    var props = this.props;

    if (props.hasOwnProperty(propertyName)) {
        this.trigger('change:'+propertyName, {'propertyName': propertyName, 'value': value});
    } else {
        this.trigger('add', {'propertyName': propertyName, 'value': value});
    }

    this.props[propertyName] = value;
}

/**
 * Метод возвращает свойство модели
 * @param {String} propertyName Имя свойства
 * @returns {*}
 */
Model.prototype.get = function (propertyName) {
    var props = this.props;

    if (props.hasOwnProperty(propertyName)) {
        return props[propertyName];
    }

    return null;
}

var m = new Model({'foo': 1, 'bar': 2});

console.log(m);

m.on('change:foo', function (e, data) {
    console.log(e, data);
});

m.on('add', function (e, data) {
    console.log(e, data);
});

m.set('foo', 'NEWAVE!!!');
m.set('newFoo', 'NEWFOOO');