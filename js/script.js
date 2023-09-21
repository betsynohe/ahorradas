// selectores
const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

//generador de id random
const randomId = () => self.crypto.randomUUID()

//localStorage
const getDataStorage = (key) => JSON.parse(localStorage.getItem(key))
const setDataStorage = (key, array) => localStorage.setItem(key, JSON.stringify(array))

//para limpiar los contenedores
const cleanContainers = (selectors) => {
    for (const selector of selectors) {
        $(selector).innerHTML = "";
    }
};

//FUNCION PARA LAS VISTAS
const showVista = (showView) => {
    $$(".view").forEach((view) => view.classList.add("is-hidden"));
    $(`#${showView}`).classList.remove("is-hidden");
};

//categorias por defecto
const defaultCategoriesOptions = [
    {
        id: randomId(),
        name: "Comida",
    },
    {
        id: randomId(),
        name: "Servicios",
    },
    {
        id: randomId(),
        name: "Salidas",
    },
    {
        id: randomId(),
        name: "Educación",
    },
    {
        id: randomId(),
        name: "Transporte",
    },
    {
        id: randomId(),
        name: "Trabajo",
    },
];

const allCategories = getDataStorage("categories") || defaultCategoriesOptions;
const allOperations = getDataStorage("operations") || []

/* ********* CATEGORIAS ********* */

const renderCategories = (categories) => {
    cleanContainers(["#categories-section"])
    for (const {id, name} of  categories) { 
        $("#categories-section").innerHTML +=
        ` <article class="column is-6-mobile is-flex">
        <p class="tag is-primary is-light mt-3">
        ${name}
        </p>
        <article class="column has-text-right">
        <a onclick= editCategoriesForm("${id}") id="${id}" class="mr-5">
            <i class="fa-solid fa-pencil"></i>
        </a>
        <a onclick= deleteCategories("${id}") id="${id}">
            <i class="fa-solid fa-trash-can"></i>
        </a>
    </article>
    </article>
    `
    }
}

const renderCategoriesOptions = (categories) => {
    cleanContainers(["#filter-category", "#categories-select-op"])
    if (categories.length){
        $("#filter-category").innerHTML += `
        <option value="todas">Todas</option>`
        for (const {id, name} of  categories) { 
        $("#filter-category").innerHTML += `
        <option value="${id}">${name}</option>
        `};
        $$(".categories-select").forEach((select) => {
        for( const {id, name} of categories){
            select.innerHTML +=`
            <option value="${id}">${name}</option>
            `
        }
        })
    }
}

//guarda las categorias
const saveCategory = (categoryId) => {
    const inputField = categoryId ? "#input-edit-categories" : "#category-name";
    const name = $(inputField).value;
    return {
        id: categoryId ? categoryId : randomId(),
        name: name,
    };
};

// agrega las categorias nuevas
const addNewCategory = () => {
    const currentCategory = getDataStorage("categories");
    const newCategory = saveCategory();
    currentCategory.push(newCategory);
    setDataStorage("categories", currentCategory);
    renderCategories(currentCategory);
    renderCategoriesOptions(currentCategory);
    console.log(newCategory);
};

//edita las categorias
const editCategory = () => {
    const categoryId= $("#btn-confirm-add").getAttribute("data-id")
    const editedCategory= getDataStorage("categories").map(category => {
        if (category.id === categoryId){
            return saveCategory(categoryId)
        }
        return category
    })
    setDataStorage("categories", editedCategory)
}

const editCategoriesForm = (id) => {
    $(showVista("edit-categories"))
    $("#btn-confirm-add").setAttribute("data-id", id)
    const categorySelected = getDataStorage("categories").find(category => category.id === id)
    $("#input-edit-categories").value = categorySelected.name
}

//elimina las categorias
const deleteCategories = (id) => {
    currentCategories = getDataStorage("categories").filter(
        (category) => category.id !== id)
    setDataStorage("categories", currentCategories)
    renderCategories(currentCategories)
}

/* **** VISTA DE OPERACIONES **** */

// CARGAR OPERACION

const saveNewOperation = (operationId) => {
    return {
        id: operationId ? operationId : randomId(),
        description: $("#description-input").value,
        amount: $("#amount-input").value,
        type: $("#type-operation").value,
        category: $("#categories-select-op").value,
        date: new Date($("#date-input").value.replace(/-/g, "/")),
    };
};

// AGREGA LAS OPERACIONES
const renderOperations = (operations) => {
    cleanContainers(["#operations-table"]);
    if (allOperations.length) {
        $("#balance-no-results").classList.add("is-hidden");
        $("#there-are-operations").classList.remove("is-hidden");
        for (const { id, description, amount, type, category, date} of operations) {
            const spentAmount = type === "Ganancia" ? "has-text-success" : "has-text-danger";
            const gainAmount = type === "Ganancia" ? "+" : "-";
            const categorySelected = getDataStorage("categories").find(catego => catego.id === category)
            $("#operations-table").innerHTML += ` <section class="columns is-multiline is-mobile">
            <article class="column has-text-weight-semibold is-6-mobile">
                <p>
                ${description}
                </p>
            </article>
            <article class="column is-6-mobile">
                <span class="tag is-primary is-light">
                ${categorySelected.name}
                </span>
            </article>
            <article class="column has-text-right has-text-gray is-hidden-mobile">
                <p>
                ${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()}
                </p>
            </article>
            <article
                class="${spentAmount} column has-text-right has-text-weight-bold has-text-success is-size-4-mobile is-6-mobile is-2-tablet has-text-left-mobile">
                <p>
                ${gainAmount} ${amount}
                </p>
            </article>
            <article class=" has-text-right buttons">
                <button class="mr-5 button" onclick="editOperation('${id}')">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="button" onclick="deleteOperation('${id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </article>
        </section>`;
        }
    } else {
        $("#balance-no-results").classList.remove("is-hidden");
        $("#there-are-operations").classList.add("is-hidden");
    }
};


//agrega la operacion
const addOperationForm = () => {
    const currentOperations = getDataStorage("operations");
    const newOperation = saveNewOperation();
    currentOperations.push(newOperation);
    setDataStorage("operations", currentOperations);
    renderOperations(currentOperations);
};

//elimina la operacion
const deleteOperation = (id) => {
    currentOperations = getDataStorage("operations").filter(
        (operation) => operation.id !== id
    );
    setDataStorage("operations", currentOperations);
    renderOperations(currentOperations);
    getBalance(allOperations)
};

//editar operaciones
const getEditOperation = () => {
    $(showVista("balance-container"));
    const operationId = $("#btn-edit-operation").getAttribute("data-id");
    const editedOperations = getDataStorage("operations").map((operation) => {
        if (operation.id === operationId) {
            return saveNewOperation(operationId);
        }
        return operation;
    });
    setDataStorage("operations", editedOperations);
    renderOperations(editedOperations);
    getBalance(allOperations)
};

const editOperation = (id) => {
    $(showVista("new-operation-container"));
    $(".title-edit").classList.remove("is-hidden")
    $(".title-operation").classList.add("is-hidden")
    $("#btn-add-operation").classList.add("is-hidden")
    $("#btn-edit-operation").classList.remove("is-hidden")
    $("#btn-edit-operation").setAttribute("data-id", id);
    const editSelected = getDataStorage("operations").find((operation) => operation.id === id);
    $("#description-input").value = editSelected.description;
    $("#amount-input").valueAsNumber = editSelected.amount;
    $("#type-operation").value = editSelected.type;
    $("#categories-select-op").value = editSelected.category;
    $("#date-input").value = editSelected.date;
};

/* *******VISTA DE BALANCE******** */

const getBalance = (operations) => {
    //balance
    let expense = 0;
    let profit = 0;
    let balance = 0;

     //render balance
    for (const { type, amount } of operations){
        if (type === "Ganancia") {
        profit += parseFloat(amount);
        balance += parseFloat(amount);
    }
        if (type === "Gasto") {
        expense -= parseFloat(amount);
        balance -= parseFloat(amount);
    }
    }
    return {
        profit: profit,
        expense: expense,
        balance: balance
    }
}

const generateBalance = (operations) => {
    const { profit, expense, balance } = getBalance(operations)
    $("#profits").innerHTML = `+ $ ` + profit;
    $("#expenses").innerHTML = `$ ` + expense;
    let className = balance > 0 ? "has-text-success" : balance < 0 ? "has-text-danger" : "has-text-black";
    let symbol = balance > 0 ? "+" : balance < 0 ? "-" : "";
    $("#total-balance").innerHTML = `<span class="${className}">${symbol} $ ${Math.abs(balance)}</span>`;
}

/* *******FILTROS DE LA VISTA DE BALANCE******* */ 

const filters = () => {
    const type = $("#filter-type").value
    const category = $("#filter-category").value
    const date = new Date($("#filter-date").value)
    const filterS = $("#filter-order").value

    const filterType = getDataStorage("operations").filter((operation) => {
        if (type === "todos") {
            return operation
        }
        return type === operation.type
    })

    const filterCategory = filterType.filter((operation) => {
        if (category === "todas") {
            return operation
        } else {
            return category === operation.category
        }
    })

    const filterDate = filterCategory.filter((operation) => {
        return new Date(operation.date).getDate() >= date.getDate() && new Date(operation.date).getMonth() >= date.getMonth()
    })

   const filterSort = filterDate.sort((a, b) => {
        if (filterS === "mas-reciente"){
            return new Date(b.date).getDate() - new Date(a.date).getDate()
        } 
        if (filterS === "menos-reciente") {
            return new Date(a.date).getDate() - new Date(b.date).getDate()
        }
        if (filterS === "mayo-monto") {
            return b.amount - a.amount
        }
        if (filterS === "menor-monto") {
            return a.amount - b.amount
        }
        if (filterS === "a/z") {
            if (a.description.toUpperCase() < b.description.toUpperCase()) {
                return -1
            }
        }
        else {
            if (b.description.toUpperCase() < a.description.toUpperCase()) {
                return -1
            }
        }
   })

   getBalance(filterSort)
   return renderOperations(filterSort)
}


// FUNCION PARA INICIALIZAR LA APP 
const initializeApp = () => {
    setDataStorage("categories", allCategories);
    setDataStorage("operations", allOperations);
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    renderOperations(allOperations)
    generateBalance(allOperations)
    getBalance(allOperations)
    filters()
    
/* boton del menu de hamburguesa */
    $('.navbar-burger').addEventListener('click', () => {
    if ($('.navbar-burger').classList.contains('is-active')){
        $('.navbar-burger').classList.toggle('is-active')
        $('.navbar-menu').classList.toggle('is-active')
    }
    else {
        $('.navbar-burger').classList.toggle('is-active')
        $('.navbar-menu').classList.toggle('is-active')
    }
    })

// click btn categories
    $("#btn-categories").addEventListener("click", () =>
    showVista("category-section")
    );

// click btn balance 
    $("#btn-balance").addEventListener("click", () =>
    showVista("balance-container")
    );

// click btn reports
    $("#btn-reports").addEventListener("click", () =>
    showVista("reports")
    );

// boton para nueva operacion
    $("#new-operation-btn").addEventListener("click", () =>
    showVista("new-operation-container")
    );

//agrega la nueva operacion
    $("#btn-add-operation").addEventListener("click", () => {
    addOperationForm();
    showVista("there-are-operations")
    showVista("balance-container")
    }); 

//edita la operacion
    $("#btn-edit-operation").addEventListener("click", () =>{
    getEditOperation()
    $("#edit-operation-container").classList.add("is-hidden")
    });

// cancela una nueva operacion
//cancela editar la operacion
    $("#btn-cancel-operation").addEventListener("click", () => {
    showVista("balance-container")
    });

//agrega una nueva categoria
    $("#btn-add-categories").addEventListener("click", () => {
            addNewCategory();
            $("#category-name").value = "";
    })

// edita la categoria
    $("#btn-confirm-add").addEventListener("click", () => {
            editCategory()
            showVista("category-section")
            renderCategories(getDataStorage("categories"))
    })
//cancela la edicion de la categoria
    $("#btn-cancel-categories").addEventListener("click",() =>{
        showVista("category-section")
    })

    $("#filter-type").addEventListener ("change", filters)
    $("#filter-category").addEventListener ("change", filters)
    $("#filter-date").addEventListener ("change", filters)
    $("#filter-order").addEventListener ("change", filters)
};




window.addEventListener("load", initializeApp)