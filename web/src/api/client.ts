const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user?: User;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async fetch<T>(
    path: string,
    options: RequestInit = {},
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Accept'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!isFormData && options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return response as unknown as Promise<T>;
  }

  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    return this.fetch<{ access_token: string; user: User }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<{ access_token: string; user: User }> {
    return this.fetch<{ access_token: string; user: User }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.fetch<{ message: string }>('/logout', {
      method: 'POST',
    });
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return this.fetch<Post[]>('/posts');
  }

  async createPost(title: string, content: string, image?: File): Promise<Post> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    return this.fetch<Post>('/posts', {
      method: 'POST',
      body: formData,
    }, true);
  }

  async updatePost(id: number, title: string, content: string, image?: File, removeImage?: boolean): Promise<Post> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    if (removeImage) {
      formData.append('remove_image', '1');
    }
    return this.fetch<Post>(`/posts/${id}`, {
      method: 'POST',
      body: formData,
    }, true);
  }

  async deletePost(id: number): Promise<void> {
    return this.fetch<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
