/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const { NunjucksShortcode, GAError } = require('js-framework');
const syslog = require('js-framework/src/logger/syslog');

class NunjucksShortcodeMenuError extends GAError {}


/**
 * Layered menu shortcode class.
 */
class LayeredMenuShortcode extends NunjucksShortcode
{
    /**
     * Render.
     * 
     * @param   {object}    context     URL.
     * @param   {Array}     args        Other arguments.
     * 
     * @return  {string}
     */
    render(context, args)
    {
        let menu = args[0];

        if (!this.config.navigation || !this.config.navigation[menu]) {
            throw new NunjucksShortcodeMenuError(`No (layered) navigation menu found for '${menu}'.`);
        }

        let items = Object.values(this.config.navigation[menu]);

        let struct = {};

        for (let item of items) {
            if (item.parent) {
                if (!struct[item.parent]) {
                    struct[item.parent] = [];
                }
                struct[item.parent].push(item);
            } else {
                if (!struct._main) {
                    struct._main = [];
                }
                struct._main.push(item);
            }
        }

        for (let item of Object.keys(struct)) {
            struct[item] = struct[item].sort(this._sortAscCompare);
        }


        let ret = '<ul class="menu-items">';

        for (let item of struct._main) {
            ret += `<li><a class="link" href="${item.link}">${item.title}</a></li>`;

            ret += `<ul class="menu-subitems">`;
            for (let subitem of struct[item]) {
                ret += `<li class="subitem"><a class="link" href="${subitem.link}">${subitem.title}</a></li>`;
            }
            ret += `</ul>`;
        }

        ret += '</ul>';

        return ret;
    }

    /**
     * The compare function for sorting articles.
     * 
     * @param   {object}    a   First article.
     * @param   {object}    b   Second article.
     */
    _sortAscCompare(a, b)
    {
        if (a.pos < b.pos) {
            return -1;
        }
        if (b.pos < a.pos) {
            return 1;
        }
        return 0;
    }
 }

module.exports = LayeredMenuShortcode;
 