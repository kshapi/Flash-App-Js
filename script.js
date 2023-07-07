const btn = document.querySelector('#flash button');


const DEVICES_SUPPORTS = 'mediaDevices' in navigator;

(function () {
  
  if (DEVICES_SUPPORTS) {
    navigator.mediaDevices.enumerateDevices()
    .then( devices => {
      //Get the environment camera
      //CallBack function
      getCameras(devices);
    });
  }else {
    document.querySelector('#flash h2').innerText = 'Some Error';
  }
  
})();


function getCameras (devices) {
  const cameras = devices.filter((device) => device.kind === 'videoinput');
  
  if (devices.length !== 0) {
    const camera = cameras[1];
    //User Media
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: camera.deviceId,
        facingMode: ['user', 'environment'],
          height: { ideal: 1080 },
          width: { ideal: 1920 }
      }
    })
    .then( stream => {
      //Create stream and get video track
      //CallBack
      getVideoTrack(stream);
    });
  };
  
}



function getVideoTrack(stream) {
  const track = stream.getVideoTracks()[0];
  
  //Use imageCapture Object
  const imageCapture = new ImageCapture(track)
  //Get photoCapabilities from image Capture
  const photoCapabilities = imageCapture.getPhotoCapabilities()
  .then(() => {
    //Click Event For On Off btn
    btn.addEventListener('click', () => {
      ontorch(track)
    })
  });
  
}


//flash off by default 
let on = false;

function ontorch (track) {
  //let On Mobile flash
  if (!on) {
    track.applyConstraints({
      //flash On
      advanced: [{ torch: true }]
    });
    on = true;
    btn.innerText = 'ON';
    //btn.style.borderBottom = '3px solid green';
    btn.style.boxShadow = '0px 3px 0px green';
  }else {
    track.applyConstraints({
      //flash Off
      advanced: [{ torch: false }]
    });
    on = false;
    btn.innerText = 'OFF';
    btn.style.boxShadow = null;
  };
  
}

//Kshapii