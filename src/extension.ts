import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function activate(context: vscode.ExtensionContext) {
  console.log("AI CodeMorph extension is now active!");

  // Register the update file command
  let updateFileCommand = vscode.commands.registerCommand(
    "aicodemorph.updateFile",
    async (uri?: vscode.Uri) => {
      await updateFileWithAI(uri);
    }
  );

  // Register the configure command
  let configureCommand = vscode.commands.registerCommand("aicodemorph.configure", async () => {
    await openConfiguration();
  });

  context.subscriptions.push(updateFileCommand, configureCommand);
}

async function updateFileWithAI(uri?: vscode.Uri) {
  try {
    // Get the target file
    let targetUri: vscode.Uri;

    if (uri) {
      // Called from context menu
      targetUri = uri;
    } else {
      // Called from command palette or editor context
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active file to update");
        return;
      }
      targetUri = activeEditor.document.uri;
    }

    const config = vscode.workspace.getConfiguration("aicodemorph");

    // Configuration Check
    const apiKey = config.get<string>("apiKey");

    if (!apiKey) {
      const action = await vscode.window.showErrorMessage(
        "Gemini API key not configured. Please set up your API key.",
        "Configure Now"
      );

      if (action === "Configure Now") {
        await openConfiguration();
      }

      return;
    }

    // Read the file content
    const document = await vscode.workspace.openTextDocument(targetUri);
    const fileContent = document.getText();

    if (!fileContent.trim()) {
      vscode.window.showWarningMessage("File is empty. Nothing to update.");
      return;
    }

    // Get the prompt from configuration
    const prompt =
      config.get<string>("defaultPrompt") ||
      "Improve and optimize this code while maintaining its functionality. Add comments where necessary and follow best practices.";

    // Show progress
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "AI CodeMorph",
        cancellable: true,
      },
      async (progress, token) => {
        try {
          // Create the full prompt
          const fullPrompt = `${prompt}\n\nFile content:\n\`\`\`\n${fileContent}\n\`\`\`\n\nPlease provide only the updated file content without any additional explanation or markdown formatting.`;

          progress.report({ increment: 0, message: "Connecting to Gemini API..." });

          const updatedContent = await generateWithGemini(config, fullPrompt, progress);

          if (token.isCancellationRequested) {
            vscode.window.showInformationMessage("AI update cancelled.");
            return;
          }

          progress.report({ increment: 60, message: "Processing AI response..." });

          // Clean up the response - remove markdown code blocks if present
          const cleanedContent = cleanAIResponse(updatedContent);

          if (!cleanedContent.trim()) {
            throw new Error("AI returned empty content");
          }

          progress.report({ increment: 80, message: "Updating file..." });

          // Apply the changes
          const edit = new vscode.WorkspaceEdit();
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(fileContent.length)
          );

          edit.replace(targetUri, fullRange, cleanedContent);
          await vscode.workspace.applyEdit(edit);

          progress.report({ increment: 90, message: "Saving file..." });

          // Auto-save if configured
          if (config.get<boolean>("autoSave")) {
            await document.save();
          }

          progress.report({ increment: 100, message: "Complete!" });

          vscode.window.showInformationMessage("File updated successfully!");
        } catch (error) {
          // Check for cancellation here if the error might be due to the process being terminated
          // by cancellation (e.g., if AbortController was used)
          if (token.isCancellationRequested) {
            vscode.window.showInformationMessage("AI update was cancelled.");
            return;
          }

          console.error("Error updating file with Gemini:", error);
          vscode.window.showErrorMessage(
            `Failed to update file: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
    );
  } catch (error) {
    console.error("Error in updateFileWithAI:", error);
    vscode.window.showErrorMessage(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Generates content using the Google Generative AI (Gemini) API.
 */
async function generateWithGemini(
  config: vscode.WorkspaceConfiguration,
  prompt: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<string> {
  const apiKey = config.get<string>("apiKey")!;
  const modelName = config.get<string>("ai.model") || "gemini-2.0-flash";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  progress.report({ increment: 30, message: "Generating content using Gemini..." });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

function cleanAIResponse(response: string): string {
  // Remove markdown code blocks
  let cleaned = response.replace(/```[\s\S]*?\n([\s\S]*?)\n```/g, "$1");
  cleaned = cleaned.replace(/```([\s\S]*?)```/g, "$1");

  // Remove leading/trailing whitespace but preserve internal formatting
  return cleaned.trim();
}

async function openConfiguration() {
  // Open the settings UI for this extension
  await vscode.commands.executeCommand("workbench.action.openSettings", "aicodemorph");
}

export function deactivate() {
  console.log("AI CodeMorph extension is now deactivated!");
}
