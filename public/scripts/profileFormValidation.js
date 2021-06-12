//// New profile form validation

// number input elements
const yearInput = document.getElementById("year");
const hoursInput = document.getElementById("hours");
hoursInput.isFloat = true; // set float flag for isNumber()
// number input listeners
yearInput.addEventListener("input", conveyError);
hoursInput.addEventListener("input", conveyError);

// simple regex test for valid int/float number
function isNumber(input) {
  const regExpInt = /^\d+$/;
  const regExpFloat = /(?<=^| )\d+(\.\d)?(?=$| )/;
  return input.isFloat
    ? regExpFloat.test(input.value)
    : regExpInt.test(input.value);
}
// indicate error condition -- input color
function conveyError() {
  if (!isNumber(this)) {
    this.classList.add("col-danger");
  } else {
    this.classList.remove("col-danger");
  }
}

// Alert and focus if submitted anyaway -- form onsubmit func
function validateProfile() {
  if (!inputHasNumber(yearInput, false)) {
    return false;
  }
  if (!inputHasNumber(hoursInput, true)) {
    return false;
  }
  return true;
}
// check isNumber, alert, focus input
function inputHasNumber(input, isFloat) {
  if (!isNumber(input, isFloat)) {
    alert(
      `The "${input.id}" value must be a number${
        input.isFloat ? ", with at most one decimal place" : ""
      }!`
    );
    input.focus();
    return false;
  }
  return true;
}
