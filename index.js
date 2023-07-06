const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

// Funcao para let html da pagina
async function scrapeWebpage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    return $;
  } catch (error) {
    console.error('Error fetching webpage:', error);
    return null;
  }
}

// fu
async function findBestPrice($, selector) {
  let bestPrice = Infinity;
  let bestBrand = '';

   $(selector).each(function (index, element){
    let casa = $(element).text().indexOf("$")
    console.log($(element).text().substr(casa+ 2,6))

    const price = parseFloat($(element).text().substr(casa+ 2,6));
    let upper = $(element).text().toUpperCase()
    console.log(price)
    if (!isNaN(price) && price < bestPrice && upper.includes('GOLD WHEY')) {
      bestPrice = price;
      bestBrand = $(element).text();
    }
  });
  console.log(bestPrice)
  return { brand: bestBrand, price: bestPrice };
}

const url = 'https://www.google.com/search?q=whey+protein+gold+whey&sa=X&rlz=1C1GCEA_enBR988BR988&biw=1920&bih=912&tbm=shop&sxsrf=APwXEdf9dnug-nWIRsECoRCyVFM0Bae8SQ%3A1684764988346&ei=PHlrZIitFKOZ0AawqbzQBA&ved=0ahUKEwiIu6PVjon_AhWjDNQKHbAUD0oQ4dUDCAg&uact=5&oq=whey+protein+gold+whey&gs_lcp=Cgtwcm9kdWN0cy1jYxADMgYIABAWEB4yCAgAEBYQHhAKMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjoHCCMQsAMQJzoKCAAQigUQsAMQQzoICAAQgAQQsAM6BAgjECc6BwgAEIoFEEM6BQgAEIAEOggIABAWEB4QGDoKCAAQCBAeEA0QGFDuB1ilJGDbJmgAcAB4AIABlAGIAdEIkgEDNy40mAEAoAEByAEKwAEB&sclient=products-cc';

const priceSelector = '.P8xhZc';

scrapeWebpage(url)
  .then($ => {
    
    const bestPrice = findBestPrice($, priceSelector).then(function (bestPrice){
      if (bestPrice.price !== Infinity) {
        console.log(`O melhor preço de gold whey é R$${bestPrice.price} do anuncio "${bestPrice.brand}."`);
        /*
        const transporter = nodemailer.createTransport({
          host: ,
          port: ,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: "username",
            pass: "password",
          },
        });
        const mailOptions = {
          from: '@gmail.com',
          to: '@gmail.com',
          subject: 'Relatorio whey gold whey',
          text: `O melhor preço de gold whey é R$${bestPrice.price} do anuncio "${bestPrice.brand}."`
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado: ' + info.response);
          }
        });
        */
      } else {
        console.log('Unable to find prices on the webpage.');
      }
    })
    
  })
  .catch(error => {
    console.error('Error scraping webpage:', error);
  });