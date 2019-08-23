/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let apiKey;
let sessionId;
let token;
let session;


function handleError(error) {
  if (error) {
    console.error(error);
  }
}

async function initPublisher() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const track = stream.getVideoTracks()[0];
  // track.contentHint = 'detail';
  console.log('stream', stream);

  // initialize the publisher
  const publisherOptions = {
    _enableSimulcast: true,
    insertMode: 'append',
    width: '100%',
    height: '100%',
    videoSource: track,
    audioSource: false,
  };

  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);
  publisher.on('videoElementCreated', (event) => {
    window.mediaStream = event.element.srcObject;
  });

  console.log('publisher', publisher);
  // Connect to the session
  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
     session.publish(publisher, handleError);
    }
  });


  document.getElementById('toggle').addEventListener('click', async () => {
    // There should be only 1 connected connection, since we send 1 stream to relayed session
    const connection = window.connections.find(c => c.connectionState === 'connected')
    const sender = connection.getSenders().find(sender => sender.track.kind === 'video');

    const params = JSON.parse(JSON.stringify(sender.getParameters()));
    const layer =  params.encodings[0]; // Layers appear to be from low-res to hi-res in encodings array
    // layer.scaleResolutionDownBy = 2;
    layer.active = !layer.active; // Disable lowest-res layer
    console.log(`${layer.active ? 'Enabling' : 'Disabling'} layer`);
    sender.setParameters(params);
  });
  
}

async function initSubscriber() {
  // Subscribe to a newly created stream
  let subscriber;
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
    };
    subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    }
  });

  document.getElementById('toggle').addEventListener('click', () => {
    subscriber._toggleResolution = !subscriber._toggleResolution;
    if (subscriber._toggleResolution) {
      console.log('Requesting low-res stream')
      subscriber.setPreferredResolution({ width: 320, height: 240 })
    } else {
      console.log('Requesting hi-res stream')
      subscriber.setPreferredResolution({ width: 1920, height: 1080 })
    }
  });
}

async function initializeSession() {
  session = OT.initSession(apiKey, sessionId);
  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  const url = new URL(window.location);
  const isPublisher = url.searchParams.has('publisher');

  if (isPublisher) {
    initPublisher();
  } else {
    initSubscriber();
  }
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
}
