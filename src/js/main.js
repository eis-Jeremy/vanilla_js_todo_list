const inputField = document.querySelector('input[type="text"]');
const todoList = document.querySelector(".todos");
const addBtn = document.querySelector("#add-btn");
const itemsLeftElement = document.querySelector("#items-left");
const allBtn = document.querySelector("#all");
const activeBtn = document.querySelector("#active");
const completedBtn = document.querySelector("#completed");
const mAllBtn = document.querySelector("#m-all");
const mActiveBtn = document.querySelector("#m-active");
const mCompletedBtn = document.querySelector("#m-completed");
const clearCompletedBtn = document.querySelector("#clear");

let todos = [];

const storedTodos = localStorage.getItem("todos");

if (storedTodos) {
    todos = JSON.parse(storedTodos);

    renderTodoList();
}

const addTodoItem = () => {
    const todoText = inputField.value.trim();

    if (todoText !== "") {
        inputField.value = "";

        const todoItemId = Math.floor(Math.random() * 10000);
        const newTodoItem = {
            id: todoItemId,
            text: todoText,
            isComplete: false,
        };

        todos.push(newTodoItem);

        localStorage.setItem("todos", JSON.stringify(todos));

        renderTodoList();
        updateItemsLeft();
    }
};

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && inputField.value.trim() !== "") {
        addTodoItem();
    }
});

addBtn.addEventListener("click", () => {
    if (inputField.value.trim() !== "") {
        addTodoItem();
    }
});

function renderTodoList() {
    todoList.innerHTML = "";

    todos.forEach((todo, i) => {
       
        const newTodoItem = document.createElement("li");
        newTodoItem.className = "card todo-item";
        newTodoItem.setAttribute("draggable", "true");
        newTodoItem.setAttribute("data-index", i);
        
        const todoContent = `
        <div class="todo">
            <input type="checkbox" id="checkbox-${todo.id}" ${todo.isComplete ? "checked" : ""}>
            <label for="checkbox-${todo.id}"></label>
            <p>${todo.text}</p>
        </div>
        <div class="icons">
            <i class="fa fa-pencil" aria-hidden="true"></i>
            <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        `;

        newTodoItem.innerHTML = todoContent;

        todoList.appendChild(newTodoItem);
    });

    addDraggableEventListeners();
}

function toggleTodoCompletion (todoId) {
    todos = todos.map((todo) => {
        if (todoId === todo.id) {
            todo.isComplete = !todo.isComplete;
        }
        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodoList();
    updateItemsLeft();
}

todoList.addEventListener("change", (event) => {
    const checkbox = event.target;
    const todoId = parseInt(checkbox.id.split("-")[1]);
    toggleTodoCompletion(todoId);
});

function editTodo(todoId, updatedTodoText) {
    todos = todos.map((todo) => {
        if (todoId === todo.id) {
            todo.text = updatedTodoText;
        }
        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodoList();
}

todoList.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-pencil")) {
        const icon = event.target;
        const todoItem = icon.closest(".todo-item");
        const todoId = parseInt(
            todoItem.querySelector('input[type="checkbox"]').id.split("-")[1]
        );
        const todoText = todoItem.querySelector("p").textContent;
        const newText = prompt("Edit the Todo-Item", todoText);
        
        if (newText !== null && newText !== "") {
            editTodo(todoId, newText);
        }
    }
});

function deleteTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);
    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodoList();
    updateItemsLeft();
}

todoList.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-times")) {
        const icon = event.target;
        const todoItem = icon.closest(".todo-item");
        const todoId = parseInt(
            todoItem.querySelector('input[type="checkbox"]').id.split("-")[1]
        );

        deleteTodo(todoId);
    }
});

function updateItemsLeft() {
    const incompleteItems = todos.filter(todo => !todo.isComplete);

    itemsLeftElement.textContent = incompleteItems.length;
}

function filterTodoList(filterType) {
    let filteredTodos = [];
    
    switch (filterType) {
        case "all": 
            filteredTodos = todos;
            break;

        case "active":
            filteredTodos = todos.filter(todo => !todo.isComplete);
            break;

        case "completed":
            filteredTodos = todos.filter(todo => todo.isComplete);
            break;
    }

    renderFilteredTodoList(filteredTodos);
}

function renderFilteredTodoList(filteredTodos) {    
    todoList.innerHTML = "";

    filteredTodos.forEach((todo, i) => {
       
        const newTodoItem = document.createElement("li");
        newTodoItem.className = "card todo-item";
        newTodoItem.setAttribute("draggable", "true");
        newTodoItem.setAttribute("data-index", i);
        
        const todoContent = `
        <div class="todo">
            <input type="checkbox" id="checkbox-${todo.id}" ${todo.isComplete ? "checked" : ""}>
            <label for="checkbox-${todo.id}"></label>
            <p>${todo.text}</p>
        </div>
        <div class="icons">
            <i class="fa fa-pencil" aria-hidden="true"></i>
            <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        `;

        newTodoItem.innerHTML = todoContent;

        todoList.appendChild(newTodoItem);
    });

    addDraggableEventListeners();
}

function clearCompletedTodos() {
    todos = todos.filter(todo => !todo.isComplete);
    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodoList();
    updateItemsLeft();
}

allBtn.addEventListener("click", () => {
    allBtn.classList.add("active");
    mAllBtn.classList.add("active");
    activeBtn.classList.remove("active");
    mActiveBtn.classList.remove("active");
    completedBtn.classList.remove("active");
    mCompletedBtn.classList.remove("active");

    filterTodoList("all");
});

mAllBtn.addEventListener("click", () => {
    allBtn.classList.add("active");
    mAllBtn.classList.add("active");
    activeBtn.classList.remove("active");
    mActiveBtn.classList.remove("active");
    completedBtn.classList.remove("active");
    mCompletedBtn.classList.remove("active");

    filterTodoList("all");
});

activeBtn.addEventListener("click", () => {
    allBtn.classList.remove("active");
    mAllBtn.classList.remove("active");
    activeBtn.classList.add("active");
    mActiveBtn.classList.add("active");
    completedBtn.classList.remove("active");
    mCompletedBtn.classList.remove("active");

    filterTodoList("active");
});

mActiveBtn.addEventListener("click", () => {
    allBtn.classList.remove("active");
    mAllBtn.classList.remove("active");
    activeBtn.classList.add("active");
    mActiveBtn.classList.add("active");
    completedBtn.classList.remove("active");
    mCompletedBtn.classList.remove("active");

    filterTodoList("active");
});

completedBtn.addEventListener("click", () => {
    allBtn.classList.remove("active");
    mAllBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    mActiveBtn.classList.remove("active");
    completedBtn.classList.add("active");
    mCompletedBtn.classList.add("active");

    filterTodoList("completed");
});

mCompletedBtn.addEventListener("click", () => {
    allBtn.classList.remove("active");
    mAllBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    mActiveBtn.classList.remove("active");
    completedBtn.classList.add("active");
    mCompletedBtn.classList.add("active");

    filterTodoList("completed");
});


clearCompletedBtn.addEventListener("click", () => {
    clearCompletedTodos();
});

function addDraggableEventListeners() {
    const todoItems = document.querySelectorAll(".todo-item");
    todoItems.forEach((item) => {
        item.addEventListener("dragstart", () => item.classList.add("dragging"));
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
            updateTodosOrder();
        });
    });

    todoList.addEventListener("dragover", (event) => {
        event.preventDefault();

        const draggingItem = document.querySelector(".dragging");
        let siblings = [...todoList.querySelectorAll(".todo-item:not(.dragging)")];
        let nextSibling = siblings.find((sibling) => {
            return event.clientY <= (sibling.offsetTop + (sibling.offsetHeight / 2));
        });

        todoList.insertBefore(draggingItem, nextSibling);
    });

    todoList.addEventListener("dragenter", (event) => event.preventDefault());
}

function updateTodosOrder() {
    const updatedTodos = [];
    const todoItems = document.querySelectorAll(".todo-item");
    
    todoItems.forEach((item) => {
        const index = parseInt(item.getAttribute("data-index"));
        updatedTodos.push(todos[index]);
    });

    todos = updatedTodos;

    localStorage.setItem("todos", JSON.stringify(todos));
}

renderTodoList();
updateItemsLeft();