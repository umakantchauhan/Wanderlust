//this script is for adding default bootstrap validation on the empty name field or the empty surname field etc which can work on the every browser
(() => {
  "use strict";

  //fetch all the form we want to apply custom validation style to
  const forms = document.querySelectorAll(".needs-validation");

  //loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
