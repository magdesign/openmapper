from websocket import create_connection

ws = create_connection("ws://localhost:9030")
print("Sending...")

ws.send("{\"videoSrc\": \"assets/dogs_playing_poker.mp4\"}")
print("Receiving...")
result =  ws.recv()
print("Received '%s'" % result)
ws.close()