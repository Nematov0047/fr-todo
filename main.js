let DATA = new Data('data454654');

if (!localStorage.getItem('count8468')) {
    localStorage.setItem('count8468', '1');
}

let COUNT = localStorage.getItem('count8468');

const todo_list = document.getElementById('todo_list');
const items_left = document.getElementById('items_left');
let currentPage = "ALL";

function generate_todo_item(text, id, checked) {
    let answer = '';
    if (checked) {
        answer = `
                <div class="radio_button">
                    <img src="./images/icon-check.svg" alt="icon" />
                </div>
                <p class="todo-list-section-p"><span class="todo-list-done" contenteditable>${text}</span><img src="./images/icon-cross.svg" alt="icon cross" data_delete="${id}" /></p>
            `;
    } else {
        answer = `
                <div class="radio_button"></div>
                    <p class="todo-list-section-p"><span contenteditable>${text}</span><img src="./images/icon-cross.svg" alt="icon cross" data_delete="${id}" /></p>`;
    }

    return `<div class="todo-list-section" data_id="${id}">
                ${answer}
            </div>
            <div class="todo-list-hr"></div>`;
}

function generate_todo_list(arr) {
    let msg = "";
    arr.map(item => {
        msg += generate_todo_item(item.title, item.id, item.checked);
    });
    return msg;
}
function reRender(d) {
    let dd;
    if (currentPage == 'ALL') {
        dd = d;
    } else if (currentPage == 'ACTIVE') {
        dd = d.filter(item => item.checked ? false : true);
    } else if (currentPage == 'COMPLETED') {
        dd = d.filter(item => item.checked ? true : false)
    }

    todo_list.innerHTML = generate_todo_list(dd);
    items_left.innerText = dd.filter(item => item.checked ? false : true).length;
}
reRender(DATA.select());

function add_todo_item(title) {
    DATA.append({
        title: title,
        checked: false,
        id: COUNT
    });
    COUNT++;
    localStorage.setItem('count8468', COUNT);
}


const form_create = document.getElementById('form_create');
form_create.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let new_todo = formData.get('new_todo');
    add_todo_item(new_todo);
    reRender(DATA.select());
    form_create.reset();
})


function check_item(id) {
    let newData = DATA.select();
    for (let d of newData) {
        if (d.id == id) {
            d.checked = !d.checked;
        }
    }
    DATA.insert(newData);
}

todo_list.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.attributes.contenteditable) {
        console.log(e.target.attributes.contenteditable);
        return;
    }

    let c_id = false;
    if (e?.target?.attributes?.data_id) {
        c_id = e?.target?.attributes?.data_id.value;
    } else if (e?.target?.parentElement?.attributes?.data_id) {
        c_id = e?.target?.parentElement?.attributes?.data_id.value;
    } else if (e?.target?.parentElement?.parentElement?.attributes?.data_id) {
        c_id = e?.target?.parentElement?.parentElement?.attributes?.data_id.value;
    }
    if (c_id) {
        check_item(c_id);
        reRender(DATA.select());
    }
})

const all_items = document.getElementById('all_items');
const all_active_items = document.getElementById('all_active_items');
const all_completed_items = document.getElementById('all_completed_items');
const clear_completed = document.getElementById('clear_completed');

const all_items_mobile = document.getElementById('all_items_mobile');
const all_active_items_mobile = document.getElementById('all_active_items_mobile');
const all_completed_items_mobile = document.getElementById('all_completed_items_mobile');

function make_active(id) {
    all_items.classList.remove('todo-list-bottom-active');
    all_active_items.classList.remove('todo-list-bottom-active');
    all_completed_items.classList.remove('todo-list-bottom-active');
    all_items_mobile.classList.remove('todo-list-bottom-active');
    all_active_items_mobile.classList.remove('todo-list-bottom-active');
    all_completed_items_mobile.classList.remove('todo-list-bottom-active');

    id.classList.add('todo-list-bottom-active');
}

function all_items_clicked(e) {
    currentPage = 'ALL';
    make_active(e.target);
    reRender(DATA.select());
}

function all_active_items_clicked(e) {
    currentPage = 'ACTIVE';
    make_active(e.target);
    reRender(DATA.select());
}

function all_completed_items_clicked(e) {
    currentPage = 'COMPLETED';
    make_active(e.target);
    reRender(DATA.select());
}

all_items.addEventListener("click", all_items_clicked);
all_items_mobile.addEventListener("click", all_items_clicked);
all_active_items.addEventListener("click", all_active_items_clicked);
all_active_items_mobile.addEventListener("click", all_active_items_clicked);
all_completed_items.addEventListener("click", all_completed_items_clicked);
all_completed_items_mobile.addEventListener("click", all_completed_items_clicked);

clear_completed.addEventListener("click", (e) => {
    DATA.insert(DATA.select().filter(item => item.checked ? false : true));
    reRender(DATA.select());
})

todo_list.addEventListener("click", e => {
    e.stopPropagation();
    if (e?.target?.attributes?.data_delete) {
        DATA.insert(DATA.select().filter(item => (item.id != e?.target?.attributes?.data_delete.value) ? true : false));
        reRender(DATA.select());
    }
})
let item_active_editable;
let item_active_editable_text;
todo_list.addEventListener("click", e => {
    if (e.target.attributes.contenteditable) {
        item_active_editable = e.target;
        e.target.classList.remove('todo-list-done');
    }
})
todo_list.addEventListener("input", e => {
    item_active_editable_text = e.target.innerText;
})

todo_list.addEventListener('keydown', e => {
    console.log('entered')
    if (e.target !== item_active_editable) {
        return;
    }
    let id = e.target.parentElement.parentElement.attributes.data_id.value;
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
        DATA.update({
            id: id,
            title: item_active_editable_text,
        })
        reRender(DATA.select());
    }
})