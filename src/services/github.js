/**
 * Service for getting stars history for specific GitHub repository.
 *
 * Documentation: https://developer.github.com/v3/activity/starring/
 */
class GitHubService {
  static ENDPOINT0 = 'https://api.github.com/repos/facebook/react';
  static ENDPOINT = 'https://api.github.com/repos/facebook/react/stargazers';

  parsePageMax(value) {
    const regexp = /next.*?page=(\d+).*?last/gim;
    const res = regexp.exec(value);
    return res[1] ? parseInt(res[1], 10) : 0;
  }

  /**
   * Parse date in format ISO 8601
   * Example: '2011-10-10T14:48:00'
   * @param value
   */
  parseDate(value) {
    value = value.replace(/\D/g, ' '); // replace anything but numbers by spaces
    let parts = value.split(' ');
    return Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
  }

  /**
   * link Sample (no link when star < 30):
   * <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=2>;
   * rel="next",
   * <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=4>;
   * rel="last"
   */
  async requestInitialStargazers() {
    // return new Promise(resolve => {resolve({date: page * 1000000, value: (page - 1) * 30})});
    let url = `${GitHubService.ENDPOINT}`;
    console.log("fetch:", url)
    return fetch(url, {method: 'GET', headers: {Accept: 'application/vnd.github.v3.star+json'}})
      .then(response => this.parsePageMax(response.headers.get('link'))) // parse total pages from link header
  }

  async requestStargazers(page = 0) {
    // return new Promise(resolve => {resolve({date: page * 1000000, value: (page - 1) * 30})});
    let url = `${GitHubService.ENDPOINT}`;
    if (page > 0)
      url += `?page=${page}`;
    console.log("fetch:", url)
    return fetch(url, {method: 'GET', headers: {Accept: 'application/vnd.github.v3.star+json'}})
      .then(response => response.json())
      .then(data => data[0])
      .then(item => ({
        date: this.parseDate(item.starred_at),
        value: page * 30
      }));
  }

  async requestRepo() {
    const url = `${GitHubService.ENDPOINT0}`;
    console.log("fetch:", url)
    return fetch(url, {method: 'GET', headers: {Accept: 'application/vnd.github.v3.star+json'}})
      .then(response => response.json())
      .then(data => ({
        date: Date.now(),
        value: data.stargazers_count
      }));
  }

  async getStarsHistory() {
    const pageMin = 2;
    const pageMax = await this.requestInitialStargazers();
    console.log("pageMax:", pageMax);

    const count = 10; // number of selected pages for requesting data
    const step = Math.floor((pageMax - pageMin) / count); // pages step
    const requests = [];
    for (let i = pageMin; i <= pageMax; i += step) {
      requests.push(this.requestStargazers(i));
    }
    requests.push(this.requestRepo());
    // const starsTotal = 107437;
    const starsHistory = await Promise.all(requests);
    console.log("starsHistory:", starsHistory);
    return Promise.resolve(starsHistory);
  }
}

export default new GitHubService();
