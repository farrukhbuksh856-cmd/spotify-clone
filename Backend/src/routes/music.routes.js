const express = require("express");
const musicController = require("../controllers/music.controller")
const authMiddleWare = require("../middlewares/auth.middlewares")
const multer = require('multer');

const upload = multer({
    storage:multer.memoryStorage()
})

const router = express.Router();

router.post("/upload",authMiddleWare.authArtist,upload.single("music"),musicController.createMusic)

router.post("/album",authMiddleWare.authArtist,musicController.createAlbum)

router.get("/",authMiddleWare.authUser, musicController.getAllMusics)

router.get("/albums",authMiddleWare.authUser,musicController.getAllAlbums)

router.get("/albums/:albumId",authMiddleWare.authUser,musicController.getAlbumById)


module.exports = router;