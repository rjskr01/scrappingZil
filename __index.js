const cheerio = require('cheerio');
const axios = require('axios');

const BASE_URI = 'https://www.zillow.com';


const getJsonData = async (url , headers) => {
    const config = {
        headers: headers
    };
    console.log(url);
    const response = await axios.get(url, config);
    return response.data;
}

const getGroupLinks = async () => {
    const groupLinks = [];
    const url = `${BASE_URI}/professionals/api/v2/search/?profileType=2&page=1&locationText=Henderson%20NV&language=English`;
    const headers = {
        'User-Agent': 'Cielo' + Date.now(),
        'Content-Type': 'application/json',
    }
    const data = await getJsonData(url, headers);
    const professionals = data.results.professionals;

    // Loop through professionals and push their URLs to groupLinks array
    for (const professional of professionals) {
        groupLinks.push(professional.profileLink);
    }

    return groupLinks;
}

const getProfileLinks = async () => {
    const profileLinks = [];
    const groupLinks = await getGroupLinks();
    for (const groupLink of groupLinks) {
        const url = `${BASE_URI}${groupLink}`;
        const headers = {
            'User-Agent': 'Cielo' + Date.now(),
            'Content-Type' : 'text/html;charset=utf-8'
        };
        const data = await getJsonData(url, headers);
        const $ = cheerio(data.results);
        const sectionTag = $('section[class*="CardSection"]');
        sectionTag.find('a').each((index, element) => {
            const href = $(element).attr('href');
            if($(element)[0].nextSibling && $(element)[0].nextSibling.children) {
                let siblingsLength = $(element)[0].nextSibling.children.length;
                if(siblingsLength === 3 || siblingsLength === 2) {
                    profileLinks.push(href);
                }
            }
        });
    }
    return profileLinks;
}

getProfileLinks().then(data=> console.log(data.length)).catch(console.error);