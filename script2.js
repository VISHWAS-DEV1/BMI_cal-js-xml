var age = document.getElementById("age");
var height = document.getElementById("height");
var weight = document.getElementById("weight");
var male = document.getElementById("m");
var female = document.getElementById("f");
var form = document.getElementById("form");
let resultArea = document.querySelector(".comment");

modalContent = document.querySelector(".modal-content");
modalText = document.querySelector("#modalText");
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function calculate() {
  if (
    age.value == "" ||
    height.value == "" ||
    weight.value == "" ||
    (male.checked == false && female.checked == false)
  ) {
    modal.style.display = "block";
    modalText.innerHTML = `All fields are required!`;
  } else {
    countBmi();
  }
}

function countBmi() {
  const height = Number(document.getElementById("height").value);
  const weight = Number(document.getElementById("weight").value);
  const bmi = weight / (height / 100) ** 2;

  // Fetch BMI category exclusively from XML
  fetchBMICategoryFromXML(bmi, function (xmlResult) {
    resultArea.style.display = "block";
    document.querySelector(
      ".comment"
    ).innerHTML = `You are <span id="comment">${xmlResult}</span>`;
    document.querySelector("#result").innerHTML = bmi.toFixed(2);
  });
}

function fetchBMICategoryFromXML(bmi, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "categories.xml", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const xml = xhr.responseXML;
      const categories = xml.getElementsByTagName("category");
      let result = "Unknown";

      for (let i = 0; i < categories.length; i++) {
        const min = parseFloat(
          categories[i].getElementsByTagName("min")[0]?.textContent || 0
        );
        const max = parseFloat(
          categories[i].getElementsByTagName("max")[0]?.textContent || Infinity
        );
        const label =
          categories[i].getElementsByTagName("label")[0]?.textContent;

        if (bmi >= min && bmi <= max) {
          result = label;
          break;
        }
      }
      callback(result); // Return the result via callback
    }
  };
  xhr.send();
}
