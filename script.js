'use strict';

const btn = document.querySelector('.btn-country');
const loading = document.querySelector('.fa-spinner');
const countriesContainer = document.querySelector('.countries');

loading.classList.add('hidden');

const html = `<div class="author">
<h1>Muhammadyor Mahamadjonov</h1>
</div>`;
document.body.insertAdjacentHTML('afterbegin', html);
setTimeout(() => {
  document.querySelector('.author').style.transform = 'scaleX(1)';
  document.querySelector('.author').style.opacity = '1';
}, 500);
setTimeout(() => {
  document.querySelector('.author').style.transform = 'scaleX(1)';
}, 1250);
setTimeout(() => {
  document.querySelector('.author').style.borderRadius = '1rem';
  document.querySelector('.author').style.color = 'white';
  document.querySelector('.author').style.boxShadow = '0 0 15px 0 black';
}, 2500);

const renderCountry = function (data, className = '') {
  console.log(data);
  let lang;
  if (data.fifa) lang = data.languages[`${data.fifa.toLowerCase()}`];
  else lang = Object.values(data.languages)[0];
  const cur = Object.values(data.currencies)[0].name;
  const html = `
      <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
          <h3 class="country__name">${data.name.official}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)} people</p>
          <p class="country__row"><span>🗣️</span>${lang}</p>
          <p class="country__row"><span>💰</span>${cur}</p>
        </div>
      </article>
      `;
  if (className == '') countriesContainer.innerHTML = className;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getCountryAndNeighbour = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(responce => {
      if (responce.ok) {
        return responce.json();
      }
    })
    .then(tempData => {
      const data = tempData[0];
      // Render country 1
      renderCountry(data);

      if (!data.borders) {
        throw new Error('No neighbour found');
      }

      // Get neighbour country (2)
      const [neighbour] = data.borders;

      // AJAX call country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(responce => {
      if (responce.ok) {
        return responce.json();
      }
    })
    .then(tempData => {
      const data = tempData[0];
      renderCountry(data, 'neighbour');
    })
    .catch(err => {
      console.log(err.message);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
      loading.classList.add('hidden');
      btn.classList.remove('hidden');
    });
};

const whereAmI = function (lat, lng) {
  countriesContainer.style.opacity = 0;
  btn.classList.add('hidden');
  loading.classList.remove('hidden');
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=${geoAuthCode}`)
    .then(responce => {
      if (responce.ok) {
        return responce.json();
      }
    })
    .then(data => {
      getCountryAndNeighbour(data.country);
    });
};

btn.addEventListener('click', function () {
  navigator.geolocation.getCurrentPosition(function (e) {
    const { latitude, longitude } = e.coords;
    whereAmI(latitude, longitude);
  });
});
