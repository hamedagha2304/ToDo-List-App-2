var body = document.getElementsByTagName("body");
var input = document.getElementById("task-input");
var resultContainer = document.getElementById("result-container");
var all = document.getElementById("all");
var pending = document.getElementById("pending");
var completed = document.getElementById("completed");
var clearBtn = document.getElementById("clear-btn");
var items = JSON.parse(localStorage.getItem("ToDo-Items")) ?? [];
var isTaskEdited = false;
var itemsId;

input.addEventListener("keyup", function (event) {
  var inputValue = input.value.trim();

  if (event.key === "Enter" && inputValue) {
    if (isTaskEdited == false) {
      var item = {
        todoTitle: inputValue,
        todoStatus: "pending",
      };
      items.push(item);
    } else {
      isTaskEdited = false;
      items[textId].todoTitle = inputValue;
    }
    input.value = "";
    showToDoItem("all");
    all.classList.add("active-filter");
    pending.classList.remove("active-filter");
    completed.classList.remove("active-filter");

    localStorage.setItem("ToDo-Items", JSON.stringify(items));
  }
});

function showToDoItem(filter) {
  if (items.length > 0) {
    var empty = document.getElementById("empty");

    if (empty) {
      empty.remove();
    }

    clearBtn.classList.add("active-btn");
    clearBtn.removeAttribute("disabled");

    var li = "";

    items.forEach(function (item, index) {
      if (item.todoStatus === filter || filter === "all") {
        if (item.todoStatus === "completed") {
          var completedStatus = "checked";
        } else {
          var completedStatus = "";
        }
        li += `
              <li id="item-${index}">
                  <div>
                    <input
                        type="checkbox"
                        ${completedStatus}
                        id="item-input-${index}"
                        onclick="updateToDoItem(event, ${index})"/>
                    <label
                        for="item-input-${index}"
                        class="${completedStatus}">${item.todoTitle}</label>
                  </div>
                  <div>
                    <i class="edit" onclick="editToDoItem(event, ${index})"></i>
                    <i class="delete" onclick="deleteToDoItem(${index})"></i>
                  </div>
              </li>
              `;
      }
    });

    resultContainer.innerHTML = li;
  } else {
    var li = `
            <li id="empty">You don't have any task here</li>
            `;
    resultContainer.innerHTML = li;
  }

  if (body[0].offsetWidth > 480) {
    if (resultContainer.offsetHeight >= 164) {
      resultContainer.classList.add("scroll");
    } else {
      resultContainer.classList.remove("scroll");
    }
  } else {
    if (resultContainer.offsetHeight >= 144) {
      resultContainer.classList.add("scroll");
    } else {
      resultContainer.classList.remove("scroll");
    }
  }
}

showToDoItem("all");

function updateToDoItem(event, index) {
  var label = event.target.nextElementSibling;

  if (items[index].todoStatus === "pending") {
    items[index].todoStatus = "completed";
    label.classList.add("checked");
  } else {
    items[index].todoStatus = "pending";
    label.classList.remove("checked");
  }

  localStorage.setItem("ToDo-Items", JSON.stringify(items));
}

all.addEventListener("click", function () {
  showToDoItem("all");
  all.classList.add("active-filter");
  pending.classList.remove("active-filter");
  completed.classList.remove("active-filter");
});

pending.addEventListener("click", function () {
  showToDoItem("pending");
  all.classList.remove("active-filter");
  pending.classList.add("active-filter");
  completed.classList.remove("active-filter");

  var isPending = items.every(function (item) {
    return item.todoStatus !== "pending";
  });

  if (isPending == true) {
    var liTag = `<li id="empty">You don't have any task here</li>`;
    resultContainer.innerHTML = liTag;
  }
});

completed.addEventListener("click", function () {
  showToDoItem("completed");
  all.classList.remove("active-filter");
  pending.classList.remove("active-filter");
  completed.classList.add("active-filter");

  var isPending = items.every(function (item) {
    return item.todoStatus !== "completed";
  });

  if (isPending == true) {
    var liTag = `<li id="empty">You don't have any task here</li>`;
    resultContainer.innerHTML = liTag;
  }
});

clearBtn.addEventListener("click", function () {
  items = [];
  showToDoItem("all");

  clearBtn.classList.remove("active-btn");
  clearBtn.setAttribute("disabled", "");

  all.classList.add("active-filter");
  pending.classList.remove("active-filter");
  completed.classList.remove("active-filter");

  localStorage.setItem("ToDo-Items", JSON.stringify(items));
});

function deleteToDoItem(index) {
  items.splice(index, 1);
  showToDoItem("all");

  all.classList.add("active-filter");
  pending.classList.remove("active-filter");
  completed.classList.remove("active-filter");

  var firstLiTag = document.getElementById("item-0");
  if (!firstLiTag) {
    clearBtn.classList.remove("active-btn");
    clearBtn.setAttribute("disabled", "");
  }

  localStorage.setItem("ToDo-Items", JSON.stringify(items));
}

function editToDoItem(event, index) {
  var labelValue =
    event.target.parentElement.parentElement.children[0].children[1]
      .textContent;

  itemsId = index;
  input.value = labelValue;
  input.focus();
  isTaskEdited = true;
}
