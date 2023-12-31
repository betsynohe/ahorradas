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
            const spentAmount = type === "ganancia" ? "has-text-success" : "has-text-danger";
            const gainAmount = type === "ganancia" ? "+" : "-";
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
    getBalance(getDataStorage(allOperations))
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
        if (type === "ganancia") {
        profit += parseFloat(amount);
        balance += parseFloat(amount);
    }
        if (type === "gasto") {
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

/* VISTA DE REPORTES */

const renderReports = () => {
    const currentOperations = getDataStorage("operations")
    const allCategories = getDataStorage("categories")
    let hasProfit = false
    let hasExpenditure = false
    
    for (const { type } of currentOperations) {
        if (type === "ganancia") {
            hasProfit = true
        } else if (type === "gasto") {
            hasExpenditure = true
        }
    }

    if (hasProfit && hasExpenditure) {console.log()
        $("#reports-table").classList.remove("is-hidden")
        $(".no-reports").classList.add("is-hidden")
        summaryByCategories(currentOperations, allCategories)
        summaryByMonths(currentOperations)
        totalsForCategory(currentOperations, allCategories)
        totalsPerMonth(currentOperations)
        generateTotalsForCategory(currentOperations, allCategories)
        generateTotalsPerMonth(currentOperations)
    } else {
        $(".no-reports").classList.remove("is-hidden")
        $("#reports-table").classList.add("is-hidden")
    }
}

//reportes por categorias
const summaryByCategories = (operations, categories) => {
    const categoryTotals = {}
    for (const { category, amount, type } of operations) {
        if (!categoryTotals[category]) {
            categoryTotals[category] = {
            profit: 0,
            expense: 0,
            }
        }
        if (type === "ganancia") {
            categoryTotals[category].profit += parseFloat(amount);
        } else if (type === "gasto") {
            categoryTotals[category].expense += parseFloat(amount);
        }
    }
    
    let maxCategoryProfits = ""
    let maxAmountProfits = 0
    let maxCategoryExpenses = ""
    let maxAmountExpenses = 0
    let maxCategoryBalance = ""
    let maxAmountBalance = 0

    for (const category in categoryTotals) {
        const { profit, expense } = categoryTotals[category]
        const balance = profit - expense
        
        if (profit > maxAmountProfits) {
            maxAmountProfits = profit
            maxCategoryProfits = category
        }
        if (expense > maxAmountExpenses){
            maxAmountExpenses = expense
            maxCategoryExpenses = category
        }
        if (balance > maxAmountBalance){
            maxAmountBalance = balance
            maxCategoryBalance = category
        }
    }

    for (const { id, name } of categories){
        if (id === maxCategoryProfits){
            $("#highest-category-profits").innerHTML = name 
            $("#total-hg-category-profits").innerHTML = `+$${maxAmountProfits}`  
        }
        if (id === maxCategoryExpenses) {
            $("#highest-category-expenses").innerHTML = name
            $("#total-hg-category-expenses").innerHTML = `-$${maxAmountExpenses}`
        }
        if (id === maxCategoryBalance){
            $("#highest-category-balance").innerHTML = name
            $("#total-hg-category-balance").innerHTML = `$${maxAmountBalance}`
        }
    }
}

//reportes por mes 
const summaryByMonths = (operations) => {
    const monthTotals = {}
    for (const { date, type, amount } of operations) {
        const currentDate = new Date(date)
        const monthYear = `${String(currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`
        if(!monthTotals[monthYear]){
            monthTotals[monthYear] = {
                profit: 0,
                expense: 0, 
            }
        }
        if (type === "ganancia"){
            monthTotals[monthYear].profit += parseFloat(amount)
        } else if (type === "gasto") {
            monthTotals[monthYear].expense += parseFloat(amount)
        }
    }
    let maxMonthProfits = ""
    let maxAmountProfits = 0
    let maxMonthExpenses = ""
    let maxAmountExpenses = 0

    for (const monthYear in monthTotals) {
        const { profit, expense } = monthTotals[monthYear]

        if (profit > maxAmountProfits) {
            maxAmountProfits = profit
            maxMonthProfits = monthYear
        }
        if (expense > maxAmountExpenses) {
            maxAmountExpenses = expense
            maxMonthExpenses = monthYear
        }
    }
    $("#month-highest-profit").innerHTML = maxMonthProfits
    $("#total-month-hg-profit").innerHTML = `+$${maxAmountProfits}`
    $("#month-highest-expenditure").innerHTML = maxMonthExpenses
    $("#total-month-hg-expenditure").innerHTML = `-$${maxAmountExpenses}`
}

//totales por categorias
const totalsForCategory = (operations, categories) => {
    const balanceByCategory = {}
    for (const { category, type, amount } of operations) {
        const categoryFiltered = categories.find(cat => cat.id === category)
        if (categoryFiltered) {
            const { name } = categoryFiltered
            if (!balanceByCategory[name]) {
                balanceByCategory[name] = {
                    profit: 0,
                    expense: 0,
                    balance: 0
                }
            }
            if (type === "ganancia") {
                balanceByCategory[name].profit += parseFloat(amount)
                balanceByCategory[name].balance += parseFloat(amount)
            } else if (type === "gasto") {
                balanceByCategory[name].expense += parseFloat(amount)
                balanceByCategory[name].balance -= parseFloat(amount)
            }
        }
    }
    return balanceByCategory
}
// genera el total es html
const generateTotalsForCategory = (operations, categories) => {
    const balanceByCategory = totalsForCategory(operations, categories)
    cleanContainers(["#totals-all-categories"])
    for (const name in balanceByCategory) {
        const { profit, expense, balance } = balanceByCategory[name]
        let symbol = balance < 0 ? "-" : ""
        $("#totals-all-categories").innerHTML += `
        <section
        class="columns is-mobile is-flex is-justify-content-center is-align-items-center">
        <article class="column has-text-weight-semibold">
            <p>
            ${name}
            </p>
        </article>
        <article class="column has-text-right">
            <p class="has-text-right has-text-success has-text-weight-bold">
            +$ ${profit}
            </p>
        </article>
        <article class="column has-text-right has-text-gray">
            <p class="has-text-right has-text-danger has-text-weight-bold">
            -$ ${expense}
            </p>
        </article>
        <article class="column has-text-right has-text-weight-bold ">
            <p class="has-text-right has-text-weight-bold">
            ${symbol}$${Math.abs(balance)}
            </p>
        </article>
    </section>`
    }
}
//totales por mes
const totalsPerMonth = (operations) => {
    const balancePerMonth = {}
    for (const { date, type, amount } of operations) {
        const currentDate = new Date(date)
        const monthYear = `${String(currentDate.getMonth() + 1)}/${currentDate.getFullYear()}`

        if (!balancePerMonth[monthYear]){
            balancePerMonth[monthYear] = {
                profit: 0,
                expense: 0,
                balance: 0
            }
        }
        if (type === "ganancia") {
            balancePerMonth[monthYear].profits += parseFloat(amount)
            balancePerMonth[monthYear].balance += parseFloat(amount)
        } else if (type === "gasto") {
            balancePerMonth[monthYear].expenses += parseFloat(amount)
            balancePerMonth[monthYear].balance -= parseFloat(amount)
        }
    }
    return balancePerMonth
}
//genera el total en html
const generateTotalsPerMonth = (operations) => {
    const balancePerMonth = totalsPerMonth(operations)
    cleanContainers(["#totals-all-months"])
    for (const monthYear in balancePerMonth) {
        const { profit, expense, balance } = balancePerMonth[monthYear]
        let symbol = balance < 0 ? "-" : ""
        $("#totals-all-months").innerHTML +=`
        <section class="columns is-mobile is-flex is-justify-content-center is-align-items-center">
            <article class="column has-text-weight-semibold">
                <p>
                ${monthYear}
                </p>
            </article>
            <article class="column has-text-right">
                <p class="has-text-right has-text-success has-text-weight-bold">
                +$ ${profit}
                </p>
            </article>
            <article class="column has-text-right has-text-gray">
                <p class="has-text-right has-text-danger has-text-weight-bold">
                -$ ${expense}
                </p>
            </article>
            <article class="column has-text-right has-text-weight-bold">
                <p class="has-text-right has-text-weight-bold">
                ${symbol}$${Math.abs(balance)}
                </p>
            </article>
        </section>`
    }
}

/* FILTROS DE LA VISTA DE BALANCE */

// FILTERS

const filters = () => {
    const type = $("#filter-type").value
    const category = $("#filter-category").value
    const date = new Date($(".date").value.replace(/-/g, '/'))
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
        if (filterS === "mayor-monto") {
            return b.amount - a.amount
        }
        if (filterS === "menor-monto") {
            return a.amount - b.amount
        }
        if (filterS === "a-z") {
            a.description.localeCompare(b.description)
        }
        if (filterS === "z-a") {
            b.description.localeCompare(a.description)
        }
})

    getBalance(filterSort)
    renderOperations(filterSort)
if (filterSort.length) {
    $("#balance-no-results").classList.add("is-hidden")
    $("#there-are-operations").classList.remove("is-hidden")
} else{
    $("#balance-no-results").classList.remove("is-hidden")
    $("#there-are-operations").classList.add("is-hidden")
}
}



//funcion para que este el dia actual en los imputs
const dateInput = () => {
    const inputsFecha = document.querySelectorAll('input[type="date"]');
        inputsFecha.forEach((input) => {
        input.valueAsDate = new Date();
    });
};



// FUNCION PARA INICIALIZAR LA APP 
const initializeApp = () => {
    setDataStorage("categories", allCategories);
    setDataStorage("operations", allOperations);
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    renderOperations(allOperations)
    generateBalance(allOperations)
    getBalance(allOperations)
    renderReports()
    dateInput()
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

// click btn categorias
    $("#btn-categories").addEventListener("click", () => {
        showVista("category-section")
        renderOperations(allOperations) 
        renderCategories(allCategories)
    });

// click btn balance 
    $("#btn-balance").addEventListener("click", () => {
        showVista("balance-container")
        renderOperations(allOperations) 
        renderCategories(allCategories)
    });

// click btn reportes
    $("#btn-reports").addEventListener("click", () => {
        showVista("reports")
        renderReports()
        renderOperations(allOperations) 
        renderCategories(allCategories)
    });

// boton para nueva operacion
    $("#new-operation-btn").addEventListener("click", () => 
    showVista("new-operation-container")
    );

//agrega la nueva operacion
    $("#btn-add-operation").addEventListener("click", () => {
    addOperationForm();
    renderReports()
    showVista("there-are-operations")
    showVista("balance-container")
    }); 

//edita la operacion
    $("#btn-edit-operation").addEventListener("click", () =>{
    getEditOperation()
    renderReports()
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
    $("#btn-cancel-categories").addEventListener("click", () =>{
        showVista("category-section")
    })

//oculta el panel de los filtros
    $("#hidden-filters").addEventListener("click", (e) =>{
        e.preventDefault()
        $("#hidden-filters").classList.add("is-hidden")
        $("#panel-filters").classList.add("is-hidden")
        $("#show-filters").classList.remove("is-hidden")
    })

//aparecen los filtros de nuevo
    $("#show-filters").addEventListener("click", (e) =>{
        e.preventDefault()
        $("#show-filters").classList.add("is-hidden")
        $("#panel-filters").classList.remove("is-hidden")
        $("#hidden-filters").classList.remove("is-hidden")
    })

//funcion de los selects del filtro
    $("#filter-type").addEventListener ("change", filters)
    $("#filter-category").addEventListener ("change", filters)
    $(".date").addEventListener ("change", filters)
    $("#filter-order").addEventListener ("change", filters)
};




window.addEventListener("load", initializeApp)