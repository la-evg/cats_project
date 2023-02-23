/// Плашка в шапке сайта под количество котов
const $countCats = document.querySelector('[data-count_cats]')

/// Функция для вывода количества айдишников в базе
const gettingCountCats = async () => {
    const res = await api.getCountCat();
    const data = await res.json();
    $countCats.innerText = data.length;
}
gettingCountCats();

