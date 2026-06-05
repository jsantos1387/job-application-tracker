const addBtn = document.getElementById("addBtn");
const applicationList = document.getElementById("applicationList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

let applications = [];

function displayApplications(filteredApplications = applications) {
    applicationList.innerHTML = "";

    filteredApplications.forEach(function (application) {
        const applicationCard = document.createElement("div");
        applicationCard.classList.add("application-card");

        applicationCard.innerHTML = `
            <h3>${application.company}</h3>
            <p><strong>Position:</strong> ${application.position}</p>
            <p><strong>Date Applied:</strong> ${application.dateApplied}</p>
            <p>
                <strong>Status:</strong>
                <span class="status ${application.status.toLowerCase()}">
                    ${application.status}
                </span>
            </p>
            <button class="delete-btn">Delete</button>
        `;

        const deleteBtn = applicationCard.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", function () {
            const realIndex = applications.indexOf(application);
            applications.splice(realIndex, 1);
            saveApplications();
            applyFilters();
        });

        applicationList.appendChild(applicationCard);
    });
}

function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
}

function loadApplications() {
    const savedApplications = localStorage.getItem("applications");

    if (savedApplications) {
        applications = JSON.parse(savedApplications);
        displayApplications();
    }
}

function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    const filteredApplications = applications.filter(function (application) {
        const matchesSearch =
            application.company.toLowerCase().includes(searchText) ||
            application.position.toLowerCase().includes(searchText) ||
            application.status.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" || application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    displayApplications(filteredApplications);
}

addBtn.addEventListener("click", function () {
    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;
    const dateApplied = document.getElementById("dateApplied").value;
    const status = document.getElementById("status").value;

    if (company === "" || position === "") {
        alert("Please fill out all fields.");
        return;
    }

    const newApplication = {
        company: company,
        position: position,
        dateApplied: dateApplied,
        status: status
    };

    applications.push(newApplication);
    saveApplications();
    applyFilters();

    document.getElementById("company").value = "";
    document.getElementById("position").value = "";
    document.getElementById("dateApplied").value = "";
});

searchInput.addEventListener("input", applyFilters);

filterStatus.addEventListener("change", applyFilters);

loadApplications();