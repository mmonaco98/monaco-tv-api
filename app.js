const express = require("express");
const app = express();
const port = 8000;

const fs = require("fs");

const MOVIE_DATA = JSON.parse(fs.readFileSync("./src/data/movie_data.json"))[
    "data"
];

const HOMEPAGE_DATA = JSON.parse(fs.readFileSync("./src/data/homepage.json"))[
    "getHomepages"
];

//const csvToJson = require("convert-csv-to-json");

// const moviesData = csvToJson
//     .fieldDelimiter(",")
//     .getJsonFromCsv("src/data/mubi_movie_data.csv");

//
// fs.writeFile(
//     "./src/data/movie_data.json",
//     JSON.stringify(data),
//     function (err) {
//         if (err) {
//             console.log(err);
//         }
//     }
// );

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
