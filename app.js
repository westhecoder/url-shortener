const express = require('express')
const shortId = require('shortId')
const pool = require('./db')


const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req, res) => {
    
    try {
        const allurls = await pool.query(
            'SELECT * FROM urls')

        res.render('index', {allurls: allurls.rows})

    } catch (err) {
        console.log(err.message)
    }
    
})

app.post('/:shortUrls', async (req, res) => {
    const fullurl = req.body.fullUrl
    const shorturl = shortId.generate()

    try {
        const urls = await pool.query(
            'INSERT INTO urls VALUES ($1, $2, $3)', [fullurl, shorturl, 0])
    } catch (err) {
        console.log(err.message)
    }
    res.redirect('/')
})

app.get('/:shortUrl',async (req, res) => {

    try {
        const shorturl = await pool.query(
            'SELECT fullurl FROM urls WHERE shorturl = $1', [req.params.shortUrl])
        
        if(shorturl.rows.length == 0) return res.sendStatus(404)
        
        await pool.query(
            'UPDATE urls SET count = count + 1 WHERE shorturl = ($1)', [req.params.shortUrl])

        res.redirect(shorturl.rows[0].fullurl)
    } catch (err) {
        console.log(err.message)
    }
    
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('Server running at port:',port)
})