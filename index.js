import Anime from './anime'

export default function AnimePlugin(component, _object) {
    let network = new Lampa.Reguest()
    let object = _object
    let animeComponent
    
    this.search = function(type, filter, page, limit, callback) {
        if (!animeComponent) {
            animeComponent = new Anime(this, object)
        }
        
        return animeComponent.search(type, filter, page, limit, callback)
    }
    
    this.reset = function() {
        if (this.animeComponent) {
            this.animeComponent.reset()
        }
    }
    
    this.destroy = function() {
        network.clear()
        
        if (animeComponent) {
            animeComponent.destroy()
            animeComponent = null
        }
    }
}

export default AnimePlugin
