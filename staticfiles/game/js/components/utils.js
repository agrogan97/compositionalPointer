function getUrlParams(params = []){
    const url = new URL(window.location.href);
    let searchParams = {}
    params.forEach(p => {
        searchParams[p] = url.searchParams.get(p) || undefined
    })

    // Generate a random ID if no ID provided
    if (searchParams.id == undefined){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        searchParams.id =  _.range(1, 16).map(i => _.sample(characters)).join('')
    }

    // If no source provided, set to string unknown
    if (searchParams.source == undefined){
        searchParams.source = "unknown"
    }

    return searchParams;

}

function detectFullscreen(){
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement);
}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}