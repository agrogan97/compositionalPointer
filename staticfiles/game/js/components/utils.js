function getUrlParams(params = []){
    const url = new URL(window.location.href);
    let searchParams = {}
    params.forEach(p => {
        searchParams[p] = url.searchParams.get(p) || undefined
    })

    return searchParams;

}