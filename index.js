const tasks = [
  {
    id: "1138465078061",
    completed: false,
    text: "Посмотреть новый урок по JavaScript",
  },
  {
    id: "1138465078062",
    completed: false,
    text: "Выполнить тест после урока",
  },
  {
    id: "1138465078063",
    completed: false,
    text: "Выполнить ДЗ после урока",
  },
];
////
const tasksListContainer = document.querySelector(".tasks-list");
const createTaskForm = document.querySelector(".create-task-block"); // обращение к классу
//////////////////////////////////////////////////////////////////////////////////////////////////
// Создание HTML-разметки для задачи
const createTaskItem = (taskId, taskText) => {
  return `
    <div class="task-item" data-task-id="${taskId}">
      <div class="task-item__main-container">
        <div class="task-item__main-content">
          <form class="checkbox-form">
            <input class="checkbox-form__checkbox" type="checkbox" id="task-${taskId}">
            <label for="task-${taskId}"></label>
          </form>
          <span class="task-item__text">${taskText}</span>
        </div>
        <button class="task-item__delete-button default-button delete-button">Удалить</button>
      </div>
    </div>
  `;
};

// Добавление задач из готового массива в DOM
tasks.forEach((task) => {
  tasksListContainer.innerHTML += createTaskItem(task.id, task.text);
});
///////////////////////////////////////////////////////////////////////////////////////////////

// Функция для отображения ошибки
const showError = (message) => {
  const existingError = document.querySelector(".error-message-block");
  if (!existingError) {
    const errorBlock = document.createElement("span");
    errorBlock.className = "error-message-block";
    errorBlock.textContent = message;
    createTaskForm.append(errorBlock);
  } else {
    existingError.textContent = message; // Обновляем текст, если ошибка уже есть
  }
};

// Функция для удаления блока ошибки
const removeError = () => {
  const existingError = document.querySelector(".error-message-block");
  if (existingError) {
    existingError.remove();
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////

// Функция добавление новой задачи
createTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //проверка на пустую строку
  const newTaskText = event.target.taskName.value.trim();
  if (!newTaskText) {
    showError("Название задачи не должно быть пустым");
    return;
  }

  //проверка на одинаковые задачи
  const existingTask = tasks.find((task) => task.text === newTaskText);
  if (existingTask) {
    showError("Задача с таким названием уже существует.");
    return;
  }

  removeError(); // Удаляем сообщение об ошибке

  const newTask = {
    id: Date.now().toString(),
    text: newTaskText,
    completed: false,
  };
  tasks.push(newTask); // добавление задачи в массив

  tasksListContainer.insertAdjacentHTML(
    "beforeend",
    createTaskItem(newTask.id, newTask.text) // добавление задачи в HTML
  );
  // Применяем тёмную тему к новой задаче, если она включена
  if (isDarkTheme) {
    const newTaskItem = tasksListContainer.querySelector(
      `[data-task-id="${newTask.id}"]`
    );
    if (newTaskItem) {
      newTaskItem.style.color = "#ffffff"; // Стили текста
      const deleteButton = newTaskItem.querySelector("button");
      if (deleteButton) {
        deleteButton.style.border = "1px solid #ffffff"; // Стили кнопки
      }
    }
  }
  event.target.taskName.value = ""; // Очистка поля ввода
});

///////////////////////////////////////////////////////////
//Модальное окно
const modalOverlay = document.createElement("div");
modalOverlay.className = "modal-overlay modal-overlay_hidden";

const deleteModal = `
    <div class="delete-modal">
        <h3 class="delete-modal__question">
            Вы действительно хотите удалить эту задачу?
        </h3>
        <div class="delete-modal__buttons">
            <button class="delete-modal__button delete-modal__cancel-button">
                Отмена
            </button>
            <button class="delete-modal__button delete-modal__confirm-button">
                Удалить
            </button>
        </div>
    </div>
</div>
`;

modalOverlay.innerHTML = deleteModal;
document.body.append(modalOverlay);

//// добавляем обработчик событий для .tasks-list
tasksListContainer.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("task-item__delete-button")) {
    const taskItem = target.closest(".task-item");
    const taskId = taskItem?.dataset.taskId;

    if (taskId) {
      modalOverlay.classList.remove("modal-overlay_hidden");
      modalOverlay.dataset.taskId = taskId;
    }
  }
});

////
modalOverlay.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("delete-modal__cancel-button")) {
    modalOverlay.classList.add("modal-overlay_hidden");
  }

  if (target.classList.contains("delete-modal__confirm-button")) {
    const taskId = modalOverlay.dataset.taskId;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
    }

    const taskHTML = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskHTML) {
      taskHTML.remove();
    }

    modalOverlay.classList.add("modal-overlay_hidden");
  }
});

/////////////////////////////////////////////////////////////

//Очень сильно захотелось снега
class Snow {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "snow-canvas";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "-10";
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.snowflakes = [];
    this.animationFrameId = null;
    this.updateDimensions();
    this.init();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    for (let i = 0; i < 100; i++) {
      this.snowflakes.push(this.createSnowflake());
    }
    this.updateSnowflakes();
  }

  createSnowflake() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 4 + 2,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
    };
  }

  updateSnowflakes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snowflakes.forEach((flake) => {
      flake.y += flake.speed;
      flake.x += (Math.random() - 0.5) * 0.5;

      if (flake.y > this.canvas.height) {
        flake.y = -flake.radius;
        flake.x = Math.random() * this.canvas.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      this.ctx.fill();
    });
    this.animationFrameId = requestAnimationFrame(
      this.updateSnowflakes.bind(this)
    );
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
    this.canvas.remove();
  }
}

// делаем переключатель темы по TAB

let isDarkTheme = false;
let snowInstance = null;

// Функция для применения стилей
function toggleTheme() {
  isDarkTheme = !isDarkTheme;

  // Применяем стили для body
  document.body.style.background = isDarkTheme ? "#24292E" : "initial";

  if (isDarkTheme) {
    snowInstance = new Snow();
  } else {
    snowInstance.stop();
    snowInstance = null;
  }

  // Применяем стили для .task-item
  const taskItems = document.querySelectorAll(".task-item");
  taskItems.forEach((item) => {
    item.style.color = isDarkTheme ? "#ffffff" : "initial";
  });

  // Применяем стили для кнопок
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.border = isDarkTheme ? "1px solid #ffffff" : "none";
  });
}

// Отслеживаем нажатие клавиши
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    toggleTheme(); // переключаем тему
  }
});
