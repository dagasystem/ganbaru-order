const API_URL = "https://script.google.com/macros/s/AKfycbzqYkLCfzlmgMoKTtU96cIQd1mchuxBrImztw6R7SG4tozYsdnS0dWXtITXO189YQEN/exec";

async function loadFacilities(){

  const response =
    await fetch(
      API_URL +
      "?action=facilities"
    );

  const facilities =
    await response.json();

  const select =
    document.getElementById(
      "facility"
    );

  select.innerHTML = "";

  facilities.forEach(f => {

    const option =
      document.createElement(
        "option"
      );

    option.value = f;
    option.textContent = f;

    select.appendChild(option);

  });

}

window.onload=function(){

  loadFacilities();

  addUser();

}

async function getProduct(code){

  const response =
    await fetch(
      API_URL +
      "?action=product&code=" +
      encodeURIComponent(code)
    );

  return await response.json();

}

function addUser(){

  const html = `

  <div class="user-block">

    <label>ご利用者名</label>

    <input class="userName">

    <div class="items"></div>

    <button type="button"
      onclick="addItem(this)">
      ＋商品追加
    </button>

  </div>

  `;

  document
    .getElementById("users")
    .insertAdjacentHTML(
      "beforeend",
      html
    );

}

function addItem(btn){

  const items =
    btn.parentElement
      .querySelector(".items");

  const html = `

  <div class="item-row">

    <label>商品コード</label>

    <input
      class="productNo"
      onchange="lookupProduct(this)">

    <label>数量</label>

    <input
      type="number"
      value="1"
      class="qty"
      onchange="calcAll()">

    <div class="product-info">

      商品名：
      <span class="productName"></span>

      <br>

      単価：
      <span class="price">0</span>円

      <br>

      金額：
      <span class="amount">0</span>円

    </div>

  </div>

  `;

  items.insertAdjacentHTML(
    "beforeend",
    html
  );

}

async function lookupProduct(input){

  const row =
    input.closest(".item-row");

  const code =
    input.value;

  const product =
    await getProduct(code);

  if(!product){

    alert("商品が見つかりません");

    return;

  }

  row.dataset.productNo =
    product.productNo;

  row.dataset.productName =
    product.name;

  row.dataset.store =
    product.store;

  row.dataset.price =
    product.price;

  row.querySelector(".productName")
    .innerText =
    product.name;

  row.querySelector(".price")
    .innerText =
    product.price;

  calcRow(row);

}

function calcRow(row){

  const qty =
    Number(
      row.querySelector(".qty").value
    );

  const price =
    Number(
      row.dataset.price || 0
    );

  const amount =
    qty * price;

  row.querySelector(".amount")
    .innerText =
    amount;

  calcAll();

}

function calcAll(){

  let total = 0;

  document
    .querySelectorAll(".item-row")
    .forEach(function(row){

      const qty =
        Number(
          row.querySelector(".qty")
          .value
        );

      const price =
        Number(
          row.dataset.price || 0
        );

      total += qty * price;

    });

  document
    .getElementById("grandTotal")
    .innerText =
      "合計 " +
      total.toLocaleString() +
      "円";

}

async function saveOrder(){

  const items = [];

  document
  .querySelectorAll(".user-block")
  .forEach(function(block){

    const userName =
      block.querySelector(".userName")
      .value;

    block
    .querySelectorAll(".item-row")
    .forEach(function(row){

      const qty =
        Number(
          row.querySelector(".qty")
          .value
        );

      const price =
        Number(
          row.dataset.price
        );

      items.push({

        userName:userName,

        productNo:
          row.dataset.productNo,

        productName:
          row.dataset.productName,

        store:
          row.dataset.store,

        qty:qty,

        price:price,

        amount:qty*price

      });

    });

  });

  const data = {

    facility:
      document.getElementById("facility")
      .value,

    staff:
      document.getElementById("staff")
      .value,

    memo:"",

    items:items

  };
  
const query =
  API_URL +
  "?action=saveOrder" +
  "&data=" +
  encodeURIComponent(
    JSON.stringify(data)
  );

const response =
  await fetch(query);

  
  const result =
    await response.json();

  alert(
    "登録完了\n" +
    result.orderId
  );

}
