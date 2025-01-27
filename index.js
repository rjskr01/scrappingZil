const express = require('express');
const cheerio = require('cheerio');


var request = require('request');

let agents = [];
const BASE_URI = 'https://www.zillow.com';

const app = express();

app.get('/', (req, res) => {
    res.send("hello")
})
app.get('/getData', (req, originalres) => {

    var url = `${BASE_URI}/professionals/api/v2/search/?profileType=2&page=1&locationText=Henderson%20NV&language=English`;

    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'Cielo' + Date.now() }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            originalres.send("received");
            agents = data.results.professionals;

            console.log(agents.length);

            for (var i=0; i< agents.length; i++){
                var group = {};
                group.name = agents[i].fullName;
                console.log('https://www.zillow.com/' + agents[i].profileLink);
            }

            request.get({
                url: 'https://www.zillow.com//profile/Ehren-Alessi-CEO/',
                json: true,
                headers: { 'User-Agent': 'Cielo' +  Date.now() , 'Content-Type' : 'text/html;charset=utf-8'}
            }, (err, res, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (res.statusCode !== 200) {
                    console.log('Status:', res.statusCode);
                } else {
                    // data is already parsed as JSON:
                    const $ = cheerio.load(data);
                    const sectionTag = $('section[class*="CardSection"]');
                    const anchorTags = sectionTag.find('a');
                    
                    anchorTags.each((index, element) => {
                        const href = $(element).attr('href');
                        if($(element)[0].nextSibling && $(element)[0].nextSibling.children) {
                            let siblingsLength = $(element)[0].nextSibling.children.length;

                            if(siblingsLength === 3 || siblingsLength === 2) {
                                console.log(href);
                                const  URL = `https://www.zillow.com${href}`;
                                request.get({
                                    url: URL,
                                    json: true,
                                    headers: { 'User-Agent': 'Cielo' +  Date.now() , 'Content-Type' : 'text/html;charset=utf-8'}
                                }, (err, res, data) => {
                                    if (err) {
                                        console.log('Error:', err);
                                    } else if (res.statusCode !== 200) {
                                        console.log('Status:', res.statusCode);
                                    } else {
                                        // data is already parsed as JSON:
                                        console.log(data);
                                    }
                                })

                            }
                        }
                            
                    });

                    return originalres.status(200).json({
                                message: data
                            })
                }
            })

        }
    });


    // var options = {
    //     host: 'zillow.com',
    //     path: '/professionals/api/v2/search/?profileType=2&page=1&locationText=Henderson%20NV&language=English',
    //     headers: { 'User-Agent': 'request' }
    // };

    // https.get(options, function (res) {
    //     var json = '';
    //     res.on('data', function (chunk) {
    //         json += chunk;
    //     });
    //     res.on('end', function () {
    //         if (res.statusCode === 200) {
    //             try {
    //                 var data = JSON.parse(json);
    //                 // data is available here:
    //                 console.log(data.html_url);
    //             } catch (e) {
    //                 console.log('Error parsing JSON!');
    //             }
    //         } else {
    //             console.log('Status:', res);
    //         }
    //     });
    // }).on('error', function (err) {
    //     console.log('Error:', err);
    // });


    // return axios.get('https://zillow.com/professionals/api/v2/search/?profileType=2&page=1&locationText=Henderson%20NV&language=English', { maxContentLength: 10000000, maxBodyLength: 10000000, headers: { 'accept': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*' } })
    // .then(response => {
    //     console.log(response.data);
    //     return res.status(200).json({
    //         message: response.data
    //     })
    // })
    // .catch(err => {
    //     return res.status(500).json({
    //         error: err
    //     })
    // })




    // var options = {
    //     headers : {
    //         'User-Agent' : 'PostmanRuntime/7.29.2'
    //     }
    // }
    // https.get('https://zillow.com/professionals/api/v2/search/?profileType=2&page=1&locationText=Henderson%20NV&language=English', (res) => {
    //     console.log('statusCode:', res.statusCode);
    //     console.log('headers:', res.headers);

    //     res.on('data', (d) => {
    //         process.stdout.write(d);
    //     });
    // }).on('error', (e) => {
    //     console.error(e);
    // });
})



const puppeteer = require('puppeteer')

async function getVisual() {
	try {
		const URL = 'https://www.zillow.com/profile/Ehren-Alessi-CEO?'+ Date.now();
		const browser = await puppeteer.launch({headless : false})

		const page = await browser.newPage()
		await page.goto(URL);
        //.then(function(){

        //     page.$eval('.kDPuVQ', function(heading) {
        //         return heading.innerText;
        //     }).then(function(result) {
        //         console.info(result);
        //         browser.close();
        //     });

        //     // const vari = page.evaluate(function(){
        //     //     return document.getElementsByClassName("Flex-c11n-8-91-4__sc-n94bjd-0 fxkdoa")
        //     // }).then(function(result) {
        //     //     console.log(result);
        //     //     browser.close();})
        //     //     console.log(vari);
        // })
        // const keywords = await page.$$eval(
        //     '.jcpIjO',
        //     function(divs){
        //         console.log(divs);
        //     },
        //   );
        // await console.log(keywords);
        // const element = await page.$('a[href*="profile"]');
        // const as = await page.$$("a").then(function(values) {
        //     console.log("asvalues:     " + values);
        // });
        // await console.log("as:     " + as);
       
		await page.screenshot({ path: 'screenshot.png' })
		await page.pdf({ path: 'page.pdf' })
        const b = (await page.$x("//a[@class='StyledTextButton-c11n-8-91-4__sc-1nwmfqo-0 jcpIjO']"))[0]
        console.log(await b);
        await b.click();

		
	} catch (error) {
		console.error(error)
	}
}

// getVisual()


app.listen(9999, () => {

    console.log("app listening on 9999")
});

// function findMissingArray(){
//     myArray = [8, 7, 4, 1, 2, 10]
//     var missingnum = [];
//     for(i=1;i<10;i++){
//         if (myArray.indexOf(i) < 0) missingnum.push(i)
//     }
//     console.log(missingnum);
// }