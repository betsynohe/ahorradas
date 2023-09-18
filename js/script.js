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

const allCategories = getDataStorage("Categories") || defaultCategoriesOptions;
const allOperations = getDataStorage("Operations") || []






// FUNCION PARA INICIALIZAR LA APP 
const initializeApp = () => {
    setDataStorage("Categories", allCategories);
    setDataStorage("Operations", allOperations);
    renderOperations(allOperations)
    
    
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
    showVista("categories")
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

//cancela editar la operacion
    $("#btns-cancel-operation").addEventListener("click", () => {
    showVista("balance-container")
    });

// cancela una nueva operacion
    $("#btn-cancel-operation").addEventListener("click", () => {
    showVista("balance-container")
    });
/*  $("#filter-type").addEventListener ("change", filters)

    $("#filter-category").addEventListener ("change", filters)

    $("#filter-date").addEventListener ("change", filters)

    $("#filter-order").addEventListener ("change", filters) */
};




window.addEventListener("load", initializeApp)