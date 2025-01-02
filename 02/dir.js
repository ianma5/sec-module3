const fs = require('fs');

// ensure dir exists then create it
if (!fs.existsSync('./new')) {
    fs.mkdir('./new', (err) => {
        if (err) throw err;
        console.log("directory created");
        if (fs.existsSync('./new')) {
            fs.rmdir('./new', (err) => {
                if (err) throw err;
                console.log("directory removed");
            });
        }
        
    });
}



// exit on uncaught errors
process.on('uncaughtException', err => {
    console.error(`uncaught error: ${err}`);
    process.exit(1);
})