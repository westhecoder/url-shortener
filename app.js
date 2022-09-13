const express = require('express')
const shortId = require('shortId')
const pool = require('./db')


const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {

    pool.query(`SELECT * FROM urls`,
        (err, results) => {
            if (err) {
                throw err
            }

            res.render('index', { results: results.rows })
        })


})

app.get('/delete/:shortLink', async (req, res) => {

    console.log(req.params.shortLink)
    pool.query(`DELETE FROM urls WHERE shorturl = ($1) RETURNING *`, [req.params.shortLink],
        (err, results) => {
            if (err) {
                throw err
            }

            console.log(results.rows)

            res.redirect('/')
        })
})

app.post('/:shortUrls', async (req, res) => {
    /*  const fullurl = req.body.fullUrl
     const shorturl = shortId.generate() */

    pool.query(`INSERT INTO urls VALUES ($1, $2, $3)`, [req.body.fullUrl, shortId.generate(), 0],
        (err, results) => {
            if (err) {
                throw err
            } else {
                res.redirect('/')
            }
        })
})

app.get('/:shortUrl', async (req, res) => {


    pool.query(`SELECT fullurl FROM urls WHERE shorturl = $1`, [req.params.shortUrl],
        (err, results) => {
            if (err) {
                throw err
            }

            if (results.rows == 0) return res.statusCode(404)


            pool.query(`UPDATE urls SET count = count + 1 WHERE shorturl = ($1) RETURNING *`, [req.params.shortUrl],
                (err, results) => {
                    if (err) {
                        throw err
                    }
                    res.redirect(results.rows[0].fullurl)
                })
        })

})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Date: ${new Date().toLocaleDateString()}) at ${new Date().toLocaleTimeString()}, Server started on port ${PORT} `)
})