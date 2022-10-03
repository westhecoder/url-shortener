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

app.post('/:shortUrls', async (req, res) => {

    //Save a URL, first checking if the long url already exisits then save if it doesn't exist. 
    pool.query(`SELECT * FROM urls WHERE fullurl = ($1)`, [req.body.fullUrl],
        (err, results) => {
            if (err) {
                throw err
            }

            console.log(results.rows)
            if (results.rows.length === 0) {

                pool.query(`INSERT INTO urls VALUES ($1, $2, $3)`, [req.body.fullUrl, shortId.generate(), 0],
                    (err, results) => {
                        if (err) {
                            throw err
                        } else {
                            res.redirect('/')
                        }
                    })
            } else {
                console.log('url exisits')
                res.redirect('/')

            }
        })

})

app.put('/nshorturl/:results', async (req, res) => {

    const [oldShorturl, newShortUrl] = req.params.results.split(' ')
    /* 
        const oldShorturl = req.params.results.slice(0, 9)
        const newShortUrl = req.params.results.slice(10) */

    pool.query(`UPDATE urls SET shorturl = ($1) WHERE shorturl = ($2) RETURNING *`, [newShortUrl, oldShorturl],
        (err, results) => {
            if (err) {
                throw err
            }

            console.log(results.rows)
            res.redirect('/')
        })

    console.log(oldShorturl, ' and ', newShortUrl)
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

app.get('/:shortUrl', async (req, res) => {


    pool.query(`SELECT fullurl FROM urls WHERE shorturl = ($1)`, [req.params.shortUrl],
        (err, results) => {
            if (err) {
                throw err
            }

            if (results.rows == 0) return res.status(404)


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
    console.log(`Date: ${new Date().toLocaleDateString()}) at ${new Date().toLocaleTimeString()}, Server started on port ${PORT}`)
})