const express = require('express');
// const axios = require('axios');
// // const https = require('node:https');
// var https = require('https');
var request = require('request');

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var agents = [];
var final = [];

const app = express();
app.get('/', (req, res) => {
    res.send("hello")
})
app.get('/getData', (req, originalres) => {
    // res.send("hello")


    var url = 'https://zillow.com/professionals/api/v2/search/?profileType=2&page=1&locationText=Henderson%20NV&language=English';

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
            // data is already parsed as JSON:
            // console.log(data);
            // return originalres.status(200).json({
            //             message: data
            //         })
            originalres.send("received");
            agents = data.results.professionals;

            for (var i=0; i< agents.length; i++){
                var group = {};
                group.name = agents[i].fullName;

                request.get({
                    url: 'https://www.zillow.com/' + agents[i].profileLink,
                    json: true,
                    headers: { 'User-Agent': 'Cielo' +  Date.now() , 'Content-Type' : 'text/html;charset=utf-8'}
                }, (err, res, data) => {
                    if (err) {
                        console.log('Error:', err);
                    } else if (res.statusCode !== 200) {
                        console.log('Status:', res.statusCode);
                    } else {
                    }
                })

            }

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
		const browser = await puppeteer.launch({headless : true})

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

        const element = await page.$('a[href*="profile"]');
        console.log(element);

		await page.screenshot({ path: 'screenshot.png' })
		await page.pdf({ path: 'page.pdf' })

		
	} catch (error) {
		console.error(error)
	}
}

getVisual()


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