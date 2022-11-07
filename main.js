const API = "http://localhost:8000/elements";

let name = document.querySelector('#name');
let type = document.querySelector('#type');
let status = document.querySelector('#status');
let link = document.querySelector('#doclink');
let btnAdd = document.querySelector('#btn-add');

let list = document.querySelector('#docs-list');

let searchInp = document.querySelector("#search");
let searchVal = "";

let currentPage = 1;
let pageTotal = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

let editName = document.querySelector("#edit-name");
let editType = document.querySelector("#edit-type");
let editStatus = document.querySelector('#edit-status')
let editLink = document.querySelector("#edit-link");
let editSaveBtn = document.querySelector("#btn-save-edit");
let modal = document.querySelector("#modal");

btnAdd.addEventListener("click", async function () {
    let obj = {
      name: name.value,
      type: type.value,
      status: status.value,
      link: link.value,
    };
    if (
      !obj.name.trim() ||
      !obj.type.trim() ||
      !obj.status.trim() ||
      !obj.link.trim()
    ) {
      alert("Fill the area!");
      return;
    }
    await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(obj),
      });
    
      name.value = "";
      type.value = "";
      status.value = "";
      link.value = "";
      render();
});

async function render() {
    let documents = await fetch(
      `${API}?q=${searchVal}&_page=${currentPage}&_limit=3`
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
    drawPaginationButtons();
    list.innerHTML ="";
    documents.forEach((element) => {
      let newElem = document.createElement("div");
      newElem.id = element.id;
      newElem.innerHTML = `<div class="card m-3" style="width: 15rem; background-color: rgb(155, 197, 155)">
      <img src=${element.link} class="card-img-top" alt="img">
              <div class="card-body">
                  <h5 class="card-title">${element.name}</h5>
                  <p class="card-text">${element.type}</p>
                  <p class="card-text">${element.status}</p>
                  <a href="#" id=${element.id} onclick='deleteProduct(${element.id})' class="btn btn-outline-success btn-delete" >Delete</a>
                  <a href="#" id=${element.id} class="btn btn-outline-success btn-edit" data-bs-toggle="modal" data-bs-target="#modal">Edit</a>
              </div>
          </div>`;
      list.append(newElem);
    });
  }
  
  render();

  function drawPaginationButtons() {
    fetch(`${API}?q=${searchVal}`)
      .then((res) => res.json())
      .then((data) => {
        pageTotal = Math.ceil(data.length / 3);
        paginationList.innerHTML = "";
        for (let i = 1; i <= pageTotal; i++) {
          if (currentPage == i) {
            let page1 = document.createElement("li");
            page1.innerHTML = ` <li class="page-item"><a class="page-link page-number text-success" href="#">${i}</a></li>`;
            paginationList.append(page1);
          } else {
            let page1 = document.createElement("li");
            page1.innerHTML = ` <li class="page-item"><a class="page-link page-number text-success" href="#">${i}</a></li>`;
            paginationList.append(page1);
          } 
        }
  
        if (currentPage == 1) {
          prev.classList.add("disabled", true);
        } else {
          prev.classList.remove("disabled");
        }
  
        if (currentPage == pageTotal) {
          next.classList.add("disabled");
        } else {
          next.classList.remove("disabled");
        }
      });
  }
  
  prev.addEventListener("click", () => {
    if (currentPage <= 1) {
      return;
    }
    currentPage--;
    render();
  });
  
  next.addEventListener("click", () => {
    if (currentPage >= pageTotal) {
      return;
    }
    currentPage++;
    render();
  });
  
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("page-number")) {
      currentPage = e.target.innerText;
      render();
    }
  });
  
  function deleteProduct(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() => render());
  }

  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-edit")) {
      let id = e.target.id;
      console.log(id);
      fetch(`${API}/${id}`).then((res) =>
        res.json().then((data) => {
          editName.value = data.name;
          editType.value = data.type;
          editStatus.value = data.status;
          editLink.value = data.link;

          editSaveBtn.setAttribute("id", data.id);
        })
      );
    }
  });
  
  editSaveBtn.addEventListener("click", function () {
    let id = this.id;
    let name = editName.value;
    let type = editType.value;
    let status = editStatus.value;
    let link = editLink.value;

  
    if (!name.trim() || !type.trim() || !status.trim() || !link.trim()) {
      alert("Fill the area!");
      return;
    }
  
    let editedProduct = {
        name: name,
        type: type,
        status: status,
        link: link
    };
    console.log(editedProduct);
    saveEdit(editedProduct, id);
  });
  
  function saveEdit(editedProduct, id) {
    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(editedProduct),
    }).then(() => render());
  
    let exampleModal = bootstrap.Modal.getInstance(modal);
    console.log(exampleModal);
    exampleModal.hide();
  }

  searchInp.addEventListener("input", () => {
    searchVal = searchInp.value;
    render();
  });