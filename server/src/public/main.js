const links = document.querySelectorAll("a");
const sections = document.querySelectorAll(".container");
// const homeSection = document.querySelector("#home_section");
// const cursosSection = document.querySelector("#cursos_section");
// const perfilSection = document.querySelector("#perfil_section");
// const contactSection = document.querySelector("#contact_section");
links.forEach((link) => {
  link.addEventListener("click", () => {
    resetContainers();
    console.log(link.getAttribute("id"));
    console.log(Array.from(sections).toString());
    sections.forEach((section) => {
      if (
        link.getAttribute("id").split("_")[0] ==
        section.getAttribute("id").split("_")[0]
      ) {
        section.style.display = "flex";
      }
    });
  });
});
paypal
  .Buttons({
    style: {
      shape: "rect",
      color: "black",
      layout: "vertical",
      label: "checkout",
    },
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "150",
            },
          },
        ],
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        alert(
          "Transaction completed by " + details.payer.name.given_name + "!"
        );
      });
    },
  })
  .render("#paypal-button-container");

function resetContainers() {
  sections.forEach((section) => (section.style.display = "none"));
}
