export interface Task<data, result> {
    runAsync(data: data): Promise<result>;
}

export interface WorkerPool {
    createTask<data, result>(f: (d: data) => result): Task<data, result>;
}
