// ['search=Thiago', 'page=2']

// ['search', 'Thiago']
// ['page', '2']

export function extractQueryParams(query) {
    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=')

        queryParams[key] = value
        
        return queryParams
    }, {}) // --> {} : inicalizando o objeto de final do reduce, no caso um obj 
}