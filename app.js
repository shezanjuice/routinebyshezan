const sheetId = "1vJQVPX0-YypjwBAoiFcMNofKR91X8Zt57NAKlXrUre4";
const apiKey = "a5385f05f1e3a26ce479b88f150164478f5d2462";
const routineRange = "Routine!A1:Z1000";
define labRange = "Labs!A1:E100";
define teacherRange = "Teachers!A1:E100";

let routineData = [];
let labData = [];
let teacherData = [];

async function fetchData(range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.values || [];
}

async function init() {
    routineData = await fetchData(routineRange);
    labData = await fetchData(labRange);
    teacherData = await fetchData(teacherRange);
    populateSemesters();
}

function populateSemesters() {
    const semesterSelect = document.getElementById("semester");
    const semesters = [...new Set(routineData.map(row => row[0]))];
    semesters.forEach(semester => {
        const option = document.createElement("option");
        option.value = semester;
        option.textContent = semester;
        semesterSelect.appendChild(option);
    });
}

function updateSections() {
    const semester = document.getElementById("semester").value;
    const sectionSelect = document.getElementById("section");
    sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';

    const sections = [...new Set(routineData.filter(row => row[0] === semester).map(row => row[1]))];
    sections.forEach(section => {
        const option = document.createElement("option");
        option.value = section;
        option.textContent = section;
        sectionSelect.appendChild(option);
    });
}

function fetchRoutine() {
    const semester = document.getElementById("semester").value;
    const section = document.getElementById("section").value;
    const day = document.getElementById("day").value;

    const results = routineData.filter(row => row[0] === semester && row[1] === section && row[2] === day);
    displayResults(results, "Routine");
}

function fetchTeacherRoutine() {
    const initial = document.getElementById("teacher-initial").value.toUpperCase();
    const day = document.getElementById("teacher-day").value;

    const results = routineData.filter(row => row.includes(initial) && row[2] === day);
    displayResults(results, "Teacher's Routine");
}

function fetchTeacherInfo() {
    const teacherInitial = document.getElementById("teacher-info-initial").value.toUpperCase();
    const teacher = teacherData.find(row => row[0] === teacherInitial);

    if (teacher) {
        displayInfo("Teacher Information", {
            "Name": teacher[1],
            "Designation": teacher[2],
            "Department": teacher[3],
            "Contact No": teacher[4]
        });
    } else {
        displayError("No teacher information found for the given initial.");
    }
}

function fetchLabInfo() {
    const labInitial = document.getElementById("classroom-initial").value.toUpperCase();
    const lab = labData.find(row => row[0] === labInitial);

    if (lab) {
        displayInfo("Lab Information", {
            "Lab Name": lab[1],
            "Room No": lab[2],
            "Executive Officer": lab[3],
            "Contact No": lab[4]
        });
    } else {
        displayError("No lab information found for the given initial.");
    }
}

function displayResults(results, title) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<h2>${title}</h2>`;

    if (results.length === 0) {
        resultsDiv.innerHTML += "<p>No data found.</p>";
        return;
    }

    const table = document.createElement("table");
    results.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    resultsDiv.appendChild(table);
}

function displayInfo(title, info) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<h2>${title}</h2>`;

    for (const [key, value] of Object.entries(info)) {
        resultsDiv.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
    }
}

function displayError(message) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<p>${message}</p>`;
}

init();
