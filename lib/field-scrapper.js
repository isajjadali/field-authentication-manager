const pathSeperator = '/';

/**
 * Extract Exact matching JSON of incomming request
 * @constructor
 * @param {array} url={} Url array that contain url splitted by `/`
 * @return {object} requiredFields={} Combined object of Required Fields for all possible request
 */
function extractKeys(url = [], requiredFields = {}) {
    const firstElementOfUrl = url.slice(0, 1)[0];
    const remianingUrlValues = url.slice(1);
    const extractedJson = requiredFields[firstElementOfUrl];

    if (!extractedJson) {
        if (!firstElementOfUrl && !remianingUrlValues.length) {
            return requiredFields[pathSeperator];
        }
        const finestExtractedJson = Object.keys(requiredFields)
            .map((route) => {
                const splittedRoute = route.split(pathSeperator);
                return splittedRoute.length === url.length ? splittedRoute : [];
            })
            .filter(route => route.length)
            .filter(route => route.every((item, index) => (item.indexOf(':') === -1 ? item === url[index] : true)))[0];
        return finestExtractedJson && requiredFields[finestExtractedJson.join(pathSeperator)];
    }
    if (!remianingUrlValues.length) {
        if (firstElementOfUrl && extractedJson) {
            return extractedJson[pathSeperator] || extractedJson[firstElementOfUrl] || extractedJson[`${pathSeperator}${firstElementOfUrl}`] || extractedJson;
        }
        return extractedJson[pathSeperator];
    }
    return extractKeys(remianingUrlValues, extractedJson);
}

/**
 * Set up configrations and return fieldAuthenticatorsRunner.
 * @module RequiredFieldScrapper
 * @param {object} config
 * @param {string} config.url='' Request URL
 * @param {string} config.method='' Request Method, e.g: (POST, PUT, GET, DELETE)
 * @param {string} config.mountPath='' Mount path from where a request url start, e.g `/api/`
 * @return {object} Object of Required Fields against incomming request
 */
module.exports.requiredFieldScrapper = ({ url = '', method = '', mountPath = '' }) => {
    let extractedUrl = url.split(mountPath)[1];

    if (!extractedUrl) {
        return false;
    }

    extractedUrl = extractedUrl.split('?')[0]
        .split(pathSeperator)
        .filter(item => item);

    extractedUrl.unshift(mountPath.replace(/\//g, ''));
    const fields = extractKeys(extractedUrl, global.RequiredFields);

    return fields && fields[method];
};
