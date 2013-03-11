(function(window, undefined){

"use strict";

function JSONP(options) {

    options = typeof options === 'object' ? options : {};

    var params = { 
            data: options.data || {},
            error: options.error || noop,
            success: options.success || noop,
            url: options.url || ''
        },
        script = window.document.createElement('script'),
        done = false,
        callback = params.data.callback = 'jsonp_' + random_string(15);

    window[callback] = function(data) {
        params.success(data);
        try {
            delete window[callback];
        }
        catch (e) {
            window[callback] = null;
        }
    };

    script.src = params.url + (params.url.indexOf('?') === -1 ? '?' : '&') + object_to_uri(params.data);
    script.async = true;

    script.onerror = function(evt){
        params.error({ url: script.src, event: evt });
    };
    
    script.onload = script.onreadystatechange = function() {
        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        }
    };

    window.document.getElementsByTagName('head')[0].appendChild(script);

    return callback;
}

function noop(){}

function random_string(length) {
    var str = '';
    while (str.length < length) { 
        str += Math.random().toString(36).substring(2,3);
    }
    return str;
}

function object_to_uri(obj) {
    var data = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            data.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
        }
    }
    return data.join('&');
}

if (typeof define !== 'undefined' && define.amd) { return JSONP; }
else if (typeof module !== 'undefined' && module.exports) { module.exports = JSONP; }
else { window.JSONP = JSONP; }

})(window);