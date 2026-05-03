import requests

# Test the API
response = requests.post(
    'http://localhost:8001/api/chat',
    json={
        'message': 'Hello, can you help me with financial planning?',
        'session_id': 'test123',
        'user_id': 'user123',
        'model_name': 'llama-3.3-70b-versatile'
    }
)

print("Status Code:", response.status_code)
print("Response:", response.json())