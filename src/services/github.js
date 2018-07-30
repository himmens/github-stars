/**
 * Service for getting stars history for specific GitHub repository.
 *
 * Documentation: https://developer.github.com/v3/activity/starring/
 */
class GitHubService {
  static STARGAZERS_ENDPOINT = 'https://api.github.com/repos/{repo}/stargazers';
  static REPO_ENDPOINT = 'https://api.github.com/repos/{repo}';
  static MAX_PAGE_COUNT = 10; // max number of pages for requesting data

  async request(url) {
    console.log("request:", url);
    return fetch(url, {method: 'GET', headers: {Accept: 'application/vnd.github.v3.star+json'}});
  }

  /**
   * Sends initial request and parse total pages count from Link header.
   * Returns pages total.
   *
   * Link: <https://api.github.com/repositories/10270250/stargazers?page=2>; rel="next", <https://api.github.com/repositories/10270250/stargazers?page=1334>; rel="last"
   */
  async requestInitialStargazers(repo) {
    return this.request(GitHubService.STARGAZERS_ENDPOINT.replace('{repo}', repo))
      .then(response => {
        let link = response.headers.get('link');
        const regexp = /next.*?page=(\d+).*?last/gim;
        const res = regexp.exec(link);
        return res[1] ? parseInt(res[1], 10) : 0;
      });
  }

  /**
   * Sends request with page param to get date related to paged stars count.
   * Returns data point in format {date, value}
   *
   * Response:
   *  [
   *    {starred_at: "2013-05-29T20:59:49Z", user: {}},
   *    {starred_at: "2013-05-29T21:18:36Z", user: {}},
   *    ...
   *  ]
   */
  async requestStargazers(repo, page) {
    return this.request(`${GitHubService.STARGAZERS_ENDPOINT.replace('{repo}', repo)}?page=${page}`)
      .then(response => response.json())
      .then(data => data[0]) // use only first element for data parsing
      .then(item => {
        // parse date in format ISO 8601
        let value = item.starred_at.replace(/\D/g, ' '); // replace anything but numbers by spaces
        let parts = value.split(' ');
        return {
          date: Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]),
          value: page * 30
        }
      });
  }

  /**
   * Sends request to get repository info with total stars amount.
   * Returns final data point with total stars amount
   */
  async requestRepo(repo) {
    return this.request(GitHubService.REPO_ENDPOINT.replace('{repo}', repo))
      .then(response => response.json())
      .then(data => ({
        date: Date.now(),
        value: data.stargazers_count
      }));
  }

  async getRepoStarsHistory(repo) {
    const pageMin = 2;
    const pageMax = await this.requestInitialStargazers(repo);
    console.log(repo, "pageMax:", pageMax);

    const step = Math.floor((pageMax - pageMin) / GitHubService.MAX_PAGE_COUNT); // pages step
    const requests = [];
    for (let i = pageMin; i <= pageMax; i += step) {
      requests.push(this.requestStargazers(repo, i));
    }
    requests.push(this.requestRepo(repo));
    return Promise.all(requests);
  }

  async getStarsHistory(repos) {
    let res = {};
    for (let repo of repos) {
      res[repo] = await this.getRepoStarsHistory(repo);
    }
    return res;
  }
}

export default new GitHubService();
