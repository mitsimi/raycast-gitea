export interface Notification {
  id: string;
  repository: Repository;
  subject: NotificationSubject;
  url: string;
}

export interface NotificationSubject {
  title: string;
  html_url: string;
  type: string;
  state: string;
  tabNum: string;
}
