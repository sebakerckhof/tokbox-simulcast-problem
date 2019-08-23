# How to

This repo contains an enhanced version of the tokbox sample app.
It is enhanced in such a way that you have either a publisher page or a subscriber page.

Furthermore we added a toggle button, which has the following behavior:

* Clicking the `toggle` button on the publisher page will enable/disable the low-res simulcast layer, using the native webRTC `RTCRtpSender.setParameters` api

* Clicking the `toggle` button on the subscriber page will toggle between subscribing to low-res/hi-res stream using tokbox's `Subscriber.setPreferedResolution` api


# Problems

**Problem 1**: When the low-res layer is disabled, new subscribers fail.

To reproduce:
1. Fill in credentials in `js/config.js` file.
2. Serve the files from the root directory on your local host
3. Run one tab as publisher by going to `http://127.0.0.1/?publisher`
4. Run another tab as subscriber by going to `http://127.0.0.1`

At this point the subscriber should receive the video of the publisher, now do:

5. Click the `toggle` button on the publisher page to disable the low-res simulcast layer
6. Open a new subscriber page by going to `http://127.0.0.1`, the subscriber is not able to receive the video.

Further subscribers fail, while the original subscriber still works.

**Problem 2**: When the subscriber is requesting the low-res stream, and the publisher disables this layer, the video stops.

This is understandable, but the SFU should preferably switch to the hi-res layer.

To reproduce:
1. Fill in credentials in `js/config.js` file.
2. Serve the files from the root directory
3. Run one tab as **publisher** by going to `http://127.0.0.1/?publisher`
4. Run another tab as **subscriber** by going to `http://127.0.0.1`

At this point the subscriber should receive the video of the publisher, now do:

5. Click the `toggle` button on the subscriber page to request the low-res layer
6. Click the `toggle` button on the publisher page to disable the low-res layer
7. The incoming video on the subscriber now freezes

Both these issues are likely because the Tokbox Mantis SFU cannot deal with layers getting disabled.