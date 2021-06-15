/** Client-side post ride form validation **/

// hours input element
const hoursInput = document.getElementById("hours");
// input listener
hoursInput.addEventListener("input", conveyError);

// simple regex test for valid int/float number
function isNumber(input) {
  const regExpFloat = /(?<=^| )\d+(\.\d)?(?=$| )/;
  return regExpFloat.test(input.value);
}

// indicate error condition -- input color
function conveyError() {
  if (!isNumber(this)) {
    this.classList.add("col-danger");
  } else {
    this.classList.remove("col-danger");
  }
}

// validate new engine hours on form submit
function validatePostRide() {
  console.log("post ride val");
  return hoursGTCurrent();
}

// onsubmit function
function hoursGTCurrent() {
  const currHrs = document.getElementById("current-hours");
  const currHrsVal = Number.parseFloat(currHrs.innerText);
  if (hoursInput.value <= currHrsVal) {
    return confirm(
      "New engine hours not greater than current hours. Continue?"
    );
  }
}
