const express = require("express");
const app = express();
const port = 8000;

const csvToJson = require("convert-csv-to-json");

const moviesData = csvToJson
    .fieldDelimiter(",")
    .getJsonFromCsv("src/data/mubi_movie_data.csv");

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/movie/byId", (req, res) => {
    const id = req.query.id;
    const movie = moviesData.find((p) => p.movie_id == id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/movies/byTitle", (req, res) => {
    const title = req.query.title;
    const movies = moviesData.filter((p) => p.movie_title.includes(title));
    if (movies) {
        res.json(movies);
    } else {
        res.status(404).send("Post not found");
    }
});
