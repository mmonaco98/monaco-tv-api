function searchByTitle({ db, req }) {
    const params = [req.query.title];
    const sql =
        "select * from movies where movie_title like ? order by movie_popularity desc";
    db.all(sql, params, (err, rows) => {
        let error, response;
        if (err) {
            error = err;
        } else {
            response = rows;
        }
        return [response, error];
    });
}

module.exports = searchByTitle;
