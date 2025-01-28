const sections = document.querySelectorAll('section');
const createTaskButton = document.querySelector('.createTaskContainer');
const form = document.querySelector('form');
const Add = document.querySelector('.Add');
// already created card logic start
let jsonData = sessionStorage.getItem('data');
if (jsonData) {
  jsonData = JSON.parse(jsonData);
  jsonData.data.forEach((item) => {
    createCard(item.id, item.name, item.type, item.desc, item);
  });
  addDragLogic();
}
// already created card logic end
// open modal logic start
createTaskButton.addEventListener('click', () => {
  console.log(form.style.display);
  form.style.display = 'inline-block';
});
// open modal logic end
//on submit form logic start
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let obj = {};
  let name = document.getElementById('name').value;
  let desc = document.getElementById('desc').value;
  let radios = document.querySelectorAll('input[type="radio"');
  radios.forEach((radio) => {
    if (radio.checked) {
      obj.type = radio.value;
    }
  });
  if (!name) {
    alert('Please enter name');
    return;
  }
  if (!desc) {
    alert('Please enter description');
    return;
  }
  if (!obj.type) {
    alert('Please select task type');
    return;
  }
  obj.name = name;
  obj.desc = desc;
  obj.status = 'inQu';
  let jsonData = sessionStorage.getItem('data');
  if (jsonData) {
    jsonData = JSON.parse(jsonData);
  } else {
    jsonData = { data: [] };
  }
  obj.id = jsonData.data.length + 1;
  jsonData = { data: [...jsonData.data, obj] };
  console.log(jsonData);
  sessionStorage.setItem('data', JSON.stringify(jsonData));
  createCard(obj.id, name, obj.type, desc, obj);
  addDragLogic();
  form.reset();
  form.style.display = 'none';
});
//on submit form logic end
// creating new card logic start
function createCard(id, name, type, desc, obj) {
  const div = document.createElement('div');
  div.className = 'card';
  div.setAttribute('draggable', 'true');
  div.id = id;
  const title = document.createElement('h4');
  const taskType = document.createElement('h5');
  const details = document.createElement('p');
  div.appendChild(title);
  div.appendChild(taskType);
  div.appendChild(details);
  title.textContent = name;
  taskType.textContent = type;
  details.textContent = desc;
  sections.forEach((section) => {
    let status = section.getAttribute('status');
    if (status == obj.status) {
      section.appendChild(div);
    }
  });
}
// creating new card logic end
// drag and drop logic start
function addDragLogic() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.ondragstart = function (e) {
      e.dataTransfer.setData('text/plain', this.id);
      e.dataTransfer.effectAllowed = 'move';
    };
  });
  sections.forEach((section) => {
    section.ondragover = function (e) {
      e.preventDefault();
    };
    section.ondrop = function (e) {
      let id = e.dataTransfer.getData('text/plain');
      console.log(section.getAttribute('status'));
      let data = JSON.parse(sessionStorage.getItem('data')).data;
      data.map((item) => {
        if (item.id == id) {
          item.status = section.getAttribute('status');
        }
      });
      sessionStorage.setItem('data', JSON.stringify({ data }));
      let cardHtml = document.getElementById(id);
      this.appendChild(cardHtml);
    };
  });
}
// drag and drop logic end
