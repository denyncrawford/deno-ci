import { CONFIG } from "../config.ts";
import { GithubData } from "../types.ts";

export async function executeScript(
  scriptPath: string,
  cwd: string,
  githubData: GithubData
): Promise<void> {
  const command = new Deno.Command(scriptPath, {
    cwd,
    stdout: "piped",
    stderr: "piped",
  });

  try {
    const child = command.spawn();
    const stdout = child.stdout; // Correctly access stdout
    const stderr = child.stderr; // Access stderr directly

    // Create text decoders for stdout and stderr
    const decoder = new TextDecoder();

    // Log output from stdout
    for await (const chunk of stdout) {
      const text = decoder.decode(chunk);
      console.log(text);
      if (CONFIG.LOG_SERVER_URL) {
        await logToServer(text, githubData);
      }
    }

    // Log output from stderr
    for await (const chunk of stderr) {
      const errorText = decoder.decode(chunk);
      console.error(errorText); // Log stderr
      if (CONFIG.LOG_SERVER_URL) {
        await logToServer(errorText, githubData);
      }
    }

    const status = await child.status;
    if (!status.success) {
      throw new Error(`Script execution failed with code ${status.code}`);
    }
  } catch (error) {
    console.error("Error executing script:", error);
    throw error;
  }
}

async function logToServer(
  line: string,
  githubData: GithubData
): Promise<void> {
  try {
    const startResponse = await fetch(
      `${CONFIG.LOG_SERVER_URL}/start?logName=${githubData.repository}`
    );
    const { logId } = await startResponse.json();

    await fetch(`${CONFIG.LOG_SERVER_URL}/log/${logId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line }),
    });

    await fetch(`${CONFIG.LOG_SERVER_URL}/end/${logId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: githubData.user,
        github: githubData.url,
      }),
    });
  } catch (error) {
    console.log("No bot running at port 3002");
    console.log("Aborting log report...");
  }
}