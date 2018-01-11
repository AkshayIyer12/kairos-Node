const hideDiv = () => {
  let id = document.getElementById('flip-1')
  let videoID = document.getElementById('videoID')
  let faceID = document.getElementById('faceID')
  if (id.value === 'face') {
    videoID.style.display = 'none'
    faceID.style.display = 'block'
  } else {
    faceID.style.display = 'none'
    videoID.style.display = 'block'
  }
}
window.onload = hideDiv()
