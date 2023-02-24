class CatsApi {
  constructor(apiName) {
    this.url = `https://cats.petiteweb.dev/api/single/${apiName}`
  }

  // Запрос на получение количества айдишников в базе
  getCountCat() {
    return fetch(`${this.url}/ids`)
  }
  // Запрос на получение всех котов в базе
  getAllCats() {
    return fetch(`${this.url}/show`)
  }

  // Запрос на получение одного кота по id
  getCurrentCat(id) {
    return fetch(`${this.url}/show/${id}`)
  }

  // Запрос на изменение данных кота по id
  changeCurrentCat(id, data) {
    return fetch(`${this.url}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }
}

const DB_NAME = 'la-evg';
const api = new CatsApi(DB_NAME);