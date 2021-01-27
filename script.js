window.saveDataAcrossSessions = true

const LOOK_DELAY = 1000 // 1 second
const LEFT_CUTOFF = window.innerWidth / 4
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4
var imgNum = 0
var currentImgNum = imgNum
var minImg = 1
var maxImg = 4
var currentDirection = null

let startLookTime = Number.POSITIVE_INFINITY
let lookDirection = null
let imageElement = getNewImage()
let nextImageElement = null

webgazer.setGazeListener((data, timestamp) => {
    if (data == null || lookDirection === "STOP") return

    if (
      data.x < LEFT_CUTOFF &&
      lookDirection !== "LEFT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp
      lookDirection = "LEFT"
    } else if (
      data.x > RIGHT_CUTOFF &&
      lookDirection !== "RIGHT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp
      lookDirection = "RIGHT"
    } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = null
    }

    if (startLookTime + LOOK_DELAY < timestamp) {
        if (lookDirection === "LEFT" && currentImgNum > minImg) {
          imageElement.classList.add("right")
        } else if (lookDirection === "RIGHT" && currentImgNum < maxImg) {
          imageElement.classList.add("left")
        }   

      currentDirection = lookDirection
      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = "STOP"
      setTimeout(() => {
        imageElement.remove()
        imageElement = getNewImage()
        lookDirection = "RESET"
      }, 200)
    }
  })
  .begin()
  
webgazer.showVideoPreview(false).showPredictionPoints(false)

function getNewImage(next = false) {
  if (currentDirection == "RIGHT" && imgNum != maxImg)
    imgNum++
  else if (currentDirection == "LEFT" && imgNum != minImg)
    imgNum--  
      
  if (imgNum == 0)
    imgNum++

  currentImgNum = imgNum
  //alert(lookDirection)
  const img = document.createElement("img")
  //img.src = "http://pitisuda.com/wp-content/uploads/2021/01/m3-" + numbers + ".jpg"
  img.src = "Img/m3-" + currentImgNum + ".jpg"
  console.log("lookDirection: " + currentDirection + ", " + img.src);
  if (next) img.classList.add("next")
  document.body.append(img)  
  return img
}
