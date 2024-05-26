const express = require("express");
const db = require("./src/helpers/database.js");
const app = express();
const port = 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/getMovieData/byId", (req, res) => {
    const params = [req.query.id];
    const sql = "select * from movies where movie_id = ?";
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: row,
        });
    });
});

app.get("/search/byTitle", (req, res) => {
    const params = [req.query.title];
    const sql =
        "select * from movies where movie_title like ? order by movie_popularity desc";
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});

app.get("/homepage/byUserId", (req, res) => {
    const params = [req.query.userId];
    const sql = "select * from homepage where user_id = ?";
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const sections = [];
        for (let x = 1; x < 30; x++) {
            const moviesInSection = rows.filter(
                (movie) => movie.section_id == x
            );
            const section = {
                sectionTitle: moviesInSection.at(0).section_title,
                movies: [],
                type: "VideoCard",
            };
            moviesInSection.forEach((elem) => {
                section.movies.push({
                    movie_title: elem.movie_title,
                    movie_description: elem.movie_description,
                    movie_image_url: elem.movie_image_url,
                    movie_release_year: elem.movie_release_year,
                    director_name: elem.director_name,
                });
            });
            sections.push(section);
        }
        res.json({
            message: "success",
            data: sections,
        });
    });
});

/* app.get("/addDescription", (req, res) => {
    let ids;
    db.all(
        "select movie_id from movies where movie_id > 102000",
        (err, rows) => {
            ids = rows;
            ids.forEach((element) => {
                const value = generateSentences(getRandomInt(4, 7));
                const sql =
                    "update movies set movie_description = ? where movie_id = ?";
                const params = [value, element.movie_id];

                db.run(sql, params, (err) => {
                    if (err) {
                        console.log("ERROR: ", params);
                        res.status(400).json({ error: err.message });
                        return;
                    }
                });
            });
        }
    );

    res.json({ message: "DONE" });
}); */

/* let movies;
db.all("select * from movies order by random()", (err, rows) => {
    movies = rows;
}); */

/* app.get("/createHomepage", (req, res) => {
    //const user_id = req.query.id;
    //const section_id = req.query.section;
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 30; j++) {
            const nFilmInSection = getRandomInt(7, 15);
            const sectionTitle = generateWords(3, 5);
            for (let k = 0; k < nFilmInSection; k++) {
                const seed = getRandomInt(1, 200000);
                const row = movies[seed + k];
                const params = [
                    i,
                    sectionTitle,
                    j,
                    row.movie_id,
                    row.movie_title,
                    row.movie_release_year,
                    row.movie_image_url,
                    row.director_name,
                    row.movie_description,
                ];
                db.run(
                    "insert into homepage values (?,?,?,?,?,?,?,?,?)",
                    params,
                    (err) => {}
                );
            }
        }
    }

    res.json({ message: "DONE" });
}); */
