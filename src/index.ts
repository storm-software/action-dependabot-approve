/* -------------------------------------------------------------------

    🗲 Storm Software - Action Dependabot Approve

 This code was released as part of the Action Dependabot Approve project. Action Dependabot Approve
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/action-dependabot-approve.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/action-dependabot-approve
 Documentation:            https://docs.stormsoftware.com
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/* eslint-disable no-console */

import * as core from "@actions/core";
import * as github from "@actions/github";

const githubToken = process.env.STORM_BOT_GITHUB_TOKEN;
if (!githubToken) {
  core.setFailed("Please add the STORM_BOT_GITHUB_TOKEN to this action");
  process.exit(1);
}

const pullNumber = github.context.payload.pull_request?.number;

if (pullNumber === undefined) {
  core.setFailed("This action must only be run on pull_request events");
  process.exit(1);
}

const octokit = github.getOctokit(githubToken) as any;
const approvedString = "true"; // core.getInput("approve", { required: true });
const approved =
  approvedString === "true"
    ? true
    : approvedString === "false"
      ? false
      : (() => {
          core.setFailed(
            `The "approve" argument must be either "true" or "false" but was ${JSON.stringify(
              approvedString
            )}`
          );
          process.exit(1);
        })();

async function getLastReviewFromActionsBot() {
  // eslint-disable-next-line ts/no-unsafe-call
  const reviews = await octokit.pulls.listReviews({
    ...github.context.repo,
    pull_number: pullNumber,
    per_page: 100
  });
  for (const review of [...reviews.data].reverse()) {
    if (
      review.user?.login === "github-actions[bot]" ||
      review.user?.login === "stormie-bot"
    ) {
      return review;
    }
  }
}

(async () => {
  const lastReviewFromActionsBot = await getLastReviewFromActionsBot();
  if (approved) {
    if (
      lastReviewFromActionsBot?.state === "DISMISSED" ||
      lastReviewFromActionsBot === undefined
    ) {
      console.log("Approving PR");
      // eslint-disable-next-line ts/no-unsafe-call
      await octokit.pulls.createReview({
        ...github.context.repo,
        event: "APPROVE",
        pull_number: pullNumber
      });
    } else {
      console.log("PR already approved so skipping approval");
    }
  } else if (lastReviewFromActionsBot?.state === "APPROVED") {
    console.log(
      "approved is false and the action has approved this PR so dismissing review."
    );
    // eslint-disable-next-line ts/no-unsafe-call
    await octokit.pulls.dismissReview({
      ...github.context.repo,
      pull_number: pullNumber,
      message:
        "The condition that caused this PR to be approved automatically changed to false, a person must approve this now.",
      review_id: lastReviewFromActionsBot.id
    });
  } else {
    console.log(
      "approved is false and the action has not approved this PR so doing nothing."
    );
  }
})().catch(err => {
  console.error(err);
  core.setFailed(err.message);
});
