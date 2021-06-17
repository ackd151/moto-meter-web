/** Client-side registration form validation **/

// get password input elements
const pw = document.getElementById("password");
const pwv = document.getElementById("password-ver");
// add input listeners
pw.addEventListener("input", conveyLengthError);
pwv.addEventListener("input", conveyMismatchError);

// indicate error condition -- input color
function conveyLengthError() {
  if (this.value.length < 8) {
    this.classList.add("col-danger");
  } else {
    this.classList.remove("col-danger");
    this.classList.add("col-good");
  }
}
function conveyMismatchError() {
  if (this.value !== pw.value || this.value.length < 8) {
    this.classList.add("col-caution");
  } else {
    this.classList.remove("col-caution");
    this.classList.add("col-good");
  }
}
