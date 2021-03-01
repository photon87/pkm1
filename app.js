console.log('Pokemon Card Display Tool by @photon87');
console.log('https://github.com/photon87/pkm1');

const cardsAPI = 'https://api.pokemontcg.io/v2/cards?q=';
const testAPI = 'https://api.pokemontcg.io/v2/cards?q=name:charizard';
const setsAPI = 'https://api.pokemontcg.io/v2/sets'

const pkmnColors = {
    'Normal': '#AAB09F',
    'Colorless': '#AAB09F',
    'Fire': '#EE8130',
    'Water': '#6390F0',
    'Electric': '#F7D02C',
    'Lightning': '#F7D02C',
    'Grass': '#7AC74C',
    'Ice': '#96D9D6',
    'Fighting': '#C22E28',
    'Poison': '#A33EA1',
    'Ground': '#E2BF65',
    'Flying': '#A98FF3',
    'Psychic': '#F95587',
    'Bug': '#A6B91A',
    'Rock': '#B6A136',
    'Ghost': '#735797',
    'Dragon': '#6F35FC',
    'Dark': '#736C75',
    'Darkness': '#736C75',
    'Steel': '#B7B7CE',
    'Metal': '#B7B7CE',
    'Fairy': '#D685AD'
}

const cardsDiv = document.querySelector('.cards');
const filterDiv = document.querySelector('.filter');
const setLogoDiv = document.querySelector('.setLogoDiv')

const select = document.createElement("select");
select.onchange = getCards

const sizeBox = document.createElement("input");
sizeBox.setAttribute("type", "checkbox");
sizeBox.onchange = getCards

getSets();
//getCards();

function getSets() {

    const setSymbols = document.createElement('div')
    setSymbols.className = 'setSymbols'


    fetch(setsAPI)
        .then(res => res.json())
        .then(sets => {

            const values = sets.data.map((set) => set);

            select.name = "sets";
            select.id = "sets"

            const noneOption = document.createElement("option");
            noneOption.value = '';
            noneOption.text = '------';
            select.appendChild(noneOption);

            for (const val of values) {
                const option = document.createElement("option");
                option.value = val.id;
                option.text = val.name;
                select.appendChild(option);

                const symbol = document.createElement('img');
                symbol.src = val.images.symbol
                symbol.title = val.name;
                symbol.onclick = () => {
                    clickSymbol(val.id, val.name)
                };
                symbol.className = 'setSymbolFilter';
                setSymbols.appendChild(symbol)
            }

            const selectLabel = document.createElement("label");
            selectLabel.innerHTML = "Choose a set: "
            selectLabel.htmlFor = "sets";

            const sizeBoxLabel = document.createElement("label");
            sizeBoxLabel.innerHTML = "Use High Res Images  "
            sizeBoxLabel.htmlFor = "size";

            filterDiv.appendChild(selectLabel).appendChild(select);
            filterDiv.appendChild(sizeBoxLabel).appendChild(sizeBox)
            filterDiv.appendChild(setSymbols)

        })
}

function clickSymbol(id, name) {
    console.log(id, name)
    select.value = id;
    select.text = name;
    getCards();
}


function getCards() {
    cardsDiv.innerHTML = ''
    setLogoDiv.innerHTML = ''
    if (select.value != '') {
        fetch(`${cardsAPI}set.id:${select.value}`)
            // fetch(testAPI)
            .then(res => res.json())
            .then(cards => {
                cards.data.sort((a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate))
                console.log(cards.data);


                const setLogo = document.createElement('img')
                setLogo.className = 'setLogo'
                setLogo.src = cards.data[0].set.images.logo
                setLogoDiv.appendChild(setLogo)
                const setName = document.createElement('span')
                setName.textContent = cards.data[0].set.name
                setLogoDiv.appendChild(setName)

                cards.data.forEach(card => {
                    const div = document.createElement('div')
                    div.className = 'card'
                    const gradColor = card.types ? pkmnColors[card.types[0]] : '#FFF'
                    div.style = `background: linear-gradient(#000, ${gradColor});`

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
                    image.src = sizeBox.checked ? card.images.large : card.images.small
                    div.appendChild(image)


                    cardsDiv.appendChild(div)

                })

            })
            .catch(err => console.error(err));
    }
}

