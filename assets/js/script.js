// SLIDER PHOTO
window.addEventListener("DOMContentLoaded", function () {
  var sliderImages = document.querySelectorAll(".slider-image");
  var prevButton = document.querySelector(".slider-prev");
  var nextButton = document.querySelector(".slider-next");
  var currentImageIndex = 0;

  function showImage(index) {
    var currentImage = sliderImages[currentImageIndex];
    var nextImage = sliderImages[index];

    currentImage.style.opacity = "0";
    nextImage.style.opacity = "1";

    currentImageIndex = index;
  }

  function showNextImage() {
    var nextImageIndex = (currentImageIndex + 1) % sliderImages.length;
    showImage(nextImageIndex);
  }

  function showPrevImage() {
    var prevImageIndex =
      (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
    showImage(prevImageIndex);
  }

  nextButton.addEventListener("click", showNextImage);
  prevButton.addEventListener("click", showPrevImage);

  setInterval(showNextImage, 3000);
});

// CART SLIDER
let cartSlider = document.querySelector(".cartSlider");
let cart = document.querySelector(".cart");
let closeButtonCartSlider = document.querySelector(
  ".cartSlider .headingCartSlider i"
);

let scrollCartSlider =document.querySelector(".cartSlider");

cart.addEventListener("click",function () {
  cartSlider.style.cssText ="animation: cartSliderOn 0.5s 0s 1; transform: translateX(0%);";
  document.getElementsByTagName("body")[0].style.cssText = `height: 100vh; overflow: hidden;`;
  scrollCartSlider.style.overflow = "scroll";
});

closeButtonCartSlider.addEventListener("click",function () {
  cartSlider.style.cssText ="animation: cartSliderOff 0.5s 0s 1; transform: translateX(100%);";
  document.getElementsByTagName("body")[0].style.cssText = `height: 100%; overflow: none;`;
  scrollCartSlider.style.overflow = "hidden";
});



// POPUP
let popUp = document.querySelector(".popUp");
function showAndHiddenPopUp(i) {
  popUp.innerHTML = `
  <div class="popUpCard">
  <i class="fa-solid fa-xmark"></i>
  <div class="image">
    <img src="${tasks.products[i].thumbnail}" alt="">
  </div>
  <div class="popUpInformation">
    <div>
      <h2>${tasks.products[i].title}</h2>
      <p>${tasks.products[i].price}$</p>
    </div>
    <p>${tasks.products[i].description}</p>
    <button class="btn btn-primary" onclick="addProductInCart(${i})">Add To Cart</button>
    </div>
    </div>
  `;

  popUp.style.cssText = `
    animation: popUpOn .5s 0s 1;
    transform: translateY(-60%);
  -webkit-transform: translateY(-60%);
  -moz-transform: translateY(-60%);
  -ms-transform: translateY(-60%);
  -o-transform: translateY(-60%);
  `;

  let closePopUp = document.querySelector(".popUp .popUpCard i");
  closePopUp.addEventListener("click", function () {
    popUp.style.cssText = `
    animation: popUpOff .5s 0s 1;
    transform: translateY(-200%);
    -webkit-transform: translateY(-200%);
    -moz-transform: translateY(-200%);
    -ms-transform: translateY(-200%);
    -o-transform: translateY(-200%);`;
  });
}

// DATA
let componentsView = document.getElementById("components");
let tasks = [];

const getData = async () => {
  let response = await fetch("https://dummyjson.com/products");
  let data = await response.json();
  tasks = data;
  displayTasks();
};
getData();

// SHOW DATA IN CARDS PAGE
const displayTasks = () => {
  componentsView.innerHTML = "";
  tasks.products.forEach((task, i) => {
    componentsView.innerHTML += `
    <div class="card">
      <div class="image-card">
        <img src="${
          task.thumbnail ?? "./assets/img/download.jpg"
        }" class="card-img-top" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-title">${task.title ?? "استني يا صحبي بيحمل"}</h5>
        <p class="card-text price">${task.price ?? "😍😍😍😍😍😍😍😍😍"}$</p>
        <p class="card-text">${
          task.description ?? "ماتمسكنيش من ايدي انا متوضية امسكني من وسطي😂"
        }</p>
        <button class="btn btn-primary showPopUp" onclick="showAndHiddenPopUp(${i})">Show</button>
      </div>
    </div>
    `;
  });
};

// ADD PRODUCT IN CART
let cards = document.querySelector(".cards");

let cartCounterDiv = document.querySelector(".cartCounter div");
let cartCounter = 0;

let Cart;
if (localStorage.product != null) {
  Cart = JSON.parse(localStorage.product);
  cartCounter = JSON.parse(localStorage.cartcounter);
  cartCounterDiv.innerHTML = cartCounter;
  checkCartCounter();
  showProductInCart();
} else {
  Cart = [];
}


function checkCartCounter() {
  if (cartCounter === 0) {
    cartCounterDiv.style.display = "none";
  } else if (cartCounter !== 0) {
    cartCounterDiv.style.display = "flex";
  }
}

function addProductInCart(i) {
  // تحقق من وجود المنتج في السلة
  let existingProductIndex = Cart.findIndex((item) => item.id === tasks.products[i].id);
  console.log(existingProductIndex)

  if (existingProductIndex !== -1) {
    // إذا كان المنتج موجود، زيادة كمية المنتج
    Cart[existingProductIndex].quantity += 1;
  } else {
    // إذا لم يكن المنتج موجود، إضافة المنتج كاملاً
    tasks.products[i].quantity = 1;
    Cart.push(tasks.products[i]);
  }

  cartCounter += 1;
  cartCounterDiv.innerHTML = cartCounter;
  localStorage.setItem("product", JSON.stringify(Cart))
  localStorage.setItem("cartcounter", JSON.stringify(cartCounter))
  checkCartCounter();
  showProductInCart(i);
}

// SHOW PRODUCT IN CART
function showProductInCart(o) {
  cards.innerHTML = "";
  Cart.map((item, i) => {
    cards.innerHTML += `
    <div class="card">
    <div class="dataCard">
      <div class="image">
        <img src="${item.thumbnail}" alt="">
      </div>
      <div class="information">
        <h3>${item.title}</h3>
        <p>${item.price}$</p>
        <p>x${item.quantity}</p>
      </div>
    </div>
    <button class="btn btn-danger gletch" onclick="deleteProductFromCart(${i},${o})"><i class="fa-solid fa-xmark"></i></button>
    </div>`;
    
  });
};

// DELETE PRODUCT FORM CART

function deleteProductFromCart(k, o) {
  if (o >= 0 && o < tasks.products.length) {
    Cart.map(function (item, i) {
      tasks.products[o].id === item.id ? (cartCounter -= item.quantity) : "";
    });
  }
  
  Cart.splice(k, 1);
  localStorage.setItem("product", JSON.stringify(Cart))
  cartCounterDiv.innerHTML = cartCounter;
  checkCartCounter();
  showProductInCart();
  if (Cart[0] === undefined) {
    cartCounterDiv.style.display = "none";
    cartCounter = 0;
    localStorage.setItem("cartcounter", JSON.stringify(cartCounter))
  }
}

// SEARCH IN WEBSITE
let search = document.querySelector(".form-control");
let researchResults = document.querySelector(".research-results");
search.addEventListener("keyup", function () {
  tasks.products.map((item, i) => {
    if (item.title.toUpperCase().includes(search.value.toUpperCase())) {
      // researchResults.innerHTML = "";
      researchResults.style.display = "block";
      researchResults.innerHTML += `
        <h6>${item.title}</h6>
      `
    }

    if (search.value === "") {
      researchResults.innerHTML = "";
      researchResults.style.display = "none";
    }
  })
})

setInterval(() => {
  if (search.value === "") {
    researchResults.innerHTML = "";
    researchResults.style.display = "none";
  }
}, 1000);

// function deleteProductFromCart(k,o) {
//   Cart.splice(k,1);
//   console.log(o)
//   Cart.map(function (item, i) {
//     tasks.products[o].id === item.id? cartCounter -= item.quantity : ""
//   });
//   cartCounterDiv.innerHTML = cartCounter;
//   checkCartCounter();
//   showProductInCart();
// }




// // ADD PRODUCT IN CART
// let Cart = [];
// let cartCounterDiv = document.querySelector(".cartCounter div");
// let cartCounter = 0;
// function checkCartCounter() {
//   if (cartCounter === 0) {
//     cartCounterDiv.style.display = "none";
//   } else if (cartCounter !== 0) {
//     cartCounterDiv.style.display = "flex";
//   }
// }

// function addProductInCart(i) {
  //   Cart.push(tasks.products[i]);
  //   cartCounter += 1;
  //   cartCounterDiv.innerHTML = cartCounter;
//   checkCartCounter();
//   showProductInCart();
// }
 