// Плашка в шапке сайта под количество котов
const $countCats = document.querySelector('[data-count_cats]')
const $wrapper = document.querySelector('[data-wrapper]')


// Функция для вывода количества айдишников в базе
const gettingCountCats = async () => {
    const res = await api.getCountCat();
    const data = await res.json();
    $countCats.innerText = data.length;
}
gettingCountCats();

// Генерация карточки с котом
const generateCatCard = (cat) => {
    return (
        `<div class="col m-2 p-0" data-card_id=${cat.id}>
      <div class="card" style="width: 18rem;">
      <i class="${cat.favorite ? "fa-solid" : "fa-regular"} fa-heart like" data-action="setLike"></i>
          <img class="object-fit-cover rounded" style="height: 250px;"
              src="${cat.image}"
              class="card-img-top" alt="Фото кота ${cat.name}">
          <div class="card-body">
              <h5 class="card-title">${cat.name}</h5>
              <p class="card-text text-truncate">${cat.description}</p>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-outline-dark btn-sm">Посмотреть</button>
                            <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                                <button type="button" class="btn btn-outline-dark"><i
                                        class="fa-solid fa-pen"></i></button>
                                <button type="button" class="btn btn-outline-dark"><i
                                        class="fa-solid fa-trash"></i></button>
                  </div>
              </div>
          </div>
      </div>
  </div>`
    )
}

// Рендер карточек
const firstGettingCats = async () => {
    const res = await api.getAllCats();
    const data = await res.json();

    data.forEach(cat => {
        $wrapper.insertAdjacentHTML('beforeend', generateCatCard(cat))
    });
}
firstGettingCats();

// Слушатель кнопок
$wrapper.addEventListener('click', async (event) => {
    const $currentCard = event.target.closest('[data-card_id]');
    const action = event.target.dataset.action;
    const catId = $currentCard.dataset.card_id;
    switch (action) {
        // Изменение статуса favorite (like)
        case 'setLike':
            try {
                // Выполняем проверку статуса favorite
                const res = await api.getCurrentCat(catId)
                const data = await res.json()
                const iconElem = $currentCard.querySelector('.like')
                if (data.favorite) {
                    // Меняем статус и изменяем class иконки
                    data.favorite = false;
                    iconElem.classList.toggle("fa-solid")
                    iconElem.classList.toggle("fa-regular")
                }
                else {
                    // Меняем статус и изменяем class иконки
                    data.favorite = true;
                    iconElem.classList.toggle("fa-regular")
                    iconElem.classList.toggle("fa-solid")
                }
                // Меняем статус и изменяем class иконки
                api.changeCurrentCat(catId, data)

            } catch (error) {
                console.log(error)
            }
            break;

        default:
            break;
    }
})
