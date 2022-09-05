const { Pokemon } = require('../db/sequelize')
const {Op, where,ValidationError} = require('sequelize')
const auth = require('../auth/auth')

  
module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {
    if(req.query.name ){
      const limit = parseInt(req.query.limit) || 5
      const name = req.query.name
      if(name.length < 2){
        const message='LE terme de recherche doit contenir au moins 2 caractères'
        res.status(400).json({ message:message})

      }
      return Pokemon.findAndCountAll({
        where : {
          name: {//'name' est la propriété du modèle pokémon
            [Op.like] : `%${name}%`//'name' est le critère de la recherche
          }
        },
        order:['name'], //genre order by en sql version sequelize
      
        limit: limit// genre limit en sql
      })
      .then(({count,rows}) => {
        const plurielSingulierPok = count > 1 ? 'pokemons' : 'pokemon'
        const plurielSingulierCorrespond = count > 1 ? 'correspondent' : 'correspond'
        const message = `Il y a ${count} ${plurielSingulierPok} qui ${plurielSingulierCorrespond} au terme de recherche ${name}`
        res.json({ message, data: rows })
      })
      
    }
    else {
      Pokemon.findAll()
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error=>{
        const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants`
        res.status(500).json({message,data:error})
      })
    }
  })
}