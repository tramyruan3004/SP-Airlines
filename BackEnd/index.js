var app = require("./controller/app");
var port = 8081;

var server = app.listen(port, () => {
    console.log(`BackEnd Server started at localhost:${port}`)
});