/**
 * @file
 * @date 17.07.14
 * @author andychups <andychups@yandex-team.ru>
 */


function inherit (parent, child) {
    child.prototype = new parent();
    child.prototype.superclass = parent.prototype;

    return child;
}