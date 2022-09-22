// for http status code

export const ok = (rawResponse) => {
    if(rawResponse.status === 200) {
        return true;
    }

    return false;
}


export const internalServerError = (rawResponse) => {
    if(rawResponse.status === 500) {
        return true;
    }

    return false;
}

export const unauthorizedOrForbidden = (rawResponse) => {
    if(rawResponse.status === 401 || rawResponse.status === 403) {
        return true;
    }

    return false;
}

export const badRequest = (rawResponse) => {
    if(rawResponse.status === 400) {
        return true;
    }

    return false;
}

export const unprocessableEntity = (rawResponse) => {
    if(rawResponse.status === 422) {
        return true;
    }

    return false;
}
