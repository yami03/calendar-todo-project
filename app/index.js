// Load application styles
import 'styles/index.css';

// ================================
// START YOUR APP HERE
// ================================
function Todo() {
  this.tabState = 'all';

  this.addNewTodo();
  this.checkedArray = [];
  this.checkAll();
  this.tab();
  this.clearCompleted();
}

Todo.prototype.initEvent = function() {
  this.countList();
  this.handleCheckboxToggle();
  this.editTodo();
  this.deleteTodo();
};

Todo.prototype.addNewTodo = function () {
  const newTodoElement = document.querySelector('.add-input');

  newTodoElement.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      if (!newTodoElement.value) return alert('쒸익쒸익 내용을 입력해 주세요~');

      const checkboxes = document.querySelectorAll('.todo-list .check-todo');
      const totalAmountOfList = document.querySelectorAll('.todo-list li').length;

      checkboxes.forEach((el, index) => {
        if(el.checked) this.checkedArray.push(index);
      });

      document.querySelector('.todo-list').innerHTML += `
        <li>
          <input type="checkbox" id="check-todo${totalAmountOfList}" class="check-todo">
          <label for="check-todo${totalAmountOfList}"></label>
          <p class="txt">${newTodoElement.value}</p>
          <input type="text" class="edit">
          <a href="#" class="del">×</a>
        </li>
      `;

      newTodoElement.value = '';

      this.backupCheckbox();
      this.initEvent();
      this.sortList();
    }
  });
};

Todo.prototype.backupCheckbox = function () {
  const checkboxes = document.querySelectorAll('.todo-list .check-todo');
  for (const i of this.checkedArray) {
    checkboxes[i].checked = true;
  }

  this.checkedArray = [];
}

Todo.prototype.countList = function () {
  const countElement = document.querySelector('.todo-tab .count');
  const checkboxes = document.querySelectorAll('.todo-list .check-todo');
  const totalAmountOfList = document.querySelectorAll('.todo-list li').length;
  const checkAllElement = document.querySelector('.todo .check-all');
  const clearTodo = document.querySelector('.todo-tab .clear');
  let count = totalAmountOfList;

  checkboxes.forEach(el => {
    if (el.checked) count--;
  });

  if (!count) {
    countElement.textContent = '0 items left';
    if (!totalAmountOfList) {
      document.querySelector('.todo-tab').classList.remove('on');
      clearTodo.classList.remove('on');
    } else {
      checkAllElement.checked = true;
      clearTodo.classList.add('on');
    }

  } else {
    countElement.textContent = `${count} item left`;
    document.querySelector('.todo-tab').classList.add('on');
    checkAllElement.checked = false;

    if (count !== totalAmountOfList) {
      clearTodo.classList.add('on');
    } else {
      clearTodo.classList.remove('on');
    }
  }
};

Todo.prototype.handleCheckboxToggle = function () {
  const checkboxes = document.querySelectorAll('.todo-list .check-todo');
  const todoText = document.querySelectorAll('.todo-list .txt');

  checkboxes.forEach(el => {
    el.addEventListener('click', () => {
      this.countList();
    });
  });

  todoText.forEach(el => {
    el.addEventListener('click', ev => {
      const checkbox = ev.currentTarget.previousElementSibling.previousElementSibling;
      checkbox.checked = !checkbox.checked;
      this.countList();
    });
  });
};

Todo.prototype.editTodo = function () {
  const todoText = document.querySelectorAll('.todo-list .txt');
  const todoEditInput = document.querySelectorAll('.todo-list .edit')

  todoText.forEach(el => {
    el.addEventListener('dblclick', ev => {
      const checkbox = ev.currentTarget.previousElementSibling;
      const editInput = ev.currentTarget.nextElementSibling;
      const delButton = editInput.nextElementSibling;

      editInput.value = ev.currentTarget.textContent;

      ev.currentTarget.classList.add('hide');
      checkbox.classList.add('hide');
      delButton.classList.add('hide');
      editInput.classList.add('on');

      editInput.focus();
    });
  });

  todoEditInput.forEach(el => el.addEventListener('focusout', ev => this.changeTodo(ev)) );

  todoEditInput.forEach(el => {
    el.addEventListener('keydown', ev => {

      if (ev.key === 'Enter') {
        this.changeTodo(ev);
      }
    });
  });
};

Todo.prototype.changeTodo = function (ev) {
  if (!ev.target.value) {
    ev.target.parentElement.remove();
    this.countList();
    return;
  };

  const delButton = ev.target.nextElementSibling;
  const todoText = ev.target.previousElementSibling;
  const checkBox = todoText.previousElementSibling;

  todoText.textContent = ev.target.value;
  
  ev.target.classList.remove('on');
  checkBox.classList.remove('hide');
  todoText.classList.remove('hide');
  delButton.classList.remove('hide');
}

Todo.prototype.checkAll = function () {
  const checkAllElement = document.querySelector('.todo .check-all');
  const countElement = document.querySelector('.todo-tab .count');
  
  checkAllElement.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.todo-list .check-todo');
    const checkboxesLen = checkboxes.length;

    checkboxes.forEach(le => {
      if (checkAllElement.checked) {
        countElement.textContent = '0 items left';
        le.checked = true;
        
      } else {
        countElement.textContent = `${checkboxesLen} ${checkboxesLen === 1 ? item : items} left`;
        le.checked = false;
      }
    });
  });
};

Todo.prototype.deleteTodo = function () {
  const delButton = document.querySelectorAll('.todo-list .del');

  delButton.forEach(el => {
    el.addEventListener('click', ev => {
      ev.currentTarget.parentElement.remove();
      this.countList();
    });
  });
};

Todo.prototype.tab = function () {
  const tabs = document.querySelectorAll('.tab-list li a');
  
  tabs.forEach(el => {
    el.addEventListener('click', ev => {
      this.tabState = ev.target.dataset.type;

      tabs.forEach(tab => tab.classList.remove('on'));
      ev.target.classList.add('on');

      this.sortList();
    });
  });
};

Todo.prototype.sortList = function () {
  const todoList = document.querySelectorAll('.todo-list li');

  todoList.forEach(li => {
    const inputElement = li.children[0];

    if (this.tabState === 'all') {
      li.classList.remove('hide');

    } else if (this.tabState === 'active') {
      inputElement.checked ? li.classList.add('hide') : li.classList.remove('hide');

    } else {
      !inputElement.checked ? li.classList.add('hide') : li.classList.remove('hide');
    }
  });
};

Todo.prototype.clearCompleted = function () {
  const clearButton = document.querySelector('.todo-tab .clear');
  
  clearButton.addEventListener('click', () => {
    const todoList = document.querySelectorAll('.todo-list li');
    
    todoList.forEach(el => {
      const checkbox = el.children[0];
      const delButton = el.children[4];

      if (checkbox.checked) delButton.click();
    });
  });

  clearButton.classList.remove('on');
};

function Calender({wrapSelector, hasTodo = false}) {
  this.today = new Date();
  this.day = this.today.getDay();
  this.date = this.today.getDate();
  this.month = this.today.getMonth();
  this.year = this.today.getFullYear();

  this.weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  this.calenderElement = document.querySelector(wrapSelector);
  this.hasTodo = hasTodo;
  this.firstLoad = true;
  this.saveTodo = {};
  this.lastClickDate;

  this.setDaily();
  this.setMonthTitle();
  this.markupMonth();
  this.handleArrowClick();

  this.firstLoad = false;
}

Calender.prototype = new Todo();

Calender.prototype.setDaily = function () {
  this.calenderElement.querySelector('.daily .day').textContent = this.weekArr[this.day];
  this.calenderElement.querySelector('.daily .date').textContent = this.date;
  this.lastClickDate = `${(this.monthArr[this.month]).toLowerCase()}${this.date}${this.year}`;
};

Calender.prototype.setMonthTitle = function () {
  this.calenderElement.querySelector('.month-control .month').textContent = `${this.monthArr[this.month]} ${this.year}`;
};

Calender.prototype.markupMonth = function () {
  const getFirstDay = new Date(this.year, this.month, 1);
  const firstDay = getFirstDay.getDay();

  const getLastDate = new Date(this.year, this.month + 1, 0);
  const lastDate = getLastDate.getDate();

  const totalDay = lastDate + firstDay
  const monthRow = Math.ceil(totalDay / 7);

  const markup = `
    ${Array(monthRow).fill().map((row, rowIndex) => {
      return `
        <tr>
          ${Array(7).fill().map((day, dayIndex) => {
            
            let findDay = (rowIndex * 7) + (dayIndex + 1) - firstDay; 
            findDay = (findDay <= 0 || findDay > lastDate) ? '' : findDay;
            
            const isToday = this.firstLoad && findDay === this.today.getDate();
            const compareDate = `${(this.monthArr[this.month]).toLowerCase()}${findDay}${this.year}`;
            const isLastClick = compareDate === this.lastClickDate;
            
            const addClass = (isToday || isLastClick) ? 'on' : '';
            
            return `
              <td>
                <a href="#" ${addClass ? `class=${addClass}` : ''} data-day="${dayIndex}">${findDay}</a>
              </td>
            `;
          }).join('')}
        </tr>
      `;
    }).join('')}
  `;

  this.calenderElement.querySelector('.calendar-tbl tbody').innerHTML = markup;

  this.handleDateClick();
};

Calender.prototype.handleArrowClick = function () {
  const arrows = this.calenderElement.querySelectorAll('.month-control .button');

  arrows.forEach(arrow => {
    arrow.addEventListener('click', () => {

      if (arrow.classList.contains('prev-button')) {
        if (!this.month) {
          this.month = 11;
          this.year -= 1;
        } else {
          this.month -= 1;
        }

      } else {
        if (this.month === 11) {
          this.month = 0;
          this.year += 1;
        } else {
          this.month += 1;
        }
      }

      this.setMonthTitle();
      this.markupMonth();
    });
  });
};

Calender.prototype.handleDateClick = function () {
  let days = this.calenderElement.querySelectorAll('.calendar-tbl td a');

  days.forEach((day) => {
    day.addEventListener('click', ev => {
      if (this.hasTodo) {
        this.syncTodo();
        this.resetTodoList();
      }

      days.forEach(el => el.classList.remove('on'));
      ev.currentTarget.classList.add('on');

      this.date = ev.currentTarget.textContent;
      this.day = ev.currentTarget.dataset.day;

      this.setDaily();
      if (this.hasTodo) this.importTodoList();
    });
  });
};

Calender.prototype.syncTodo = function () {
  const todoText = Array.from(document.querySelectorAll('.todo-list .txt'));
  const day = this.lastClickDate;

  if ((!todoText.length && !this.saveTodo[day])) return;

  let checkedIndex = [];
  const checkBoxsofTodolist = document.querySelectorAll('.todo-list .check-todo');

  checkBoxsofTodolist.forEach((box, index) => {
    if (box.checked === true) checkedIndex.push(index);
  });

  let todoListTextArray = todoText.map(text => text.textContent);

  this.saveTodo[day] = [];
  this.saveTodo[day][0] = todoListTextArray;
  this.saveTodo[day][1] = checkedIndex;

  console.table(this.saveTodo);
};

Calender.prototype.importTodoList = function () {
  if (!this.saveTodo[this.lastClickDate] || !this.saveTodo[this.lastClickDate][0].length) return;
  
  const tabs = document.querySelectorAll('.tab-list a');
  const todoList = document.querySelector('.todo-list');
  this.tabState = 'all';

  tabs.forEach((tab, index) => {
    index === 0 ? tab.classList.add('on') : tab.classList.remove('on');
  });

  const markup = `
    ${this.saveTodo[this.lastClickDate][0].map((text,index) => {
      return `
        <li>
          <input type="checkbox" id="check-todo${index}" class="check-todo">
          <label for="check-todo${index}"></label>
          <p class="txt" data-index="${index}">${text}</p>
          <input type="text" class="edit">
          <a href="#" class="del">×</a>
        </li>
      `;
    }).join('')}
  `;

  todoList.innerHTML = markup;
    
  if (this.saveTodo[this.lastClickDate][1].length) {
    const todoListArray = document.querySelectorAll('.todo-list .check-todo');

    todoListArray.forEach((checkbox, index) => {
      const isChecked = this.saveTodo[this.lastClickDate][1].includes(index);
      if (isChecked) checkbox.checked = true;
    });
  }
  
  this.initEvent();
};

Calender.prototype.resetTodoList = function () {
  document.querySelector('.todo-list').innerHTML = '';
};

new Calender({
  wrapSelector: '.calendar-wrap',
  hasTodo: true
});

