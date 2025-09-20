import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js"
import { getDatabase, 
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://leads-tracker-app-4330e-default-rtdb.asia-southeast1.firebasedatabase.app/"
} 

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.querySelector("#ul-el")
const deleteBtn = document.querySelector("#delete-btn")

function showMessage(msg, color = "red") {
    const msgBox = document.getElementById("msg-box")
    msgBox.textContent = msg
    msgBox.style.color = color
    msgBox.style.display = "block"
    setTimeout(() => {
        msgBox.style.display = "none"
    }, 3000)
}

function render(leadsObj) {
    let listItems = ""
    for(const [key, value] of Object.entries(leadsObj)) {
        listItems += `
            <li>
                <a href="${value}" target="_blank">
                    ${value}
                </a>
                <button class="delete-btn" data-key="${key}">❌</button>
            </li>
        `
    }
    ulEl.innerHTML = listItems

    const deleteButtons = document.querySelectorAll(".delete-btn")
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            const key = this.getAttribute("data-key")
            const itemRef = ref(database, `leads/${key}`)
            remove(itemRef).then(() => {
                showMessage("✅ Lead deleted!", "goldenrod")
            })
        })
    })
}

onValue(referenceInDB, function(snapshot) {
    if (snapshot.exists()) {
        const snapshotValues = snapshot.val()
        render(snapshotValues)
    } else {
        ulEl.innerHTML = ""
    }  
})

inputBtn.disabled = true
inputEl.addEventListener("input", function() {
    if(inputEl.value.trim() !== "") {
        inputBtn.disabled = false
    } else {
        inputBtn.disabled = true
    }
})

deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
    ulEl.innerHTML = ""
    showMessage("✅ All Leads deleted!", "goldenrod")
})

inputBtn.addEventListener("click", function() {
    const inputVal = inputEl.value.trim()
    if(!inputVal) {
        showMessage("⚠️ Cannot add empty lead!")
        return
    }

    onValue(referenceInDB, function(snapshot) {
        const snapshotValues = snapshot.val()
        const leads = snapshotValues ? Object.values(snapshotValues) : []

        if (leads.includes(inputVal)) {
            showMessage("⚠️ Already saved!")
        } else {
            push(referenceInDB, inputVal)
            showMessage("✅ Lead saved!", "green")
        }

        inputEl.value = ""
        inputBtn.disabled = true
    }, {
        onlyOnce: true
    }) 
})

// setTimeout(() => {
//   const banner = document.getElementById("welcome-banner")
//   if (banner) {
//     banner.style.opacity = "0"
//     setTimeout(() => banner.remove(), 500) // remove from DOM after fade
//   }
// }, 3000)
