const $countCats = document.querySelector('[data-count_cats]')
const $wrapper = document.querySelector('[data-wrapper]')
const $modalAdd = document.querySelector('[data-modal]')
const $addBtn = document.querySelector('[data-add_button]')
const $btnCloseModalAdd = document.querySelector('[data-close_addModal]')


const HIDDEN_CLASS = 'hidden'
const OVERFLOW = 'overflow'

//Кнопка открытия модального окна
$addBtn.addEventListener('click', () => {
    $modalAdd.classList.toggle(HIDDEN_CLASS) // Открываем модалку
    document.body.classList.toggle(OVERFLOW)
})

// Кнопка закрытия модального окна
$btnCloseModalAdd.addEventListener('click', () => {
    $modalAdd.classList.toggle(HIDDEN_CLASS) //  Закрываем модалку
    document.body.classList.toggle(OVERFLOW)
})


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
        `<div class="col col-sm-auto m-2 p-0 d-flex justify-content-center" data-card_id=${cat.id}>
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
                                <button data-action="delete" type="button" class="btn btn-outline-dark"><i
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
    const action = event.target.dataset.action;
    switch (action) {
        // Изменение статуса favorite (like)
        case 'setLike':
            $currentCard = event.target.closest('[data-card_id]');
            catId = $currentCard.dataset.card_id;
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
                const result = await api.changeCurrentCat(catId, data)
                const response = await result.json()
                // Вызываем уведомление
                callNotification('success', response.message, 2000)



            } catch (error) {
                console.log(error)
            }
            break;

        // Удаление кота
        case 'delete':
            $currentCard = event.target.closest('[data-card_id]');
            catId = $currentCard.dataset.card_id;
            try {
                const res = await api.deleteCat(catId);
                const response = await res.json();
                // Выполняем проверку на статус ошибки
                if (res.status != 200) {
                    // Вызываем уведомление
                    callNotification(generateNotification('danger', response.message), 2000)
                }
                // Иначе удаляем карточку
                else {
                    // Вызываем уведомление
                    callNotification('success', response.message, 2000)
                    $currentCard.remove()
                }
            } catch (error) {
                console.log(error);
            }
            break;

        default:
            break;
    }
})

//Преобразование, проверка и отправка формы для добавления кота
document.forms.add_cats_form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.id = Number(data.id)
    data.age = Number(data.age)
    data.rate = Number(data.rate)
    data.favorite = data.favorite == ''
    try {
        let res = await api.addNewCat(data)
        const response = await res.json()
        // Выполняем проверку на статус ошибки
        if (res.status != 200) {
            // Вызываем уведомление
            callNotification('danger', response.message, 2000)
        }
        // Иначе - сбрасываем форму, скрываем модалку и рендерим карточку
        else {
            event.target.reset()
            $modalAdd.classList.add(HIDDEN_CLASS)
            document.body.classList.toggle(OVERFLOW)
            // Вызываем уведомление
            callNotification('success', response.message, 2000)
            $wrapper.insertAdjacentHTML('beforeend', generateCatCard(data))
        }
    } catch (error) {
        console.log(error)
    }
})

//Генерация уведомления
const generateNotification = (typeOfMessage, message) => {
    return (`<div class="toast-container position-fixed bottom-0 end-0 p-3" data-notific>
    <div id="liveToast" class="toast text-bg-${typeOfMessage} fade show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">${message}
            </div>
        </div>
    </div>
</div>`)
}

//Вызов и удаление уведомления
const callNotification = (typeOfMessage, message, time) => {
    $wrapper.insertAdjacentHTML('beforeend', generateNotification(typeOfMessage, message))
    const $notification = document.querySelectorAll('[data-notific]')
    $notification.forEach(el => {
        setTimeout(() => {
            el.remove()
        }, time);
    })

}
