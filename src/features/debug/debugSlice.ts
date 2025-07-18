import { generateModuleConfigDict } from "@/features/mockServer/fake/modules"
import type { Job, Module, Source } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

export type DebugState = {
    key: number
    moduleConfigs: Record<string, Module>
    jobs: Record<string, Job>
    sources: Record<string, Source>
}

const initialState: DebugState = {
    // module configs
    moduleConfigs: generateModuleConfigDict(8),
    // jobs
    jobs: {},
    // sources
    sources: {},
}

const debugSlice = createSlice({
    name: "debug",
    initialState,
    reducers: {
        setNumModules(state, action) {
            const numModules = action.payload
            let moduleConfigs
            if (Object.keys(state.moduleConfigs).length !== numModules) {
                // generate fake modules
                moduleConfigs = generateModuleConfigDict(numModules)
            } else {
                moduleConfigs = { ...state.moduleConfigs }
            }

            return {
                ...state,
                moduleConfigs,
            }
        },
        createJob(state, action) {
            const { jobId, jobType, params, numResults } = action.payload

            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    [jobId]: {
                        id: jobId,
                        jobType,
                        sourceId: "fake-source-id",
                        params,
                        status: "created",
                        createdAt: Date.now(),
                        entriesProcessed: [],
                        numEntriesProcessed: 0,
                        numEntriesTotal: numResults,
                        showNumEntriesTotal: false,
                        outputFiles: [],
                    },
                },
            }
        },
        addOutputFile(state, action) {
            const { jobId, format, url } = action.payload
            const job = state.jobs[jobId]

            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    [jobId]: {
                        ...job,
                        outputFiles: [...job.outputFiles, { format, url }],
                    },
                },
            }
        },
        deleteJob(state, action) {
            const jobId = action.payload.jobId
            const jobs = { ...state.jobs }
            delete jobs[jobId]

            return {
                ...state,
                jobs,
            }
        },
        createSource(state, action) {
            const { sourceId, filename } = action.payload

            return {
                ...state,
                sources: {
                    ...state.sources,
                    [sourceId]: {
                        id: sourceId,
                        timestamp: Date.now(),
                        format: "",
                        filename: filename,
                    },
                },
            }
        },
        deleteSource(state, action) {
            const sourceId = action.payload.sourceId
            const sources = { ...state.sources }
            delete sources[sourceId]

            return {
                ...state,
                sources,
            }
        },
        addMolecule(state, action) {
            const jobId = action.payload
            const job = state.jobs[jobId]
            const numEntriesProcessed = Math.min(
                job.numEntriesProcessed + 1,
                job.numEntriesTotal,
            )

            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    [jobId]: {
                        ...state.jobs[jobId],
                        entriesProcessed: [[0, numEntriesProcessed - 1]],
                        numEntriesProcessed,
                    },
                },
            }
        },
        setNumEntriesTotal(state, action) {
            const { jobId } = action.payload

            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    [jobId]: {
                        ...state.jobs[jobId],
                        showNumEntriesTotal: true,
                    },
                },
            }
        },
        updateJob(state, action) {
            const { jobId, ...updates } = action.payload
            const job = state.jobs[jobId]

            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    [jobId]: {
                        ...job,
                        ...updates,
                    },
                },
            }
        },
    },
})

export const {
    createJob,
    addOutputFile,
    deleteJob,
    createSource,
    deleteSource,
    addMolecule,
    setNumModules,
    setNumEntriesTotal,
    updateJob,
} = debugSlice.actions

export default debugSlice.reducer
