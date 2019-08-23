# How to

Make sure you have a video media device (e.g. webcam)

1. Fill in credentials in `js/config.js` file.
2. Serve the files from the root directory
3. Run one tab with `127.0.0.1/?publsher`
4. Run another tab with `127.0.0.1`

Clicking the `toggle` button on the publisher page will enable/disable the low-res simulcast layer
Clicking the `toggle` button on the subscriber page will toggle between subscribing to low-res/hi-res stream


# Problems

1. When the subscriber is requesting the low-res stream, and the publisher disables this layer, the video stops.
This is understandable, but the SFU should preferably switch to the hi-res layer.

2. When the low-res layer is disabled, new subscribers fail.

This is likely because the Tokbox Mantis SFU cannot deal with layers getting disabled.