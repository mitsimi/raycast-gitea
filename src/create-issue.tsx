import { Action, ActionPanel, Form, Icon, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useMemo, useState } from "react";
import { createIssue, listRepoAssignees, listRepoLabels, listRepoMilestones } from "./api/issues";
import { useUserRepositories } from "./hooks/useUserRepositories";
import type { Label, Milestone, Repository, User } from "./types/api";

export default function Command(props: { initialRepo?: string }) {
  const { items: repositories, isLoading } = useUserRepositories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>(props.initialRepo ?? "");

  const repoOptions = useMemo(
    () =>
      repositories
        .filter((repo): repo is Repository => Boolean(repo.owner?.login && repo.name))
        .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? "")),
    [repositories],
  );

  const { owner, repo } = useMemo(() => parseRepo(selectedRepo), [selectedRepo]);

  const { data: labels } = useCachedPromise(
    async (o?: string, r?: string): Promise<Label[]> => {
      if (!o || !r) return [];
      return listRepoLabels({ owner: o, repo: r });
    },
    [owner, repo] as [string | undefined, string | undefined],
    {
      keepPreviousData: true,
      initialData: [],
    },
  );

  const { data: milestones } = useCachedPromise(
    async (o?: string, r?: string): Promise<Milestone[]> => {
      if (!o || !r) return [];
      return listRepoMilestones({ owner: o, repo: r, state: "open" });
    },
    [owner, repo] as [string | undefined, string | undefined],
    {
      keepPreviousData: true,
      initialData: [],
    },
  );

  const { data: assignees } = useCachedPromise(
    async (o?: string, r?: string): Promise<User[]> => {
      if (!o || !r) return [];
      return listRepoAssignees({ owner: o, repo: r });
    },
    [owner, repo] as [string | undefined, string | undefined],
    {
      keepPreviousData: true,
      initialData: [],
    },
  );

  return (
    <Form
      isLoading={isLoading || isSubmitting}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Issue" onSubmit={(values) => handleSubmit(values, setIsSubmitting)} />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        id="repository"
        title="Repository"
        isLoading={isLoading}
        value={selectedRepo}
        onChange={(value) => setSelectedRepo(value)}
      >
        {repoOptions.map((repo) => (
          <Form.Dropdown.Item
            key={repo.id ?? repo.full_name ?? repo.name ?? "repo"}
            title={repo.full_name ?? repo.name ?? ""}
            icon={{ source: repo.avatar_url || repo.owner?.avatar_url || "" }}
            value={repo.full_name ?? ""}
          />
        ))}
      </Form.Dropdown>
      <Form.TextField id="title" title="Title" placeholder="Issue title" />
      <Form.TextArea id="body" title="Description" placeholder="Describe the issue" />
      <Form.TagPicker
        id="labels"
        title="Labels"
        placeholder={selectedRepo ? "Select labels" : "Select a repository first"}
      >
        {(labels ?? []).map((label) => (
          <Form.TagPicker.Item
            key={label.id ?? label.name ?? "label"}
            value={String(label.id ?? "")}
            title={label.name ?? ""}
            icon={{ source: Icon.Dot, tintColor: label.color }}
          />
        ))}
      </Form.TagPicker>
      <Form.TagPicker
        id="assignees"
        title="Assignees"
        placeholder={selectedRepo ? "Select assignees" : "Select a repository first"}
      >
        {(assignees ?? []).map((user) => (
          <Form.TagPicker.Item
            key={user.login ?? user.id ?? "user"}
            value={user.login ?? ""}
            title={user.login ?? ""}
            icon={{ source: user.avatar_url ?? Icon.Person }}
          />
        ))}
      </Form.TagPicker>
      <Form.Dropdown id="milestone" title="Milestone" placeholder="Select a milestone">
        <Form.Dropdown.Item value="" title="No milestone" />
        {(milestones ?? []).map((milestone) => (
          <Form.Dropdown.Item
            key={milestone.id ?? milestone.title ?? "milestone"}
            value={String(milestone.id ?? "")}
            title={milestone.title ?? ""}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

type FormValues = {
  repository: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
  milestone?: string;
  dueDate?: string;
};

function parseRepo(fullName?: string) {
  if (!fullName) return { owner: undefined, repo: undefined };
  const [owner, repo] = fullName.split("/");
  return { owner, repo };
}

async function handleSubmit(values: Form.Values, setIsSubmitting: (v: boolean) => void) {
  const formValues = values as unknown as FormValues;
  if (!formValues.repository || !formValues.title?.trim()) {
    await showToast({ style: Toast.Style.Failure, title: "Repository and title are required" });
    return;
  }

  const { owner, repo } = parseRepo(formValues.repository);
  if (!owner || !repo) {
    await showToast({ style: Toast.Style.Failure, title: "Invalid repository selection" });
    return;
  }

  setIsSubmitting(true);
  try {
    const labels = (formValues.labels ?? []).map((v) => parseInt(v, 10)).filter((v) => Number.isFinite(v));
    const assignees = (formValues.assignees ?? []).map((v) => v.trim()).filter(Boolean);
    const milestone = formValues.milestone ? parseInt(formValues.milestone, 10) : undefined;
    const due_date = formValues.dueDate ? new Date(formValues.dueDate).toISOString() : undefined;

    await createIssue({
      owner,
      repo,
      title: formValues.title.trim(),
      body: formValues.body?.trim() || undefined,
      labels: labels.length > 0 ? labels : undefined,
      milestone: Number.isFinite(milestone) ? milestone : undefined,
      assignees: assignees.length > 0 ? assignees : undefined,
      due_date,
    });

    await showToast({ style: Toast.Style.Success, title: "Issue created" });
  } catch (error) {
    await showToast({ style: Toast.Style.Failure, title: "Failed to create issue", message: String(error) });
  } finally {
    setIsSubmitting(false);
  }
}
