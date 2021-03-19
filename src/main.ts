import * as core from "@actions/core";
import { GitHub, context } from "@actions/github";
import { createBranch } from "./create-branch";

async function run() {
  try {
    const branch = core.getInput("branch", { required: true });
    const from = core.getInput("from", { required: false });
    core.debug(`Creating branch ${branch}`);
    await createBranch(GitHub, context, branch, from);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
