const express = require("express");
const fs = require("fs");

const app = express();
const port = 8000;

const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4,
    },
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
});

const MOVIE_DATA = JSON.parse(fs.readFileSync("./src/data/movie_data.json"))[
    "data"
];

const HOMEPAGE_DATA = JSON.parse(fs.readFileSync("./src/data/homepage.json"))[
    "getHomepages"
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//const csvToJson = require("convert-csv-to-json");

// const moviesData = csvToJson
//     .fieldDelimiter(",")
//     .getJsonFromCsv("src/data/mubi_movie_data.csv");

//

// MOVIE_DATA.forEach((element) => {
//     element.movie_description = lorem.generateSentences(getRandomInt(3, 6));
// });

// const x = { data: MOVIE_DATA };

// fs.writeFile("./src/data/movie_data.json", JSON.stringify(x), function (err) {
//     if (err) {
//         console.log(err);
//     }
// });

// HOMEPAGE_DATA.forEach((homepage) => {
//     homepage.sections = [];
//     for (let y = 0; y < 20; y++) {
//         homepage.sections[y] = {
//             title: lorem.generateWords(getRandomInt(2, 5)),
//             type: ["PosterCard", "VideoCard"][getRandomInt(0, 1)],
//             data: [],
//         };

//         for (let x = 0; x < getRandomInt(6, 12); x++) {
//             homepage.sections[y].data.push(MOVIE_DATA[getRandomInt(0, 260000)]);
//         }
//     }
// });

// const y = { getHomepages: HOMEPAGE_DATA };

// fs.writeFile("./src/data/homepage.json", JSON.stringify(y), function (err) {
//     if (err) {
//         console.log(err);
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/getMovieData/byId", (req, res) => {
    const id = req.query.id;
    const movie = MOVIE_DATA.find((p) => p.movie_id == id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send("Movie not found");
    }
});

app.get("/search/byTitle", (req, res) => {
    const title = req.query.title;
    const movies = MOVIE_DATA.filter((p) =>
        p.movie_title.toLowerCase.includes(title.toLowerCase)
    );
    if (movies) {
        res.json(movies);
    } else {
        res.status(404).send("Movies not found");
    }
});

app.get("/homepage/byUserId", (req, res) => {
    const userId = req.query.userId;
    const homepage = HOMEPAGE_DATA.find((p) => p.user_id == userId);
    if (homepage) {
        res.json(homepage);
    } else {
        res.status(404).send("Movies not found");
    }
});
