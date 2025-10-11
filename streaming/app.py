# this file is vibe coded.
from flask import Flask, Response
import threading
import time
import requests
import base64
import paho.mqtt.client as mqtt
import os 
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)

source_mjpeg_url = os.getenv("HTTP_SOURCE")
api_url = os.getenv("API_URL")
camera_uuid = os.getenv("CAMERA_ID")
mqtt_server = os.getenv("MQTT_SERVER")
mqtt_port = int(os.getenv("MQTT_PORT", 1883))

print(f"Using MJPEG source: {source_mjpeg_url}")
print(f"Using API URL: {api_url}")
print(f"Using Camera ID: {camera_uuid}")
print(f"Using MQTT server: {mqtt_server}:{mqtt_port}")


if isinstance(mqtt_port, int):
    print("MQTT port is an integer.")
else:
    print("MQTT port is not an integer.")


frame = None
lock = threading.Lock()
frame_available = threading.Condition(lock)

def mjpeg_capture():
    global frame
    backoff = 1.0
    while True:
        try:
            buffer = b""
            print("Connecting to MJPEG source...")
            # long timeout for streaming; allow requests to stream indefinitely
            response = requests.get(source_mjpeg_url, stream=True, timeout=(5, None))
            if response.status_code != 200:
                print(f"MJPEG source returned status {response.status_code}")
                response.close()
                #time.sleep(backoff)
                backoff = min(backoff * 2, 30)
                continue

            # reset backoff on successful connection
            backoff = 1.0

            for chunk in response.iter_content(chunk_size=4096):
                if not chunk:
                    # keep reading
                    continue
                buffer += chunk

                # Extract all complete JPEGs from buffer
                while True:
                    start = buffer.find(b"\xff\xd8")
                    end = buffer.find(b"\xff\xd9", start + 2) if start != -1 else -1
                    if start != -1 and end != -1:
                        jpg = buffer[start:end + 2]
                        buffer = buffer[end + 2:]
                        # set frame and notify any waiting generators
                        with frame_available:
                            frame = jpg
                            frame_available.notify_all()
                    else:
                        # no complete frame available yet
                        # keep at most 1MB of leftover to avoid unbounded growth
                        if len(buffer) > 1024 * 1024:
                            # trim leading bytes until next SOI marker if present
                            soi = buffer.find(b"\xff\xd8")
                            if soi != -1:
                                buffer = buffer[soi:]
                            else:
                                buffer = b""
                        break

        except requests.exceptions.RequestException as e:
            print(f"MJPEG connection error: {e}")
            # backoff before reconnecting, without sleeping the whole program
            # small blocking sleep here is acceptable inside this thread
            #time.sleep(backoff)
            backoff = min(backoff * 2, 30)
        except Exception as e:
            print(f"MJPEG capture unexpected error: {e}")
            #time.sleep(backoff)
            backoff = min(backoff * 2, 30)

def post_frame_to_api(b64str):
    try:
        payload = {"deviceid": camera_uuid, "image": [b64str]}
        resp = requests.post(f"{api_url}/api/uploadImage", json=payload, timeout=2)
        print("API response:", resp.status_code)
    except Exception as e:
        print("API error:", str(e))

def on_mqtt_message(client, userdata, msg):
    val = msg.payload.decode()
    print("MQTT message received:", val)
    if val == "1":
        with lock:
            if frame is not None:
                b64img = base64.b64encode(frame).decode("utf-8")
                post_frame_to_api(b64img)
                print("MQTT trigger captured and uploaded one frame")
            else:
                print("No frame available at MQTT trigger time")

def on_mqtt_disconnect(client, userdata, rc):
    print(f"MQTT disconnected (rc={rc}), retrying soon...")
    # DO NOT sleep here—handled in the outer thread loop.

def mqtt_sub_thread():
    topic = f"camera_{camera_uuid}_capture"
    while True:
        try:
            print("Connecting to MQTT broker...")
            client = mqtt.Client()
            client.on_message = on_mqtt_message
            client.on_disconnect = on_mqtt_disconnect
            client.connect(mqtt_server, mqtt_port, 60)
            client.subscribe(topic)
            client.publish(f"camera_{camera_uuid}/receiver_status", "online")
            client.loop_forever()
        except Exception as e:
            print("MQTT thread error:", e)
            # small sleep on failure to avoid tight error loop inside this thread
            time.sleep(2)

def generate_frames():
    global frame
    while True:
        # Wait for a frame to be available. This avoids polling/sleeps.
        with frame_available:
            if frame is None:
                frame_available.wait()
            local_frame = frame
        if local_frame is None:
            # Spurious wake or shutdown; continue waiting
            continue
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + local_frame + b"\r\n")

@app.route("/")
def video_feed():
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

def autocleanup(interval=300):
    """
    Periodically clears the global frame if it's older than a set duration
    and cleans up any other potential lingering resources.
    """
    global frame
    last_cleanup = time.time()
    frame_age_limit = 60  # seconds, e.g., 10 minutes

    # Keep track of when the frame was last updated
    last_frame_time = [time.time()]  # Use a mutable container for threaded update

    def frame_update_listener():
        while True:
            with frame_available:
                frame_available.wait()
                last_frame_time[0] = time.time()
    # Start a thread just to monitor frame updates
    threading.Thread(target=frame_update_listener, daemon=True).start()

    while True:
        with lock:
            # Check if frame is old, and clean if so
            frame_stale = time.time() - last_frame_time[0] > frame_age_limit
            if frame is not None and frame_stale:
                print("Autocleanup: clearing stale frame from memory.")
                frame = None
        # Additional cleanup can be added here if needed
        #time.sleep(interval)

if __name__ == '__main__':
    threading.Thread(target=mjpeg_capture, daemon=True).start()
    threading.Thread(target=mqtt_sub_thread, daemon=True).start()
    threading.Thread(target=autocleanup, daemon=True).start()
    # run Flask in threaded mode to allow multiple clients
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
