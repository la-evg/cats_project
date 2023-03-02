const $countCats = document.querySelector('[data-count_cats]')
const $wrapper = document.querySelector('[data-wrapper]')
const $modalAdd = document.querySelector('[data-modal-add]')
const $addBtn = document.querySelector('[data-add_button]')
const $modalEdit = document.querySelector('[data-modal-edit]')
const $btnCloseModalAdd = document.querySelector('[data-close_modal-add]')
const $btnCloseModalEdit = document.querySelector('[data-close_modal-edit]')
const $btnCloseModalView = document.querySelector('[data-close_modal-view]')
const $modalView = document.querySelector('[data-modal-view]')
const $characterInfo = $modalView.querySelector('[data-character]')


const HIDDEN_CLASS = 'hidden'
const OVERFLOW = 'overflow'

//Кнопка открытия модального окна Добавления
$addBtn.addEventListener('click', () => {
    $modalAdd.classList.toggle(HIDDEN_CLASS) // Открываем модалку
    document.body.classList.toggle(OVERFLOW)
})

// Кнопка закрытия модального окна Добавления
$btnCloseModalAdd.addEventListener('click', () => {
    $modalAdd.classList.toggle(HIDDEN_CLASS) //  Закрываем модалку
    document.body.classList.toggle(OVERFLOW)
})

// Кнопка закрытия модального окна редактирования
$btnCloseModalEdit.addEventListener('click', () => {
    $modalEdit.classList.toggle(HIDDEN_CLASS) //  Закрываем модалку
    document.body.classList.toggle(OVERFLOW)
})


$btnCloseModalView.addEventListener('click', () => {
    $modalView.classList.toggle(HIDDEN_CLASS) //  Закрываем модалку
    document.body.classList.toggle(OVERFLOW)
    $characterInfo.replaceChildren()
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
                            <button data-action="view" type="button" class="btn btn-outline-dark btn-sm">Посмотреть</button>
                            <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
                                <button data-action="edit" type="button" class="btn btn-outline-dark"><i
                                        class="fa-solid fa-pen" style="pointer-events: none"></i></button>
                                <button data-action="delete" type="button" class="btn btn-outline-dark"><i
                                        class="fa-solid fa-trash" style="pointer-events: none"></i></button>
                  </div>
              </div>
          </div>
      </div>
  </div>`
    )
}

// Рендер карточек
const gettingCats = async () => {
    const res = await api.getAllCats();
    const data = await res.json();

    data.forEach(cat => {
        $wrapper.insertAdjacentHTML('beforeend', generateCatCard(cat))
    });
}
gettingCats();


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
                callNotification('danger', error, 3000)
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
                    callNotification('success', response.message, 2000)
                }
                // Иначе удаляем карточку
                else {
                    // Вызываем уведомление
                    callNotification('success', response.message, 2000)
                    // Удаляем Элемент
                    $currentCard.remove()
                    // Получаем количество котов
                    gettingCountCats()
                }
            } catch (error) {
                callNotification('danger', error, 3000)
            }
            break;

        // Просмотр кота
        case 'view':
            $currentCard = event.target.closest('[data-card_id]');
            catId = $currentCard.dataset.card_id;
            try {
                const res = await api.getCurrentCat(catId);
                const response = await res.json();
                if (res.status != 200) {
                    callNotification('danger', response.message, 2000)
                }
                else {
                    $modalView.classList.toggle(HIDDEN_CLASS) // Открываем модалку
                    document.body.classList.toggle(OVERFLOW)
                    $modalView.querySelector('#cat_photo').src = response.image
                    const dict = {
                        id: 'ID',
                        name: 'Имя',
                        favorite: 'Любимый',
                        age: 'Возраст',
                        rate: 'Рейтинг',
                        description: 'Описание'
                    }
                    for (key in dict) {
                        $characterInfo.insertAdjacentHTML('beforeend', `<tr><th scope="row" >${dict[key]}</th><td>${response[key]}</td></tr>`)
                    }
                }
            }
            catch (error) {
                callNotification('danger', error, 3000)
            }
            break;

        // Редактирование кота
        case 'edit':
            $currentCard = event.target.closest('[data-card_id]');
            catId = $currentCard.dataset.card_id;
            const $formCat = document.forms.cat_form_edit;
            try {
                const res = await api.getCurrentCat(catId);
                const response = await res.json();
                if (res.status != 200) {
                    callNotification('danger', response.message, 2000)
                }
                else {
                    $modalEdit.classList.toggle(HIDDEN_CLASS)
                    document.body.classList.toggle(OVERFLOW)

                    for (key in response) {
                        $formCat[key].value = response[key]
                    }
                    $modalEdit.querySelector('#cat_photo').src = $formCat.image.value
                    response.favorite ? $formCat.favorite.setAttribute('checked', 'checked') : $formCat.favorite.removeAttribute('checked');
                    $formCat.image.addEventListener("input", (event) => { $modalEdit.querySelector('#cat_photo').src = $formCat.image.value });
                }
            }
            catch (error) {
                callNotification('danger', error, 3000)
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
            // Выводим карточку
            $wrapper.insertAdjacentHTML('beforeend', generateCatCard(data))
            // Меняем src изображения на стандартный
            document.querySelector('#cat_photo').src = './placeholder-image.png'
            // Получаем количество котов
            gettingCountCats()
            //Очищаем local storage
            localStorage.clear();
        }
    } catch (error) {
        console.log(error)
    }
})
//Преобразование, проверка и отправка формы для изменения кота
document.forms.cat_form_edit.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.id = Number(data.id)
    data.age = Number(data.age)
    data.rate = Number(data.rate)
    data.favorite = data.favorite == ''
    try {
        res = await api.changeCurrentCat(Number(data.id), data)
        response = await res.json()
        // Выполняем проверку на статус ошибки
        if (res.status != 200) {
            // Вызываем уведомление
            callNotification('danger', response.message, 2000)
        }
        // Иначе - сбрасываем форму, скрываем модалку и рендерим карточку
        else {
            event.target.reset()
            $modalEdit.classList.add(HIDDEN_CLASS)
            document.body.classList.toggle(OVERFLOW)
            // Вызываем уведомление
            callNotification('success', response.message, 2000)
            // Выводим карточку
            $wrapper.replaceChildren();
            gettingCats()
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
    document.body.insertAdjacentHTML('beforeend', generateNotification(typeOfMessage, message))
    const $notification = document.querySelectorAll('[data-notific]')
    $notification.forEach(el => {
        setTimeout(() => {
            el.remove()
        }, time);
    })

}


//Local storage

const formDataFromLC = localStorage.getItem(document.forms.add_cats_form.dataset.name);
const parsedData = formDataFromLC ? JSON.parse(formDataFromLC) : null;
console.log(formDataFromLC)

if (parsedData) {
  Object.keys(parsedData).forEach(key => {
    document.forms.add_cats_form[key].value = parsedData[key]
  });
}


document.forms.add_cats_form.addEventListener('input', event => {
  const formData = Object.fromEntries(new FormData(document.forms.add_cats_form).entries());

  localStorage.setItem(document.forms.add_cats_form.dataset.name, JSON.stringify(formData))
})

document.querySelector('[data-clear_btn]').addEventListener('click', event => {
  event.preventDefault();
  localStorage.clear();
  document.forms.add_cats_form.reset()
})