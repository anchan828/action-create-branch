import { Context } from "@actions/github/lib/context";
import { GitHub } from "@actions/github";

export async function createBranch(
  github: any,
  context: Context,
  branch: string,
  from?: string
) {
  const toolkit: GitHub = new github(githubToken());
  // Sometimes branch might come in with refs/heads already
  branch = branch.replace("refs/heads/", "");
  let sha = context.sha;
  if (from) {
    from = from.replace("refs/heads/", "");
    const fromBranch = await toolkit.repos.getBranch({
      ...context.repo,
      branch: from,
    });
    sha = fromBranch.data.commit.sha;
  }

  // throws HttpError if branch already exists.
  try {
    await toolkit.repos.getBranch({
      ...context.repo,
      branch,
    });

  } catch (error) {
    if (error.name === "HttpError" && error.status === 404) {
      await toolkit.git.createRef({
        ref: `refs/heads/${branch}`,
        sha,
        ...context.repo,
      });
    } else {
      throw Error(error);
    }
  }
}

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token)
    throw ReferenceError("No token defined in the environment variables");
  return token;
}
