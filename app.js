const sheetId = "1vJQVPX0-YypjwBAoiFcMNofKR91X8Zt57NAKlXrUre4";
const apiKey = "AIzaSyDTnnNd5FAdYg10hrcZLU1y0VupuUTmK9k";
const routineRange = "Routine!A1:Z1000";

async function fetchRoutineData() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${routineRange}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.values) {
      throw new Error("No data available from the sheet.");
    }
    return data.values;
  } catch (error) {
    console.error("Error fetching routine data:", error);
    alert("Failed to load routine data. Please try again later.");
    return [];
  }
}

function populateSelectOptions(data) {
  const semesterSet = new Set();
  const sectionSet = new Set();
  const daysSet = new Set();

  data.forEach((row, index) => {
    if (index === 0) return; // Skip headers
    if (row[0]) daysSet.add(row[0]);
    if (row[1]) semesterSet.add(row[1]);
    if (row[2]) sectionSet.add(row[2]);
  });

  populateDropdown("semesterSelect", Array.from(semesterSet));
  populateDropdown("sectionSelect", Array.from(sectionSet));
  populateDropdown("daySelect", Array.from(daysSet));
}

function populateDropdown(elementId, options) {
  const select = document.getElementById(elementId);
  select.innerHTML = options
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");
}

async function displayRoutine() {
  const semester = document.getElementById("semesterSelect").value;
  const section = document.getElementById("sectionSelect").value;
  const day = document.getElementById("daySelect").value;

  if (!semester || !section || !day) {
    alert("Please select Semester, Section, and Day.");
    return;
  }

  const rows = await fetchRoutineData();
  const headers = rows[0];
  const filteredRows = rows.filter(
    (row) => row[0] === day && row[1] === semester && row[2] === section
  );

  const table = document.getElementById("routineTable");
  if (filteredRows.length > 0) {
    table.innerHTML = `
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${filteredRows
          .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    `;
  } else {
    table.innerHTML = `<tr><td colspan="${headers.length}">No routine found for the selected criteria.</td></tr>`;
  }
}

async function initializeApp() {
  const data = await fetchRoutineData();
  if (data.length > 0) {
    populateSelectOptions(data);
  }
}

document.getElementById("viewRoutineBtn").addEventListener("click", displayRoutine);
initializeApp();
