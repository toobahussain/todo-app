const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const clearAll = document.getElementById("clearAll");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let nextTaskId =
    Number(localStorage.getItem("nextTaskId")) || 1;
let currentFilter = "all";

function sanitizeInput(text){
    return text
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .trim();
}

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function addTask(){

    const text = sanitizeInput(taskInput.value);


if (text.trim() === "") {
    alert("Task cannot be empty!");
    return;
}


const isOnlySpecialChars = /^[^a-zA-Z0-9]+$/.test(text);

if (isOnlySpecialChars) {
    alert("Task cannot contain only special characters!");
    return;
}

    const task = {
    id: nextTaskId,
    text,
    completed:false,
    createdAt:new Date().toLocaleString()
};

    tasks.push(task);

nextTaskId++;

localStorage.setItem(
    "nextTaskId",
    nextTaskId
);

saveTasks();
renderTasks();

taskInput.value = "";
}

function deleteTask(id){

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){
            return {
                ...task,
                completed:!task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function updateCounts(){

    const completed =
        tasks.filter(task => task.completed).length;

    const pending =
        tasks.length - completed;

    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "pending"){
        filteredTasks = tasks.filter(
            task => !task.completed
        );
    }

    if(currentFilter === "completed"){
        filteredTasks = tasks.filter(
            task => task.completed
        );
    }

    if(filteredTasks.length === 0){

        taskList.innerHTML = `
            <div class="empty-message">
                No tasks found
            </div>
        `;

        updateCounts();
        return;
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        li.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <div>
                    <div class="task-text ${task.completed ? "completed" : ""}">
                        ${task.text}
                    </div>

                    <small>
                        ${task.createdAt}
                    </small>
                </div>

            </div>

            <button class="delete-btn">
                Delete
            </button>
        `;

        li.querySelector("input")
        .addEventListener("change",() => {
            toggleTask(task.id);
        });

        li.querySelector(".delete-btn")
        .addEventListener("click",() => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    });

    updateCounts();
}

addBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keypress",
    function(e){

        if(e.key === "Enter"){
            addTask();
        }
    }
);

clearAll.addEventListener(
    "click",
    () => {

        if(tasks.length === 0){
            return;
        }

        if(confirm("Delete all tasks?")){

           tasks = [];

           nextTaskId = 1;

          localStorage.setItem(
          "nextTaskId",
           nextTaskId
        );

        saveTasks();

        renderTasks();
        }
    }
);

filterButtons.forEach(button => {

    button.addEventListener("click",() => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();
    });
});

renderTasks();