`use strict`
let editing_options = document.querySelectorAll(".icon_container");
let main_container = document.querySelector(".main_container");
let text_container = document.querySelector(".text_container");
let text_display = document.querySelector(".text_display");
let checklist_display = document.querySelector(".checklist_display");
let colorBtn = document.querySelectorAll(".filter");
let body = document.body;
let plusBtn = editing_options[0];
let crossBtn = editing_options[1];
let deleteState = false;
let taskArr = [];


//---------------Local Storage-----------------------------------------------------------------------------------
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask")); 
    for (let i = 0; i < taskArr.length; i++) {
        let { NoteType, color, task, uid, heading, date } = taskArr[i];
        createTask(NoteType, color, task, false, heading, date, uid); 
    }
}

for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function () {
        let isActive = colorBtn[i].classList.contains("active");
        if (isActive) {
            colorBtn[i].classList.remove("active");
            changeFilter(null);  
        } else {
            for (let i = 0; i < colorBtn.length; i++) {
                colorBtn[i].classList.remove("active");
            }
            colorBtn[i].classList.add("active");  
            let displayColor = colorBtn[i].children[0].classList[0]; 
            changeFilter(displayColor);
        }
    })
}

function changeFilter(displayColor) {
    let task_container = document.querySelectorAll(".task_container");  
    if (task_container) { 
        for (let i = 0; i < task_container.length; i++) {
            let taskColor = task_container[i].children[0].classList[1];  
            if (displayColor == null) {  
                task_container[i].style.display = "block";
            }
            else if (displayColor != taskColor) {
                task_container[i].style.display = "none";  
            }
            else if (displayColor == taskColor) {
                task_container[i].style.display = "block"; 
            }
        }
    }
    if (displayColor == "pink") {
        text_display.style.backgroundColor = "rgb(245, 222, 229)";
        checklist_display.style.backgroundColor = "rgb(245, 222, 229)";
    }
    else if (displayColor == "blue") {
        text_display.style.backgroundColor = "rgb(222, 235, 245)";
        checklist_display.style.backgroundColor = "rgb(222, 235, 245)";
    }
    else if (displayColor == "green") {
        text_display.style.backgroundColor = "rgb(228, 245, 238)";
        checklist_display.style.backgroundColor = "rgb(228, 245, 238)";
    }
    else if (displayColor == "black") {
        text_display.style.backgroundColor = "rgb(215, 218, 221)";
        checklist_display.style.backgroundColor = "rgb(215, 218, 221)";
    }
    else {
        text_display.style.backgroundColor = "rgb(238, 242, 247)";
        checklist_display.style.backgroundColor = "rgb(238, 242, 247)";
    }
}

plusBtn.addEventListener("click", createTextModal);
crossBtn.addEventListener("click", setDeleteState);  // to change the state of button from off to on or vice versa

//---------------Creating Modal for adding new task---------------------------------------------------------------

function createTextModal() {
    let modal_container = document.querySelector(".modal_container");
    if (modal_container == null) {    
        plusBtn.classList.add("active");  
        modal_container = document.createElement("div");
        modal_container.setAttribute("class", "modal_container");    
        modal_container.innerHTML = `
            <div class = "noteOption">
                <div class = "textOption option active_option">TEXT</div>
                <div class = "checklistOption option">CHECKLIST</div>
            </div>
            <div class = "workArea">
                <div class="input_container">    
                    <textarea class="modal_heading" placeholder = "Enter your topic"></textarea>
                    <textarea class="modal_input" placeholder = "Enter your task"></textarea>
                </div>
                <div class="modal_filter"> 
                    <div class="pink filter"></div>
                    <div class="blue filter"></div>
                    <div class="green filter"></div>
                    <div class="black filter"></div>
                    <div class="enter">E N T E R</div>
                </div>
            </div>
            `
        body.appendChild(modal_container);   
        let checklistOption = document.querySelector(".checklistOption");
        checklistOption.addEventListener("click", function () {
            modal_container.remove();
            createChecklistModal()
        })
        handleTextModal(modal_container);    
    }
    else {
        modal_container.remove();
        plusBtn.classList.remove("active");  
        main_container.style.opacity = 1;
    }
}

function handleTextModal(modal_container) {
    main_container.style.opacity = 0.5;
    // handling colors
    let current_color = "black";    // the default color is black
    let modal_filters = document.querySelectorAll(".modal_filter .filter");  // extracting all the filter color available
    modal_filters[3].classList.add("border");    // adding border class to the default color
    for (let i = 0; i < modal_filters.length; i++) {
        modal_filters[i].addEventListener("click", function (e) {
            // removing the border class from all of the filter color available
            modal_filters.forEach((filter) => {
                filter.classList.remove("border");
            })
            // adding the border class to the filter color clicked
            modal_filters[i].classList.add("border");
            current_color = modal_filters[i].classList[0];   // changing the current color to the filter clicked
        })
    }
    // adding eventlistner to the text area
    let input_area = modal_container.querySelector(".modal_input");
    let header_input = modal_container.querySelector(".modal_heading");
    let date = getDate();
    let enterBtn = modal_container.querySelector(".enter");
    enterBtn.addEventListener("click", function (e) {
        if (input_area.innerText != null) {   // as the enter bttn is pressed perform following task
            plusBtn.classList.remove("active");
            modal_container.remove();         // removing the modal container
            main_container.style.opacity = 1;
            createTask("Text", current_color, input_area.value, true, header_input.value, date);   // creating the task on the body with the color and the task entered(true : to tell its entered from the UI not local storage)
        }
    })
}

function createChecklistModal() {
    let modal_container = document.createElement("div");
    modal_container.setAttribute("class", "modal_container");     //setting its class = modal_container
    //adding html of the conntainer
    modal_container.innerHTML = `
            <div class = "noteOption">
                <div class = "textOption option">TEXT</div>
                <div class = "checklistOption option active_option">CHECKLIST</div>
            </div>
            <div class = "workArea">
                <div class="input_container">    
                    <textarea class="modal_heading" placeholder = "Enter your topic"></textarea>
                    <input type = "text" class="checkList_input" placeholder = "Enter your task">
                    <div class = "display_checklist">
                        <p class="instruction">Double click to remove</p>
                        <ul class="task-list">
                        </ul>
                    </div>
                </div>
                <div class="modal_filter"> 
                    <div class="pink filter"></div>
                    <div class="blue filter"></div>
                    <div class="green filter"></div>
                    <div class="black filter"></div>
                    <div class="enter">E N T E R</div>
                </div>
            </div>
            `
    body.appendChild(modal_container);

    // if the text option is selected then display its UI and remove this one
    let textOption = document.querySelector(".textOption");
    textOption.addEventListener("click", function () {
        modal_container.remove();
        createTextModal()
    })

    handleChecklistModal(modal_container);     // for handling the actions inside the checklist modal container
}

function handleChecklistModal(modal_container) {
    let current_color = "black";  
    let modal_filters = document.querySelectorAll(".modal_filter .filter"); 
    modal_filters[3].classList.add("border");   
    for (let i = 0; i < modal_filters.length; i++) {
        modal_filters[i].addEventListener("click", function (e) {
            modal_filters.forEach((filter) => {
                filter.classList.remove("border");
            })
            modal_filters[i].classList.add("border");
            current_color = modal_filters[i].classList[0];  
        })
    }

    let input_task = document.querySelector(".checkList_input");
    let ul = document.querySelector(".task-list");   
    let checklistArray = [];

    input_task.addEventListener("keydown", function (e) {   
        if (e.key == "Enter") {
            let task = input_task.value; 
            let li = document.createElement("li");
            li.innerText = task; 
            checklistArray.push(task);
            li.setAttribute("class", "task");
            li.addEventListener("dblclick", function (e) {   
                li.remove();
            })
            ul.appendChild(li);
            input_task.value = "";
        }
    })

    let header_input = modal_container.querySelector(".modal_heading");
    let date = getDate();
    let enterBtn = modal_container.querySelector(".enter");
    enterBtn.addEventListener("click", function (e) {
        plusBtn.classList.remove("active");
        modal_container.remove();
        main_container.style.opacity = 1;
        createTask("Checklist", current_color, checklistArray, true, header_input.value, date);
    })
}

function getDate() {
    let dateobj = new Date;
    let hours = dateobj;
    let minutes = dateobj.getMinutes();
    let ampm = dateobj >= 12 ? 'pm' : 'am';
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let date = hours + ':' + minutes + ' ' + ampm;
    date = date.split("GMT")[0];

    return date;
}

//---------------Creating and editing Task------------------------------------------------------------------------
function createTask(NoteType, color, task, flag, heading, date, id) { 
    let task_container = document.createElement("div");
    task_container.setAttribute("class", "task_container");
    let uifn = new ShortUniqueId();
    let uid = id || uifn();
    task_container.innerHTML = `<div class="color_bar ${color}">
    <h4 class="uid">${uid}</h4>
    </div>
    <div class="task_description">
    <div class= "task_header">
        <h3 class="heading">${heading}</h3>
        <div class="task_icon_container">
            <i class="fas fa-expand"></i>
        </div>
    </div>
        <div class="task_area">${task}</div>
        <div class="date">${date}</div>
    </div>`

    let task_area = task_container.querySelector(".task_area");

    if (NoteType == "Text") {
        text_display.appendChild(task_container);
    }
    else {
        displayTaskList(task_area, task);
        checklist_display.appendChild(task_container);
    }

    if (flag == true) {  
        let obj = { "NoteType": NoteType, "task": task, "color": color, "uid": uid, "heading": heading, "date": date };
        taskArr.push(obj);
        let finalArr = JSON.stringify(taskArr);
        localStorage.setItem("allTask", finalArr); 
    }

    let color_bar = task_container.querySelector(".color_bar");
    color_bar.addEventListener("click", changeColor);

    let expandBtn = task_container.querySelector(".task_icon_container");;
    expandBtn.addEventListener("click", expandFunction);

    task_container.addEventListener("click", deleteTask);
}

function displayTaskList(task_area, task) {
    task_area.innerText = "";
    let ul = document.createElement("ul");
    ul.setAttribute("class", "task_list");
    task.forEach((value) => {
        let li = document.createElement("li");
        li.innerText = value;
        li.setAttribute("class", "tasks");
        ul.appendChild(li);
    })
    task_area.appendChild(ul);
}

function changeColor(e) {
    let colorArr = ["pink", "blue", "green", "black"];
    let color_bar = e.currentTarget;
    let cColor = color_bar.classList[1];   
    let idx = colorArr.indexOf(cColor);    
    idx = (idx + 1) % colorArr.length;     
    color_bar.classList.remove(cColor);    
    color_bar.classList.add(colorArr[idx]); 

    let id = color_bar.children[0].innerText;
    for (let i = 0; i < taskArr.length; i++) {
        let { uid } = taskArr[i]
        if (uid == id) {
            taskArr[i].color = colorArr[idx];
            let finalArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalArr);
            break;
        }
    }

}

// -------------------Expanding Function------------------------------------------------------------------------------
function expandFunction(e) {
    let expandBtn = e.currentTarget;
    let isActive = expandBtn.classList.contains("task_icon_active");  
    if (isActive) {
        expandBtn.classList.remove("task_icon_active");
    }
    else {
        expandBtn.classList.add("task_icon_active");
        let task_area = expandBtn.parentNode.parentNode.children[1];  
        let task = task_area.innerText;    
        let color = expandBtn.parentNode.parentNode.parentNode.children[0].classList[1]; 
        let id = expandBtn.parentNode.parentNode.parentNode.children[0].children[0].innerText;
        let heading = expandBtn.parentNode.children[0].innerText;
        let noteType
        for (let i = 0; i < taskArr.length; i++) {
            let { uid, NoteType } = taskArr[i]
            if (uid == id) {
                noteType = NoteType
            }
        }
        if (noteType == "Text")
            createTextExpandContainer(color, task, heading, id, expandBtn, noteType);
        else
            createChecklistExpandContainer(color, task, heading, id, expandBtn, noteType);
    }
}

function createTextExpandContainer(color, task, heading, id, expandBtn, noteType) {
    let expand_container = document.querySelector(".expand_container");
    if (expand_container == null) {
        main_container.style.opacity = 0.5;
        expand_container = document.createElement("div");
        expand_container.setAttribute("class", "expand_container");
        expand_container.innerHTML = `<div class="expandColorBar ${color}">
            <h4 class="uid">${id}</h4>
                </div>
                <div class="expandTaskDesc">
                    <div class="expandTask">
                        <div class="expandHeading">${heading}</div>
                        <div class="expandTaskArea">${task}</div>
                    </div>
                    <div class="expand_edits">
                        <div class="expand_icon_container">
                            <i class="fas fa-pencil-alt"></i>
                        </div>
                        <div class="enter">E N T E R</div>
                    </div>
                </div>`
        body.appendChild(expand_container);

        let pencilBtn = expand_container.querySelector(".expand_icon_container");
        pencilBtn.addEventListener("click", TextPencilBtn);

        let expandTaskArea = expand_container.querySelector(".expandTaskArea");
        expandTaskArea.addEventListener("keypress", editExpandTask);

        let enterBtn = expand_container.querySelector(".enter");
        enterBtn.addEventListener("click", function (e) {
            main_container.style.opacity = 1;
            expandBtn.classList.remove("task_icon_active");
            expand_container.remove();

            let task_container = document.querySelectorAll(".task_container");
            for (let i = 0; i < task_container.length; i++) {
                let uid = task_container[i].children[0].children[0].innerText;
                if (uid == id) {
                    let task_area = task_container[i].children[1].children[1];
                    task_area.innerText = expandTaskArea.innerText  
                }
            }
        })
    }
    else {
        main_container.style.opacity = 1;
        expand_container.remove();
    }
}

function TextPencilBtn(e) {
    let pencilBtn = e.currentTarget;
    let expandTaskArea = document.querySelector(".expandTaskArea");
    let isActive = pencilBtn.classList.contains("expandIcon_Active");
    if (isActive == false) {
        pencilBtn.classList.add("expandIcon_Active");
        expandTaskArea.setAttribute("contenteditable", "true");
    }
    else {
        pencilBtn.classList.remove("expandIcon_Active");
        expandTaskArea.setAttribute("contenteditable", "false");
    }
}

function createChecklistExpandContainer(color, ptask, heading, id, expandBtn, noteType) {
    let exTaskArr = [];
    let expand_container = document.querySelector(".expand_container");
    if (expand_container == null) {  
        main_container.style.opacity = 0.5;
        expand_container = document.createElement("div");
        expand_container.setAttribute("class", "expand_container");
        expand_container.innerHTML = `<div class="expandColorBar ${color}">
            <h4 class="uid">${id}</h4>
                </div>
                <div class="expandTaskDesc">
                    <div class="expandTask">
                        <div class="expandHeading">${heading}</div>
                        <input type = "text" class="expandchecklistInput" placeholder = "Enter a task">
                        <p id = "instruction">Double click to delete</p>
                        <ul class = "expand_task_list"> </ul>
                    </div>
                    <div class="expand_edits">
                        <div class="enter">E N T E R</div>
                    </div>
                </div>`
        body.appendChild(expand_container);
        let createList = function (value) {
            let li = document.createElement("li");
            li.innerText = value;
            exTaskArr.push(value);
            li.setAttribute("class", "expand_tasks");
            li.addEventListener("dblclick", function (e) {
                let val = li.innerText;
                let idx = exTaskArr.indexOf(val);
                exTaskArr.splice(idx, 1);
                li.remove();
            })
            ul.appendChild(li);
        }

        let ul = document.querySelector(".expand_task_list");
        for (let i = 0; i < taskArr.length; i++) {
            let { uid, task } = taskArr[i];
            if (uid == id) {
                task.forEach((value) => {
                    createList(value);
                })
            }
        }

        let expand_input = document.querySelector(".expandchecklistInput");
        expand_input.addEventListener("keydown", function (e) {
            if (e.key == "Enter" && expand_input.value != "") {
                createList( expand_input.value);
                expand_input.value = "";
            }
        })

        let enterBtn = expand_container.querySelector(".enter");
        enterBtn.addEventListener("click", function (e) {
            // displaying on UI in the task container
            let task_area;
            let task_container = document.querySelectorAll(".task_container");
            for (let i = 0; i < task_container.length; i++) {
                let uid = task_container[i].children[0].children[0].innerText;
                if (uid == id) {
                    task_area = task_container[i].children[1].children[1];
                }
            }
            displayTaskList(task_area, exTaskArr);

            // saving in the local storage
            for (let i = 0; i < taskArr.length; i++) {
                let { uid } = taskArr[i];
                if (uid == id) {
                    taskArr[i].task = exTaskArr;
                    let finalArr = JSON.stringify(taskArr);
                    localStorage.setItem("allTask", finalArr);
                    break;
                }
            }

            main_container.style.opacity = 1;
            expandBtn.classList.remove("task_icon_active");
            expand_container.remove();

        })
    }
    else {
        main_container.style.opacity = 1;
        expand_container.remove();
    }
}

function editExpandTask(e) {
    let expandTaskArea = e.currentTarget;
    let id = expandTaskArea.parentNode.parentNode.parentNode.children[0].children[0].innerText;
    for (let i = 0; i < taskArr.length; i++) {
        let { uid } = taskArr[i]
        if (uid == id) {
            taskArr[i].task = expandTaskArea.innerText;
            let finalArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalArr);
            break;
        }
    }
}

//-----------------Deleting Task-----------------------------------------------------------------------------------------------

function setDeleteState(e) {
    let crossBtn = e.currentTarget;
    if (deleteState == false) {
        crossBtn.classList.add("active");    
    }
    else {
        crossBtn.classList.remove("active");   
    }
    deleteState = !deleteState;    
}


function deleteTask(e) {
    if (deleteState == true) { 
        let task_container = e.currentTarget;
        let id = task_container.querySelector(".uid").innerText; 
        for (let i = 0; i < taskArr.length; i++) {
            let { uid } = taskArr[i];
            if (uid == id) {
                task_container.remove(); 
                taskArr.splice(i, 1);     
                let finalArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalArr);
                break;
            }
        }
    }
}