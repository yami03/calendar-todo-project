// Load application styles
import 'styles/index.css';

// ================================
// START YOUR APP HERE
// ================================
function Todo({ todosSelector, calenderTableSelector = null, hasCalender = false}) {
  this.$todos = document.querySelector(todosSelector);
  this.$calenderTable = document.querySelector(calenderTableSelector);
  this.hasCalender = hasCalender;
  this.tabState = 'all';

  this.addNewTodo();
  this.checkAll();
  this.tab();
  this.clearCompleted();
}

Todo.prototype.initEvent = function () {
  this.setNumberOfItemsLeft();
  this.handleCheckboxToggle();
  this.editTodo();
  this.deleteTodo();
};

Todo.prototype.addNewTodo = function () {
  const $newTodoInput = this.$todos.querySelector('.add-input');

  $newTodoInput.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      if (!$newTodoInput.value) return alert('쒸익쒸익 내용을 입력해 주세요~');

      const $checkboxes = this.$todos.querySelectorAll('.todo-list .check-todo');
      const $list = this.$todos.querySelector('.todo-list');
      const totalAmountOfList = this.$todos.querySelectorAll('.todo-list li').length;
      let checkedArray = [];

      $checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) checkedArray.push(index);
      });

      $list.innerHTML += `
        <li>
          <input type="checkbox" id="check-todo${totalAmountOfList}" class="check-todo">
          <label for="check-todo${totalAmountOfList}"></label>
          <p class="txt">${$newTodoInput.value}</p>
          <input type="text" class="edit">
          <a href="#" class="del">×</a>
        </li>
      `;

      $newTodoInput.value = '';

      this.backupCheckbox(checkedArray);
      this.initEvent();
      this.sortList();
    }
  });
};

Todo.prototype.backupCheckbox = function (checkedArray) {
  const $checkboxes = this.$todos.querySelectorAll('.todo-list .check-todo');

  for (const i of checkedArray) {
    $checkboxes[i].checked = true;
  }

  checkedArray = [];
};

Todo.prototype.setNumberOfItemsLeft = function () {
  const $tab = this.$todos.querySelector('.todo-tab');
  const $count = $tab.querySelector('.count');
  const $clear = $tab.querySelector('.clear');
  const $todoList = this.$todos.querySelector('.todo-list');
  const $checkboxes = $todoList.querySelectorAll('.check-todo');
  const $checkAll = this.$todos.querySelector('.check-all');
  const totalAmountOfList = $todoList.querySelectorAll('li').length;
  let countItemsLeft = totalAmountOfList;

  $checkboxes.forEach(checkbox => {
    if (checkbox.checked) countItemsLeft--;
  });

  if (!countItemsLeft) {
    $count.textContent = '0 item left';

    if (!totalAmountOfList) { 
      $tab.classList.remove('on');
      $clear.classList.remove('on');
      $checkAll.checked = false;

    } else { 
      $tab.classList.add('on');
      $clear.classList.add('on');
      $checkAll.checked = true;
    }

  } else {
    $count.textContent = `${countItemsLeft} ${countItemsLeft === 1 ? 'item' : 'items'} left`;
    $tab.classList.add('on');
    $checkAll.checked = false;

    if (countItemsLeft !== totalAmountOfList) {
      $clear.classList.add('on');
    } else {
      $clear.classList.remove('on');
    }
  }

  if (this.hasCalender) this.daysAddDot(totalAmountOfList);
};

Todo.prototype.daysAddDot = function (totalAmountOfList) {
  const $days = this.$calenderTable.querySelectorAll('tbody td');

  $days.forEach(day => {
    const clickDate = day.children[0].classList.contains('on');
    
    if (clickDate) {
      if (!totalAmountOfList) {
        if (day.classList.contains('has-todo')) day.classList.remove('has-todo');

      } else {
        day.classList.add('has-todo');
      } 
    }
  });
}; 

Todo.prototype.handleCheckboxToggle = function () {
  const $checkboxes = this.$todos.querySelectorAll('.todo-list .check-todo');
  const $todoTexts = this.$todos.querySelectorAll('.todo-list .txt');

  $checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      this.setNumberOfItemsLeft();
    });
  });

  $todoTexts.forEach(todoText => {
    todoText.addEventListener('click', ev => {
      const $checkbox = ev.currentTarget.previousElementSibling.previousElementSibling;
      $checkbox.checked = !$checkbox.checked;
      this.setNumberOfItemsLeft();
    });
  });
};

Todo.prototype.editTodo = function () {
  const $todoTexts = this.$todos.querySelectorAll('.todo-list .txt');
  const $todoEditInputs = this.$todos.querySelectorAll('.todo-list .edit');

  $todoTexts.forEach(todoText => {
    todoText.addEventListener('dblclick', ev => {
      const $checkbox = ev.currentTarget.previousElementSibling;
      const $editInput = ev.currentTarget.nextElementSibling;
      const $delButton = $editInput.nextElementSibling;

      $editInput.value = ev.currentTarget.textContent;

      ev.currentTarget.classList.add('hide');
      $checkbox.classList.add('hide');
      $delButton.classList.add('hide');
      $editInput.classList.add('on');

      $editInput.focus();
    });
  });

  $todoEditInputs.forEach(input => {
    input.addEventListener('blur', ev => {
      
      if (!ev.target.value) {
        ev.target.parentElement.remove();
        this.setNumberOfItemsLeft();
        return;
      }

      const $delButton = ev.target.nextElementSibling;
      const $todoText = ev.target.previousElementSibling;
      const $checkBox = $todoText.previousElementSibling;

      $todoText.textContent = ev.target.value;

      ev.target.classList.remove('on');
      $checkBox.classList.remove('hide');
      $todoText.classList.remove('hide');
      $delButton.classList.remove('hide');
    });
  });

  $todoEditInputs.forEach(input => {
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') ev.target.blur();
    });
  });
};

Todo.prototype.checkAll = function () {
  const $checkAll = this.$todos.querySelector('.check-all');
  const $count = this.$todos.querySelector('.todo-tab .count');
  const $clear = this.$todos.querySelector('.todo-tab .clear');
  
  $checkAll.addEventListener('click', () => {
    const $checkboxes = this.$todos.querySelectorAll('.todo-list .check-todo');
    const checkboxesLen = $checkboxes.length;

    $checkboxes.forEach(checkbox => {
      if ($checkAll.checked) {
        $count.textContent = '0 items left';
        checkbox.checked = true;
        $clear.classList.add('on');
        
      } else {
        $count.textContent = `${checkboxesLen} ${checkboxesLen === 1 ? `item` : `items`} left`;
        checkbox.checked = false;
        $clear.classList.remove('on');
      }
    });
  });
};

Todo.prototype.deleteTodo = function () {
  const $delButtons = this.$todos.querySelectorAll('.todo-list .del');

  $delButtons.forEach(button => {
    button.addEventListener('click', ev => {
      ev.currentTarget.parentElement.remove();
      this.setNumberOfItemsLeft();
    });
  });
};

Todo.prototype.tab = function () {
  const $tabs = this.$todos.querySelectorAll('.tab-list li a');
  
  $tabs.forEach(tab => {
    tab.addEventListener('click', ev => {
      this.tabState = ev.target.dataset.type;

      $tabs.forEach(tab => tab.classList.remove('on'));
      ev.target.classList.add('on');

      this.sortList();
    });
  });
};

Todo.prototype.sortList = function () {
  const $todoLists = this.$todos.querySelectorAll('.todo-list li');

  $todoLists.forEach(li => {
    const $checkbox = li.children[0];

    if (this.tabState === 'all') {
      li.classList.remove('hide');

    } else if (this.tabState === 'active') {
      $checkbox.checked ? li.classList.add('hide') : li.classList.remove('hide');

    } else {
      !$checkbox.checked ? li.classList.add('hide') : li.classList.remove('hide');
    }
  });
};

Todo.prototype.clearCompleted = function () {
  const $clearButton = this.$todos.querySelector('.todo-tab .clear');
  
  $clearButton.addEventListener('click', () => {
    const $todoLists = this.$todos.querySelectorAll('.todo-list li');
    
    $todoLists.forEach(list => {
      const $checkbox = list.children[0];
      const $delButton = list.children[4];

      if ($checkbox.checked) $delButton.click();
    });
  });

  $clearButton.classList.remove('on');
};

function Calender({ wrapSelector, todoSelector = null, hasTodo = false}) {
  this.today = new Date();
  this.day = this.today.getDay();
  this.date = this.today.getDate();
  this.month = this.today.getMonth();
  this.year = this.today.getFullYear();

  this.weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  this.$calender = document.querySelector(wrapSelector);
  this.$todo = document.querySelector(todoSelector);
  this.hasTodo = hasTodo;
  this.firstLoad = true;
  this.saveTodo = {};
  this.lastClickDate;

  this.setDaily();
  this.setMonthTitle();
  this.markupMonth();
  this.clickMonthArrow();

  this.firstLoad = false;
}

Calender.prototype = new Todo({
  todosSelector: '.todo', 
  calenderTableSelector: '.calendar-tbl',
  hasCalender: true
});

Calender.prototype.setDaily = function () {
  const $day = this.$calender.querySelector('.daily .day');
  const $date = this.$calender.querySelector('.daily .date');
  const monthDtatYear = `${(this.monthArr[this.month]).toLowerCase()}${this.date}${this.year}`;

  $day.textContent = this.weekArr[this.day];
  $date.textContent = this.date;
  this.lastClickDate = monthDtatYear;
};

Calender.prototype.setMonthTitle = function () {
  const monthYear = `${this.monthArr[this.month]} ${this.year}`;
  
  this.$calender.querySelector('.month-control .month').textContent = monthYear;
};

Calender.prototype.markupMonth = function () {
  const $tbody = this.$calender.querySelector('.calendar-tbl tbody'); 

  const getFirstDay = new Date(this.year, this.month, 1);
  const firstDay = getFirstDay.getDay();

  const getLastDate = new Date(this.year, this.month + 1, 0);
  const lastDate = getLastDate.getDate();

  const totalDay = lastDate + firstDay;
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
            
            const addBgClass = (isToday || isLastClick) ? 'on' : '';

            let hasTodoList = false;

            if(this.hasTodo) {
              const listLen = this.$todo.querySelectorAll('.todo-list li').length;

              if ((addBgClass && listLen || !addBgClass && this.saveTodo[compareDate])) {
                hasTodoList = true;
              }
            }
            
            return `
              <td ${hasTodoList ? `class='has-todo'` : ''}>
                <a href="#" ${addBgClass ? `class=${addBgClass}` : ''} data-day="${dayIndex}">${findDay}</a>
              </td>
            `;
          }).join('')}
        </tr>
      `;
    }).join('')}
  `;

  $tbody.innerHTML = markup;

  this.clickDate();
};

Calender.prototype.clickMonthArrow = function () {
  const $arrows = this.$calender.querySelectorAll('.month-control .button');
  let monthInterval;
  let isLongPress = false;

  $arrows.forEach(arrow => {
    arrow.addEventListener('mousedown', () => {
      isLongPress = true;
      monthInterval = setInterval(() => {this.changeMonth(arrow)}, 200);
    });

    arrow.addEventListener('click', () => this.changeMonth(arrow));

    arrow.addEventListener('mouseup', () => this.stopChangingMonth(isLongPress, monthInterval));
    arrow.addEventListener('mouseleave', () => this.stopChangingMonth(isLongPress, monthInterval));
  });
};

Calender.prototype.changeMonth = function (arrow) {
  const isPrevButton = arrow.classList.contains('prev-button');
  
  if (isPrevButton) {
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
};

Calender.prototype.stopChangingMonth = function (isLongPress, monthInterval) {
  if (isLongPress) {
    clearInterval(monthInterval);
    isLongPress = false;
  }
}

Calender.prototype.clickDate = function () {
  const $days = this.$calender.querySelectorAll('.calendar-tbl td a');

  $days.forEach((day) => {
    day.addEventListener('click', ev => {
      if (this.hasTodo) {
        this.syncTodo();
        this.resetTodoList();
      }

      $days.forEach(el => el.classList.remove('on'));
      ev.currentTarget.classList.add('on');

      this.date = ev.currentTarget.textContent;
      this.day = ev.currentTarget.dataset.day;

      this.setDaily();
      if (this.hasTodo) this.importTodoList();
    });
  });
};


Calender.prototype.syncTodo = function () {
  const $todoTexts = Array.from(this.$todo.querySelectorAll('.todo-list .txt'));
  const $checkAll = this.$todo.querySelector('.check-all');
  const day = this.lastClickDate;
  const hasNothingTodo = !$todoTexts.length && !this.saveTodo[day];
  const isDeletedAtPresent = !$todoTexts.length && this.saveTodo[day];
  const $checkBoxsofTodolist = this.$todo.querySelectorAll('.todo-list .check-todo');
  let checkedIndex = [];

  if (isDeletedAtPresent) return delete this.saveTodo[day];
  if (hasNothingTodo) return;

  $checkBoxsofTodolist.forEach((box, index) => {
    if (box.checked === true) checkedIndex.push(index);
  });

  const todoListTextArray = $todoTexts.map(text => text.textContent);

  this.saveTodo[day] = [];
  this.saveTodo[day][0] = todoListTextArray;
  this.saveTodo[day][1] = checkedIndex;

  $checkAll.checked = false;
};

Calender.prototype.importTodoList = function () {
  if (!this.saveTodo[this.lastClickDate] || !this.saveTodo[this.lastClickDate][0].length) return;
  
  const isSavedTodo = this.saveTodo[this.lastClickDate];
  const savedTodoList = isSavedTodo[0];
  const savedCheckList = isSavedTodo[1];

  const tabs = this.$todo.querySelectorAll('.tab-list a');
  const todoList = this.$todo.querySelector('.todo-list');
  this.tabState = 'all';

  tabs.forEach((tab, index) => index === 0 ? tab.classList.add('on') : tab.classList.remove('on'));

  const markup = `
    ${savedTodoList.map((text,index) => {
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
    
  if (savedCheckList.length) {
    const checkboxes = this.$todo.querySelectorAll('.todo-list .check-todo');

    checkboxes.forEach((checkbox, index) => {
      const isChecked = savedCheckList.includes(index);

      if (isChecked) checkbox.checked = true;
    });
  }
  
  this.initEvent();
};

Calender.prototype.resetTodoList = function () {
  const $list = this.$todo.querySelector('.todo-list');
  const $tab = this.$todo.querySelector('.todo-tab');
  const $tabAll = $tab.querySelector('.all');

  $list.innerHTML = '';
  $tab.classList.remove('on');
  $tabAll.click();

};

new Calender({
  wrapSelector: '.calendar-wrap',
  todoSelector:  '.todo',
  hasTodo: true
});

