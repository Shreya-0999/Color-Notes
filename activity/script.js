`use strict`
let editing_options = document.querySelectorAll(".icon_container");
let main_container = document.querySelector(".main_container");
let colorBtn = document.querySelectorAll(".filter");
let body = document.body;
let plusBtn = editing_options[0];
let crossBtn = editing_options[1];
let deleteState = false;
let taskArr = [];


//---------------Local Storage-----------------
// display all the task stored in the local storage i.e retreive the data from the local storage
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));   // to convert the string recived to an object
    for (let i = 0; i < taskArr.length; i++) {
        let { color, task, uid } = taskArr[i];
        // to display it on UI
        createTask(color, task, false, uid); // false to tell that its from local storage
    }
}

//---------------Navigation Functionality-----------------
plusBtn.addEventListener("click", createModal);
crossBtn.addEventListener("click", setDeleteState);  // to change the state of button from off to on or vice versa

// Activating color buttons in the navigation bar
for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function () {
        let isActive = colorBtn[i].classList.contains("active");
        if (isActive) {
            colorBtn[i].classList.remove("active");
            changeFilter(null);  // if no filter color is selected
        } else {
            // removing active class from other color so that no two color are selected at same time.
            for (let i = 0; i < colorBtn.length; i++) {
                colorBtn[i].classList.remove("active");
            }
            colorBtn[i].classList.add("active");   // highlighting the color selected by adding active class
            let displayColor = colorBtn[i].children[0].classList[0]; // getting the color selected
            changeFilter(displayColor);
        }
    })
}

function changeFilter(displayColor) {
    let task_container = document.querySelectorAll(".task_container");  // getting all the task container present
    if (task_container) { // task container present then
        for (let i = 0; i < task_container.length; i++) {
            let taskColor = task_container[i].children[0].classList[1];  // extracting its filter color
            if (displayColor == null) {  // if no filter color is selected then display all of them
                task_container[i].style.display = "block";
            }
            else if (displayColor != taskColor) {
                task_container[i].style.display = "none";  // if color extracted is not equal to the color selected then remove the task container
            }
            else if (displayColor == taskColor) {
                task_container[i].style.display = "block"; // if equal then display
            }
        }
    }
    if (displayColor == "pink")
        body.style.backgroundColor = "rgb(245, 222, 229)";
    else if (displayColor == "blue")
        body.style.backgroundColor = "rgb(222, 235, 245)";
    else if (displayColor == "green")
        body.style.backgroundColor = "rgb(228, 245, 238)";
    else if (displayColor == "black")
        body.style.backgroundColor = "rgb(215, 218, 221)";
    else {
        body.style.backgroundColor = "rgb(238, 242, 247)";
    }
}

//---------------Creating Modal for adding new task-----------------
function createModal(task, flag, color, uid, expandBtn) {
    if (typeof (task) == "object") {   // done for expanding feature to check that whether it is called from expand button or plusbtn (if plusbtn then it will have object inside it)
        task = "";
    }
    let modal_container = document.querySelector(".modal_container");
    if (modal_container == null) {       // to check whether the container is already present of not
        if (!flag)   // to check whether it is called from expand btn or plus btn
            plusBtn.classList.add("active");  // change its backgroung to tell its active
        modal_container = document.createElement("div");
        modal_container.setAttribute("class", "modal_container");     //setting its class = modal_container
        //adding html of the conntainer
        modal_container.innerHTML = `<div class="input_container">    
                <textarea class="modal_input" placeholder = "Enter your task">${task}</textarea>
            </div>
            <div class="modal_filter"> 
                <div class="pink filter"></div>
                <div class="blue filter"></div>
                <div class="green filter"></div>
                <div class="black filter"></div>
            </div>`
        body.appendChild(modal_container);   //attaching it to the body (whenever plusbtn will be clicked this modal will be attached to the body)
        if (flag)
            expandModal(modal_container, color, uid, expandBtn);
        else
            handleModal(modal_container);     // for handling the actions inside the modal container
    }
    else {
        modal_container.remove();
        plusBtn.classList.remove("active");   // to remove the active feature
        main_container.style.opacity = 1;
    }
}

function handleModal(modal_container) {
    main_container.style.opacity = 0.5;
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
            plusBtn.classList.remove("active");
            modal_container.remove();         // removing the modal container
            main_container.style.opacity = 1;
            createTask(current_color, input_area.value, true);   // creating the task on the body with the color and the task entered(true : to tell its entered from the UI not local storage)
        }
    })
}

// if the task container is expanded
function expandModal(modal_container, color, uid, expandBtn) {
    main_container.style.opacity = 0.5;
    let currColor = color.classList[1];  // getting the color of the task container
    // selecting same color which is on task container with the color filter from the modal container
    let modal_filters = document.querySelectorAll(".modal_filter .filter");
    modal_filters.forEach((filter) => {
        filter.classList.remove("border");
    })
    // as the task container color is met adding the border to it
    modal_filters.forEach((filter) => {
        if (filter.classList[0] == currColor)
            filter.classList.add("border");
    })

    // if any changes is done in the input container then reflecting it back in the task container
    let task_cont = '';
    let uidArr = document.querySelectorAll(".uid");  // collecting the all the uid present in the document
    for (let i = 0; i < uidArr.length; i++)   // matching all the uids with the one that has been selected 
        if (uid == uidArr[i])
            task_cont = uidArr[i].parentNode.parentNode.parentNode;   // storing the task_container of the matched uid to reflect the changes in the task_area
    let input_area = modal_container.querySelector(".modal_input");   // as the enter key is pressed in the modal container
    input_area.addEventListener("keydown", function (e) {
        if (e.key == "Enter" && input_area != null) {
            modal_container.remove();                                 // it will remove the modal container
            let t_a = task_cont.querySelector(".task_area");          // get the task_area of the container
            t_a.innerText = input_area.value;                         // and reflect the changes done that has been made to the modal
            expandBtn.classList.remove("task_icon_active");
            main_container.style.opacity = 1;
        }
    })
}

//---------------Creating and editing Task-----------------
function createTask(color, task, flag, id) {
    // creating the task container 
    let task_container = document.createElement("div");
    task_container.setAttribute("class", "task_container");
    let uifn = new ShortUniqueId();
    let uid = id || uifn();
    task_container.innerHTML = `<div class="color_bar ${color}"></div>
    <div class="task_description">
    <div class= "task_header">
        <h3 class="uid">${uid}</h3>
        <div class="task_icon_container">
            <i class="fas fa-pencil-alt"></i>
        </div>
        <div class="task_icon_container">
            <i class="fas fa-expand"></i>
        </div>
    </div>
        <div class="task_area">${task}</div>
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

    let task_iconArr = task_container.querySelectorAll(".task_icon_container");  // getting the edit option available in the task container

    // On clicking the pencil icon the content will become editable
    let pencilBtn = task_iconArr[0];
    pencilBtn.addEventListener("click", pencilFunction)

    let expandBtn = task_iconArr[1];
    expandBtn.addEventListener("click", expandFunction);

    // if their is any editing done on the task then it must be reflected back into the local storage
    let task_area = task_container.querySelector(".task_area");
    task_area.addEventListener("keypress", editTask);

    // to delete any task if the delete state  is true
    task_container.addEventListener("click", deleteTask);
}

//adding pencil feature
function pencilFunction(e) {
    let pencilBtn = e.currentTarget;
    let task_area = pencilBtn.parentNode.parentNode.children[1];
    let isActive = pencilBtn.classList.contains("task_icon_active");
    if (isActive) {      // if button active then close
        pencilBtn.classList.remove("task_icon_active");
        task_area.setAttribute("contenteditable", "false")
    }
    else {    // if button not active then make it active and perfrom the task
        pencilBtn.classList.add("task_icon_active");
        task_area.setAttribute("contenteditable", "true")
    }
}

//adding the expanding feature
function expandFunction(e) {
    let expandBtn = e.currentTarget;
    let task_area = expandBtn.parentNode.parentNode.children[1];   // getting the task area of the container selected
    let isActive = expandBtn.classList.contains("task_icon_active");  // adding active feature
    if (isActive) {
        expandBtn.classList.remove("task_icon_active");
        createModal();
    }
    else {
        expandBtn.classList.add("task_icon_active");
        let task = task_area.innerText;    // extracting the text inside the container to display it in modal
        let color = expandBtn.parentNode.parentNode.parentNode.children[0];  // extracting colo and uid for the task container selected
        let uid = expandBtn.parentNode.children[0];
        createModal(task, true, color, uid, expandBtn);   // creating the expanded version
    }
}

//changing the color of the color bar of task container
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

//if their is any change in the task then update it on local storage
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
//---------------Deleting Task-----------------

//checking the state of cross button i.e whether active or not
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

//deleting the task if cross btn is active and updating it on local
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