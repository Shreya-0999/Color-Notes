`use strict`
let editing_options = document.querySelectorAll(".icon_container");
let main_container = document.querySelector(".main_container");
let colorBtn = document.querySelectorAll(".filter");
let body = document.body;
let plusBtn = editing_options[0];
let crossBtn = editing_options[1];
let deleteState = false;
let taskArr = [];


//---------------Local Storage-----------------------------------------------------------------------------------
// display all the task stored in the local storage i.e retreive the data from the local storage
if (localStorage.getItem("allTask")) {
    taskArr = JSON.parse(localStorage.getItem("allTask"));   // to convert the string recived to an object
    for (let i = 0; i < taskArr.length; i++) {
        let { color, task, uid, heading } = taskArr[i];
        // to display it on UI
        createTask(color, task, false, heading, uid); // false to tell that its from local storage
    }
}

//---------------Navigation Functionality------------------------------------------------------------------------
plusBtn.addEventListener("click", createModal);
crossBtn.addEventListener("click", setDeleteState);  // to change the state of button from off to on or vice versa

// Activating color buttons in the navigation bar
for (let i = 0; i < colorBtn.length; i++) {
    colorBtn[i].addEventListener("click", function () {
        let isActive = colorBtn[i].classList.contains("active");
        if (isActive) {
            colorBtn[i].classList.remove("active");
            changeFilter(null);  // if no filter color is selected then display all the task
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

//---------------Creating Modal for adding new task---------------------------------------------------------------
function createModal() {

    let modal_container = document.querySelector(".modal_container");
    if (modal_container == null) {       // to check whether the container is already present of not
        plusBtn.classList.add("active");  // change its backgroung to tell its active
        modal_container = document.createElement("div");
        modal_container.setAttribute("class", "modal_container");     //setting its class = modal_container
        //adding html of the conntainer
        modal_container.innerHTML = `<div class="input_container">    
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
            `
        body.appendChild(modal_container);   //attaching it to the body (whenever plusbtn will be clicked this modal will be attached to the body)
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
    let enterBtn = modal_container.querySelector(".enter");
    let input_area = modal_container.querySelector(".modal_input");
    let header_input = modal_container.querySelector(".modal_heading");
    enterBtn.addEventListener("click", function (e) {
        if (input_area.innerText != null) {   // as the enter bttn is pressed perform following task
            plusBtn.classList.remove("active");
            modal_container.remove();         // removing the modal container
            main_container.style.opacity = 1;
            createTask(current_color, input_area.value, true, header_input.value);   // creating the task on the body with the color and the task entered(true : to tell its entered from the UI not local storage)
        }
    })
}

//---------------Creating and editing Task------------------------------------------------------------------------
function createTask(color, task, flag, heading, id) {
    // creating the task container 
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
        let obj = { "task": task, "color": color, "uid": uid, "heading": heading };
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

// -------------------Expanding Function------------------------------------------------------------------------------
//adding the expanding feature
function expandFunction(e) {
    let expandBtn = e.currentTarget;
    let isActive = expandBtn.classList.contains("task_icon_active");  // adding active feature
    if (isActive) {
        expandBtn.classList.remove("task_icon_active");
        createExpandContainer();
    }
    else {
        expandBtn.classList.add("task_icon_active");
        //collecting all the data in the task conatiner to display it on the expanded UI
        let task_area = expandBtn.parentNode.parentNode.children[1];   // getting the task area of the container selected
        let task = task_area.innerText;    // extracting the text inside the container to display it in modal
        let color = expandBtn.parentNode.parentNode.parentNode.children[0].classList[1];  // extracting color and uid for the task container selected
        let uid = expandBtn.parentNode.parentNode.parentNode.children[0].children[0].innerText;
        let heading = expandBtn.parentNode.children[0].innerText;
        createExpandContainer(color, task, heading, uid, expandBtn);
    }
}

function createExpandContainer(color, task, heading, id, expandBtn) {
    let expand_container = document.querySelector(".expand_container");
    if (expand_container == null) {  //checking if it is already present or not
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
        // pencil function on expand UI
        let pencilBtn = expand_container.querySelector(".expand_icon_container");
        pencilBtn.addEventListener("click", expandPencilBtn);

        let expandTaskArea = expand_container.querySelector(".expandTaskArea");
        expandTaskArea.addEventListener("keypress", editExpandTask);

        // enter function on expand UI
        let enterBtn = expand_container.querySelector(".enter");
        enterBtn.addEventListener("click", function (e) {
            main_container.style.opacity = 1;
            expandBtn.classList.remove("task_icon_active");
            expand_container.remove();
            // updating any changes done in the expanded container to the task container
            let task_container = document.querySelectorAll(".task_container");
            for(let i = 0; i < task_container.length; i++){
                let uid = task_container[i].children[0].children[0].innerText;
                if(uid == id){
                    let task_area = task_container[i].children[1].children[1];
                    task_area.innerText = expandTaskArea.innerText  // copying the changes to reflect in task container
                    console.log(expandTaskArea.innerText);
                }
            }
        })
    }
    else {
        main_container.style.opacity = 1;
        expand_container.remove();
    }
}

function expandPencilBtn(e) {
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


// ----------------Editing Task------------------------------------------------------------------------------------------------
//if their is any change in the task then update it on local storage
function editTask(e) {
    let task_area = e.currentTarget;
    let id = task_area.parentNode.parentNode.children[0].children[0].innerText;          // to know the uid of the task clicked
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

// if any changes done after expanding the task
function editExpandTask(e){
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