const getMovieDataById = ({ db, req, res }) => {
    const params = [req.query.id];
    const sql = "select * from movies where movie_id = ?";
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.json({
                message: "getMovieData/byId: success",
                data: res,
            });
        }
    });
};

module.exports = getMovieDataById;
