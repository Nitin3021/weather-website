const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const { geocode, reverseGeocode } = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Nitin P'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Nitin P'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text!',
        title: 'Help',
        name: 'Nitin P'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address is not provided!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/weather/currentLocation', (req, res) => {
    if (!req.query.latitude || !req.query.longitude) {
        return res.send({
            error: 'Co-ordinates not provided!'
        })
    }

    reverseGeocode(req.query.latitude, req.query.longitude, (error, { location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(req.query.latitude, req.query.longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                location: location,
                forecast: forecastData
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nitin P',
        errorMessage: 'Help article not found!!!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Nitin P',
        errorMessage: 'Page not found!'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})