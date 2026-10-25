const { ImageKit } = require("@imagekit/nodejs");

let imageKitClient = null;

function getImageKitClient() {
    if (!imageKitClient) {
        if (!process.env.IMAGEKIT_PRIVATE_KEY) {
            throw new Error("IMAGEKIT_PRIVATE_KEY environment variable is required to upload files.");
        }
        imageKitClient = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        });
    }
    return imageKitClient;
}

async function uploadFile(file) {
    const client = getImageKitClient();
    const result = await client.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "yt-complete-backend/music"
    });
    return result;
}

module.exports = { uploadFile };