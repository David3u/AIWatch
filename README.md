# AIWatch

A browser extension that analyzes YouTube video transcripts to detect AI-generated content.

## Overview

In an era where AI-generated content is becoming increasingly prevalent, it can be difficult to distinguish between human-created and AI-generated videos. AIWatch aims to solve this problem by providing a tool to analyze YouTube video transcripts and estimate the likelihood of them being AI-generated.

## Features

- **Dark Mode:** The extension includes a dark mode for comfortable viewing.
- **Configurable Settings:** Easily toggle dark mode and auto-analysis (wip) from the settings page.

## How It Works

AIWatch works by fetching the transcript of a YouTube video and sending it to a backend server for analysis. The backend uses a natural language processing model to determine the probability of the text being AI-generated. The result is then displayed to the user in the extension's UI.

## Setup & Installation (For Developers)

To get started with AIWatch development, follow these steps:

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up your environment variables:**
    You will need to create a `.env` file in the `backend` directory and add your Sapling API key:
    ```
    SAPLING_API_KEY=your_api_key_here
    ```

4.  **Run the backend server:**
    ```bash
    python app.py
    ```
    The server will start on `http://127.0.0.1:5000`.

### Frontend Setup

1.  **Open Chrome and navigate to `chrome://extensions/`.

2.  **Enable "Developer mode"** using the toggle in the top-right corner.

3.  **Click on "Load unpacked"** and select the `frontend` directory of this project.

4.  The AIWatch extension should now be installed and ready for use.

## Usage

- **Manual Analysis:** Navigate to a YouTube video, click the AIWatch extension icon in your browser's toolbar, and click the "Analyze Video" button.
- **Automatic Analysis:** Open the extension's settings page and enable the "Auto-Analyze on New Video" option. Now, whenever you load a new YouTube video, the analysis will run automatically.
