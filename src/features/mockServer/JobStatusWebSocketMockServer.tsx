import { Server as SocketServer } from "mock-socket"
import { useEffect, useMemo, useState } from "react"
import recursiveCamelToSnakeCase from "./recursiveCamelToSnakeCase"

type JobStatusWebSocketMockServerProps = {
    job: {
        id: string
        jobType: string
        numEntriesTotal: number
        showNumEntriesTotal: boolean
        [key: string]: any
    }
    pageSize: number
}

export default function JobStatusWebSocketMockServer({
    job,
    pageSize,
}: JobStatusWebSocketMockServerProps) {
    const [socketServer, setSocketServer] = useState<SocketServer | null>(null)
    const moduleId = job.jobType

    const jobResponse = useMemo(
        () => ({
            ...job,
            pageSize,
            // do not return numEntriesTotal if showNumEntriesTotal is false
            numEntriesTotal: job.showNumEntriesTotal
                ? job.numEntriesTotal
                : undefined,
            numPagesTotal: job.showNumEntriesTotal
                ? Math.ceil(job.numEntriesTotal / pageSize)
                : undefined,
        }),
        [job, pageSize],
    )

    // create a socket server
    useEffect(() => {
        if (moduleId === undefined || job.id === null) {
            return
        }

        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws"
        const wsHost = window.location.hostname
        const wsPort = window.location.port ? `:${window.location.port}` : ""
        const wsUrl = `${wsProtocol}://${wsHost}${wsPort}/websocket/${moduleId}/jobs/${job.id}`

        const server = new SocketServer(wsUrl)

        // initially send the job status once when connecting
        server.on("connection", (socket) => {
            socket.send(JSON.stringify(recursiveCamelToSnakeCase(jobResponse)))
        })

        // save socket server
        setSocketServer(server)

        return () => {
            server.clients().forEach((client) => client.close())
            server.stop()
        }
    }, [moduleId, job.id])

    // send the job status if job (specifically numPagesProcessed) changes
    useEffect(() => {
        if (socketServer !== null) {
            socketServer.clients().forEach((socket) => {
                socket.send(
                    JSON.stringify(recursiveCamelToSnakeCase(jobResponse)),
                )
            })
        }
    }, [socketServer, jobResponse])

    return null
}
