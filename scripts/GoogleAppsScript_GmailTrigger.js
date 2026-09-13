/**
 * BIT Daily Placement Sync - Google Apps Script (Gmail Webhook Trigger)
 * 
 * Automatically watches for incoming emails from "dailynews@bitsathy.ac.in",
 * and triggers the GitHub Actions CI/CD workflow to update placement details in real-time.
 * 
 * Instructions for Setup:
 * 1. Open https://script.google.com/ in your browser (logged into your college Google account).
 * 2. Click "New Project" and name it "BIT Daily Placement Sync Trigger".
 * 3. Paste this code into Code.gs.
 * 4. Replace YOUR_GITHUB_PERSONAL_ACCESS_TOKEN with your GitHub Personal Access Token (or add it in Project Settings -> Script Properties).
 * 5. Set up a Time-driven Trigger:
 *    - Click the clock icon (Triggers) on the left sidebar.
 *    - Click "Add Trigger".
 *    - Function: "checkDailyNewsEmail".
 *    - Event Source: "Time-driven".
 *    - Type: "Minutes timer" -> "Every 5 minutes" (or "Every 10 minutes").
 */

const GITHUB_REPO_OWNER = 'dharineeshv';
const GITHUB_REPO_NAME = 'RewardsPointsSite_BIT';
const WORKFLOW_ID = 'daily_placement_sync.yml';

// Store your GitHub Personal Access Token in Script Properties for security:
// (Project Settings -> Script Properties -> Add 'GITHUB_TOKEN')
// Or paste it directly in the fallback below:
const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN') || 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';

function checkDailyNewsEmail() {
  // Search for recent unread emails from dailynews@bitsathy.ac.in
  const query = 'from:dailynews@bitsathy.ac.in is:unread';
  const threads = GmailApp.search(query, 0, 5);

  if (threads.length === 0) {
    Logger.log('No new unread emails from dailynews@bitsathy.ac.in.');
    return;
  }

  Logger.log(`Found ${threads.length} new email thread(s) from dailynews@bitsathy.ac.in!`);

  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    const messages = thread.getMessages();
    const latestMessage = messages[messages.length - 1];

    const subject = latestMessage.getSubject();
    const date = latestMessage.getDate();

    Logger.log(`Processing email: "${subject}" received at ${date}`);

    // Trigger GitHub Actions workflow
    const success = triggerGitHubPlacementSync();

    if (success) {
      // Mark as read so we don't trigger multiple times for the same email
      thread.markRead();
      Logger.log('Successfully dispatched GitHub Action and marked email as read.');
    }
  }
}

/**
 * Sends a dispatch request to GitHub API to run the sync workflow immediately
 */
function triggerGitHubPlacementSync() {
  const url = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`;

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'Google-Apps-Script-BIT-Placement-Sync'
    },
    payload: JSON.stringify({
      ref: 'main'
    }),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode === 204) {
      Logger.log('✅ GitHub Workflow dispatched successfully (Status: 204 No Content).');
      return true;
    } else {
      Logger.log(`⚠️ GitHub API responded with status ${responseCode}: ${response.getContentText()}`);
      return false;
    }
  } catch (error) {
    Logger.log(`❌ Error calling GitHub API: ${error.toString()}`);
    return false;
  }
}
