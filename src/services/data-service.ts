import {
  User,
  Task,
  TaskScore,
  CrossCheckSession,
  ReviewRequest,
  Review,
  Dispute,
} from '../models/data-models';

class DataService {
  baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:3001';
  }

  async setResource<T>(url: string, resource: object): Promise<T> {
    const res = await fetch(this.baseURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resource),
    });
    if (!res.ok) {
      console.log(res);

      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  async getResource<T>(url: string): Promise<T> {
    const res = await fetch(this.baseURL + url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  getAllUsers(): Promise<User[]> {
    return this.getResource<User[]>('/users');
  }

  async getSingleUser(githubId: string): Promise<User> {
    const result = await this.getResource<User[]>(
      `/users?githubId=${githubId}`
    );
    return result[0];
  }

  async setUser(user: User): Promise<User> {
    return this.setResource<User>(`/users`, user);
  }

  getAllTasks(): Promise<Task[]> {
    return this.getResource<Task[]>('/tasks');
  }

  async getSingleTask(id: string): Promise<Task> {
    const result = await this.getResource<Task[]>(`/tasks?id=${id}`);
    return result[0];
  }

  getAllTaskScores(): Promise<TaskScore[]> {
    return this.getResource<TaskScore[]>('/taskScores');
  }

  async getSingleTaskScore(taskId: string): Promise<TaskScore> {
    const result = await this.getResource<TaskScore[]>(
      `/taskScores?task=${taskId}`
    );
    return result[0];
  }

  getAllCrossCheckSessions(): Promise<CrossCheckSession[]> {
    return this.getResource<CrossCheckSession[]>('/crossCheckSessions');
  }

  async getSingleCrossCheckSession(id: string): Promise<CrossCheckSession> {
    const result = await this.getResource<CrossCheckSession[]>(
      `/crossCheckSessions?id=${id}`
    );
    return result[0];
  }

  getAllReviewRequests(): Promise<ReviewRequest[]> {
    return this.getResource<ReviewRequest[]>('/reviewRequests');
  }

  async getSingleReviewRequest(id: string): Promise<ReviewRequest> {
    const result = await this.getResource<ReviewRequest[]>(
      `/reviewRequests?id=${id}`
    );
    return result[0];
  }

  getAllReviews(): Promise<Review[]> {
    return this.getResource<Review[]>('/reviews');
  }

  async getSingleReview(id: string): Promise<Review> {
    const result = await this.getResource<Review[]>(`/reviews?id=${id}`);
    return result[0];
  }

  getAllDisputes(): Promise<Dispute[]> {
    return this.getResource<Dispute[]>('/disputes');
  }

  async getSingleDispute(reviewId: string): Promise<Dispute> {
    const result = await this.getResource<Dispute[]>(
      `/disputes?reviewId=${reviewId}`
    );
    return result[0];
  }
}

export default DataService;

/// usage example
// const [users, setUsers] = useState<User[]>([]);
// const dataService = new DataService();
// dataService
//   .getAllUsers()
//   .then((body) => {
//     setUsers(body || []);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
