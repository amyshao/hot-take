const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const http = require("http").createServer(app);
const router = express.Router();
app.use(cors());

// Listen on port 3000
const port = process.env.PORT || 3000;
const host = "http://localhost:";

http.listen(port, () => console.log(`Server listening ${host}${port}`));
app.use('/api', router);
app.use(express.static(path.join(__dirname, 'client/build')));

/* MODELS

Room {
    int roomId
    Image[] images
    Ranking[] rankings
    Map<string imageURL, int score> scores
}

Image {
    string imageURL
}

Ranking {
    Image[] ranking
}
*/

var rooms = [];

router.post("/createRoom", function (req, res) {
    const uniqueRoomId = Math.floor(Math.random() * 9999);
    rooms.push({
        roomId: uniqueRoomId,
        images: [],
        rankings: [],
        scores: new Map(),
    });
    console.log('rooms: ', rooms);
    res.json({ roomId: uniqueRoomId });
});

router.post("/addImages/:roomId", async function (req, res) {
    const roomId = parseInt(req.params.roomId);
    const imageURL = req.query.src;
    console.log(`[STARTED]    Add image: ${imageURL} to room: ${roomId}`);
    console.log('imageURL: ', imageURL);
    try {
        const room = rooms.filter(function (item) {
            return item.roomId == roomId;
        })[0];
        room["images"].push({
            imageURL: imageURL,
        });
        room["scores"].set(imageURL, 0);
        console.log(`[SUCCESS]    Added image: ${imageURL} to room: ${roomId}`);
        console.log('rooms: ',rooms);
        res.json({ message: "SUCCESS" });
    } catch (e) {
        res.json([]);
        console.log(`[ERROR]    prob can't find room: ${roomId}. ${e}`);
    }
});

router.get("/getImages/:roomId", function (req, res) {
    const roomId = parseInt(req.params.roomId);
    try {
        const images = rooms.filter(function (item) {
            return item.roomId == roomId;
        })[0]["images"];
        res.json(images);
    } catch (e) {
        console.log(`[ERROR]    Cannot find room: ${roomId}`);
        res.json([]);
    }
});

router.post("/addRanking/:roomId", async function (req, res) {
    const roomId = parseInt(req.params.roomId);
    const ranking = JSON.parse(req.query.ranking);
    console.log(`[STARTED]    Add ranking: ${ranking} to room: ${roomId}`);
    try {
        const room = rooms.filter(function (item) {
            return item.roomId == roomId;
        })[0];
        room["rankings"].push({
            ranking: ranking,
        });
        for (let i = 0; i < ranking.length; i++) {
            let oldScore = room["scores"].get(ranking[i]);
            room["scores"].set(ranking[i], oldScore + ranking.length - i - 1);
        }
        console.log(`[SUCCESS]    Added ranking: ${ranking} to room: ${roomId}`);
        console.log('rooms: ',rooms);
        res.json({ message: "SUCCESS" });
    } catch (e) {
        res.json([]);
        console.log(`[ERROR]    prob can't find room: ${roomId}. ${e}`);
    }
});

router.get("/getScores/:roomId", function (req, res) {
    const roomId = parseInt(req.params.roomId);
    try {
        const scores = rooms.filter(function (item) {
            return item.roomId == roomId;
        })[0]["scores"];
        var scoreArray = [];
        scores.forEach((score, imageURL) => {
            scoreArray.push({score: score, imageURL: imageURL});
        });
        scoreArray.sort((a, b) => {
            return b.score - a.score;
        });
        res.json(scoreArray);
    } catch (e) {
        console.log(`[ERROR]    prob cannot find room: ${roomId}. ${e}`);
        res.json([]);
    }
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/src/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })