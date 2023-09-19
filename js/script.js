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

// seccion de categorias

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
  /*   return {
        id: randomId(),
        name: $("#input-edit-categories").value
    }; */
};

// agregar las categorias
const addNewCategory = () => {
    const currentCategory = getDataStorage("categories");
    const newCategory = saveCategory();
    currentCategory.push(newCategory);
    setDataStorage("categories", currentCategory);
    renderCategories(currentCategory);
    renderCategoriesOptions(currentCategory);
    console.log(newCategory);
};

//edit category
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




// FUNCION PARA INICIALIZAR LA APP 
const initializeApp = () => {
    setDataStorage("categories", allCategories);
    setDataStorage("operations", allOperations);
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

/*  $("#filter-type").addEventListener ("change", filters)

    $("#filter-category").addEventListener ("change", filters)

    $("#filter-date").addEventListener ("change", filters)

    $("#filter-order").addEventListener ("change", filters) */
};




window.addEventListener("load", initializeApp)