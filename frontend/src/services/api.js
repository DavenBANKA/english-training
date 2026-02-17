import { API_BASE_URL } from '../config/env.js';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('access_token');
  }

  setAuthToken(token) {
    localStorage.setItem('access_token', token);
  }

  removeAuthToken() {
    localStorage.removeItem('access_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || 'Une erreur est survenue');
        error.details = data.details;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email, password, full_name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password, full_name }),
    });

    if (data.success && data.data.session) {
      this.setAuthToken(data.data.session.access_token);
    }

    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.data.access_token) {
      this.setAuthToken(data.data.access_token);
    }

    return data;
  }

  async logout() {
    const data = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.removeAuthToken();
    return data;
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  // Questions endpoints
  async getQuestions(skill, level = null, limit = 20) {
    const params = new URLSearchParams({ skill, limit });
    if (level) params.append('level', level);

    return await this.request(`/questions?${params}`);
  }

  // Speaking endpoints
  async analyzeSpeaking(formData) {
    const token = this.getAuthToken();
    const response = await fetch(`${this.baseURL}/speaking/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  }

  // Writing endpoints
  async analyzeWriting(question_id, text) {
    return await this.request('/writing/analyze', {
      method: 'POST',
      body: JSON.stringify({ question_id, text }),
    });
  }

  // Answers endpoints
  async submitAnswers(test_id, answers) {
    return await this.request('/answers/submit', {
      method: 'POST',
      body: JSON.stringify({ test_id, answers }),
    });
  }

  // Results endpoints
  async getMyResults() {
    return await this.request('/results/me');
  }

  async calculateResults(test_id) {
    return await this.request('/results/calculate', {
      method: 'POST',
      body: JSON.stringify({ test_id }),
    });
  }
}

export default new ApiService();
