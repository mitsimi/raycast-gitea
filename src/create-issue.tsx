import { Action, ActionPanel, Form, Icon, showToast, Toast } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useMemo, useState } from "react";
import { createIssue, listRepoAssignees, listRepoLabels, listRepoMilestones } from "./api/issues";
import { useUserRepositories } from "./hooks/useUserRepositories";
import type { Label, Milestone, Repository, User } from "./types/api";

function LabelPicker({ labels, selectedRepo }: { labels: Label[]; selectedRepo: boolean }) {
  const [regularLabels, setRegularLabels] = useState<string[]>([]);
  const [exclusiveSelections, setExclusiveSelections] = useState<Record<string, string>>({});

  const grouped = useMemo(() => {
    return labels.reduce(
      (acc, label) => {
        if (label.exclusive) {
          const prefix = label.name?.split("/")[0] || "";
          acc.exclusive[prefix] = [...(acc.exclusive[prefix] || []), label];
        } else {
          acc.regular.push(label);
        }
        return acc;
      },
      { regular: [] as Label[], exclusive: {} as Record<string, Label[]> },
    );
  }, [labels]);

  if (!selectedRepo || labels.length === 0) {
    return null;
  }

  return (
    <>
      {grouped.regular.length > 0 && (
        <Form.TagPicker
          id="labels"
          title="Labels"
          placeholder="Select labels"
          value={regularLabels.filter((id) => grouped.regular.some((l) => l.id === parseInt(id)))}
          onChange={(selected) => setRegularLabels(selected)}
        >
          {grouped.regular.map((label) => (
            <Form.TagPicker.Item
              key={label.id}
              value={String(label.id)}
              title={label.name ?? ""}
              icon={{ source: Icon.Circle, tintColor: label.color }}
            />
          ))}
        </Form.TagPicker>
      )}
      {Object.entries(grouped.exclusive).map(([prefix, exclusiveLabels]) => (
        <Form.Dropdown
          key={prefix}
          id={`label.${prefix}`}
          title={prefix}
          value={exclusiveSelections[prefix] ?? ""}
          onChange={(value) => setExclusiveSelections((prev) => ({ ...prev, [prefix]: value }))}
        >
          <Form.Dropdown.Item key="none" title="None" value="" />
          {exclusiveLabels.map((label) => (
            <Form.Dropdown.Item
              key={label.id}
              value={String(label.id)}
              title={label.name?.replace(`${prefix}/`, "") ?? label.name ?? ""}
              icon={{ source: Icon.Circle, tintColor: label.color }}
            />
          ))}
        </Form.Dropdown>
      ))}
    </>
  );
}

export default function Command(props: { initialRepo?: Repository }) {
  const { items: repositories, isLoading } = useUserRepositories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>(props.initialRepo?.full_name ?? "");

  const repoOptions = useMemo(() => {
    return repositories
      .filter((repo): repo is Repository => Boolean(repo.owner?.login && repo.name))
      .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));
  }, [repositories]);

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

  const isRepoSelected = Boolean(selectedRepo);

  const initialRepo = props.initialRepo;

  return (
    <Form
      isLoading={isLoading || isSubmitting}
      enableDrafts={true}
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
        placeholder="Select a repository"
      >
        {initialRepo ? (
          <Form.Dropdown.Section>
            <Form.Dropdown.Item
              key={initialRepo.id ?? initialRepo.full_name ?? initialRepo.name ?? "repo"}
              title={initialRepo.full_name ?? initialRepo.name ?? ""}
              icon={{ source: initialRepo.avatar_url || initialRepo.owner?.avatar_url || "" }}
              value={initialRepo.full_name ?? ""}
            />
          </Form.Dropdown.Section>
        ) : null}
        {repoOptions
          .filter((repo) => !(initialRepo && repo.full_name === initialRepo.full_name))
          .map((repo) => (
            <Form.Dropdown.Item
              key={repo.id ?? repo.full_name ?? repo.name ?? "repo"}
              title={repo.full_name ?? repo.name ?? ""}
              icon={{ source: repo.avatar_url || repo.owner?.avatar_url || "" }}
              value={repo.full_name ?? ""}
            />
          ))}
      </Form.Dropdown>
      {isRepoSelected && (
        <>
          <Form.Separator />
          <Form.TextField id="title" title="Title" placeholder="Issue title" />
          <Form.TextArea id="body" title="Description" placeholder="Describe the issue" />
          <LabelPicker labels={labels ?? []} selectedRepo={isRepoSelected} />
          <Form.TagPicker id="assignees" title="Assignees" placeholder="Select assignees">
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
          <Form.DatePicker id="dueDate" title="Due Date" />
        </>
      )}
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
  [key: string]: unknown;
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
    const regularLabels = (formValues.labels ?? []).map((v) => parseInt(v, 10)).filter((v) => Number.isFinite(v));
    const exclusiveLabels = Object.keys(formValues)
      .filter((key) => key.startsWith("label."))
      .map((key) => formValues[key as keyof FormValues])
      .filter((v) => v)
      .map((v) => parseInt(v as string, 10))
      .filter((v) => Number.isFinite(v));
    const labels = [...regularLabels, ...exclusiveLabels];

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
