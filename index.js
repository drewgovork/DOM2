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
	console.log(event);
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
