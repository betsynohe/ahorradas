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

// seccion de categorias

const renderCategories = (Categories) => {
    cleanContainers(["#categories-section"])
    for (const {id, name} of  Categories) { 
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

const renderCategoriesOptions = (Categories) => {
    cleanContainers(["#filter-category", "#categories-select-op"])
    if (Categories.length){
        $("#filter-category").innerHTML += `
        <option value="todas">Todas</option>`
        for (const {id, name} of  Categories) { 
        $("#filter-category").innerHTML += `
        <option value="${id}">${name}</option>
        `};
        $$(".categories-select").forEach((select) => {
        for( const {id, name} of Categories){
            select.innerHTML +=`
            <option value="${id}">${name}</option>
            `
        }
        })
    }
}

//guarda las categorias
const saveCategory = (categoryId) => {
    console.log(categoryId);
    return {
        id: categoryId ? categoryId : randomId(),
        nombre: $("#input-edit-categories").value
    };
};

// agregar las categorias
const addNewCategory = () => {
    const currentCategory = getDataStorage("Categories");
    const newCategory = saveCategory();
    currentCategory.push(newCategory);
    setDataStorage("Categories", currentCategory);
    renderCategories(currentCategory);
    renderCategoriesOptions(currentCategory);
};

//edit category
const editCategory = () => {
    const categoryId= $("#btn-confirm-add").getAttribute("data-id")
    const editedCategory= getDataStorage("Categories").map(category => {
        if (category.id === categoryId){
            return saveCategory(categoryId)
        }
        return category
    })
    setDataStorage("Categories", editedCategory)
}

const editCategoriesForm = (id) => {
    $(showVista("edit-categories"))
    $("#btn-confirm-add").setAttribute("data-id", id)
    const categorySelected = getDataStorage("Categories").find(category => category.id === id)
    $("#input-edit-categories").value = categorySelected.name
}




// FUNCION PARA INICIALIZAR LA APP 
const initializeApp = () => {
    setDataStorage("Categories", allCategories);
    setDataStorage("Operations", allOperations);
    renderCategories(allCategories)
    renderCategoriesOptions(allCategories)
    /* renderOperations(allOperations) */
    
    
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

//cancela editar la operacion
    $("#btns-cancel-operation").addEventListener("click", () => {
    showVista("balance-container")
    });

// cancela una nueva operacion
    $("#btn-cancel-operation").addEventListener("click", () => {
    showVista("balance-container")
    });
// edita la nueva categoria
    $("#btn-confirm-add").addEventListener("click", () => {
            editCategory()
            showVista("category-section")
            renderCategories(getDataStorage("Categories"))
    })
/*  $("#filter-type").addEventListener ("change", filters)

    $("#filter-category").addEventListener ("change", filters)

    $("#filter-date").addEventListener ("change", filters)

    $("#filter-order").addEventListener ("change", filters) */
};




window.addEventListener("load", initializeApp)