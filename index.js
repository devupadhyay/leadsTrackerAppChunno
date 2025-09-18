let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.querySelector("#ul-el")
const deleteBtn = document.querySelector("#delete-btn")
const tabBtn = document.querySelector("#tab-btn")


function showMessage(msg, color = "red") {
    const msgBox = document.getElementById("msg-box")
    msgBox.textContent = msg
    msgBox.style.color = color
    msgBox.style.display = "block"
    setTimeout(() => {
        msgBox.style.display = "none"
    }, 3000)
}

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url

        if(!myLeads.includes(currentUrl)) {
            myLeads.push(currentUrl)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
        } else {
            showMessage("Already saved!")
        }
    })
})

function render(leads) {
    let listItems = ""
    for(let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a href="${leads[i]}" target="_blank">
                    ${leads[i]}
                </a>
                <button class="delete-btn" data-index="${i}">❌</button>
            </li>
        `
        // const li = document.createElement("li")
        // li.textContent = leads[i]
        // ulEl.append(li)
    }
    ulEl.innerHTML = listItems

    const deleteButtons = document.querySelectorAll(".delete-btn")
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const index = parseInt(this.getAttribute("data-index"))
            myLeads.splice(index, 1)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
        })
    })
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.disabled = true
inputEl.addEventListener("input", function() {
    if(inputEl.value.trim() !== "") {
        inputBtn.disabled = false
    } else {
        inputBtn.disabled = true
    }
})

inputBtn.addEventListener("click", function() {
    const inputVal = inputEl.value.trim()
    if(inputVal) {
        if(!myLeads.includes(inputVal)) {
            myLeads.push(inputVal)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
        } else {
            showMessage("Already saved!")
        }
        inputEl.value = ""
        inputBtn.disabled = true
    }    
})
