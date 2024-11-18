const express = require("express");
const db = require("./src/helpers/database.js");
const getRandomInt = require("./src/helpers/random.js");
const [
    generateSentences,
    generateWords,
] = require("./src/helpers/loremIpsum.js");
const constants = require("./src/helpers/constants.js");
const app = express();
const port = 8000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// MOVIES

app.get("/movie/byId", (req, res) => {
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

// HOMEPAGE

app.post("/homepage/create", (req, res) => {
    const user_id = req.query.id;
    let movies;
    db.all("select * from movies order by random()", (err, rows) => {
        movies = rows;
        for (let j = 1; j <= 30; j++) {
            const nFilmInSection = getRandomInt(7, 15);
            const sectionTitle = generateWords(3, 5);
            for (let k = 0; k < nFilmInSection; k++) {
                const seed = getRandomInt(1, 200000);
                const row = movies[seed + k];
                if (row) {
                    const params = [
                        user_id,
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
    });

    res.json({ message: "DONE" });
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
                section.movies.push(elem);
            });
            sections.push(section);
        }
        res.json({
            message: "success",
            data: sections,
        });
    });
});

// USER

app.get("/user/byId", (req, res) => {
    const params = [req.query.id];
    const sql = "select * from user where id = ?";
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row == undefined) {
            res.status(400).json({ error: "User does not exist." });
            return;
        }
        res.json({
            message: "success",
            data: row,
        });
    });
});

app.post("/user/insert", (req, res) => {
    const user = req.body;
    const params = [
        user.name,
        user.mail,
        user.age,
        user.gender,
        user.avatar,
        user.username,
        user.password,
    ];
    const sql = `insert into user values (NULL,?,?,?,?,?,?,?)`;

    db.run(sql, params, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from user where username = ?",
            [user.username],
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                    data: row,
                });
            }
        );
    });
});

app.post("/user/login", (req, res) => {
    const credentials = req.body;
    const params = [credentials.username, credentials.password];
    const sql = "select * from user where username = ? and password = ?";

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row == undefined) {
            res.status(400).json({ error: "User does not exist." });
            return;
        }
        res.json({
            message: "success",
            data: row,
        });
    });
});

// LIKED

app.get("/liked/isLiked", (req, res) => {
    const params = [Number(req.query.user_id), Number(req.query.movie_id)];
    const sql = "select * from liked where user_id = ? and movie_id = ?";
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            userId: req.query.user_id,
            movieId: req.query.movie_id,
            isLiked: row == undefined ? false : true,
        });
    });
});

app.post("/liked/addLiked", (req, res) => {
    const data = req.body;
    const params = [data.user_id, data.movie_id];
    const sql = "insert into liked values (NULL, ?, ?)";
    db.run(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from liked where user_id = ? and movie_id = ?",
            params,
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                    data: row,
                });
            }
        );
    });
});

app.delete("/liked/removeLiked", (req, res) => {
    const data = req.body;
    const params = [data.user_id, data.movie_id];
    const sql = "delete from liked where user_id = ? and movie_id = ?";

    db.run(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from liked where user_id = ? and movie_id = ?",
            params,
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                });
            }
        );
    });
});

// DISLIKED

app.get("/disliked/isDisliked", (req, res) => {
    const params = [Number(req.query.user_id), Number(req.query.movie_id)];
    const sql = "select * from disliked where user_id = ? and movie_id = ?";
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            userId: req.query.user_id,
            movieId: req.query.movie_id,
            isDisliked: row == undefined ? false : true,
        });
    });
});

app.post("/disliked/addDisliked", (req, res) => {
    const data = req.body;
    const params = [data.user_id, data.movie_id];
    const sql = "insert into disliked values (NULL, ?, ?)";
    db.run(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from disliked where user_id = ? and movie_id = ?",
            params,
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                    data: row,
                });
            }
        );
    });
});

app.delete("/disliked/removeDisliked", (req, res) => {
    const data = req.body;
    const params = [data.user_id, data.movie_id];
    const sql = "delete from disliked where user_id = ? and movie_id = ?";

    db.run(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from disliked where user_id = ? and movie_id = ?",
            params,
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                });
            }
        );
    });
});

// FAVOURITE

app.get("/favourite/isFavourite", (req, res) => {
    const params = [Number(req.query.user_id), Number(req.query.movie_id)];
    const sql = "select * from favourite where user_id = ? and movie_id = ?";
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            userId: req.query.user_id,
            movieId: req.query.movie_id,
            isFavourite: row == undefined ? false : true,
        });
    });
});

app.post("/favourite/addFavourite", (req, res) => {
    const data = req.body;
    const params = [data.user_id, data.movie_id];
    const sql = "insert into favourite values (NULL, ?, ?)";
    db.run(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from favourite where user_id = ? and movie_id = ?",
            params,
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                    data: row,
                });
            }
        );
    });
});

app.delete("/favourite/removeFavourite", (req, res) => {
    const data = req.body;
    const params = [data.user_id, data.movie_id];
    const sql = "delete from favourite where user_id = ? and movie_id = ?";

    db.run(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        db.get(
            "select * from favourite where user_id = ? and movie_id = ?",
            params,
            (err, row) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                });
            }
        );
    });
});

// GENERIC

app.get("/addData", (req, res) => {
    let ids;
    db.all(
        "select movie_id from movies where movie_id > 43815",
        (err, rows) => {
            ids = rows;
            ids.forEach((element) => {
                const duration = Math.floor(Math.random() * (300 - 100) + 100);
                const sql =
                    "update movies set movie_duration = ? where movie_id = ?";
                const params = [duration, element.movie_id];

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
});

app.get("/createTable", (req, res) => {
    const sql =
        "create table favourite(id integer primary key, user_id integer not null, movie_id not null)";
    db.run(sql, (err) => {
        if (err) {
            console.log("ERROR: ", err);
            res.status(400).json({ error: err.message });
            return;
        }
    });

    res.json({ message: "DONE" });
});
