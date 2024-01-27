$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow", "visible")

    })
})

function openSideNav() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500)


    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");


    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    $(".links li").animate({
        top: 300
    }, 500)
}

closeSideNav()
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

async function searchByName(item) {
    closeSideNav()
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}

async function searchByFLetter(item) {
    closeSideNav()
    $(".inner-loading-screen").fadeIn(300)

    item == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${item}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}

function showSearch() {
    document.getElementById("search").innerHTML = `<div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`
    document.getElementById("Data").innerHTML = ""
}

async function getMealDetails(mealID) {   
    document.getElementById("Data").innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    document.getElementById("search").innerHTML  = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".inner-loading-screen").fadeOut(300)
}


function displayMeals(list) {
    let cartoona = "";
    for (let i = 0; i < list.length; i++) {
        cartoona += `<div class="col-md-3">
        <div onclick="getMealDetails('${list[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${list[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${list[i].strMeal}</h3>
                    </div>
                    </div>
                    </div>`
                } 
    document.getElementById("Data").innerHTML = cartoona
}
                       
function displayMealDetails(meal) {
    document.getElementById("search").innerHTML = "";
    let ingredients = ""
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let strTags = ''
    for (let i = 0; i < tags.length; i++) {
        strTags += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    let cartoona = `<div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}"alt="">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                 ${strTags}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`
    document.getElementById("Data").innerHTML = cartoona
}

async function getCategories() {
    document.getElementById("Data").innerHTML =""    
    $(".inner-loading-screen").fadeIn(300)
    document.getElementById("search").innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)
    $(".inner-loading-screen").fadeOut(300)

}

function displayCategories(list) {
    let cartoona = "";    
    for (let i = 0; i < list.length; i++) {
        cartoona += ` <div class="col-md-3">
            <div onclick="getCategoryMeals('${list[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${list[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${list[i].strCategory}</h3>
                        <p>${list[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
            </div>
        </div>`
    }
    document.getElementById("Data").innerHTML = cartoona
}

async function getCategoryMeals(category) {
    document.getElementById("Data").innerHTML  = ""    
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}

async function getArea() {
    document.getElementById("Data").innerHTML  = "" ;    
    $(".inner-loading-screen").fadeIn(300)

    document.getElementById("search").innerHTML  = ""    

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()

    displayArea(respone.meals)
    $(".inner-loading-screen").fadeOut(300)

}


function displayArea(list) {
    let cartoona = "";    

    for (let i = 0; i < list.length; i++) {
        cartoona += `<div class="col-md-3">
            <div onclick="getAreaMeals('${list[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${list[i].strArea}</h3>
            </div>
        </div>`
    }
    document.getElementById("Data").innerHTML = cartoona
}

async function getAreaMeals(area) {
    document.getElementById("Data").innerHTML= ""    
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}

async function getIngredients() {
    document.getElementById("Data").innerHTML= ""    
    $(".inner-loading-screen").fadeIn(300)

    document.getElementById("search").innerHTML= "" 

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()

    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}


function displayIngredients(arr) {
    let cartoona = "";    

    for (let i = 0; i < arr.length; i++) {
        cartoona += ` <div class="col-md-3">
            <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${arr[i].strIngredient}</h3>
                <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>`
    }
    document.getElementById("Data").innerHTML = cartoona
}

async function getIngredientsMeals(ingredients) {
    document.getElementById("Data").innerHTML= ""   
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()

    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)
    
}

let Name = false;
let Email = false;
let Phone = false;
let Age = false;
let Password = false;
let Repassword = false;

function showContacts() {
    document.getElementById("Data").innerHTML = `<div class="contact vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="name" onkeyup="validation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="email" onkeyup="validation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phone" onkeyup="validation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="age" onkeyup="validation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="password" onkeyup="validation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repassword" onkeyup="validation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `

    document.getElementById("name").addEventListener("focus", () => {
       Name = true
    })

    document.getElementById("email").addEventListener("focus", () => {
        Email = true
    })

    document.getElementById("phone").addEventListener("focus", () => {
        Phone = true
    })

    document.getElementById("age").addEventListener("focus", () => {
        Age = true
    })

    document.getElementById("password").addEventListener("focus", () => {
        Password  = true
    })

    document.getElementById("repassword").addEventListener("focus", () => {
        Repassword  = true
    })
}

function validation() {
    if (Name) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (Email) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (Phone) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (Age) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (Password) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (Repassword) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        document.getElementById("submitBtn").removeAttribute("disabled")
    } else {
        document.getElementById("submitBtn").setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("name").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("email").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phone").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("age").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("password").value))
}

function repasswordValidation() {
    return document.getElementById("repassword").value == document.getElementById("password").value
}