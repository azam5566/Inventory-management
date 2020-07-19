const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//validations
function isNumber(str) {
  if (str === '') {
    return false
  }
  return str - 0 === str * 1
}
var isOnlyChar = /^[A-Z]+$/;
var isAlphaNumeric = /^[A-Z0-9]+$/;

//user input
rl.question("Enter Input :  ", function (input) {
  inputF(input);
});

const MyInventory = {
  uk: {
    mask: {
      quantity: 100,
      price: 65
    },
    gloves: {
      quantity: 100,
      price: 100
    },
  },
  germany: {
    mask: {
      quantity: 100,
      price: 100
    },
    gloves: {
      quantity: 50,
      price: 150
    },
  }
}

var bill = 0;
var leftOvers = {};
leftOvers.maskLeftuk = MyInventory.uk.mask.quantity
leftOvers.maskLeftgermany = MyInventory.germany.mask.quantity
leftOvers.glovesLeftuk = MyInventory.uk.gloves.quantity
leftOvers.glovesLeftgermany = MyInventory.germany.gloves.quantity
const inputF = (input) => {
  var finalArr = [];
  input.split(":").forEach((element) => {
    finalArr.push(element.trim());
  });

  if (finalArr.length >= 5 && finalArr.length <= 6) {
    let s = ""
    s = s + findInInv(finalArr, finalArr.length)
    if (s != undefined && s != "") {
      console.log(s);
    }
    bill = 0
    leftOvers.maskLeftuk = MyInventory.uk.mask.quantity
    leftOvers.maskLeftgermany = MyInventory.germany.mask.quantity
    leftOvers.glovesLeftuk = MyInventory.uk.gloves.quantity
    leftOvers.glovesLeftgermany = MyInventory.germany.gloves.quantity
    rl.question("Enter Input :  ", function (input) {
      inputF(input);
    });

  } else {
    console.log("INCORRECT INPUT");
    rl.question("Enter Input :  ", function (input) {
      inputF(input);
    });
  }
};

function findInInv(arr, arrLen) {
  var country;
  var passPort = "";
  var productName1;
  var productQty1;
  var productName2;
  var productQty2;
  if (arrLen == 5) {
    country = arr[0].toLowerCase();
    productName1 = arr[1].toLowerCase();
    productQty1 = arr[2];
    productName2 = arr[3].toLowerCase();
    productQty2 = arr[4];
  } else {
    country = arr[0].toLowerCase();
    passPort = arr[1]
    productName1 = arr[2].toLowerCase();
    productQty1 = arr[3];
    productName2 = arr[4].toLowerCase();
    productQty2 = arr[5];
  }
  if (productQty1 <= MyInventory.uk[productName1].quantity + MyInventory.germany[productName1].quantity) {
    price(productQty1, productName1, country, passPort)
  } else {
    outOfStock("OUT_OF_STOCK" + ":" + MyInventory.uk.mask.quantity + ":" + MyInventory.germany.mask.quantity + ":" + MyInventory.uk.gloves.quantity + ":" + MyInventory.germany.gloves.quantity);
    return ""
  }
  if (productQty2 <= MyInventory.uk[productName2].quantity + MyInventory.germany[productName2].quantity) {
    price(productQty2, productName2, country, passPort)
  } else {
    outOfStock("OUT_OF_STOCK" + ":" + MyInventory.uk.mask.quantity + ":" + MyInventory.germany.mask.quantity + ":" + MyInventory.uk.gloves.quantity + ":" + MyInventory.germany.gloves.quantity);
    return ""
  }
  return bill + ":" + leftOvers.maskLeftuk + ":" + leftOvers.maskLeftgermany + ":" + leftOvers.glovesLeftuk + ":" + leftOvers.glovesLeftgermany
};

const outOfStock = (str) => {
  console.log(str)
}

function minimizeBill(name, qty, bill, passPort) {
  var prevBill = bill
  var minImport = 10
  for (var i = 1; i <= Math.floor(MyInventory.uk[name].quantity / 10) && i <= Math.floor(qty / 10); i++) {
    let currentBill = 0
    minImport = minImport * i
    if (passPort != "" && isPassLocal(passPort, "uk")) {
      currentBill = currentBill + minImport * MyInventory.uk[name].price + (320 * (minImport / 10)) + (qty - minImport) * MyInventory.germany[name].price
    } else {
      currentBill = currentBill + minImport * MyInventory.uk[name].price + (400 * (minImport / 10)) + (qty - minImport) * MyInventory.germany[name].price
    }
    if (currentBill > prevBill) {
      return [prevBill, minImport]
    } else {
      prevBill = currentBill
    }
  }
  return [prevBill, minImport]
}
const price = (quantity, itemName, country, passPort) => {
  if (country == "uk") {
    let toBeImported = 0;
    let existing = 0;
    existing = quantity <= MyInventory[country][itemName].quantity ? quantity : MyInventory[country][itemName].quantity;
    toBeImported =
      quantity > MyInventory[country][itemName].quantity ? quantity - MyInventory[country][itemName].quantity : 0;
    leftOvers[itemName + 'Left' + country] = MyInventory[country][itemName].quantity - existing
    bill = bill + existing * MyInventory[country][itemName].price
    if (toBeImported > 0 && passPort != "" && isPassLocal(passPort, "germany")) {
      toBeImported % 10 == 0 ? bill = bill + toBeImported * MyInventory.germany[itemName].price + (320 * (toBeImported / 10)) : bill = bill + toBeImported * MyInventory.germany[itemName].price + (320 * (Math.ceil(toBeImported / 10)))
      leftOvers[itemName + 'Leftgermany'] = MyInventory.germany[itemName].quantity - toBeImported
    } else if (toBeImported > 0) {
      toBeImported % 10 == 0 ? bill = bill + toBeImported * MyInventory.germany[itemName].price + (400 * (toBeImported / 10)) : bill = bill + toBeImported * MyInventory.germany[itemName].price + (400 * (Math.ceil(toBeImported / 10)))
      leftOvers[itemName + 'Leftgermany'] = MyInventory.germany[itemName].quantity - toBeImported
    }
  } else if (country == "germany") {
    let toBeImported = 0;
    let existing = 0;
    existing = quantity <= MyInventory[country][itemName].quantity ? quantity : MyInventory[country][itemName].quantity;
    toBeImported =
      quantity > MyInventory[country][itemName].quantity ? quantity - MyInventory[country][itemName].quantity : 0;
    leftOvers[itemName + 'Left' + country] = MyInventory[country][itemName].quantity - existing
    if (toBeImported > 0 && passPort != "" && isPassLocal(passPort, "uk")) {
      bill = bill + existing * MyInventory[country][itemName].price

      toBeImported % 10 == 0 ? bill = bill + toBeImported * MyInventory.uk[itemName].price + (320 * (toBeImported / 10)) : bill = bill + toBeImported * MyInventory.uk[itemName].price + (320 * (Math.ceil(toBeImported / 10)))
      leftOvers[itemName + 'Leftuk'] = MyInventory.uk[itemName].quantity - toBeImported
    } else if (toBeImported > 0) {
      bill = bill + existing * MyInventory[country][itemName].price

      toBeImported % 10 == 0 ? bill = bill + toBeImported * MyInventory.uk[itemName].price + (400 * (toBeImported / 10)) : bill = bill + toBeImported * MyInventory.uk[itemName].price + (400 * (Math.ceil(toBeImported / 10)))
      leftOvers[itemName + 'Leftuk'] = MyInventory.uk[itemName].quantity - toBeImported
    } else {
      let minBillArr = minimizeBill(itemName, quantity, existing * MyInventory[country][itemName].price, passPort)
      if (minBillArr[0] < existing * MyInventory[country][itemName].price) {
        bill = bill + minBillArr[0]
        leftOvers[itemName + 'Leftuk'] = MyInventory.uk[itemName].quantity - minBillArr[1]
        leftOvers[itemName + 'Left' + country] = MyInventory[country][itemName].quantity - (quantity - minBillArr[1])
      } else {
        bill = bill + existing * MyInventory[country][itemName].price
      }
    }
  } else {
    console.log("INCORRECT COUNTRY NAME");
    rl.question("Enter Input :  ", function (input) {
      inputF(input);
    });
  }
};

function isPassLocal(str, identify) {
  if (identify == "uk") {
    return str.substring(0, 1) == "B" && isNumber(str.substring(1, 4)) && isOnlyChar.test(str.substring(4, 6)) && isAlphaNumeric.test(str.substring(6))
  } else {
    return str.substring(0, 1) == "A" && isOnlyChar.test(str.substring(1, 3)) && isAlphaNumeric.test(str.substring(3))
  }
}