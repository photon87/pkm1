console.log('Pokemon Card Display Tool by @photon87');

const cardsAPI = 'https://api.pokemontcg.io/v2/cards?q=';
const testAPI = 'https://api.pokemontcg.io/v2/cards?q=name:charizard';
const setsAPI = 'https://api.pokemontcg.io/v2/sets'

const cardsDiv = document.querySelector('.cards');
const filterDiv = document.querySelector('.filter');

const select = document.createElement("select");
select.onchange = getCards

getSets();
//getCards();

function getSets() {
    fetch(setsAPI)
        .then(res => res.json())
        .then(sets => {

            const values = sets.data.map((set) => set);

            select.name = "sets";
            select.id = "sets"

            var noneOption = document.createElement("option");
            noneOption.value = '';
            noneOption.text = '------';
            select.appendChild(noneOption);

            for (const val of values) {
                var option = document.createElement("option");
                option.value = val.id;
                option.text = val.name;
                select.appendChild(option);
            }

            var label = document.createElement("label");
            label.innerHTML = "Choose a set: "
            label.htmlFor = "sets";

            filterDiv.appendChild(label).appendChild(select);


        })
}


function getCards() {
    cardsDiv.innerHTML = ''
    if (select.value != '') {
        fetch(`${cardsAPI}set.id:${select.value}`)
            // fetch(testAPI)
            .then(res => res.json())
            .then(cards => {
                cards.data.sort((a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate))
                console.log(cards.data);
                cards.data.forEach(card => {
                    const div = document.createElement('div')
                    div.className = 'card'

                    const name = document.createElement('span')
                    name.className = 'cardName'
                    name.textContent = card.name
                    div.appendChild(name)

                    const set = document.createElement('div')
                    set.className = 'set'
                    const setName = document.createElement('span')
                    setName.textContent = card.set.name
                    const setSymbol = document.createElement('img')
                    setSymbol.className = 'setSymbol'
                    setSymbol.src = card.set.images.symbol
                    set.appendChild(setName)
                    set.appendChild(setSymbol)
                    div.appendChild(set)

                    const setDate = document.createElement('span')
                    setDate.className = 'setDate'
                    setDate.textContent = `Release Date: ${card.set.releaseDate}`
                    div.appendChild(setDate)

                    const rarity = document.createElement('small')
                    rarity.className = 'rarity'
                    rarity.textContent = card.rarity
                    div.appendChild(rarity)

                    const number = document.createElement('small')
                    number.className = 'number'
                    number.textContent = `${card.number} / ${card.set.printedTotal}`
                    div.appendChild(number)

                    if (card.tcgplayer != undefined) {
                        const prices = document.createElement('div')
                        prices.className = 'prices'
                        prices.innerHTML = '<b>Prices</b>'
                        for (const [key, value] of Object.entries(card.tcgplayer.prices)) {
                            const price = document.createElement('div')
                            price.className = 'price'
                            const priceType = document.createElement('span')
                            priceType.textContent = key
                            price.appendChild(priceType)
                            const divider = document.createElement('span')
                            divider.textContent = '--------'
                            price.appendChild(divider)
                            const priceAmount = document.createElement('span')
                            priceAmount.textContent = `$${parseFloat(value.market).toFixed(2)}`
                            price.appendChild(priceAmount)
                            prices.appendChild(price)
                        }
                        div.appendChild(prices)
                    }

                    const image = document.createElement('img')
                    image.src = card.images.large
                    div.appendChild(image)


                    cardsDiv.appendChild(div)

                })

            })
            .catch(err => console.error(err));
    }
}

