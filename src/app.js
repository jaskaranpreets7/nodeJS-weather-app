const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast');

const app = express()
const port = process.env.PORT || 7777

//Define Paths for Express Config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.get('',(req,res)=>{
    res.render('index',{
        title:'Weather app',
        name:'Jaskaranpreet Singh'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Jaskaranpreet Singh'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText:'This is some helpful example',
        title:'Help',
        name:'Jaskaranpreet Singh'
    })
})

app.get('/weather', (req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error) return res.send({error})
        
        forecast(latitude, longitude , (error, forecastData) => {
            if(error) return res.send({ error })

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})
app.get('/help/*',(req,res)=>{
    res.render('404',{
        errorText:'help artical not found',
        title:'404 help',
        name:'Jaskaranpreet Singh'
    })
})


app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        errorText :'404 page not found',
        name:'Jaskaranpreet Singh'
    })
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

