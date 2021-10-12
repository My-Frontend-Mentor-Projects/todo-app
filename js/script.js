const body = document.querySelector('body');
const themeSwitch = document.getElementById('theme-switch');
const inputs = document.getElementById('new-task');
let tasksData = JSON.parse(localStorage.getItem('tasks') || '[]');
const taskList = document.getElementById('tasklist');
const categories = document.querySelectorAll('.category');
const itemsLeft = document.getElementById('items-left');
const clearTasks = document.getElementById('clear-completed');
let isDark = false;
let newTaskStatus = 'active';
let taskStatus = 'active';

class Task {
    constructor(id, status, name) {
        this.id = id;
        this.status = status;
        this.name = name;
    }
}

function loadTheme() {
    let currentTheme = localStorage.getItem('theme');
    currentTheme == 'dark' ? isDark = true : isDark = false;
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleDarkTheme() {
    if (!isDark) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        isDark = true;
    } else {
        localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
        isDark = false;
    }
}

function useCustomCheckbox(item) {
    item.classList.toggle('checked');

    if (item.parentElement.classList.contains('new-task')) {
        item.classList.contains('checked') ? newTaskStatus = 'completed' : newTaskStatus = 'active';
    }
    else {
        item.classList.contains('checked') ? taskStatus = 'completed' : taskStatus = 'active';
        item.nextSibling.classList.toggle('completed');
        item.nextSibling.classList.contains('completed') ? updateTaskOnLocalStorage(item.parentElement.dataset.taskId, 'completed') : updateTaskOnLocalStorage(item.parentElement.dataset.taskId, 'active');
    }
}

function addTaskToLocalStorage(status, name) {
    let task = new Task(Date.now(), status, name);
    tasksData.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasksData));
}

function loadTask(taskId, taskStatus, taskName) {
    let itemIsChecked = taskStatus === 'completed' ? 'checked' : '';
    let itemIsCompleted = taskStatus === 'completed' ? 'completed' : '';
    let task =
        `<div class="task" data-task-id=${taskId}><span class="custom-check ${itemIsChecked}"></span><p class="task-text ${itemIsCompleted}">${taskName}</p><span class="delete-task"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></span></div>`;
    taskList.insertAdjacentHTML('afterbegin', task);
}

function loadTasks(status = 'all') {
    taskList.textContent = '';
    if (status === 'all') {
        // Load data on DOM
        tasksData.forEach((task) => loadTask(task.id, task.status, task.name));
        // task Management
        let tasks = document.querySelectorAll('.task');
        tasks.forEach((task) => {
            // set as active/completed
            task.children[0].addEventListener('click', () => useCustomCheckbox(task.children[0]));
            // delete task
            task.children[2].addEventListener('click', () => {
                task.remove();
                deleteTaskFromLocalStorage(task.dataset.taskId);
                itemsLeft.textContent = `${tasks.length} items left`;
            });
        })
        itemsLeft.textContent = `${tasks.length} items left`;
        categories[0].classList.add('active');
    } else {
        let filter = tasksData.filter(task => task.status === status);
        filter.forEach((task) => loadTask(task.id, task.status, task.name));
        itemsLeft.textContent = `${filter.length} items left`;
    }
}

function updateTaskOnLocalStorage(id, status) {
    let updatedTasks = tasksData.map((task) => {
        if (task.id === Number(id)) {
            task.status = status;
            return task;
        } else {
            return task;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function deleteTaskFromLocalStorage(id) {
    let taskIndex = tasksData.findIndex((task) => task.id == id);
    tasksData.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasksData));
}

function clearCompletedTasks() {
    let clearTasks = tasksData.filter(task => task.status != 'completed');
    localStorage.setItem('tasks', JSON.stringify(clearTasks));
    location.reload();
}

function clearInputs() {
    newTaskStatus = 'active';
    inputs.children[0].classList.remove('checked');
    inputs.children[1].value = '';
}

// Set Light/Dark Theme
themeSwitch.addEventListener('click', toggleDarkTheme);
// Add new task
inputs.children[0].addEventListener('click', () => useCustomCheckbox(inputs.children[0]));
inputs.children[1].addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addTaskToLocalStorage(newTaskStatus, inputs.children[1].value);
        loadTasks();
        clearInputs();
    }
})
// Filter Active/Completed Tasks
categories.forEach((category, index) => {
    category.addEventListener('click', () => {
        let prevIndex = index - 1;
        let nextIndex = index + 1;
        prevIndex = index - 1 < 0 ? prevIndex = 2 : prevIndex;
        nextIndex > 2 ? nextIndex = 0 : nextIndex;
        categories[prevIndex].classList.remove('active');
        categories[index].classList.add('active');
        categories[nextIndex].classList.remove('active');
        loadTasks(category.dataset.category);
    });
})
// Clear completed tasks
clearTasks.addEventListener('click', clearCompletedTasks);

// On Load
loadTheme();
loadTasks();


