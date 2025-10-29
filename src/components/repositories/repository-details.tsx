import { Icon, List } from "@raycast/api";
import dayjs from "dayjs";
import GitHubColors from "../../utils/colors";
import { Repository } from "../../types/repository";

export default function RepositoryDetails(props: { repo: Repository }) {
  const repo = props.repo;

  const ownerName = repo.owner?.username || repo.owner?.login || "Unknown";
  const languageColor = GitHubColors.get(repo.language, true)?.color;
  const created = safeFormatDate(repo.created_at);
  const updated = safeFormatDate(repo.updated_at);
  const description = repo.description || "No description provided.";

  return (
    <List.Item.Detail
      key={repo.id}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Name" text={repo.full_name} />
          <List.Item.Detail.Metadata.Label title="Description" text={description} />

          <List.Item.Detail.Metadata.Separator />

          <List.Item.Detail.Metadata.Label title="Owner" text={ownerName} icon={repo.owner?.avatar_url} />

          {repo.language ? (
            <List.Item.Detail.Metadata.TagList title="Language">
              <List.Item.Detail.Metadata.TagList.Item text={repo.language} color={languageColor} />
            </List.Item.Detail.Metadata.TagList>
          ) : null}

          <List.Item.Detail.Metadata.Label title="Stars" icon={Icon.Star} text={`${repo.stars_count}`} />
          <List.Item.Detail.Metadata.Label title="Forks" text={`${repo.forks_count}`} />

          <List.Item.Detail.Metadata.Separator />

          <List.Item.Detail.Metadata.Label title="Created" icon={Icon.Calendar} text={created} />
          <List.Item.Detail.Metadata.Label title="Updated" icon={Icon.Calendar} text={updated} />
        </List.Item.Detail.Metadata>
      }
    />
  );
}

function safeFormatDate(input?: string): string {
  if (!input) return "-";
  const d = dayjs(input);
  return d.isValid() ? d.format("DD.MM.YYYY") : "-";
}
