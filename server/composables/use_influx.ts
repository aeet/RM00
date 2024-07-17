import { InfluxDB, type ClientOptions } from '@influxdata/influxdb-client'

const createInfluxClient = (): () => InfluxDB => {
  let client: InfluxDB | null = null
  return (): InfluxDB => {
    if (client) return client
    const config = useRuntimeConfig()
    const options: ClientOptions = { url: config.influx.endpoint, token: config.influx.token }
    client = new InfluxDB(options)
    return client
  }
}

export const useInflux = createInfluxClient()
