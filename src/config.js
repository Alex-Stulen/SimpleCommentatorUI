
const API_VERSION = 'v1'
const HOST = 'https://server.simple-commentator.space'
const COMMENTATOR_ROOT_API = HOST + `/commentator/api/${API_VERSION}/`

export const api_endpoints = {
    comments: COMMENTATOR_ROOT_API + 'comments/',
    get_comment: COMMENTATOR_ROOT_API + 'comments/' + '$id/',
    get_comment_replies: COMMENTATOR_ROOT_API + 'comments/' + '$id/' + 'replies/',
}

export function insertParameter(url, name, value){
    return url.replace(name, value)
}

export function buildAbsoluteUrl(relative_url){
    return HOST + relative_url
}

export const upload_file_permissions = {
    max_size: 1024 * 100,
    allowed_file_content_types: ['image/jpeg', 'image/gif', 'image/png', 'text/plain']
}
