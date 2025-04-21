document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const categorySelect = document.getElementById('categorySelect');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.querySelector('.theme-toggle');
    const optionsContainer = document.querySelector('.options-container');

    // Set today's date as the default
    const today = new Date();
    dateInput.valueAsDate = today;

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Initial render
    renderTasks();
    updateTaskCount();

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Replace the taskInput event listener
    taskInput.addEventListener('focus', () => {
        optionsContainer.classList.add('show');
    });

    // Add a click event listener to document to handle clicking outside
    document.addEventListener('click', (e) => {
        // If click is outside the task input and options container
        if (!taskInput.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.remove('show');
        }
    });

    // Keep options visible when clicking inside the options container
    optionsContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') {
            // Shake animation for empty input
            taskInput.classList.add('shake');
            setTimeout(() => taskInput.classList.remove('shake'), 500);
            return;
        }

        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            date: dateInput.value,
            priority: prioritySelect.value,
            category: categorySelect.value,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateTaskCount();

        // Clear input
        taskInput.value = '';

        // Animation for new task
        anime({
            targets: `.task-item[data-id="${newTask.id}"]`,
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, .8)',
            duration: 800
        });
    }

    function toggleTaskStatus(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            
            const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
            const checkbox = taskElement.querySelector('.task-checkbox');
            
            if (task.completed) {
                // Celebration animation
                const confetti = [];
                for (let i = 0; i < 30; i++) {
                    const div = document.createElement('div');
                    div.className = 'confetti';
                    div.style.left = Math.random() * 100 + '%';
                    div.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                    div.style.zIndex = '9999';
                    document.body.appendChild(div);
                    confetti.push(div);
                }
                
                anime({
                    targets: confetti,
                    translateY: [0, window.innerHeight],
                    translateX: () => anime.random(-100, 100) + 'px',
                    rotate: () => anime.random(0, 360),
                    opacity: [1, 0],
                    delay: anime.stagger(30),
                    duration: 1500,
                    easing: 'easeOutExpo',
                    complete: () => confetti.forEach(el => el.remove())
                });
                
                anime({
                    targets: checkbox,
                    scale: [1, 1.5, 1],
                    duration: 600,
                    easing: 'easeInOutBack'
                });
                
                anime({
                    targets: taskElement.querySelector('.task-text'),
                    textDecoration: ['none', 'line-through'],
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-light'),
                    duration: 500
                });
            } else {
                // Unchecking animation
                anime({
                    targets: checkbox,
                    rotate: ['0deg', '-15deg', '15deg', '0deg'],
                    duration: 500,
                    easing: 'easeInOutBack'
                });
                
                anime({
                    targets: taskElement.querySelector('.task-text'),
                    textDecoration: ['line-through', 'none'],
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
                    duration: 300
                });
            }
            
            renderTasks();
            updateTaskCount();
        }
    }

    function deleteTask(id) {
        const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
        
        // Delete animation
        anime({
            targets: taskElement,
            translateX: '100%',
            opacity: 0,
            easing: 'easeOutExpo',
            duration: 500,
            complete: () => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
                updateTaskCount();
            }
        });
    }

    function clearCompleted() {
        const completedElements = document.querySelectorAll('.task-item.completed');
        
        // Animation for all completed tasks
        anime({
            targets: completedElements,
            translateX: '100%',
            opacity: 0,
            easing: 'easeOutExpo',
            delay: anime.stagger(100),
            duration: 500,
            complete: () => {
                tasks = tasks.filter(t => !t.completed);
                saveTasks();
                renderTasks();
                updateTaskCount();
            }
        });
    }

    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = currentFilter === 'all' 
                ? 'No tasks yet. Add a new task!' 
                : `No ${currentFilter} tasks`;
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = 'var(--text-light)';
            emptyMessage.style.padding = '20px 0';
            taskList.appendChild(emptyMessage);
            return;
        }

        // Sort tasks by priority and date
        filteredTasks.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            // First sort by priority
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // Then by date
            return new Date(a.date) - new Date(b.date);
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item${task.completed ? ' completed' : ''}`;
            li.dataset.id = task.id;
            
            const formattedDate = formatDate(task.date);
            
            li.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'completed' : ''}"></div>
                <div class="task-content">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-date">${formattedDate}</span>
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        <span class="task-category category-${task.category}">${task.category !== 'none' ? task.category : ''}</span>
                    </div>
                </div>
                <button class="task-delete"><i class="fas fa-trash"></i></button>
            `;
            
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('click', () => toggleTaskStatus(task.id));
            
            const deleteBtn = li.querySelector('.task-delete');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskList.appendChild(li);
        });

        enableDragAndDrop();
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Initial animation for existing tasks
    anime({
        targets: '.task-item',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
        duration: 800
    });

    function enableDragAndDrop() {
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(task => {
            task.setAttribute('draggable', true);
            
            task.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.dataset.id);
                task.classList.add('dragging');
            });
            
            task.addEventListener('dragend', () => {
                task.classList.remove('dragging');
            });
        });
        
        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(taskList, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (afterElement == null) {
                taskList.appendChild(dragging);
            } else {
                taskList.insertBefore(dragging, afterElement);
            }
        });
        
        taskList.addEventListener('drop', (e) => {
            e.preventDefault();
            // Update task order in the data array
            const newTasksOrder = [];
            document.querySelectorAll('.task-item').forEach(item => {
                const id = parseInt(item.dataset.id);
                const task = tasks.find(t => t.id === id);
                if (task) newTasksOrder.push(task);
            });
            tasks = newTasksOrder;
            saveTasks();
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Add these functions for modern features

    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            document.querySelectorAll('.task-item').forEach(task => {
                const taskText = task.querySelector('.task-text').textContent.toLowerCase();
                if (searchTerm === '' || taskText.includes(searchTerm)) {
                    task.style.display = '';
                } else {
                    task.style.display = 'none';
                }
            });
        });
    }

    // View switching
    function setupViewSwitcher() {
        const viewButtons = document.querySelectorAll('.view-btn');
        const taskListContainer = document.querySelector('.task-list-container');
        
        // Create kanban and calendar containers if they don't exist
        let kanbanContainer = document.querySelector('.kanban-container');
        if (!kanbanContainer) {
            kanbanContainer = document.createElement('div');
            kanbanContainer.className = 'kanban-container';
            kanbanContainer.innerHTML = `
                <div class="kanban-column" data-status="todo">
                    <h3>To Do</h3>
                    <div class="kanban-tasks"></div>
                </div>
                <div class="kanban-column" data-status="inprogress">
                    <h3>In Progress</h3>
                    <div class="kanban-tasks"></div>
                </div>
                <div class="kanban-column" data-status="done">
                    <h3>Done</h3>
                    <div class="kanban-tasks"></div>
                </div>
            `;
            taskListContainer.parentNode.insertBefore(kanbanContainer, taskListContainer.nextSibling);
        }
        
        let calendarContainer = document.querySelector('.calendar-container');
        if (!calendarContainer) {
            calendarContainer = document.createElement('div');
            calendarContainer.className = 'calendar-container';
            calendarContainer.innerHTML = `<div class="calendar-placeholder">Calendar View</div>`;
            taskListContainer.parentNode.insertBefore(calendarContainer, taskListContainer.nextSibling);
        }
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Hide all view containers
                taskListContainer.style.display = 'none';
                kanbanContainer.style.display = 'none';
                calendarContainer.style.display = 'none';
                
                // Show selected view
                const view = btn.dataset.view;
                if (view === 'list') {
                    taskListContainer.style.display = '';
                } else if (view === 'kanban') {
                    kanbanContainer.style.display = 'flex';
                    renderKanbanView();
                } else if (view === 'calendar') {
                    calendarContainer.style.display = '';
                    // Implement calendar rendering
                }
            });
        });
    }

    // Render Kanban view
    function renderKanbanView() {
        const todoColumn = document.querySelector('.kanban-column[data-status="todo"] .kanban-tasks');
        const progressColumn = document.querySelector('.kanban-column[data-status="inprogress"] .kanban-tasks');
        const doneColumn = document.querySelector('.kanban-column[data-status="done"] .kanban-tasks');
        
        // Clear existing content
        todoColumn.innerHTML = '';
        progressColumn.innerHTML = '';
        doneColumn.innerHTML = '';
        
        // Distribute tasks to columns
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.dataset.id = task.id;
            taskCard.draggable = true;
            
            // Handle drag events for kanban cards
            taskCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.id);
                taskCard.classList.add('dragging');
            });
            
            taskCard.addEventListener('dragend', () => {
                taskCard.classList.remove('dragging');
            });
            
            taskCard.innerHTML = `
                <div class="task-card-text">${escapeHtml(task.text)}</div>
                <div class="task-card-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    ${task.category !== 'none' ? `<span class="task-category category-${task.category}">${task.category}</span>` : ''}
                </div>
            `;
            
            // Add to appropriate column
            if (task.completed) {
                doneColumn.appendChild(taskCard);
            } else if (task.inProgress) { // You'd need to add this status to your task model
                progressColumn.appendChild(taskCard);
            } else {
                todoColumn.appendChild(taskCard);
            }
        });
        
        // Make columns accept drop events
        const columns = document.querySelectorAll('.kanban-column');
        columns.forEach(column => {
            column.addEventListener('dragover', e => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    column.querySelector('.kanban-tasks').appendChild(draggable);
                }
            });
            
            column.addEventListener('drop', e => {
                e.preventDefault();
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    // Update task status based on column
                    const status = column.dataset.status;
                    if (status === 'done') {
                        task.completed = true;
                        task.inProgress = false;
                    } else if (status === 'inprogress') {
                        task.completed = false;
                        task.inProgress = true;
                    } else {
                        task.completed = false;
                        task.inProgress = false;
                    }
                    
                    saveTasks();
                    updateTaskCount();
                }
            });
        });
    }

    // Call these setup functions at the end of the DOMContentLoaded event
    setupSearch();
    setupViewSwitcher();
});