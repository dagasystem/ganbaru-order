const API_URL = "ここにGASのexec URL";

async function loadFacilities(){

  const response =
    await fetch(
      API_URL +
      "?action=facilities"
    );

  const facilities =
    await response.json();

  const select =
    document.getElementById(
      "facility"
    );

  select.innerHTML = "";

  facilities.forEach(f => {

    const option =
      document.createElement(
        "option"
      );

    option.value = f;
    option.textContent = f;

    select.appendChild(option);

  });

}
