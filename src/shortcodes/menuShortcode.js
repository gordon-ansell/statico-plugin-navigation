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
 * Menu shortcode class.
 */
class MenuShortcode extends NunjucksShortcode
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
            throw new NunjucksShortcodeMenuError(`No navigation menu found for '${menu}'.`);
        }

        let items = Object.values(this.config.navigation[menu]);

        let sorted = items.sort(this._sortAscCompare);

        let article = context.ctx;
        let curr = null;
        if (article.navigation && article.navigation['menu'] === menu) {
            curr = article.navigation;
        }

        let ret = '<ul class="menu-items">';

        for (let item of sorted) {
            let isActive = false;
            if (curr && curr.title === item.title && curr.link == item.link) {
                isActive = true;
            }

            let classes = '';
            if (isActive) {
                classes = ` class="active"`;
            }

            ret += `<li${classes}><a class="link" href="${item.link}">${item.title}</a></li>`;
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

module.exports = MenuShortcode;
 