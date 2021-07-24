let db;
let version;

const request = indexedDB.open("BudgetDB", version || 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetStore", { autoIncrement: true });
  }
};

request.onerror = function (e) {
  console.log(`Error with indexedDB ${e.target.errorCode}`);
};

function checkDatabase() {
  let transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(["BudgetStore"], "readwrite");
            const currentStore = transaction.objectStore("BudgetStore");
            currentStore.clear();
            console.log("IndexDB Cleared");
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  console.log("success");
  db = e.target.result;

  if (navigator.onLine) {
    console.log("You are Online");
    checkDatabase();
  }
};

const saveRecord = (record) => {
  console.log("Saving record");
  const transaction = db.transaction(["BudgetStore"], 'readwrite');
  const store = transaction.objectStore('BudgetStore');

  store.add(record);
};

window.addEventListener("online", checkDatabase);
