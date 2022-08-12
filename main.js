

function checkCashRegister(price, cash, cid) {

  //-------------------------------------------
  // variables
  //-------------------------------------------
  
    let change = cash-price;
    let changePlus = 0
    let changeInUnits = []
    let ci= 0;

  
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
  

  
  //-------------------------------------------
  // functions declaration
  //-------------------------------------------
  


    // [for calculateChange] 
    // ---> give closest "currency unit" 
    function closestUnit () {
      
      if (change===0) {

      let oneBigger = changeTable.find( cur => change <= cur[1])

      let cidIndex = changeTable.indexOf(oneBigger)-1
      let cidUnit  = cid[cidIndex][0]
      let cidAmount  = cid[cidIndex][1]
  
      return [cidIndex, cidUnit, cidAmount]
    }
  


  
    // ---> calculate change
    function calculateChangeInUnits(ch, chPlus){


      // 1. check the maxium amount of current units, used for payout of change.

      
      // cid unit 
      ci = closestUnit()[0]
      let unit = changeTable[ci]
      console.log(ci)
  
      // change
      let changeBase = parseInt((ch+chPlus)/unit[1])*unit[1]
      let changeRemains = ((ch*1000 + chPlus*1000) - changeBase*1000)/1000
  
  

      // 2. check how many units are they in CID
  
      let changeToNext = closestUnit()[2] - changeBase
  


      console.log("")
      console.log("--> current CID <--")
      console.log("-----------------")
      console.log(" ch  = "+ch)
      console.log(" ch+ = "+chPlus)
      console.log("-----------------")
      console.log("unit  = "+unit)
      console.log("CID   = "+closestUnit()[2])
      console.log("base  = "+changeBase)
      console.log("--")
      console.log("ch+   = "+changeToNext)
      console.log("ch    = "+changeRemains)
  


      // a) there is no rest

      if (changeRemains === 0) {

        // ...and there is more in CID = no change 

        if (changeToNext >= 0) {
          changeInUnits.push([unit[0], changeBase])
          console.log("---------------------------")
          console.log("->> out: "+changeInUnits)
  
          if (ci === 0) {
            return changeInUnits
          }

          // ...and there is not enough in CID. so the change is what was missing in the units - this needs to be paid from lower units

        } else if (changeToNext < 0) {
          changeInUnits.push([unit[0], changeBase])
          change = changeRemains;
          closestUnit()

          console.log ("") 
          console.log ("") 
          console.log ("[NEXT]")
          console.log ("")  
          
          calculateChangeInUnits(0, Math.abs(changeToNext))
  
        }

        
  
      // b) cid got less then needed, change needs to be paid from lower units

      } else if (changeToNext < 0 ){
        changeInUnits.push([unit[0], closestUnit()[2]])
        change = changeRemains;
        closestUnit()

  
        console.log ("") 
        console.log ("") 
        console.log ("[NEXT]")
        console.log ("")      

        if (ci === 0) {
          return changeInUnits
        }
  
        calculateChangeInUnits(change, (changePlus+Math.abs(changeToNext)))

      // c) cid got more than needed, 

      } else if (changeToNext > 0 ) {
        changeInUnits.push([unit[0], changeBase])
        change = changeRemains;
        closestUnit()


        console.log ("") 
        console.log ("") 
        console.log ("[NEXT]")
        console.log ("")

        if (ci === 0) {
          return changeInUnits
        }

        calculateChangeInUnits(change, 0)
      }
    }
  
  
  
  
  
  //-------------------------------------------
  // let it bang
  //-------------------------------------------
  
  // ---> check the CID

  calculateChangeInUnits(change, changePlus)

  let cidSUM = cid.reduce( (total, current) => total + current[1]*100, 0)

  // if (cidSUM < cash) {
  //   return  {status: "INSUFFICIENT_FUNDS", change: []}
  // }

  // } else if (cidSUM === cash) {
  //   console.log(calculateChangeInUnits(change, changePlus))
  //   calculateChangeInUnits(change, changePlus)
  //   return {status: "CLOSED", change: changeInUnits}

  // } else if (cidSUM > 0) {
  //   console.log(calculateChangeInUnits(change, changePlus))
  //   calculateChangeInUnits(change, changePlus)
  //   return {status: "OPEN", change: changeInUnits}
  // }

 


  // console.log(calculateChangeInUnits(change, changePlus))
  
  }

  checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])