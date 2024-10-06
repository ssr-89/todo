const form = document.getElementById('form')
const input = form.querySelector('input')
const todolist = document.getElementById('todolist')
const todoboxlist = document.querySelector('.todobox--list')

let tasks = []

// проверка хранилища браузера на наличие данных по массиву
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))

  // перебор данных из хранилища браузера и добавление в массив
  tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
todolist.addEventListener('click', deleteTask)
todolist.addEventListener('click', doneTask)

function addTask(e) {
  e.preventDefault()

  const inputValue = input.value

  const newTask = {
    id: Date.now(),
    text: inputValue,
    done: false
  }

  tasks.push(newTask)

  // добавление задачи в хранилище браузера localStorage
  saveToLocalStorage()

  renderTask(newTask)

  input.value = ''
  input.focus()

  checkEmptyList()
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') return
  const parentNode = event.target.closest('.todolist__task')

  // определение id задачи
  const id = Number(parentNode.id)

  // короткий способ
  tasks = tasks.filter((task) => task.id !== id)

  // добавление задачи в хранилище браузера localStorage
  saveToLocalStorage()

  parentNode.remove()

  checkEmptyList()
}

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return

  const parentNode = event.target.closest('.todolist__task')

  const id = Number(parentNode.id)

  // метод find действует как findIndex, только выискивает весь объект
  const task = tasks.find((task) => task.id === id) // если task.id === id, то return true

  task.done = !task.done

  // добавление задачи в хранилище браузера localStorage
  saveToLocalStorage()

  const taskTitle = parentNode.querySelector('.todolist__task-title')

  // ДОБАВЛЕНИЕ/УДАЛЕНИЕ КЛАССА
  // короткий способ
  taskTitle.classList.toggle('task-title--done', task.done);
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<div id="emptylist" class="todobox__header todobox--listheader">
              <img class="todobox__img img" src="img/leaves.svg" alt="Лепесток">
              <h2 class="todobox__title todobox--listtitle title">Список дел пуст</h2>
            </div>`

    todoboxlist.insertAdjacentHTML('afterbegin', emptyListHTML)
  } else if (tasks.length > 0) {
    const emptylistEl = document.getElementById('emptylist')
    emptylistEl ? emptylistEl.remove() : null
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
  const cssClass = task.done ? 'todolist__task-title task-title task-title--done' : 'todolist__task-title task-title'

  const taskHTML = `
              <li id="${task.id}" class="todolist__task">
                <span class="${cssClass}">
                  ${task.text}
                </span>
                <div class="todolist__wrap-btns">
                  <button class="todolist__btn todolist__btn--done btn" data-action="done">
                    <img class="todolist__img img-done img" src="img/done.svg" alt="Готово">
                    <span class="tooltip">Выполнить</span>
                  </button>
                  <button class="todolist__btn todolist__btn--delete btn" data-action="delete">
                    <img class="todolist__img img-delete img" src="img/delete.svg" alt="Удалить">
                    <span class="tooltip">Удалить</span>
                  </button>
                </div>
              </li>`

  todolist.insertAdjacentHTML('beforeend', taskHTML)
}