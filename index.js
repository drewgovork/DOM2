// массив c задачами
const tasks = [
  {
    id: "1138465078061",
    completed: false,
    text: "Выполнить что-то там",
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

//
const createTaskForm = document.querySelector(".create-task-block");
//
createTaskForm.addEventListener("submit", (event) => {
  //   console.log(event);
  event.preventDefault();
  //
  const { target } = event;
  const taskNameInput = target.taskName;
  const inputValue = taskNameInput.value.trim();
  ////////////////////////////////////

  //Функция для отображения ошибки
  const showError = (message) => {
    const errorMsgBlock = document.createElement("span");
    errorMsgBlock.className = "error-message-block";
    errorMsgBlock.textContent = message;
    createTaskForm.append(errorMsgBlock);
  };
  //переменная для удаление ошибки
  const existingError = document.querySelector(".error-message-block");

  //
  if (existingError) {
    existingError.remove(); // Удаляем существующее сообщение об ошибке
  }

  if (inputValue) {
    const existingTask = tasks.find((task) => task.text === inputValue);
    if (existingTask) {
      showError("Задача с таким названием уже существует.");
      return; // Завершаем выполнение функции, если задача существует
    }

    const taskId = Date.now().toString();
    const newTask = {
      id: taskId,
      completed: false,
      text: inputValue,
    };
    tasks.push(newTask);
    console.log(tasks);

    addTaskToDOM(newTask);
    taskNameInput.value = ""; // Сбрасываем значение
  } else {
    showError("Название задачи не должно быть пустым!");
  }
});

//////
const tasksList = document.querySelector(".tasks-list");

function addTaskToDOM(task) {
  //
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";
  taskItem.dataset.taskId = task.id;
  //
  //создаем контейнер
  const taskMainContainer = document.createElement("div");
  taskMainContainer.className = "task-item__main-container";
  taskItem.append(taskMainContainer);

  //пихаем новый контейнер в контейнер
  const taskMainContent = document.createElement("div");
  taskMainContent.className = "task-item__main-content";

  //чекбокс пихаем в новый контейнер
  const checkBoxForm = document.createElement("form");
  checkBoxForm.className = "checkbox-form";

  //чекбокс форм пихаем в чекбоксинпут
  const checkBoxInput = document.createElement("input");
  checkBoxInput.className = "checkbox-form__checkbox";
  checkBoxInput.type = "checkbox";
  checkBoxInput.id = `task-${task.id}`;
  checkBoxInput.checked = task.completed;

  //создаем лейбл и пихаем в чекбокс
  const checkBoxLabel = document.createElement("label");
  checkBoxLabel.htmlFor = `task-${task.id}`;
  checkBoxForm.append(checkBoxLabel, checkBoxInput);

  // пихаем спан во второй контейнер
  const taskText = document.createElement("span");
  taskText.className = "task-item__text";
  taskText.textContent = task.text;
  taskMainContent.append(checkBoxForm, taskText);

  // создаем кнопку удаления в первом контейнере
  const deleteButton = document.createElement("button");
  deleteButton.className =
    "task-item__delete-button default-button delete-button";
  deleteButton.textContent = "Удалить";
  taskMainContainer.append(taskMainContent, deleteButton);

  // добавили все HTML-элементы с задачами в элемент по селектору .tasks-list

  tasksList.append(taskItem);
}

tasks.forEach((task) => addTaskToDOM(task));

//// создаем модальное окно
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
tasksList.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("task-item__delete-button")) {
    const taskItem = target.closest(".task-item");
    const taskId = taskItem.dataset.taskId;

    modalOverlay.classList.remove("modal-overlay_hidden");
    modalOverlay.dataset.taskId = taskId;
  }
});

//

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

const body = document.body;
const taskItems = document.querySelectorAll(".task-item");
const buttons = document.querySelectorAll("button");
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
  taskItems.forEach((item) => {
    item.style.color = isDarkTheme ? "#ffffff" : "initial";
  });

  // Применяем стили для кнопок
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
