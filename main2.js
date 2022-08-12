

function checkCashRegister(price, cash, cid) {

  //-------------------------------------------
  // variables
  //-------------------------------------------

    let change = cash-price;
    let changeFromPrevious = 0;   // this var for recursion to work, in calculateChangeInUnits(). "change" is seperated in two parts
    let changeInUnits = []
    let unitIndex;
    let cidSUM = cid.reduce((total, current) => (total*100 + current[1]*100)/100, 0)

    const changeTable = [ 
        [ "PENNY", 0.01 ],
        [ "NICKEL", 0.05 ],
        [ "DIME", 0.1 ],
        [ "QUARTER", 0.25 ],
        [ "ONE", 1 ],
        [ "FIVE", 5 ],
        [ "TEN", 10 ],
        [ "TWENTY", 20 ],
        [ "ONE HUNDRED", 100 ] 
      ]

    const showResults = [
        {
            index : "     [1/5]",
            status : "status : No change remaining and money in this unit (in CID)",
            push : "push   : changeInUnit",
            next : "next   : end result"
        },
        {
            index : "     [2/5]",
            status : "status : Change remaining and not enough money in this unit (in CID)",
            push: "  push : unitCidAmount",
            next : "  next : go to lower unit"
        },
        {
            index : "     [3/5]",
            status : "status : change remaining and there is money in this unit (in CID)",
            push: "  push : changeInUnit",
            next : "  next : go to lower unit"
        },
        {
            index : "     [4/5]",
            status : "status : no change remaining and no money in CID this unit",
            push: "  push : -",
            next : "  next : go to lower unit"
        },
        {
            index : "     [5/5]",
            status : "status : inuffiecient funds",
            push: "  push : -",
            next : "  next : end result"
        },
    ]

  //-------------------------------------------
  // functions declaration
  //-------------------------------------------

    // [for calculateChange] 
    function printResult(i) {
        console.log("")
        console.log("- - - - - - - - - - - - - - - ")
        Object.values(showResults[i]).map( item => console.log(item))
        console.log("- - - - - - - - - - - - - - - ")
        console.log("")
    }

    // [for calculateChange] 
    function closestUnitIndex () {
      
        let oneBigger = changeTable.find( cur => change <= cur[1])
        let cidIndex = changeTable.indexOf(oneBigger)-1
    
        return cidIndex
      }
    

    // ---> calculate change
    function calculateChangeInUnits(change, changeFromPrevious, unitIndex){

        console.log("change = "+change)
        console.log("change from previous unit = "+changeFromPrevious)
        console.log("changeInUnits = "+changeInUnits)
        console.log("-------------")

        console.log("unitIndex = "+unitIndex)

        let unit = changeTable[unitIndex]
        console.log("unit : "+unit)

        let unitCidAmount = cid[unitIndex][1]
        console.log("unitCidAmount = "+unitCidAmount)
        console.log("-------------")

        let changeInUnit = parseInt(change/unit[1])*unit[1] + changeFromPrevious
        console.log("changeInUnit = "+changeInUnit)
        console.log(">------------>>>")

        let changeRemaining = ((change*1000 + changeFromPrevious*1000) - changeInUnit*1000)/1000
        console.log("changeRemaining = "+changeRemaining)

        let unitCidBallance = unitCidAmount - changeInUnit
        console.log("unitCidBallance = "+unitCidBallance)


        // 1. no change remaining and is money in CID this unit 
        if (changeRemaining === 0 && unitCidBallance > 0) {
            printResult(0)

            changeInUnits.push([unit[0], changeInUnit])

            let changeInActiveUnits = changeInUnits.filter(arr => arr[1])

            return {status: "OPEN", change: changeInActiveUnits}

        // 2. change remaining and not enough money in CID this unit 
        } else if (changeRemaining !== 0 && unitCidBallance < 0) {
            printResult(1)

            changeInUnits.push([unit[0], unitCidAmount])

            change = changeRemaining;
            changeFromPrevious = Math.abs(unitCidBallance);
            unitIndex = unitIndex-1

            calculateChangeInUnits(change, changeFromPrevious, unitIndex)

            let changeInActiveUnits = changeInUnits.filter(arr => arr[1])

            return {status: "OPEN", change: changeInActiveUnits}

        // 3. change remaining and there is money in CID this unit
        } else if (changeRemaining !== 0 && unitCidBallance > 0) {
            printResult(2)

            changeInUnits.push([unit[0], changeInUnit])

            change = changeRemaining;
            changeFromPrevious = 0;
            unitIndex = unitIndex-1

            calculateChangeInUnits(change, changeFromPrevious, unitIndex)

            let changeInActiveUnits = changeInUnits.filter(arr => arr[1])

            return {status: "OPEN", change: changeInActiveUnits}

        // 4. no change remaining and no money in CID this unit 
        } else if (changeRemaining === 0 && unitCidBallance < 0) {
            printResult(3)

            change = Math.abs(unitCidBallance)
            changeFromPrevious = 0
            unitIndex = unitIndex-1

            if (unitIndex < 0) {
                printResult(4)
                return 
            }

            calculateChangeInUnits(change, changeFromPrevious, unitIndex)
            return {status: "INSUFFICIENT_FUNDS", change: []}
        }
    }


  //-------------------------------------------
  // let it bang
  //-------------------------------------------



    if (cidSUM === change) {
        return {status: "CLOSED", change: cid}

    } else if (cidSUM > 0) {
        unitIndex = closestUnitIndex()
        return calculateChangeInUnits(change, changeFromPrevious, unitIndex)

    } else if (cidSUM < 0) {
        return {status: "INSUFFICIENT_FUNDS", change: []}
    }


}

let x = checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])

console.log(x)