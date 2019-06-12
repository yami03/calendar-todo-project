// Load application styles
import 'styles/index.css';

// ================================
// START YOUR APP HERE
// ================================
function Calender({
  daySelector,
  dateSelector,
  monthSelector,
  tableSelector,
  monthTitleSelector,
  hasTodo
}) {
  this.today = new Date();
  this.day = this.today.getDay();
  this.date = this.today.getDate();
  this.month = this.today.getMonth();
  this.year = this.today.getFullYear();

  this.hasTodo = hasTodo;
  this.saveTodo = {};

  this.weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  this.monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  this.dayElement = document.querySelector(daySelector);
  this.dateElement = document.querySelector(dateSelector);
  this.monthElement = document.querySelector(monthSelector);
  this.monthTitleElement = document.querySelector(monthTitleSelector);
  this.tableElement = document.querySelector(tableSelector + ' tbody');

  this.firstLoad = true;

  this.setDaily();
  this.setMonthTitle();
  this.markupMonth();
  this.handleArrowClick(tableSelector);

  this.firstLoad = false;
}


Calender.prototype.setDaily = function () {
  this.dayElement.textContent = this.weekArr[this.day];
  this.dateElement.textContent = this.date;
};

Calender.prototype.setMonthTitle = function () {
  this.monthElement.textContent = `${this.monthArr[this.month]} ${this.year}`;
};

Calender.prototype.markupMonth = function () {
  const getFirstDay = new Date(this.year, this.month, 1);
  const firstDay = getFirstDay.getDay();

  const getLastDate = new Date(this.year, this.month + 1, 0);
  const lastDate = getLastDate.getDate();

  const totalDay = lastDate + firstDay
  const monthRow = Math.ceil(totalDay / 7);

  const now = `${this.monthArr[this.today.getMonth()]} ${this.today.getFullYear()}`;
  const compareMonthYear = now === this.monthTitleElement.textContent;

  const markup = `
  ${Array(monthRow).fill().map((row, rowIndex) => {
    return `
    <tr>
    ${Array(7).fill().map((day, dayIndex) => {
      
      let findDay = (rowIndex * 7) + (dayIndex + 1) - firstDay; 
      findDay = (findDay <= 0 || findDay > lastDate) ? '' : findDay;
      
      const todayAddClass = (this.firstLoad && compareMonthYear && findDay === this.today.getDate()) ? 'on' : ''; 
      
      return `
      <td><a href="#" class="${todayAddClass}" data-day="${dayIndex}">${findDay}</a></td>
      `
    }).join('')}
    </tr>`;
  }).join('')}
  `;

  this.tableElement.innerHTML = markup;

  this.handleDateClick();
};

Calender.prototype.handleArrowClick = function () {
  const arrows = document.querySelectorAll('.month-control .button');

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
          this.year -= 1;
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
  let days = document.querySelectorAll('.calendar-tbl td a');

  days.forEach((day) => {
    day.addEventListener('click', (ev) => {
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
  const todoDate = `${(this.monthArr[this.month]).toLowerCase()}${this.date}${this.year}`;
  const todoText = Array.from(document.querySelectorAll('.todo-list .txt'));
  
  if (!todoText.length && !this.saveTodo[todoDate]) return;

  const checkBoxsofTodolist = Array.from(document.querySelectorAll('.todo-list .check-todo'));
  
  const checkedIndex = checkBoxsofTodolist.forEach((box, index) => {
    if (box.checked === true) return index;
  });

  let todoListTextArray = todoText.map(text => text.textContent);
  
  this.saveTodo[todoDate] = [];
  this.saveTodo[todoDate][0] = todoListTextArray;
  this.saveTodo[todoDate][1] = checkedIndex;

  console.table(this.saveTodo);
};

Calender.prototype.importTodoList = function () {
  const todoDate = `${(this.monthArr[this.month]).toLowerCase()}${this.date}${this.year}`;
  if (!this.saveTodo[todoDate] || !this.saveTodo[todoDate][0].length) return;
  
  const todoList = document.querySelector('.todo-list');
  const markup = `
    ${this.saveTodo[todoDate][0].map((text,index) => {
      return `
        <li>
          <input type="checkbox" id="check-todo${index}" class="check-todo">
          <label for="check-todo${index}"></label>
          <p class="txt" data-index="${index}">${text}</p>
          <input type="text" class="edit">
          <a href="#" class="del">×</a>
        </li>`
    })}
  `;
  
  todoList.innerHTML = markup;

  if (!this.saveTodo[todoDate][1]) return;
  const todoListArray = document.querySelectorAll('.todo-list .check-todo');
  
  console.log(todoListArray);
  todoListArray.forEach((checkbox, index) => {
    console.log(this.saveTodo[todoDate][1]);
    const isChecked = this.saveTodo[todoDate][1].includes(index);
    if (isChecked) checkbox.checked = true;
  });
};

Calender.prototype.resetTodoList = function () {
  document.querySelector('.todo-list').innerHTML = '';
};

function Todo() {
  this.addNewTodo();
}

Todo.prototype.addNewTodo = function () {
  const newTodoElement = document.querySelector('.add-input');

  newTodoElement.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      const totalAmountOfList = document.querySelectorAll('.todo-list li').length;
      
      document.querySelector('.todo-list').innerHTML += `
      <li>
        <input type="checkbox" id="check-todo${totalAmountOfList}" class="check-todo">
        <label for="check-todo${totalAmountOfList}"></label>
        <p class="txt" data-index="${totalAmountOfList}">${newTodoElement.value}</p>
        <input type="text" class="edit">
        <a href="#" class="del">×</a>
      </li>`;
        
      newTodoElement.value = '';
      //this.changeTodo = true;      
      this.countList();
      this.handleCheckboxToggle();
      this.editTodo();
    }
  });
};

Todo.prototype.countList = function () {
  const countElement = document.querySelector('.todo-tab .count');
  const checkboxList = document.querySelectorAll('.todo-list .check-todo');
  const totalAmountOfList = document.querySelectorAll('.todo-list li').length;
  let count = totalAmountOfList;

  checkboxList.forEach(el => {
    if (el.checked) {
      return count--;
    }
  });

  if (!count) {
    countElement.textContent = '0 items left';
    if (!totalAmountOfList) {
      document.querySelector('.todo-tab').classList.remove('on');
    }

  } else {
    countElement.textContent = `${count} item left`;
    document.querySelector('.todo-tab').classList.add('on');
  }
}

Todo.prototype.handleCheckboxToggle = function () {
  const checkboxList = document.querySelectorAll('.todo-list .check-todo');
  const todoText = document.querySelectorAll('.todo-list .txt');

  checkboxList.forEach(el => {
    el.addEventListener('click', () => {
      this.countList();
    });
  });

  todoText.forEach(el => {
    el.addEventListener('click', ev => {
      ev.path[2].childNodes[1].checked = !ev.path[2].childNodes[1].checked;
      this.countList();
    });
  });
}

Todo.prototype.editTodo = function () {
  const todoText = document.querySelectorAll('.todo-list .txt');
  const todoEditInput = document.querySelectorAll('.todo-list ')

  todoText.forEach(el => {
    el.addEventListener('dblclick', ev => {
      const editInput = ev.currentTarget.nextElementSibling;

      editInput.value = ev.currentTarget.textContent;
      ev.currentTarget.classList.add('hide');
      editInput.classList.add('on');
      editInput.focus();
    });
  });

  todoEditInput.forEach(el => {
    el.addEventListener('keydown', (ev) => {

      if (ev.key === 'Enter') {
        const todoText = ev.target.previousElementSibling;
        if (!ev.target.value) return alert('내용을 입력해 주세요');
        todoText.textContent = ev.target.value;
        ev.target.classList.remove('on');
        todoText.classList.remove('hide');
      }
    });
  });
}

//Calender.prototype = new Todo();

new Calender({
  daySelector: '.daily .day',
  dateSelector: '.daily .date',
  monthSelector: '.calendar .month',
  tableSelector: '.calendar-tbl',
  monthTitleSelector: '.month-control .month',
  hasTodo: true
});

new Todo();
