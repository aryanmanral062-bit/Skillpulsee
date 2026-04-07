import axios from 'axios';
import { ConnectorError } from '../errors';

export interface JiraIssue {
  issueKey: string;
  summary: string;
  issueType: string;
  status: string;
  priority: string;
  storyPoints: number | null;
  originalEstimateHours: number | null;
  timeSpentHours: number | null;
  labels: string[];
  createdAt: string;
  resolvedAt: string | null;
  assigneeEmail: string;
}

function getApiClient() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!baseUrl || !email || !token) {
    throw new Error('Jira configuration is missing (JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN)');
  }

  // Use Basic auth: base64(email:token)
  const authHash = Buffer.from(`${email}:${token}`).toString('base64');

  return axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Basic ${authHash}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

function handleError(error: any, contextMsg: string): never {
  if (axios.isAxiosError(error)) {
    throw new ConnectorError(
      'jira',
      error.response?.status,
      `${contextMsg}: ${error.message}`
    );
  }
  throw new ConnectorError('jira', 500, error instanceof Error ? error.message : 'Unknown error');
}

export async function fetchUserIssues(email: string, days: number): Promise<JiraIssue[]> {
  const apiClient = getApiClient();
  let startAt = 0;
  const maxResults = 50;
  const allIssues: JiraIssue[] = [];

  // Construct JQL
  const jql = `assignee = "${email}" AND updated >= "-${days}d" ORDER BY updated DESC`;

  const fields = [
    'summary',
    'issuetype',
    'status',
    'priority',
    'customfield_10016', // story_points
    'timeoriginalestimate',
    'timespent',
    'labels',
    'created',
    'resolutiondate'
  ];

  try {
    while (true) {
      const response = await apiClient.post('/rest/api/3/search', {
        jql,
        startAt,
        maxResults,
        fields
      });

      const data = response.data;
      if (!data.issues || data.issues.length === 0) {
        break;
      }

      for (const issue of data.issues) {
        const issueFields = issue.fields || {};
        
        // Jira returns time original estimate and time spent in seconds
        const origEstimateHours = issueFields.timeoriginalestimate 
          ? issueFields.timeoriginalestimate / 3600 
          : null;
        const timeSpentHours = issueFields.timespent 
          ? issueFields.timespent / 3600 
          : null;

        allIssues.push({
          issueKey: issue.key,
          summary: issueFields.summary || '',
          issueType: issueFields.issuetype?.name || '',
          status: issueFields.status?.name || '',
          priority: issueFields.priority?.name || '',
          storyPoints: issueFields.customfield_10016 ? Number(issueFields.customfield_10016) : null,
          originalEstimateHours: origEstimateHours,
          timeSpentHours: timeSpentHours,
          labels: issueFields.labels || [],
          createdAt: issueFields.created,
          resolvedAt: issueFields.resolutiondate || null,
          assigneeEmail: email
        });
      }

      startAt += data.issues.length;
      if (startAt >= data.total) {
        break;
      }
    }
  } catch (error) {
    handleError(error, `Failed to search Jira issues for ${email}`);
  }

  return allIssues;
}
