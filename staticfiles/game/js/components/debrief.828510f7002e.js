async function submitData(data){
    const URL = `/pointer/api/submitDebrief/`
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            // 'X-CSRFToken': Cookies.get('csrftoken'),
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
    })

    return response
}