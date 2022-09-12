const express = require('express')
const shortId = require('shortId')
const pool = require('./db')


const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {

    try {
        const allurls = await pool.query(
            'SELECT * FROM urls')

        res.render('index', { allurls: allurls.rows })

    } catch (err) {
        console.log(err.message)
    }

})

app.post('/:shortUrls', async (req, res) => {
    const fullurl = req.body.fullUrl
    const shorturl = shortId.generate()

    pool.query(`INSERT INTO urls VALUES ($1, $2, $3)`, [fullurl, shorturl, 0],
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

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server running at port:', port)
})