// Select DOM elements
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date-input');
const dueTimeInput = document.getElementById('due-time-input'); // New due time input
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCountDisplay = document.getElementById('task-count');
const searchInput = document.getElementById('search-input');
const sortTasksBtn = document.getElementById('sort-tasks-btn');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');

// Load tasks and theme from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = ''; // Clear the list
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    // Sort tasks if necessary
    const sortedTasks = filteredTasks.sort((a, b) => {
        // Sort by priority first, then by due date and time
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        const dateA = new Date(a.dueDate + 'T' + (a.dueTime || '00:00'));
        const dateB = new Date(b.dueDate + 'T' + (b.dueTime || '00:00'));
        return priorityOrder[a.priority] - priorityOrder[b.priority] || dateA - dateB;
    });

    sortedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.text} - ${task.priority} - Due: ${task.dueDate ? task.dueDate + ' ' + (task.dueTime || 'No time') : 'No date'}`;
        
        // Completed tasks
        if (task.completed) {
            li.classList.add('completed');
        }

        // Overdue tasks
        if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
            li.classList.add('overdue');
        }

        // Due today
        if (task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString() && !task.completed) {
            li.classList.add('due-today');
        }

        // Edit and complete buttons
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.onclick = () => toggleComplete(index);
        li.appendChild(completeBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTask(index);
        li.appendChild(editBtn);

        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Function to add a new task
function addTask() {
    const text = taskInput.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;
    const dueTime = dueTimeInput.value; // Capture the due time

    if (text) {
        tasks.push({
            text,
            priority,
            dueDate,
            dueTime, // Store the due time
            completed: false
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = ''; // Reset due time input
        renderTasks();
    }
}

// Function to toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to edit a task
function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.text;
    prioritySelect.value = task.priority;
    dueDateInput.value = task.dueDate;
    dueTimeInput.value = task.dueTime; // Set the due time for editing

    // Remove the task from the array and re-render
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to update task count display
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    taskCountDisplay.textContent = `Total Tasks: ${totalTasks}, Completed: ${completedTasks}`;
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
searchInput.addEventListener('input', renderTasks);
sortTasksBtn.addEventListener('click', renderTasks);
document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedTasks);
toggleThemeBtn.addEventListener('click', toggleTheme);

// Function to toggle dark/light theme
function toggleTheme() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
    renderTasks();
}

// Initialize theme
if (darkMode) {
    document.body.classList.add('dark-mode');
}

// Initial render
renderTasks();
// Select DOM elements for statistics
const completedCountDisplay = document.getElementById('completed-count');
const overdueCountDisplay = document.getElementById('overdue-count');
const averageTimeDisplay = document.getElementById('average-time');

// Function to calculate statistics
function calculateStatistics() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const overdueTasks = tasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date() && !task.completed).length;
    
    // Calculate average time taken (assuming you want to use due date and current time for calculation)
    let totalTimeTaken = 0;
    let totalCompletedTasks = 0;

    tasks.forEach(task => {
        if (task.completed && task.dueDate) {
            const dueDateTime = new Date(task.dueDate + 'T' + (task.dueTime || '00:00'));
            const timeTaken = Math.floor((new Date() - dueDateTime) / (1000 * 60)); // Time in minutes
            totalTimeTaken += timeTaken > 0 ? timeTaken : 0; // Only consider positive time taken
            totalCompletedTasks++;
        }
    });

    const averageTime = totalCompletedTasks > 0 ? (totalTimeTaken / totalCompletedTasks).toFixed(2) : 0;

    // Update the display
    completedCountDisplay.textContent = `Completed Tasks: ${completedTasks}`;
    overdueCountDisplay.textContent = `Overdue Tasks: ${overdueTasks}`;
    averageTimeDisplay.textContent = `Average Time Taken: ${averageTime} minutes`;
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = ''; // Clear the list
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    // Sort tasks if necessary
    const sortedTasks = filteredTasks.sort((a, b) => {
        // Sort by priority first, then by due date and time
        const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
        const dateA = new Date(a.dueDate + 'T' + (a.dueTime || '00:00'));
        const dateB = new Date(b.dueDate + 'T' + (b.dueTime || '00:00'));
        return priorityOrder[a.priority] - priorityOrder[b.priority] || dateA - dateB;
    });

    sortedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = `${task.text} - ${task.priority} - Due: ${task.dueDate ? task.dueDate + ' ' + (task.dueTime || 'No time') : 'No date'}`;
        
        // Completed tasks
        if (task.completed) {
            li.classList.add('completed');
        }

        // Overdue tasks
        if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
            li.classList.add('overdue');
        }

        // Due today
        if (task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString() && !task.completed) {
            li.classList.add('due-today');
        }

        // Edit and complete buttons
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.onclick = () => toggleComplete(index);
        li.appendChild(completeBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTask(index);
        li.appendChild(editBtn);

        taskList.appendChild(li);
    });

    updateTaskCount();
    calculateStatistics(); // Update statistics after rendering tasks
}

// Function to add a new task
function addTask() {
    const text = taskInput.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;
    const dueTime = dueTimeInput.value; // Capture the due time

    if (text) {
        tasks.push({
            text,
            priority,
            dueDate,
            dueTime, // Store the due time
            completed: false
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = ''; // Reset due time input
        renderTasks();
    }
}

// Function to toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to edit a task
function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.text;
    prioritySelect.value = task.priority;
    dueDateInput.value = task.dueDate;
    dueTimeInput.value = task.dueTime; // Set the due time for editing

    // Remove the task from the array and re-render
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to clear completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Function to update task count display
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    taskCountDisplay.textContent = `Total Tasks: ${totalTasks}, Completed: ${completedTasks}`;
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
searchInput.addEventListener('input', renderTasks);
sortTasksBtn.addEventListener('click', renderTasks);
document.getElementById('clear-completed-btn').addEventListener('click', clearCompletedTasks);
toggleThemeBtn.addEventListener('click', toggleTheme);

// Function to toggle dark/light theme
function toggleTheme() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
    renderTasks();
}

// Initialize theme
if (darkMode) {
    document.body.classList.add('dark-mode');
}

// Initial render
renderTasks();
