import { showToast, Toast } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { useState } from "react";
import type { CreateIssueParams } from "../api/issues";
import { createIssue } from "../services/issues";

export function useCreateIssueMutation() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (params: CreateIssueParams) => {
    setIsSubmitting(true);
    try {
      await createIssue(params);
      await showToast({ style: Toast.Style.Success, title: "Issue created" });
    } catch (error) {
      await showFailureToast(error, { title: "Failed to create issue" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createIssue: submit, isSubmitting };
}
