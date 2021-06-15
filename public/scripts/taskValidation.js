/** Client-side task create/edit form validation **/

// get all number input elements
const numberInputs = document.querySelectorAll('input[type="number"]');
// add input listeners
for (const numberInput of numberInputs) {
  numberInput.addEventListener("input", conveyError);
}

// simple regex test for valid float number
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
