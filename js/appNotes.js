// Переменные

// Меню навигации
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('nav');
const closeNavMenu = document.getElementById('closeNavMenu');

// Заставка
const screensaver = document.getElementById("screensaver");

// Модальное окно релактирвания
const openEditModalWindow = document.getElementById('editModalPopup');
const closeWindow = document.getElementById('closeWindow');


// Функция открывания меню
menuBtn.onclick = function () {
    navMenu.style.left = '0';
    // screensaver.style.display = 'none';
    // screensaverTwo.style.display = 'flex';
}

// Функция закрытия меню
closeNavMenu.onclick = function () {
    navMenu.style.left = '-150%';
}

// Табы
let tabNavs = document.querySelectorAll(".nav-tab");
let tabPanes = document.querySelectorAll(".tab-pane");
// Отображения списка
let ulListNotes = document.querySelectorAll("#listNotes");
// Поле ввода
let unputNoteCreate = document.querySelectorAll("#titleNote");
// Кнопка добавить
let createBtn = document.querySelectorAll("#createBtn");


// Массив дней недели
arrayDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Функция закрытия меню
closeNavMenu.onclick = function () {
    navMenu.style.left = '-150%';
}

// Функцмя проверки наличия в LocalStorage
function checkLocalStorage() {
    for(i = 0; i < arrayDays.length; i++) {
        if(localStorage.getItem(arrayDays[i]) === null) {
            localStorage.setItem(arrayDays[i], JSON.stringify([]));
        }
    }
}
checkLocalStorage()

function firstWindow() {
    if(tabPanes[0].classList.contains('active') === true) {
        getNotes(arrayDays[0], 0)
        createNote(0, arrayDays[0]);
        activesBtn(0, arrayDays[0]);
    }
}
firstWindow()


// Работа табов
for (i = 0; i < tabNavs.length; i++) {
    
    tabNavs[i].addEventListener("click", function (e) {
        
        e.preventDefault();
        let activeTabAttr = e.target.getAttribute("data-tab");

        for (j = 0; j < tabNavs.length; j++) {
            let contentAttr = tabPanes[j].getAttribute("data-tab-content");

            if (activeTabAttr === contentAttr) {
                tabNavs[j].classList.add("active");
                tabPanes[j].classList.add("active");
                getNotes(arrayDays[j], j)
                createNote(j, arrayDays[j]);
                activesBtn(j, arrayDays[j]);
                
                //console.log(tabPanes[j].classList.contains('active'))


            } else {
                tabNavs[j].classList.remove("active");
                tabPanes[j].classList.remove("active");
            }
        };
    });
}

// Функция показа списка дел
function getNotes(tabIndex, indexUl) {
    ulListNotes[indexUl].innerHTML = '';
    if (JSON.parse(localStorage.getItem(tabIndex)).length === 0) {
        ulListNotes[indexUl].innerHTML = `
        <li id="note" style="background: rgb(235, 242, 224);">
            <div id="text">
                <span style="justify-content: center; text-transform: uppercase;">
                    Дела не запланированы
                </span>
            </div>
        </li>
        `
    }
    for (i = 0; i < JSON.parse(localStorage.getItem(tabIndex)).length; i++) {
        ulListNotes[indexUl].insertAdjacentHTML(
            'beforeend', getNoteTemplate(
                JSON.parse(localStorage.getItem(tabIndex))[i].titleNote,
                JSON.parse(localStorage.getItem(tabIndex))[i].completed,
                i
            )
        );
    }
}

// Функция исполнения заметки (кнопка check)
function activesBtn(tabIndex, arrayIndex) {
    ulListNotes[tabIndex].onclick = function (event) {
        // console.log(event.target)
        if (event.target.dataset.index) {
            // создаем переменную для индекса
            const index = Number(event.target.dataset.index);
            // создаем переменную для типа кнопки
            const type = event.target.dataset.type;
            if (type === 'check') {
                // выбираем из LocalStorage по индексу определенную покупки и проверяем на завершенность
                if (JSON.parse(localStorage.getItem(arrayIndex))[index].completed === false) {
                    // создаем новый массив из LocalStorage
                    const newArrayNote = JSON.parse(localStorage.getItem(arrayIndex));
                    // Меняем выполненность на противоположную
                    newArrayNote[index].completed = true
                    // сохроняем в LocalStorage
                    localStorage.setItem(arrayIndex, JSON.stringify(newArrayNote))
                } else if (JSON.parse(localStorage.getItem(arrayIndex))[index].completed === true) {
                    const newArrayNote = JSON.parse(localStorage.getItem(arrayIndex));
                    newArrayNote[index].completed = false
                    localStorage.setItem(arrayIndex, JSON.stringify(newArrayNote))
                }
                getNotes(arrayIndex, tabIndex)
            }
            // проверяем условие на нажатие кнопки удаления покупки
            if (type === 'remove') {
                const newArrayNote = JSON.parse(localStorage.getItem(arrayIndex));
                newArrayNote.splice(index, 1);
                localStorage.setItem(arrayIndex, JSON.stringify(newArrayNote));
                getNotes(arrayIndex, tabIndex);
            }
        }
    }
}

// Создание заметки
function createNote(indexCreateBtn, index) {
    createBtn[indexCreateBtn].onclick = function () {
        //console.log('Я кнопка ' + indexCreateBtn);
        const newNote = {
            titleNote: unputNoteCreate[indexCreateBtn].value,
            completed: false
        }
        // console.log(newNote)
        notes = JSON.parse(localStorage.getItem(index));
        notes.push(newNote);
        localStorage.setItem(index, JSON.stringify(notes));
        // Очищаем инпут после ввода
        unputNoteCreate[indexCreateBtn].value = '';
        getNotes(index, indexCreateBtn)
    }
}

// Отображение заметок (шаблон)
function getNoteTemplate(titleNote, completed, index) {
    function checkExecutionCompleted() {
        if (completed === true) {
            return `<div class="check">
                        <button
                            id="checkBtn"
                            data-index = "${index}"
                            data-type="check"
                            style="
                                border:none;
                                background: rgb(23, 138, 23);
                            "
                        >
                            <i
                                class="bx bx-check"
                                data-index = "${index}"
                                data-type="check"
                            >
                            </i>
                        </button>
                    </div>`
        } else {
            return `<div class="check">
                        <button
                            id="checkBtn"
                            data-index = "${index}"
                            data-type="check"
                        >

                        </button>
                    </div>`
        }
    }
    return ` 
        <li id="note" style="${completed ? ' background: rgb(176, 233, 176);' : ''}">
            ${checkExecutionCompleted()}
            <div id="text" style="${completed ? 'text-decoration: line-through;' : ''}">
                <span>${titleNote}</span>
            </div>
            <div class="actionBtn">
                <button id="deleteBtn">
                    <i
                        class='bx bxs-trash'
                        data-index = "${index}"
                        data-type="remove"
                    >
                    </i>
                </button>
            </div>
        </li>
    `
}
