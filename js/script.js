// Insert your Firebase config here

const firebaseConfig = {
  apiKey: "AIzaSyARNHO_Sj7sCtq7Ea9iRrRnKFRT8cc83a8",
  authDomain: "web25-afcee.firebaseapp.com",
  databaseURL: "https://web25-afcee-default-rtdb.firebaseio.com",
  projectId: "web25-afcee",
  storageBucket: "web25-afcee.firebasestorage.app",
  messagingSenderId: "324494759810",
  appId: "1:324494759810:web:b8d9734f3b3a4b125aa19b",
  measurementId: "G-LWDF9YCG91"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const tableRef = db.ref("records");

// Local cache of data
let records = [];

/* -------------------------------------------
   LOAD DATA FROM FIREBASE
------------------------------------------- */
function loadData() {
    tableRef.on("value", snapshot => {
        const data = snapshot.val();
        records = [];

        if (data) {
            Object.keys(data).forEach(id => {
                records.push({ id, ...data[id] });
            });
        }

        document.getElementById("resultCount").textContent =
            "Please select a type to display results.";
    });
}

loadData();

/* -------------------------------------------
   UPDATE TABLE DISPLAY
------------------------------------------- */
function updateTable() {
    const typeFilter = document.getElementById("typeFilter").value;
    const keyword = document.getElementById("searchBox").value.toLowerCase();
    const tbody = document.getElementById("dataTable");
    const resultCount = document.getElementById("resultCount");

    tbody.innerHTML = "";

    if (!typeFilter) {
        resultCount.textContent = "Please select a type to display results.";
        document.getElementById("searchBox").disabled = true;
        return;
    }

    document.getElementById("searchBox").disabled = false;

    let filtered = records.filter(r => {
        const matchType = (typeFilter === "all" || r.type === typeFilter);
        const matchName =
            r.name.toLowerCase().includes(keyword) ||
            r.address.toLowerCase().includes(keyword) ||
            (r.phone || "").toLowerCase().includes(keyword) ||
            (r.email || "").toLowerCase().includes(keyword);

        return matchType && matchName;
    });

    resultCount.textContent =
        filtered.length === 0 ? "No results found" : `${filtered.length} result(s) found`;

    filtered.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.type}</td>
                <td>${r.name}</td>
                <td>${r.address}</td>
                <td>${r.phone || ""}</td>
                <td>${r.email || ""}</td>
            </tr>
        `;
    });
}

/* -------------------------------------------
   ADD A NEW RECORD INTO FIREBASE
------------------------------------------- */
function addRecord() {
    const type = document.getElementById("newType").value;
    const name = document.getElementById("newName").value.trim();
    const address = document.getElementById("newAddress").value.trim();
    const phone = document.getElementById("newPhone").value.trim();
    const email = document.getElementById("newEmail").value.trim();

    if (!name || !address) {
        alert("Name and Address are required.");
        return;
    }

    const newRecord = {
        type,
        name,
        address,
        phone,
        email
    };

    // Push into Firebase
    tableRef.push(newRecord).then(() => {
        updateTable();
        document.getElementById("newName").value = "";
        document.getElementById("newAddress").value = "";
        document.getElementById("newPhone").value = "";
        document.getElementById("newEmail").value = "";

        alert("Record added!");
    });
}

/* -------------------------------------------
   EVENT LISTENERS
------------------------------------------- */
document.getElementById("typeFilter").addEventListener("change", updateTable);
document.getElementById("searchBox").addEventListener("keyup", updateTable);
document.getElementById("addBtn").addEventListener("click", addRecord);
