import { Color, Icon, List } from "@raycast/api";
import NotificationActions from "./notification-actions";
import { getTrailingNumberFromUrl } from "../../utils/string";
import { MutatePromise } from "@raycast/utils";
import { IssueState, NotificationSubjectType, NotificationThread } from "../../types/api";

export default function NotificationMenu(props: {
  items: NotificationThread[];
  revalidate?: () => void;
  mutate?: MutatePromise<NotificationThread[], NotificationThread[]>;
}) {
  return props.items.map((item) => {
    return (
      <List.Item
        key={item.id ?? item.updated_at ?? "notification"}
        icon={getIcon(item)}
        title={item.subject?.title ?? "(no title)"}
        subtitle={item.repository?.full_name ?? ""}
        accessories={[
          ...(item.pinned ? [{ icon: Icon.Tack } as const] : []),
          { text: { value: item.subject?.type ?? "", color: Color.PrimaryText } },
          {
            text: {
              value: "#" + (getTrailingNumberFromUrl(item.subject?.html_url ?? "") ?? ""),
              color: Color.SecondaryText,
            },
          },
          //{ text: `[${item.id}]` },
        ]}
        actions={<NotificationActions item={item} mutate={props.mutate} />}
      />
    );
  });
}

export function getIcon(notification: NotificationThread) {
  const subject = notification.subject;
  if (!subject) return { source: Icon.Dot, tintColor: Color.SecondaryText };

  const subjectType = subject.type?.toLowerCase();
  const subjectState = subject.state?.toLowerCase();

  switch (subjectType) {
    case NotificationSubjectType.Issue:
      switch (subjectState) {
        case IssueState.Open:
          return { source: "issue-open.svg", tintColor: Color.Green };
        case IssueState.Closed:
          return { source: "issue-closed.svg", tintColor: Color.Red };
      }
      break;

    case NotificationSubjectType.Pull:
      switch (subjectState) {
        case IssueState.Open:
          return subject.title?.startsWith("WIP")
            ? { source: "pr-draft.svg", tintColor: Color.SecondaryText }
            : { source: "pr-open.svg", tintColor: Color.Green };
        case IssueState.Closed:
          return { source: "pr-closed.svg", tintColor: Color.Red };
        case IssueState.Merged:
          return { source: "pr-merged.svg", tintColor: Color.Purple };
      }
      break;
  }

  return { source: Icon.Dot, tintColor: Color.SecondaryText };
}
