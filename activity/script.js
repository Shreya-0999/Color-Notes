`use strict`
let editing_options = document.querySelectorAll(".icon_container");
let main_container = document.querySelector(".main_container");
let body = document.body;
let plusBtn = editing_options[0];
let crossBtn = editing_options[1];
let deleteState = false;
let taskArr = [];

// display all the task stored in the local storage i.e retreive the data from the local storage
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));   // to convert the string recived to an object
    for (let i = 0; i < taskArr.length; i++) {
        let { color, task, uid } = taskArr[i];
        // to display it on UI
        createTask(color, task, false, uid); // false to tell that its from local storage
    }
}

plusBtn.addEventListener("click", createModal);
crossBtn.addEventListener("click", setDeleteState);  // to change the state of button from off to on or vice versa

function createModal() {
    let modal_container = document.querySelector(".modal_container");
    if (modal_container == null) {       // to check whether the container is already present of not
        modal_container = document.createElement("div");
        modal_container.setAttribute("class", "modal_container");     //setting its class = modal_container
        //adding html of the conntainer
        modal_container.innerHTML = `<div class="input_container">    
                <textarea class="modal_input" placeholder = "Enter your task"></textarea>
            </div>
            <div class="modal_filter"> 
                <div class="pink filter"></div>
                <div class="blue filter"></div>
                <div class="green filter"></div>
                <div class="black filter"></div>
            </div>`
        body.appendChild(modal_container);   //attaching it to the body (whenever plusbtn will be clicked this modal will be attached to the body)
        handleModal(modal_container);     // for handling the actions inside the modal container
    }
    let input = modal_container.querySelector(".modal_input");
    input.value = "";   // if the conatiner is already present then clear its value
}

function handleModal(modal_container) {
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
    input_area.addEventListener("keydown", function (e) {
        if (e.key == "Enter" && input_area != null) {   // as the enter bttn is pressed perform following task
            modal_container.remove();         // removing the modal container
            createTask(current_color, input_area.value, true);   // creating the task on the body with the color and the task entered(true : to tell its entered from the UI not local storage)
        }
    })
}

function createTask(color, task, flag, id) {
    // creating the task container 
    let task_container = document.createElement("div");
    task_container.setAttribute("class", "task_container");
    let uifn = new ShortUniqueId();
    let uid = id || uifn();
    task_container.innerHTML = `<div class="color_bar ${color}"></div>
    <div class="task_description">
        <h3 class="uid">${uid}</h3>
        <div class="task_area" contenteditable = "true">${task}</div>
    </div>`
    main_container.appendChild(task_container);
    if (flag == true) {  // it is from UI then add it to local storage
        let obj = { "task": task, "color": color, "uid": uid };
        taskArr.push(obj);
        let finalArr = JSON.stringify(taskArr);
        localStorage.setItem("allTask", finalArr); // accepts key: value(string)
    }

    //for changing the color of any task
    let color_bar = task_container.querySelector(".color_bar");
    color_bar.addEventListener("click", changeColor);

    // if their is any editing done on the task then it must be reflected back into the local storage
    let task_area = task_container.querySelector(".task_area");
    task_area.addEventListener("keypress", editTask);

    // to delete any task if the delete state  is true
    task_container.addEventListener("click", deleteTask);
}

function changeColor(e) {
    let colorArr = ["pink", "blue", "green", "black"];
    let color_bar = e.currentTarget;
    let cColor = color_bar.classList[1];   // getting the class (color) name
    let idx = colorArr.indexOf(cColor);    // getting the index of current color
    idx = (idx + 1) % colorArr.length;     // for rotating around the array (i.e storing the idx of next color)
    color_bar.classList.remove(cColor);    // removing the current color
    color_bar.classList.add(colorArr[idx]);  // adding the next color in the list

    //updating the change in the local storage
    let id = color_bar.parentNode.children[1].children[0].innerText;
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

function editTask(e) {
    let task_area = e.currentTarget;
    let id = task_area.parentNode.children[0].innerText;          // to know the uid of the task clicked
    //comparing the id's to update it in the local storage
    for (let i = 0; i < taskArr.length; i++) {
        let { uid } = taskArr[i]
        if (uid == id) {
            taskArr[i].task = task_area.innerText;
            let finalArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalArr);
            break;
        }
    }
}

function setDeleteState(e) {
    let crossBtn = e.currentTarget;
    if (deleteState == false) {
        crossBtn.classList.add("active");     // it will add the active class and chnage the color to darker mode
    }
    else {
        crossBtn.classList.remove("active");   // it will remove the active class and chnage the color back
    }
    deleteState = !deleteState;    // to change the state of cross btn i.e to know whether the btn is on of off
}

function deleteTask(e) {
    if (deleteState == true) {  // if the cross button is on then perform the operation
        let task_container = e.currentTarget;
        let id = task_container.querySelector(".uid").innerText; // getting the uid of the task container clicked
        // or
        // let id = task_container.children[1].children[0].innerText;
        for (let i = 0; i < taskArr.length; i++) {
            let { uid } = taskArr[i];
            // comparing the id with the local storage to update it their
            if (uid == id) {
                task_container.remove();    // deleting the task from the main body
                taskArr.splice(i, 1);       // removing it from local storage and updating the data
                let finalArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalArr);
                break;
            }
        }
    }
}