

/* 

Cash Register App* 
- freeCodeCamp project for "JavaScript Algorithms and Data Structures Projects" course. 
______
* author is aware that functions aren't fully abstracted and are operating on global values. For more professional use of this app - that would be corrected.

*/



function checkCashRegister(price, cash, cid) {

  //-------------------------------------------
  // variables
  //-------------------------------------------

    let change = cash-price;
    let changeInUnits = []
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

    const statusValues = [
        {
            id : 1,
            status : "No change remaining and money in this unit (in CID)",
            push : "changeInUnit",
            next : "end"
        },
        {
            id : 2,
            status : "Change remaining and not enough money in this unit (in CID)",
            push: "unitCidAmount",
            next : "go to lower unit"
        },
        {
            id : 3,
            status : "change remaining and there is money in this unit (in CID)",
            push: "changeInUnit",
            next : "go to lower unit"
        },
        {
            id : 4,
            status : "no change remaining and no money in CID this unit",
            push: " - ",
            next : "go to lower unit"
        },
        {
            id : 5,
            status : "no more units",
            push: " - ",
            next : "end"
        },
    ]


  //-------------------------------------------
  // functions declaration 
  //-------------------------------------------


    // [for calculateChange] 
    // ---> before recursion
    function printStatus(i) {
        console.log("")
        console.log("- - - - - - - - - - - - - - - ")

        Object.keys(statusValues[i]).map( (item,index) => {
            console.log(item + " : " + statusValues[i][item])
        })

        console.log("- - - - - - - - - - - - - - - ")
        console.log("")
    }

    // [for calculateChange] 
    function closestUnitIndex () {
        let oneBigger = changeTable.find( cur => change <= cur[1])
        let cidIndex = changeTable.indexOf(oneBigger)-1
        return cidIndex
    }
    
    // end result
    function printCashRegister(status, change) {

        let cashRegisterValues = {
            open : {status: "OPEN", change: change},
            closed: {status: "CLOSED", change: change},
            if : {status: "INSUFFICIENT_FUNDS", change: change}
        }

        let cashRegisterReport;

        switch (status) {
            case "open":
                cashRegisterReport = cashRegisterValues.open
                break;
            case "closed":
                cashRegisterReport = cashRegisterValues.closed
                break;
            case "if":
                cashRegisterReport = cashRegisterValues.if
                break;
        }

        return cashRegisterReport;
    }

    // ---> calculate all of the change
    function calculateChangeInUnits(change, unitIndex){

        // >> variables <<
        let unit = changeTable[unitIndex]
        let unitCidAmount = cid[unitIndex][1]
        let changeInUnit = parseInt(change/unit[1])*unit[1] 
        let changeRemaining = (change*1000 - changeInUnit*1000)/1000
        let unitCidBallance = unitCidAmount - changeInUnit
        // >> variables <<

        // >> control panel <<
        console.log("change = "+change)
        console.log("changeInUnits = "+changeInUnits)
        console.log("-------------")
        console.log("unit : "+unit)
        console.log("unitIndex = "+unitIndex)
        console.log("unitCidAmount = "+unitCidAmount)
        console.log("-------------")
        console.log("changeInUnit = "+changeInUnit)
        console.log(">------------>>>")
        console.log("changeRemaining = "+changeRemaining)
        console.log("unitCidBallance = "+unitCidBallance)
        // >> control panel <<

        // 1. 
        if (changeRemaining === 0) {

            // a) & is money in CID this unit
            if (unitCidBallance > 0) {

                printStatus(0)
                changeInUnits.push([unit[0], changeInUnit])
                let changeInActiveUnits = changeInUnits.filter(arr => arr[1]) 
                return printCashRegister("open", changeInActiveUnits)

            // b) & no money in CID this unit
            } else if (unitCidBallance < 0) {

                printStatus(3)
                change = Math.abs(unitCidBallance)
                unitIndex = unitIndex-1
    
                if (unitIndex < 0) {
                    printStatus(4)
                    return 
                }
    
                calculateChangeInUnits(change, unitIndex)
                return printCashRegister("if", [])
            }

        // 2.
        } else if (changeRemaining !== 0) {

            // a) & not enough money in CID this unit 
            if (unitCidBallance < 0) {

                printStatus(1)
                changeInUnits.push([unit[0], unitCidAmount])
                change = (changeRemaining*100 + Math.abs(unitCidBallance)*100)/100
                unitIndex = unitIndex-1
    
            // b) and there is money in CID this unit
            } else if (unitCidBallance > 0) {

                printStatus(2)
                changeInUnits.push([unit[0], changeInUnit])
                change = changeRemaining;
                unitIndex = unitIndex-1
            }

            calculateChangeInUnits(change, unitIndex)
            let changeInActiveUnits = changeInUnits.filter(arr => arr[1])
            return printCashRegister("open",changeInActiveUnits)
        }
    }


  //-------------------------------------------
  // let it bang
  //-------------------------------------------


    if (cidSUM === change) {
        return printCashRegister("closed", cid)

    } else if (cidSUM > 0) {
        return calculateChangeInUnits(change, closestUnitIndex())

    } else if (cidSUM < 0) {
        return printCashRegister("if", [])
    }
}

let x = checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])

console.log(x)