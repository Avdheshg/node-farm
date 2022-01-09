// getting the fs module
const fs = require("fs");
// Creating a server
const http = require("http");
// for getting the url/routing
const url = require("url");
// importing the replaceTemplate module
const replaceTemplate = require("./modules/replaceTemplate");


// this is a top level code, which will be executed only once after the server reload
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);   // dataObj is an array

// Creating a server
const server = http.createServer((req, res) => {

    // console.log("URL====================" );
    // logging the whole URL object
    // console.log(url);

    // console.log("req----------------");
    // console.log(req);

    // getting the url entered in the google bar
    const pathName = req.url;
    console.log("Entered url: " + pathName);

    // Parsing var from URLs
    // console.log(url.parse(req.url, true));
    // using ES6 structuring
    const { query, pathname } = url.parse(req.url, true);
    console.log("query and pathname");
    // this query is an object with id field in it
    console.log(query);
    console.log(pathname);

    // Overview page
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {
            "Content-type": "text/html"
        });

        // V R looping through the json(by using dataObj.map). For each different object taken from the JSON file V R sending the same HTML template in which all the details will be replaced by the details of "el"
        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
        // console.log(cardsHTML);
        
        res.end(output);
    } 
    // Products page
    else if (pathname === "/products") {
        // console.log("V R at products page and the query is: ");
        // console.log(query);
        console.log(query.id);

        // grabbing the id field from the "query" object defined above 
        const product = dataObj[query.id];
        console.log("product:");
        console.log(product);

        res.writeHead(200, {"Content-type": "text/html"});
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    } 

    // API page
    else if (pathname === "/api") {

        // M-1: Read the file and send all of the data
        // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
        //     // parse the 
        //     const productData = JSON.parse(data);
        //     res.writeHead(200, {
        //         // for sending the JSON object to the broswer V use, "application/json"
        //         "Content-type": "application/json"
        //     });
        //     res.end(data);
        // });

        res.writeHead(200, {
            "Content-type": "application/json"
        });
        res.end(data);

    } 
    // Not found page
    else {
        res.writeHead(404, {
            // Content-type: means that V R telling the browser that V will send this kind of data, and here V R sending the HTML format
            'Content-type': 'text/html',

        })
        res.end("<h1>Page not found!</h1>");
    }
});

// console.log( server);

server.listen(8000, '127.0.0.1', () => {
    console.log("Server is listning at the port 8000");
});

















