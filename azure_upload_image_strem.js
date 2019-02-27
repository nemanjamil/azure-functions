var accessKey = '.....';
var storageAccount = 'zzzaaabbb';
const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const multiparty = require('multiparty');

module.exports = async function (context, req) {

    console.log("req", req);
    let containerName = "images";
    let blobName = "seat_shell.jpg";

    let stream = getStream(req.body.buffer);
    let streamLength = req.body.length;
    

    // image is not parsed as expected
    const msg = await putFileToContainer(containerName, blobName, stream, streamLength)

    context.res = {
        status: 200,
        body: msg
    };
};



function putFileToContainer(containerName, blobName, stream, streamLength) {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    message: "Image upload successfully"
                });
            }
        });
    });
}