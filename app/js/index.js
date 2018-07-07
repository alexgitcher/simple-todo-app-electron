const ipcRenderer = require('electron').ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close');
  
  closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-window');
  });

  let taskID = 0;

  const app = document.querySelector('.app'),
    tasks = document.getElementById('tasks'),

    createTask = taskID => {
      const task = document.createElement('li');

      task.classList.add('task__item');

      task.innerHTML = `<div class="task__content"><input type="checkbox" name="task${taskID}" class="task__checkbox task__checkbox--hidden"><input type="text" class="task__input" id="task-title${taskID}" placeholder="Enter a task to do"></div>`;

      tasks.appendChild(task);

      tasksProcessing();
    },

    getTask = taskID => {
      const currentTaskID = `task-title${taskID}`,
        currentTask = document.getElementById(currentTaskID);

      return currentTask;
    },

    saveTaskTitle = taskID => {
      const taskToSave = getTask(taskID);

      taskToSave.classList.add('task--saved');
    },

    savedTasksProcessing = () => {
      const savedTasks = document.querySelectorAll('.task--saved');

      savedTasks.forEach((input) => {
        let savedTaskTitle = '';
        input.addEventListener('focus', (event) => {
          const target = event.target,
            value = target.value;

          savedTaskTitle = value;

          target.classList.remove('task--saved');
        });

        input.addEventListener('blur', (event) => {
          const target = event.target,
            value = target.value;

          if (value.length > 0) {
            target.classList.add('task--saved');
            savedTaskTitle = value;
          } else {
            target.value = savedTaskTitle;
          }
        });
      });
    },

    tasksProcessing = () => {
      const tasks = document.querySelectorAll('.task__input');

      tasks.forEach((input) => {
        const checkbox = input.previousSibling;

        input.addEventListener('blur', (event) => {
          const target = event.target,
            value = target.value;

          if (value.length > 0) {
            target.classList.add('task--saved'); savedTasksProcessing();
          }
        });

        input.addEventListener('input', (event) => {
          const target = event.target,
            value = target.value;

          if (value.length > 0) {
            checkbox.classList.remove('task__checkbox--hidden');
          } else {
            checkbox.classList.add('task__checkbox--hidden');
          }
        });
      });
    };

  createTask(taskID);

  const setCurrentTask = taskID => {
    const activeTask = getTask(taskID);

    setTimeout(() => activeTask.focus(), 100);
  };

  setCurrentTask(taskID);

  app.classList.remove('app--hidden');

  tasks.addEventListener('keypress', (event) => {
    const target = event.target,
      targetType = target.getAttribute('type');

    if (targetType === 'text') {
      const taskValue = target.value;

      if (event.which === 13) {
        event.preventDefault();

        if (taskValue.length === 0) {
          return;
        } else {
          saveTaskTitle(taskID);
          savedTasksProcessing();
          taskID += 1;
          createTask(taskID);
          setCurrentTask(taskID);
        }
      }
    } else {
      return;
    }
  });

  tasks.addEventListener('click', (event) => {
    const target = event.target,
      targetType = target.getAttribute('type');

    if (targetType === 'checkbox') {
      const nextInput = target.nextSibling;
      if (target.checked) {
        nextInput.classList.add('task--done');
        nextInput.setAttribute('disabled', true);
      } else {
        nextInput.classList.remove('task--done');
        nextInput.removeAttribute('disabled');
      }
    } else {
      return;
    }
  });

});