import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class JoblyApi {
  static token = localStorage.getItem("jobly-token");

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = JoblyApi.token
      ? { Authorization: `Bearer ${JoblyApi.token}` }
      : {};
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Get current user details */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get companies (optionally filtered by name) */
  static async getCompanies(name) {
    let res = await this.request("companies", { name });
    return res.companies;
  }

  /** Get details on a company by handle */
  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get list of jobs (optionally filtered by title) */
  static async getJobs(title) {
    let res = await this.request("jobs", { title });
    return res.jobs;
  }

  /** Apply to a job */
  static async applyToJob(username, jobId) {
    let res = await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
    return res.applied;
  }

  /** Login: Authenticate user & store token */
  static async login(loginData) {
    let res = await this.request("auth/token", loginData, "post");
    JoblyApi.token = res.token;
    localStorage.setItem("jobly-token", res.token);
    return res.token;
  }

  /** Signup: Register new user & store token */
  static async signup(signupData) {
    let res = await this.request("auth/register", signupData, "post");
    JoblyApi.token = res.token;
    localStorage.setItem("jobly-token", res.token);
    return res.token;
  }

  /** Update user profile */
  static async saveProfile(username, profileData) {
    let res = await this.request(`users/${username}`, profileData, "patch");
    return res.user;
  }
}

export default JoblyApi;
