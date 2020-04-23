import { WorkerPoolOptions, WorkerPool } from 'src/interfaces';

export const createWorkerPool = (options: WorkerPoolOptions): WorkerPool => {
    const workers = new Map(
        Array.from({ length: options.workers }).map<[number, Worker]>(() => {
            const w = new Worker('./build/workers/worker.js');
            return [w.threadId, w];
        }),
    );

    const idle = Array.from(workers.keys());
    const resolvers = new Map<number, (data: any) => void>();
    let backlog: { id: number; task: (data: any) => void; data: any }[] = [];
    let taskIdCounter = 0;

    const runNext = () => {
        // check if we have both task and idle worker
        if (backlog.length == 0 || idle.length == 0) return;
        // task the next task and idle worker
        const task = backlog.shift();
        const worker = idle.shift();
        console.log(`Scheduling ${task.id} on ${worker}`);
        // build the message for the worker.
        const msg = { ...task, task: task.task.toString() };
        // send the task to the worker
        workers.get(worker).postMessage(msg);
        runNext();
    };
};
