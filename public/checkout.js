function initAutoComplete() {

    const companyName = document.getElementById('company')
    const companyCopyright = document.getElementById('company-copyright')
    const company = localStorage.getItem('company')
    const logoDiv = document.getElementById('logo')
    const logo = localStorage.getItem('logo')

    companyName.innerHTML = `<strong>Place your order with ${company}:</strong>`;
    companyCopyright.innerHTML = `<p class="mb-1">&copy; 2020 ${company} </p>`
    logoDiv.innerHTML += `<img class="d-block mx-auto mb-4" src=${logo} alt="" width="180">`;

    let input = document.getElementById('address');
    let autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
    });
}