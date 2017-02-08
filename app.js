function include(filename) {
    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

include("./bower_components/requirejs/require.js")

require("babel-core").transformFile("./ScrumStandUpTimerCode.js", {}, function(err, result) {
    result; // => { code, map, ast }
});
