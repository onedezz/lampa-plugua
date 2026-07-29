import Utils from '../utils/utils'

export default function Anime(component, _object) {
    let network = new Lampa.Reguest()
    let object = _object
    
    this.search = function(type, filter, page, limit, callback) {
        network.clear()
        
        if (type === 'manga') {
            type = 'anime' // Fallback to anime API for now
        }
        
        let url = 'https://api.jikan.moe/v4/' + type
        
        if (filter && filter.startsWith('rating_')) {
            let order = filter.replace('rating_', '')
            let sortDir = order === 'desc' ? '-score_by_users' : 'score_by_users'
            
            url += '?order_by=' + sortDir + '&page=' + page + '&limit=' + limit
        } else if (filter && filter.includes('_')) {
            let parts = filter.split('_')
            let param = parts[1]
            
            if (param === 'media_manga') {
                url += '?media=manga&page=' + page + '&limit=' + limit
            } else if (param === 'media_novel') {
                url += '?media=novel&page=' + page + '&limit=' + limit
            } else if (param === 'media_web') {
                url += '?media=web_tv&page=' + page + '&limit=' + limit
            } else if (param === 'media_movie') {
                url += '?type=movie&page=' + page + '&limit=' + limit
            } else if (param === 'source_original') {
                url += '?source=original&page=' + page + '&limit=' + limit
            }
        }
        
        network.silent(url, function(json) {
            if (!json.data || json.data.length === 0) {
                callback({ results: [] })
                return
            }
            
            let data = json.data.map(item => ({
                id: item.mal_id,
                title: item.title_japanese || item.title_en || item.title,
                original_title: item.title_japanese || item.title,
                poster_image_url: item.images.jpg.large_image_url || '',
                url: '/anime/' + item.mal_id,
                type: item.type || 'TV',
                episodes: item.episodes || 0,
                status: item.status || '',
                score: Math.round(item.score * 10) / 10 || 0,
                scored_by: item.scored_by || 0,
                rank: item.rank || 999999,
                year: item.year || '',
                seasons: [item.seasons] || [],
                genres: item.genres.map(g => g.name),
                source: 'anime'
            }))
            
            callback({ results: data })
        }, function(a, c) {
            component.empty('Jikan API Error')
        })
    }
    
    this.extendChoice = function(saved) {
        // Placeholder for future choice extensions
    }
    
    this.reset = function() {
        network.clear()
    }
    
    this.destroy = function() {
        network.clear()
    }
}
