/**
 * EXTREME PERFORMANCE: Worker Thread Pool
 * Offload CPU-intensive tasks to worker threads
 * Prevents blocking the main event loop
 */

import { Worker } from 'worker_threads';
import { cpus } from 'os';

interface WorkerTask {
  id: string;
  data: any;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

export class WorkerPool {
  private workers: Worker[];
  private availableWorkers: Worker[];
  private taskQueue: WorkerTask[];
  private activeTasksCount: number;
  private readonly maxWorkers: number;
  private stats: {
    tasksCompleted: number;
    tasksQueued: number;
    totalProcessingTime: number;
    avgProcessingTime: number;
  };

  constructor(workerScript: string, poolSize?: number) {
    this.maxWorkers = poolSize || cpus().length;
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
    this.activeTasksCount = 0;
    this.stats = {
      tasksCompleted: 0,
      tasksQueued: 0,
      totalProcessingTime: 0,
      avgProcessingTime: 0,
    };

    // Initialize worker pool
    this.initializeWorkers(workerScript);
  }

  /**
   * Execute task in worker thread
   */
  async execute<T = any>(data: any): Promise<T> {
    const taskId = `task_${Date.now()}_${Math.random()}`;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        id: taskId,
        data,
        resolve: (value) => {
          const duration = Date.now() - startTime;
          this.updateStats(duration);
          resolve(value);
        },
        reject,
        timestamp: Date.now(),
      };

      this.stats.tasksQueued++;

      // Try to assign immediately
      if (this.availableWorkers.length > 0) {
        this.assignTask(task);
      } else {
        // Queue task
        this.taskQueue.push(task);
      }
    });
  }

  /**
   * Execute multiple tasks in parallel
   */
  async executeMany<T = any>(tasks: any[]): Promise<T[]> {
    return Promise.all(tasks.map(task => this.execute<T>(task)));
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      ...this.stats,
      activeWorkers: this.activeTasksCount,
      availableWorkers: this.availableWorkers.length,
      queuedTasks: this.taskQueue.length,
      poolSize: this.maxWorkers,
      utilization: ((this.activeTasksCount / this.maxWorkers) * 100).toFixed(2) + '%',
    };
  }

  /**
   * Terminate all workers
   */
  async terminate(): Promise<void> {
    const terminationPromises = this.workers.map(worker =>
      worker.terminate()
    );
    await Promise.all(terminationPromises);
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
  }

  // Private methods

  private initializeWorkers(workerScript: string): void {
    for (let i = 0; i < this.maxWorkers; i++) {
      try {
        // For now, create a simple inline worker
        // In production, you'd reference an actual worker file
        const worker = new Worker(
          `
          const { parentPort } = require('worker_threads');
          parentPort.on('message', (task) => {
            try {
              // Simulate heavy computation
              const result = processTask(task);
              parentPort.postMessage({ success: true, result });
            } catch (error) {
              parentPort.postMessage({ success: false, error: error.message });
            }
          });

          function processTask(task) {
            // Task processing logic here
            // For AI content generation, sentiment analysis, etc.
            return { processed: true, data: task };
          }
          `,
          { eval: true }
        );

        worker.on('message', (result) => this.handleWorkerResult(worker, result));
        worker.on('error', (error) => this.handleWorkerError(worker, error));
        worker.on('exit', (code) => this.handleWorkerExit(worker, code));

        this.workers.push(worker);
        this.availableWorkers.push(worker);
      } catch (error) {
        console.error(`[WorkerPool] Failed to create worker ${i}:`, error);
      }
    }

    console.log(`[WorkerPool] Initialized ${this.workers.length} workers`);
  }

  private assignTask(task: WorkerTask): void {
    const worker = this.availableWorkers.pop();
    if (!worker) return;

    this.activeTasksCount++;

    // Store task info on worker for later reference
    (worker as any).currentTask = task;

    worker.postMessage(task.data);
  }

  private handleWorkerResult(worker: Worker, result: any): void {
    const task = (worker as any).currentTask as WorkerTask;

    if (task) {
      if (result.success) {
        task.resolve(result.result);
      } else {
        task.reject(new Error(result.error));
      }

      delete (worker as any).currentTask;
    }

    this.activeTasksCount--;
    this.availableWorkers.push(worker);

    // Process next queued task
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      if (nextTask) {
        this.assignTask(nextTask);
      }
    }
  }

  private handleWorkerError(worker: Worker, error: Error): void {
    console.error('[WorkerPool] Worker error:', error);

    const task = (worker as any).currentTask as WorkerTask;
    if (task) {
      task.reject(error);
      delete (worker as any).currentTask;
    }

    this.activeTasksCount--;
  }

  private handleWorkerExit(worker: Worker, code: number): void {
    if (code !== 0) {
      console.error(`[WorkerPool] Worker exited with code ${code}`);
    }

    // Remove from available workers
    const index = this.availableWorkers.indexOf(worker);
    if (index > -1) {
      this.availableWorkers.splice(index, 1);
    }
  }

  private updateStats(duration: number): void {
    this.stats.tasksCompleted++;
    this.stats.totalProcessingTime += duration;
    this.stats.avgProcessingTime =
      this.stats.totalProcessingTime / this.stats.tasksCompleted;
  }
}

/**
 * Singleton worker pools for different task types
 */
export class WorkerPoolManager {
  private pools: Map<string, WorkerPool>;

  constructor() {
    this.pools = new Map();
  }

  getPool(name: string, workerScript?: string, poolSize?: number): WorkerPool {
    if (!this.pools.has(name)) {
      const script = workerScript || './worker.js';
      const pool = new WorkerPool(script, poolSize);
      this.pools.set(name, pool);
    }

    return this.pools.get(name)!;
  }

  async terminateAll(): Promise<void> {
    const promises = Array.from(this.pools.values()).map(pool =>
      pool.terminate()
    );
    await Promise.all(promises);
    this.pools.clear();
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [name, pool] of this.pools.entries()) {
      stats[name] = pool.getStats();
    }
    return stats;
  }
}

export const workerPoolManager = new WorkerPoolManager();

// Pre-create pools for common tasks
// export const aiWorkerPool = workerPoolManager.getPool('ai-processing', './workers/ai-worker.js');
// export const analyticsWorkerPool = workerPoolManager.getPool('analytics', './workers/analytics-worker.js');
// export const imageWorkerPool = workerPoolManager.getPool('image-processing', './workers/image-worker.js');
