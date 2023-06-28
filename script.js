fetch('https://api.coincap.io/v2/assets?limit=30')
  .then(response => response.json())
  .then(data => {
    const coins = data.data;

    // Fetch JSON file with descriptions
    return fetch('descriptions.json')
      .then(response => response.json())
      .then(descriptions => {
        // Fetch JSON file with background gradient colors
        return fetch('background-colors.json')
          .then(response => response.json())
          .then(backgroundColors => {
            // Merge descriptions and background colors with coin data
            const coinsWithData = coins.map(coin => ({
              ...coin,
              description: descriptions[coin.name] || 'No description available',
              backgroundColor: backgroundColors[coin.name] || '#222',
            }));

            // Generate the crypto grid
            generateCryptoGrid(coinsWithData);
          });
      });
  })
  .catch(error => {
    console.error('Error:', error);
  });

function generateCryptoGrid(coins) {
  const cryptoGrid = document.getElementById('crypto-grid');

  coins.forEach((crypto, index) => {
    const rank = index + 1;
    const name = crypto.name;
    const price = crypto.priceUsd;
    const marketCap = crypto.marketCapUsd;
    const moreInfoUrl = crypto.id; // Assuming the API provides the ID as the URL for more information

    const li = document.createElement('li');
    const backgroundColor = crypto.backgroundColor || '#222';

    li.style.background = `linear-gradient(45deg, ${backgroundColor}, #f00)`;

    const heading = document.createElement('h2');
    heading.textContent = `#${rank}: ${name}`;

    const pricePara = document.createElement('p');
    pricePara.textContent = `Price: $${price}`;

    const marketCapPara = document.createElement('p');
    marketCapPara.textContent = `Market Cap: $${marketCap}`;

    const dropdownBtn = document.createElement('span');
    dropdownBtn.classList.add('dropdown-btn');
    dropdownBtn.textContent = '▼';

    const dropdownContent = document.createElement('div');
    dropdownContent.classList.add('dropdown-content');
    dropdownContent.innerHTML = `
      <p>Description: ${crypto.description}</p>
    `;

    li.appendChild(heading);
    li.appendChild(pricePara);
    li.appendChild(marketCapPara);
    li.appendChild(dropdownBtn);
    li.appendChild(dropdownContent);

    cryptoGrid.appendChild(li);
  });
}
