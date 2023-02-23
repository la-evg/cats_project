class CatsApi {
    constructor(apiName) {
      this.url = `https://cats.petiteweb.dev/api/single/${apiName}`
    }
    getCountCat() {
        return fetch (`${this.url}/ids`)
    }
  }
  
  const DB_NAME = 'la-evg';
  const api = new CatsApi(DB_NAME);