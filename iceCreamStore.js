let iceCreamFlavors = [
    { name: "Chocolate", type: "Chocolate", price: 2 },
    { name: "Strawberry", type: "Fruit", price: 1 },
    { name: "Vanilla", type: "Vanilla", price: 2 },
    { name: "Pistachio", type: "Nuts", price: 1.5 },
    { name: "Neapolitan", type: "Chocolate", price: 2},
    { name: "MintChip", type: "Chocolate", price: 1.5 },
    { name: "Raspberry", type: "Fruit", price: 1},
   ];

let transactions = []

transactions.push({ scoops: ["Chocolate", "Vanilla", "MintChip"], total: 5.5 })
transactions.push({ scoops: ["Raspberry", "StrawBerry"], total: 2 })
transactions.push({ scoops: ["Vanilla", "Vanilla"], total: 4 })

const total = transactions.reduce((acc, curr) => acc + curr.total, 0); 
console.log(`You've made ${total} $ today`);

let flavorDistribution = transactions.reduce((acc, curr) => {
    curr.scoops.forEach(scoop => {
      if (!acc[scoop]) {
        acc[scoop] = 0;
      }
      acc[scoop]++;
    })
    return acc;
}, {})

console.log(flavorDistribution);

const mostPopularFlavor = Object.keys(flavorDistribution).reduce((a, b) =>
    flavorDistribution[a] > flavorDistribution[b] ? a : b
);

console.log(mostPopularFlavor);

//const maxValue = Math.max(...Object.keys(data).map(key => data[key]));

//console.log(maxValue); 