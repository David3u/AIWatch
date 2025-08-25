import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import requests

app = Flask(__name__)
CORS(app)

SAPLING_API_KEY = os.getenv('SAPLING_API_KEY')
SAPLING_API_URL = "https://api.sapling.ai/api/v1/aidetect"


@app.route('/analyze', methods=['POST'])
def analyze_transcript():
    """
    Analyzes a YouTube video transcript for AI-generated content.
    Expects a JSON payload with a 'video_id' key.
    """
    data = request.get_json()
    if not data or 'video_id' not in data:
        return jsonify({"error": "Missing video_id"}), 400

    video_id = data['video_id']

    try:
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id)
        transcript_text = ""
        for snippet in fetched_transcript[:300]:
            transcript_text += snippet.text + " "

        if not transcript_text:
            return jsonify({"error": "Empty transcript"}), 404

        payload = {
            "key": SAPLING_API_KEY,
            "text": transcript_text
        }
        
        response = requests.post(SAPLING_API_URL, json=payload)

        if response.status_code == 401:
            return jsonify({"error": "Invalid API key for Sapling AI service"}), 401
        elif response.status_code == 403:
            return jsonify({"error": "API key quota exceeded or access denied"}), 403

        response.raise_for_status()

        analysis_result = response.json()
        ai_score = analysis_result.get("score", 0)

        return jsonify({"ai_score": ai_score, "transcript_found": True})

    except requests.exceptions.RequestException as e:
        print(f"API request error: {e}")
        return jsonify({"error": f"API service error: {str(e)}", "transcript_found": False}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e), "transcript_found": False}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)