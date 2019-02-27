var accessKey = '......';
var storageAccount = 'xxxaaabbb';
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const { parse } = require('querystring');
const uuidv1 = require('uuid/v1');

module.exports = async function (context, req) {

    let parses = parse(req.body);
    let slika = parses.image;
    let folder = parses.folder;
    let eventId = parses.eventId;

    let matches = slika.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer(matches[2], 'base64');

    let containerName = "images";
    let blobName = folder+'/'+eventId+'/data/'+uuidv1()+".jpg";

    var data = await putFileToContainer(containerName, blobName, buffer)

    context.res = {
        status: 200,
        body: data
    };

};


function putFileToContainer(containerName, blobName, data) {
    //https://azure.github.io/azure-storage-node/BlobService.html
    let opt = {
        contentSettings : {
            contentType: 'image/jpeg',
            contentEncoding: 'base64'
        }
    }
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
            if (err) {
                reject({
                    message: "Fail"
                });
            } else {
                resolve({
                    message: "Image upload successfully"
                });
            }
        });
    });
}