// 1) go to /dashboard/order and select a file (front/back/etc)
// 2) make sure to upload a design so the script can evaluate the printarea
// 3) paste this file in the console and run getMockupConfigForFile()
// 4) paste result into mockups.json > id > files > file
// 5) repeat for desired files
function getMockupConfigForFile() {
  const result = {
    ...getMockupPlacement(),
    assets: getMockupAssets(),
  }
  window.prompt("cmd+c", JSON.stringify(result))
}

// 1) go to /dashboard/order and select a file (front/back/etc)
// 2) paste this file in the console and run getMockupImagesCommand()
// 3) cd into this folder and paste the result into terminal
function getMockupImagesCommand() {
  const urls = Object.values(getMockupAssets()).reduce((urls, assets) => {
    const { image, background_image } = assets
    const background = background_image.replace(/(url\(|\)|")/g, "")
    if (image && urls.indexOf(image) < 0) urls.push(image)
    if (background && urls.indexOf(background)) urls.push(background)
    return urls
  }, [])
  const result = "curl -O " + urls.join(" ")
  window.prompt("cmd+c", result)
}

function getMockupPlacement() {
  var mockuparea = document.querySelector(".mockup-area")
  var printarea = document.querySelector(".print-area")
  return {
    width: parseFloat(mockuparea.style.width),
    height: parseFloat(mockuparea.style.height),
    printarea: {
      top: parseFloat(printarea.style.top),
      left: parseFloat(printarea.style.left),
      width: parseFloat(printarea.style.width),
      height: parseFloat(printarea.style.height),
    },
  }
}

function getMockupAssets() {
  var swatches = document.querySelectorAll(".swatches__item")
  return [...swatches].reduce((mockups, swatch) => {
    swatch.dispatchEvent(new Event("click"))
    var img = document.querySelector(".main-mockup-area img")
    var title = swatch.getAttribute("data-original-title")
    return {
      ...mockups,
      [title]: {
        image: img.src,
        background_color: img.style.backgroundColor,
        background_image: img.style.backgroundImage,
      },
    }
  }, {})
}
