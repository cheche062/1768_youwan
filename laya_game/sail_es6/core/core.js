var Sail = (window || global).Sail = ((window) => {
    let URL = Laya.URL,Render = Laya.Render;
    URL.customFormat = function (url) {
        if (!Render.isConchApp && url.indexOf("?v=") < 0) url += ("?v=" + $.ASSETS_VERSION);
        console.log("URL.customFormat:--->  " + url);
        return url;
    }

    let $ = {
        __isInit : false,
        viewer : null,
        io : null,
        director : null,
        ASSETS_VERSION : null,
        version : "1.0.0",
        class : function (_class, fullName) {
            Laya.class(_class, fullName);
        }
    }

    return $;
})(window || global);