// identifikasi element
    const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

    // mengidentifikasi id
    let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("save_task"));

    // menambahkan button di samping todo
    filters.forEach(btn => 
    {
        btn.addEventListener("click", () => 
        {
            document.querySelector("span.active").classList.remove("active");
            btn.classList.add("active");
            showTodo(btn.id);
        });
    });

    // menampilkan semua todo
    function showTodo(filter) 
    {
        let liTag = "";
        if (todos) 
        {
            todos.forEach((todo, id) => 
            {
                let done = todo.status == "done" ? "checked" : "";
                if (filter == todo.status || filter == "all") 
                {
                    liTag += `
                    <div class="card border border-0" style="background-color: mintcream">
                        <div class="row g-0">
                                <div class="col-md-1">
                                    <div class="card-body">
                                    <li class="task list-group-item border border-0" style="background-color: mintcream">
                                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${done} class="form-check-input">   
                                    </li>
                                    </div>    
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                    <li class="task list-group-item border border-0" style="background-color: mintcream">
                                        <label class="form-check-label" for="${id}">
                                            <p class="${done}">${todo.name}</p>
                                        </label>
                                    </li>
                                    </div>    
                                </div>
                                <div class="col-md-5 settings">
                                    <div class="card-body">
                                    <li class="task list-group-item border border-0" style="background-color: mintcream">
                                        <ul class="task-menu list-group">
                                            <li onclick='deleteTask(${id}, "${filter}")' class="list-group-item border border-0" style="background-color: mintcream">
                                                <button class="btn btn-danger btn-sm">Delete</button>
                                            </li>
                                        </ul>
                                    </li>  
                                    </div>  
                                </div> 
                        </div>
                    </div>`;
                }
            });
        }
        taskBox.innerHTML = liTag || `<span class="m-3">You don't have a task</span>`;
        let checkTask = taskBox.querySelectorAll(".task");
        !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
        taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
    }
    showTodo("all");

    //menampilkan menu jika todo sudah ditambahkan
    function showMenu(selectedTask) 
    {
        let menuDiv = selectedTask.parentElement.lastElementChild;
        menuDiv.classList.add("show");
        document.addEventListener("click", e => {
            if (e.target.tagName != "I" || e.target != selectedTask) {
                menuDiv.classList.remove("show");
            }
        });
    }

    //mengupdate status todo dari pending menjadi done
    function updateStatus(selectedTask) 
    {
        let taskName = selectedTask.parentElement.lastElementChild;
        if (selectedTask.checked) {
            taskName.classList.add("checked");
            todos[selectedTask.id].status = "done";
        } else {
            taskName.classList.remove("checked");
            todos[selectedTask.id].status = "pending";
        }
        localStorage.setItem("save_task", JSON.stringify(todos))
    }

    //menghapus to do
    function deleteTask(deleteId, filter) 
    {
        isEditTask = false;
        todos.splice(deleteId, 1);
        localStorage.setItem("save_task", JSON.stringify(todos));
        showTodo(filter);
    }

    //Membuang semua isi to do
    clearAll.addEventListener("click", () => 
    {
        isEditTask = false;
        todos.splice(0, todos.length);
        localStorage.setItem("save_task", JSON.stringify(todos));
        showTodo()
        Clearalert()
    });

    //menampilkan alert jika sudah dihapus semua
    function Clearalert() 
    {
        swal({
            title: "Succeed",
            text: "Berhasil menghapus semua aktivitas",
            icon: "success",
            button: true
        });

    }

//menambahkan input to do
taskInput.addEventListener("keyup", e => 
{
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) 
    {
        if (!isEditTask) 
        {
            todos = !todos ? [] : todos;
            let taskInfo = 
            {
                name: userTask,
                status: "pending"
            };
            todos.push(taskInfo);
        } 
        else 
        {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("save_task", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});