export default class MovieService {
    apiURL = 'https://api.themoviedb.org/3'

    apiKey = '513bf9f08c1740f99aadbe1ee3e7e9ee'

    async getMovies(label, pageNumber) {
        const response = await fetch(`${this.apiURL}/search/movie?api_key=${this.apiKey}&language=en-US&query=${label}&page=${pageNumber}`)
        if (!response.ok) {
            throw new Error(``)
        }
        const result = response.json()
        return result
    }

    async getGuestToken() {
        const response = await fetch(`${this.apiURL}/authentication/guest_session/new?api_key=${this.apiKey}`)
        if (!response.ok) {
            throw new Error(`Could not get quest token, please, retry`)
        }
        const token = await response.json()
        return token.guest_session_id
    }

    async getGenres() {
        const response = await fetch(`${this.apiURL}/genre/movie/list?api_key=${this.apiKey}`)
        if (!response.ok) {
            throw new Error(`Could not get genres, please, retry`)
        }
        const genres = await response.json()
        return genres.genres
    }
}