# AI CodeMorph (Gemini-powered)

A Visual Studio Code extension that allows you to update files using AI prompts powered by Google's Gemini API.

<img width="1721" height="994" alt="SCR-20250905-tsoi" src="https://github.com/user-attachments/assets/5c6d21a9-65aa-4cb8-b0f1-0836d3e9a7b0" />
<img width="1171" height="726" alt="SCR-20250905-ttda" src="https://github.com/user-attachments/assets/97cbcd95-2e81-4446-8be7-60fefaf365d4" />
<img width="1150" height="1001" alt="SCR-20250905-tuku" src="https://github.com/user-attachments/assets/6edc3034-dae5-4880-9900-6df9e27eb29b" />
<img width="1725" height="976" alt="SCR-20250905-tvdh" src="https://github.com/user-attachments/assets/5ac1adf0-cf36-4e50-8be4-e78667b77e87" />


## Features

- **Right-click Integration**: Right-click on any file in the Explorer or within the editor to update it with AI.
- **Multiple AI Models**: Choose from the latest available Gemini models.
- **Streamlined Workflow**: Uses a configured default prompt without interrupting your flow.
- **Configurable Settings**: Easily set up your API key, models, and default prompt.
- **Auto-save**: Automatically save files after AI updates (configurable).
- **Progress Tracking**: Visual feedback during AI processing.

## Setup

1.  **Get a Gemini API Key**
    - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Click "Create API key" and copy the key.

2.  **Configure the Extension**
      - In VS Code, open Settings (`Ctrl+,` or `Cmd+,`).
      - Search for "AI CodeMorph".
      - Paste your key into the **Api Key** field.

## Usage

### Method 1: Right-click in Explorer

1.  Right-click on any file in the Explorer panel.
2.  Select "AI CodeMorph: Update Current File".

### Method 2: Right-click in Editor

1.  Open a file in the editor and right-click anywhere inside it.
2.  Select "AI CodeMorph: Update Current File".

### Method 3: Command Palette

1.  Open the file you want to update.
2.  Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac).
3.  Type "AI CodeMorph: Update Current File" and press Enter.

## Configuration Options

### General Settings

- **Setting**: `aicodemorph.defaultPrompt`
    - **Description**: The default instruction to give the AI. Renders as a multiline text box for easier editing.
    - **Default**: "Improve and optimize this code while maintaining its functionality. Add comments where necessary and follow best practices."

- **Setting**: `aicodemorph.autoSave`
    - **Description**: Automatically save the file after the AI update.
    - **Default**: `true`.

- **Setting**: `aicodemorph.apiKey`
    - **Description**: Your API key from Google AI Studio.

- **Setting**: `aicodemorph.ai.model`
    - **Type**: String (dropdown)
    - **Description**: The Gemini model to use.
    - **Default**: `gemini-2.0-flash`.
    - **Options**:
      - `gemini-2.0-flash`: Latest multimodal model with improved performance (recommended)
      - `gemini-2.5-pro`: Latest pro model with enhanced reasoning and thinking capabilities
      - `gemini-2.5-flash`: Updated fast model with improved capabilities
      - `gemini-1.5-pro`: Previous generation pro model (limited availability for new projects)
      - `gemini-1.5-flash`: Previous generation fast model (limited availability for new projects)

## Requirements

- Visual Studio Code 1.90.0 or higher.
- Internet connection.
- A valid Gemini API key.

## Known Issues

- Large files may take longer to process.
- API rate limits may apply based on your Google AI.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License.
